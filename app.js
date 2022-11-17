const express = require('express');
const path = require('path');
const fs = require('fs');

const { ArgumentParser } = require('argparse');
const parser = new ArgumentParser({
  description: 'Simple file sharing server',
});

parser.add_argument('-d', '--dev', {
  action: 'store_true',
  help: 'run in dev mode',
});
parser.add_argument('-q', '--qr', {
  action: 'store_true',
  help: 'show qr code',
});
parser.add_argument('-p', '--port', { type: 'int' });
parser.add_argument('folder', {
  nargs: '?',
  default: __dirname,
  help: 'shared folder',
});

const app = express();
const argv = parser.parse_args();

if (!fs.existsSync(argv.folder)) {
  fs.mkdirSync(argv.folder);
}

const sharedFolder = fs.realpathSync(argv.folder);
const clientFolder = path.join(__dirname, 'client');
const buildFolder = path.join(clientFolder, 'build');

if (
  !(
    fs.existsSync(buildFolder) &&
    fs.readdirSync(buildFolder).includes('index.html')
  )
) {
  console.log(
    `Couldn't find index.html. Try rebuilding the client in ${clientFolder}`
  );
  process.exit(1);
}

app.use(
  require('express-fileupload')({
    useTempFiles: true,
    tempFileDir: '/tmp/express-fileupload',
  })
);
app.use(require('cors')());
app.use(require('morgan')('dev'));

app.use('/', express.static(buildFolder));
app.use('/files', express.static(sharedFolder, { dotfiles: 'allow' }));

const { formatBytes, getFolderContents, pathIsSafe } = require('./utils');
app.post('/upload', ({ files, body: { targetPath } }, res) => {
  try {
    if (!files) {
      const error = 'No files uploaded';
      console.error(error);
      return res.status(400).send(error);
    }

    for (const name in files) {
      const file = files[name];

      console.log(name, formatBytes(file.size));

      if (!pathIsSafe(name)) {
        const error = `Forbidden path: ${targetPath} `;
        console.error(error);
        return res.status(401).send(error);
      }

      file.mv(path.join(sharedFolder, targetPath, name));
    }

    res.send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal error');
  }
});

app.get('/list', async ({ query }, res) => {
  try {
    const queryPath = atob(query.path); // decode base64
    console.log(`query: ${queryPath}`);

    if (!pathIsSafe(queryPath)) {
      const error = `Forbidden path: ${queryPath}`;
      console.error(error);
      return res.status(401).send(error);
    }

    let folder;
    try {
      folder = await fs.promises.realpath(path.join(sharedFolder, queryPath));
    } catch (e) {
      const error = 'Folder does not exist';
      console.error(error);
      return res.status(404).send(error);
    }

    const { files, folders } = await getFolderContents(folder);

    res.type('json').send({ files, folders });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal error');
  }
});

console.log(`Using folder: ${sharedFolder}`);

if (argv.dev) {
  const port = argv.port ?? 5000;
  app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
} else {
  const port = argv.port ?? 0; // port 0 = OS chooses random free port

  const server = app.listen(port, () => {
    const { port } = server.address();

    const interfaces = require('os').networkInterfaces();
    const interfacesNames = Object.keys(interfaces);

    let ip = null;
    let interface = null;
    for (const keyword of ['e', 'w', 'lan', 'tun', '[^(lo)]', '.+']) {
      const name = interfacesNames.find((ifc) =>
        ifc.match(new RegExp(`^${keyword}`))
      );

      if (name) {
        ip = interfaces[name][0].address;
        interface = name;
        break;
      }
    }

    if (ip === null) {
      console.error('IP not found');
      process.exit(1);
    }

    const address = `http://${ip}:${port} on interface ${interface}`;

    if (argv.qr) require('qrcode-terminal').generate(address, { small: true });

    console.log(`Listening at ${address}`);
  });
}
