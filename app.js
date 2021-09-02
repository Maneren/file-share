const express = require('express');
const path = require('path');
const fs = require('fs');

const { ArgumentParser } = require('argparse');
const parser = new ArgumentParser({
  description: 'Simple file sharing server'
});

parser.add_argument('-d', '--dev', {
  action: 'store_true',
  help: 'run in dev mode'
});
parser.add_argument('-q', '--qr', {
  action: 'store_true',
  help: 'show qr code'
});
parser.add_argument('-p', '--port', { type: 'int' });
parser.add_argument('folder', {
  nargs: '?',
  default: path.join(__dirname, 'shared'),
  help: 'shared folder'
});

const app = express();
const argv = parser.parse_args();

const sharedFolder = fs.realpathSync(argv.folder);
const buildFolder = path.join(__dirname, 'client', 'build');

if (!fs.existsSync(sharedFolder)) {
  fs.mkdirSync(sharedFolder);
}

if (
  !fs.existsSync(buildFolder) ||
  !fs.readdirSync(buildFolder).includes('index.html')
) {
  console.log("Couldn't find index.html. Try rebuilding the client");
  process.exit(1);
}

app.use(
  require('express-fileupload')({
    useTempFiles: true,
    tempFileDir: '/tmp/express-fileupload'
  })
);
app.use(require('cors')());
app.use(require('morgan')('dev'));

app.use('/', express.static(buildFolder));
app.use('/files', express.static(sharedFolder, { dotfiles: 'allow' }));

app.post('/upload', ({ files }, res) => {
  try {
    if (!files) {
      return res.send({ error: 'No files uploaded' });
    }

    for (const name in files) {
      const file = files[name];

      console.log(name, file.size);

      file.mv(path.join(sharedFolder, name));
    }

    res.send({});
  } catch (err) {
    console.error(err);
    res.send({ error: 'Internal error' });
  }
});

app.get('/list', async (req, res) => {
  try {
    const folder = fs.realpathSync(path.join(sharedFolder, req.query.path));

    if (req.query.path.includes('..')) {
      return res.send({ error: 'Invalid query' });
    }

    if (!fs.existsSync(folder)) {
      return res.send({ error: 'Folder does not exist' });
    }

    const contents = await fs.promises.readdir(folder);

    const files = [];
    const folders = [];

    for (const item of contents) {
      const absolutePath = path.join(folder, item);
      let stats = await fs.promises.lstat(absolutePath);

      if (stats.isSymbolicLink()) {
        const realPath = await fs.promises.readlink(absolutePath);
        stats = await fs.promises.lstat(realPath);
      }

      if (stats.isFile()) {
        files.push(item);
      } else if (stats.isDirectory()) {
        folders.push(item);
      }
    }

    res.send({ files, folders });
  } catch (err) {
    console.error(err);
    res.send({ error: 'Internal error' });
  }
});

console.log(`Using folder: ${sharedFolder}`);

if (argv.dev) {
  const port = 5000;
  app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
} else {
  const port = argv.port !== undefined ? argv.port : 0; // port 0 = OS chooses random free port

  const server = app.listen(port, () => {
    const { port } = server.address();

    const interfaces = require('os').networkInterfaces();
    const interfacesNames = Object.keys(interfaces);

    let ip = null;
    for (const keyword of ['eth', 'wlan', 'lan', 'tun', 'lo', '\\w*']) {
      const regex = new RegExp(`^${keyword}\\d+$`);
      const name = interfacesNames.find(ifc => regex.test(ifc));

      if (name === undefined) continue;

      ip = interfaces[name][0].address;
      break;
    }

    const address = `http://${ip}:${port}`;

    if (argv.qr) require('qrcode-terminal').generate(address, { small: true });

    console.log(`Listening at ${address}`);
  });
}
