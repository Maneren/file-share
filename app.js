const express = require('express');
const path = require('path');
const fs = require('fs');

const { ArgumentParser } = require('argparse');
const parser = new ArgumentParser({
  description: 'Simple file sharing server'
});

parser.add_argument('-d', '--dev', { action: 'store_true', help: 'run in dev mode' });
parser.add_argument('-q', '--qr', { action: 'store_true', help: 'show qr code' });
parser.add_argument('-p', '--port', { type: 'int' });
parser.add_argument('folder', { nargs: '?', default: path.join(__dirname, 'shared'), help: 'shared folder' });

const app = express();
const argv = parser.parse_args();

const sharedFolder = argv.folder;
const buildFolder = path.join(__dirname, 'client', 'build');

if (!fs.existsSync(sharedFolder)) {
  fs.mkdirSync(sharedFolder);
}

if (!fs.existsSync(buildFolder) || !fs.readdirSync(buildFolder).includes('index.html')) {
  console.log('Couldn\'t find index.html. Try rebuilding the client');
  require('process').exit(1);
}

app.use('/', express.static(buildFolder));
app.use('/files', express.static(sharedFolder));

app.use(require('express-fileupload')());
app.use(require('cors')());
app.use(require('morgan')('dev'));

app.post('/upload', ({ files }, res) => {
  try {
    if (!files?.uploads) {
      return res.status(400).redirect(`/?error=${encodeURIComponent('No files selected')}`);
    }

    files.uploads.forEach((file) => {
      const { name } = file;
      file.mv(path.join(sharedFolder, name));
    });

    res.redirect('/?error=none');
  } catch (err) {
    console.error(err);
    res.status(500).redirect(`/?error=${encodeURIComponent(err)}`);
  }
});

app.get('/file-list', (req, res, next) => {
  try {
    res.send(fs.readdirSync(sharedFolder));
  } catch (err) {
    console.error(err);
    res.status(500).redirect(`/?error=${encodeURIComponent(err)}`);
  }
});

console.log(`Using folder: ${sharedFolder}`);

if (argv.dev) {
  const port = 5000;
  app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
} else {
  let port = 0;
  if (argv.port) {
    port = argv.port;
  }

  const server = app.listen(port, () => {
    const { port } = server.address();
    const ip = require('ip').address('public');

    const address = `http://${ip}:${port}`;

    require('qrcode-terminal').generate(address, { small: true });

    console.log(`Listening at ${address}`);
  });
}
