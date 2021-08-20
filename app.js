const express = require('express');
const path = require('path');
const fs = require('fs');

const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = 5000;

const buildFolder = path.join(__dirname, 'build');
const sharedFolder = path.join(__dirname, 'shared');

app.use('/', express.static(buildFolder));
app.use('/files', express.static(sharedFolder));

// enable upload
app.use(fileUpload({ createParentPath: true }));

// other middleware
app.use(cors());
app.use(morgan('dev'));

app.post('/upload', (req, res) => {
  try {
    const { files } = req;
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

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

// TODO: add cli
