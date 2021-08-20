import styles from './App.module.css';
import FileList from './components/FileList';
import UploadForm from './components/UploadForm';

import 'bootstrap/dist/css/bootstrap.min.css';

import { React as ReactUtils } from 'my-utils';
const cls = ReactUtils.classListBuilder(styles);

const App = () => (
  <div className={cls('App')}>
    <UploadForm />
    <FileList />
  </div>
);

export default App;
