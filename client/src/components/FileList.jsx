import styles from "./FileList.module.css";
import { File, Folder } from "./Item";

import axios from "axios";
import { useState } from "react";

import { Button, Modal } from "react-bootstrap";

import { sleep } from '@maneren/utils/general'
import { classListBuilder } from '@maneren/utils/react';
const cls = classListBuilder(styles);

const Error = ({ error, onClick }) => (
  <Modal show onHide={onClick}>
    <Modal.Header closeButton>
      <Modal.Title>Error</Modal.Title>
    </Modal.Header>
    <Modal.Body>Error while fetching remote files: {error}</Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={onClick}>
        Dismiss
      </Button>
    </Modal.Footer>
  </Modal>
);

const FileList = () => {
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState([false, false]);

  const pathModule = require("path-browserify");

  const [path, setPath] = useState("");
  const [data, setData] = useState(null);
  const [loadState, setLoadState] = useState({ loading: false, loaded: false });

  const { loading, loaded } = loadState;

  if (!loading && !loaded) {
    setLoadState({ loading: true, loaded: false });

    const start = Date.now();

    const pathString = btoa(path);

    axios
      .request(`/list?path=${pathString}`, {
        headers: { accept: "application/json" },
      })
      .then(async (response) => {
        const { data } = response;

        const { error } = data;
        if (error) {
          setError(error);

          setShowError([true, true]);
          setLoadState({ loading: false, loaded: true });

          return (
            <Error error={error} onClick={() => setShowError([false, true])} />
          );
        }

        const { files, folders } = data;

        if (!files || !folders) return;

        if (Date.now() - start < 500) {
          await sleep(200);
        }

        setData(data);
        setShowError([false, false]);
        setLoadState({ loading: false, loaded: true });
      });
  }

  if (loading || !loaded) return "Loading...";

  const [show, shown] = showError;

  if (show) console.log("error");
  if (show)
    return <Error error={error} onClick={() => setShowError([false, true])} />;
  if (shown) return `Error: ${error}`;

  const folderClickHandler = (name, back) => {
    const newPath = back ? pathModule.dirname : pathModule.join(path, name);

    setPath(newPath);
    setLoadState({ loading: false, loaded: false });
  };

  const { files, folders } = data;
  return (
    <div className={cls("file-view")}>
      {path.length > 0 ? (
        <Folder
          key="folder-back"
          name="back"
          icon="back"
          onClick={() => folderClickHandler("back", true)}
        />
      ) : null}

      {folders.map((name) => (
        <Folder
          key={`folder-${name}`}
          name={name}
          icon="folder"
          onClick={() => folderClickHandler(name, false)}
          path={path}
        />
      ))}

      {files.map((name) => (
        <File
          key={`file-${name}`}
          name={name}
          path={pathModule.join(path, name)}
        />
      ))}
    </div>
  );
};

export default FileList;
