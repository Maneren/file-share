import styles from './Item.module.css';
import getIcon from '../assets/file-icons';

import { Ratio } from 'react-bootstrap';

import { React as ReactUtils } from 'my-utils';
const cls = ReactUtils.classListBuilder(styles);

const getExtension = filename => {
  const ext = /^.*\.([^.]+)$/.exec(filename.toLowerCase());
  return ext == null ? '' : ext[1];
};

const Item = ({ name }) => (
  <div className={cls('file')}>
    <a href={`/files/${name}`} className={cls('link')}>
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

export default Item;
