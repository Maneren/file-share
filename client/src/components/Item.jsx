import styles from './Item.module.css';
import { getIcon, icons } from '../assets/icons';

import { Ratio } from 'react-bootstrap';

import { React as ReactUtils } from 'my-utils';
const cls = ReactUtils.classListBuilder(styles);

const getExtension = filename => {
  const ext = /^.*\.([^.]+)$/.exec(filename.toLowerCase());
  return ext == null ? '' : ext[1];
};

const File = ({ name, path }) => (
  <div className={cls('item file')}>
    <a href={path.length > 0 ? `/files/${path}/${name}` : `/files/${name}`} className={cls('link')} download>
      <Ratio aspectRatio='1x1'>
        <img
          alt='file icon'
          className={cls('icon')}
          src={getIcon(getExtension(name))}
        />
      </Ratio>
      <div className={cls('name')}>{name}</div>
    </a>
  </div>
);

const Folder = ({ name, path, onClick, icon }) => (
  <div className={cls('item folder')}>
    <span className={cls('link')} onClick={onClick}>
      <Ratio aspectRatio='1x1'>
        <img
          alt='folder icon'
          className={cls('icon')}
          src={icons[icon]}
        />
      </Ratio>
      <div className={cls('name')}>{name}</div>
    </span>
  </div>
);

export { File, Folder };
