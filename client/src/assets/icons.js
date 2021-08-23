import { React as ReactUtils } from 'my-utils';
const icons = ReactUtils.importAll(require.context('./icons', false, /\.svg$/), false);

const table = {
  apk: 'android',

  mp3: 'audio',
  ogg: 'audio',
  wav: 'audio',
  flac: 'audio',

  mp4: 'video',
  mov: 'video',
  mkv: 'video',
  webm: 'video',
  avi: 'video',
  gif: 'video',

  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  ico: 'image',
  bmp: 'image',
  webp: 'image',

  doc: 'word',
  docx: 'word',
  odt: 'document',
  rtf: 'document',

  xls: 'table',
  xlsx: 'table',

  ppt: 'powerpoint',
  pptx: 'powerpoint',

  zip: 'archive',
  rar: 'archive',
  tar: 'archive',
  '7z': 'archive',

  conf: 'settings',
  rc: 'settings',

  bat: 'console',
  sh: 'console',
  zsh: 'console',

  jsx: 'react',
  tsx: 'react',

  gitignore: 'git',

  ttf: 'font',
  otf: 'font',
  woff: 'font',
  woff2: 'font'
};

const getIcon = extension => icons[extension] ? icons[extension] : table[extension] ? icons[table[extension]] : icons.file;

export { getIcon, icons };
