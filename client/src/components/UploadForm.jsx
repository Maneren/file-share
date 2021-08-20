import styles from './UploadForm.module.css';

import { Col, Form, Row } from 'react-bootstrap';

import { React as ReactUtils } from 'my-utils';
const cls = ReactUtils.classListBuilder(styles);
// TODO: handle upload response
const UploadForm = () => (
  <form className={cls('upload-form')} action='/upload' method='post' encType='multipart/form-data'>
    <Form.Group as={Row} controlId='file-upload'>
      <Form.Label column sm='2'>
        Upload:
      </Form.Label>
      <Col sm='8'>
        <Form.Control type='file' name='uploads' multiple className={cls('input')} />
      </Col>
      <Col sm='2'>
        <Form.Control type='submit' value='Upload' />
      </Col>
    </Form.Group>
  </form>
);

export default UploadForm;
