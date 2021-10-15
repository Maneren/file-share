
function formatBytes (bytes, decimals = 2) {
  decimals = Math.max(0, decimals);

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k)); // = floor(log_k(bytes))

  const number = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
  const unit = sizes[i];

  return `${number} ${unit}`;
}

async function getFolderContents (folder) {
  const fs = require('fs');
  const path = require('path');

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
      continue;
    }

    if (stats.isDirectory()) {
      folders.push(item);
      continue;
    }
  }

  return { files, folders };
}

module.exports = { getFolderContents, formatBytes };
