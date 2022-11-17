import styles from "./App.module.css";
import FileList from "./components/FileList";
import UploadForm from "./components/UploadForm";

import "bootstrap/dist/css/bootstrap.min.css";

import { classListBuilder } from "@maneren/utils/react";
import { useState } from "react";
const cls = classListBuilder(styles);

const App = () => {
  const [path, setPath] = useState(sessionStorage.getItem("path") ?? "");

  sessionStorage.setItem("path", path);

  return (
    <div className={cls("App")}>
      <UploadForm path={path} />
      <FileList path={path} setPath={setPath} />
    </div>
  );
};

export default App;
