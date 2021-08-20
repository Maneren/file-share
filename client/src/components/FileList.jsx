import styles from './FileList.module.css';
import Item from './Item';

import { useState } from 'react';
import { useFetch } from 'react-async';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';

import { React as ReactUtils } from 'my-utils';
const cls = ReactUtils.classListBuilder(styles);

const Error = ({ error, onClick }) => (
  <Modal show onHide={onClick}>
    <Modal.Header closeButton>
      <Modal.Title>Error</Modal.Title>
    </Modal.Header>
    <Modal.Body>Error while fetching remote files: {error}</Modal.Body>
    <Modal.Footer>
      <Button variant='primary' onClick={onClick}>
        Dismiss
      </Button>
    </Modal.Footer>
  </Modal>
);

const FileList = () => {
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(null);
  const [errorShown, setErrorShown] = useState(false);

  const response = useFetch('/file-list', {
    headers: { accept: 'application/json' }
  });

  if (!showError && errorShown) {
    return error;
  }

  const ErrorEl = <Error error={error} onClick={() => setShowError(false)} />;

  if (showError) {
    return ErrorEl;
  }

  if (response.error) {
    setError(response.error.message);
    setShowError(true);
    setErrorShown(true);

    return ErrorEl;
  }

  if (response.data) {
    const directoryContent = response.data;
    return (
      <div className={cls('file-view')}>
        {directoryContent.map(name => <Item key={name} name={name} />)}
      </div>
    );
  }

  return null;
};

export default FileList;
