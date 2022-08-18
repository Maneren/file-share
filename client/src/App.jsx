import styles from './App.module.css';
import FileList from './components/FileList';
import UploadForm from './components/UploadForm';

import 'bootstrap/dist/css/bootstrap.min.css';

import { classListBuilder } from '@maneren/utils/react';
const cls = classListBuilder(styles);

const App = () => (
  <div className={cls('App')}>
    <UploadForm />
    <FileList />
  </div>
);

export default App;
