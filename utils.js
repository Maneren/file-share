const formatBytes = (bytes, precision = 3) => {
  precision = Math.max(0, precision);

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k)); // = floor(log_k(bytes))

  const number = parseFloat((bytes / Math.pow(k, i)).toPrecision(precision));
  const unit = sizes[i];

  return `${number} ${unit}`;
};

async function getFolderContents(folder) {
  const fs = require('fs');
  const { AsyncIter } = require('@maneren/utils/iterator.async');

  const contents = await fs.promises.readdir(folder, { withFileTypes: true });

  const [fileStats, folderStats] = await AsyncIter.fromSync(contents)
    .filter((stat) => stat.isFile() || stat.isDirectory())
    .partition((stat) => stat.isFile());

  const [files, folders] = [fileStats, folderStats].map(
    (entries) => entries.map((entry) => entry.name)
  );

  return { files, folders };
}

function checkPathIsSafe(path) {
  return ! path.split('/').includes('..');
}

module.exports = { getFolderContents, formatBytes, checkPathIsSafe };
