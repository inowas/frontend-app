import { Button, Icon, Message, Modal } from 'semantic-ui-react';
import { JSON_SCHEMA_URL } from '../../../services/api';
import {validate as jsonSchemaValidate} from '../../../services/jsonSchemaValidator';
import Qmra from '../../../core/model/qmra/Qmra';
import React, { ChangeEvent, useState } from 'react';

interface IProps {
  onChange: (response: Qmra) => void;
  qmra: Qmra;
}

const JsonUpload = ({ onChange, qmra }: IProps) => {
  const [data, setData] = useState<any>();
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const fileReader = new FileReader();
  fileReader.onload = (event: any) => {
    if (event && event.target && event.target.result) {
      parseFileContent(event.target.result);
    }
  };

  const handleConfirm = () => {
    let q = Qmra.fromDefaults();
    if ('config' in data) {
      q = qmra.fromPayload(data);
    }
    if ('data' in data) {
      q = Qmra.fromObject(data);
    }
    if ('inflow' in data) {
      q = qmra.fromPayload(data);
    }
    setShowModal(false);
    onChange(q);
  };

  const handleTriggerModal = () => setShowModal(!showModal);

  const isValidJson = (text: string) => {
    try {
      JSON.parse(text);
    } catch (e) {
      return false;
    }
    return true;
  };

  const parseFileContent = (text: string) => {
    const checkPassed = isValidJson(text);
    const e: string[] = [];

    if (!checkPassed) {
      setData(undefined);
      e.push('Invalid JSON');
    }

    const d = JSON.parse(text);

    // TODO: JSON SCHEME VALIDATION

    jsonSchemaValidate(
      d,
      JSON_SCHEMA_URL + '/qmra/qmra.payload.json'
    ).then((r) => {
      console.log(r);
    });

    if (checkPassed && e.length === 0) {
      setData(d);
    }

    setErrors(e);
    setIsLoading(false);
    setShowModal(true);
  };

  const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      setIsLoading(true);
      fileReader.readAsText(files[0]);
    }
  };

  return (
    <React.Fragment>
      <Button
        primary={true}
        fluid={true}
        as="label"
        htmlFor="inputField"
        icon="upload"
        content="Import Json"
        labelPosition="left"
        loading={isLoading}
      />
      <input hidden={true} type="file" id="inputField" onChange={handleUploadFile} />
      <Modal onClose={handleTriggerModal} open={showModal} size="small">
        <Modal.Header>Upload Json</Modal.Header>
        <Modal.Content>
          {errors.map((e, key) => (
            <Message key={key} negative>
              {e}
            </Message>
          ))}
          {errors.length < 1 && <p>Are you sure, you want to replace all settings by the uploaded file?</p>}
        </Modal.Content>
        {errors.length > 0 && (
          <Modal.Actions>
            <Button color="grey" onClick={handleTriggerModal}>
              <Icon name="remove" /> Close
            </Button>
          </Modal.Actions>
        )}
        {errors.length < 1 && (
          <Modal.Actions>
            <Button color="red" onClick={handleTriggerModal}>
              <Icon name="remove" /> No
            </Button>
            <Button color="green" onClick={handleConfirm}>
              <Icon name="checkmark" /> Yes
            </Button>
          </Modal.Actions>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default JsonUpload;
