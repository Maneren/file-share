const express = require('express');
const path = require('path');

const fileUpload = require('express-fileupload');
const cors = require('cors');
// const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/files', express.static(path.join(__dirname, 'shared')));

// allow upload
app.use(fileUpload({
  createParentPath: true
}));

// other middleware
app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.post('/upload', (req, res) => {
  try {
    if (!req.files) {
      return res.send('No file uploaded');
    }

    const file = req.files.file;
    const { name, size } = file;

    // Use the mv() method to place the file in upload directory
    file.mv(path.join(__dirname, 'shared', name));

    // send response
    res.send({
      status: true,
      message: 'File is uploaded',
      data: {
        name: name,
        size: size
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
