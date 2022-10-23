import styles from './UploadForm.module.css';

import axios from 'axios';
import { useState } from 'react';

import { Col, Form, Row } from 'react-bootstrap';

import { classListBuilder } from '@maneren/utils/react';
const cls = classListBuilder(styles);

const formatBytes = (bytes, precision = 3) => {
  precision = Math.max(0, precision);

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k)); // = floor(log_k(bytes))

  const number = parseFloat((bytes / Math.pow(k, i)).toPrecision(precision));
  const unit = sizes[i];

  return `${number} ${unit}`;
};

const UploadForm = ({ path }) => {
  const [files, setFiles] = useState({});

  const [uploadStats, setUploadStats] = useState({
    total: 0,
    loaded: 0,
    start: Date.now(),
  });

  const handleFileChange = e => {
    setFiles(e.target.files);
  };

  const { start } = uploadStats;

  const handleFormSubmit = async e => {
    e.preventDefault();

    const formData = new window.FormData();
    for (const file of files) formData.append(file.name, file);
    formData.append('targetPath', path);

    const start = Date.now();

    const onUploadProgress = ({ total, loaded }) => {
      total === loaded ? setUploadStats({ total: 0, loaded: 0, start }) : setUploadStats({ total, loaded, start });
    };

    axios
      .request({
        method: 'post',
        url: '/upload',
        data: formData,
        headers: { accept: 'application/json' },
        onUploadProgress
      })
      .then(response => {
        // TODO: handle upload response
      });
  };

  const { total, loaded } = uploadStats;
  const speed = loaded / ((Date.now() - start) / 1000);
  return (
    <>
      <form className={cls('upload-form')} onSubmit={handleFormSubmit}>
        <Form.Group as={Row} controlId='file-upload'>
          <Form.Label column sm='2'>
            Upload:
          </Form.Label>
          <Col sm='8'>
            <Form.Control
              type='file'
              name='uploads'
              multiple
              className={cls('input')}
              onChange={handleFileChange}
            />
          </Col>
          <Col sm='2'>
            <Form.Control type='submit' value='Upload' />
          </Col>
        </Form.Group>
      </form>
      {total > 0
        ? (
          <div className={cls('progress-container')}>
            <p>
              Upload: {formatBytes(loaded)} of {formatBytes(total)} ({formatBytes(speed)}/s)
            </p>
            <progress className={cls('progress')} value={loaded} max={total} />
          </div>
          )
        : null}
    </>
  );
};

export default UploadForm;
