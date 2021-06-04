import {Button, Icon, Message, Modal} from 'semantic-ui-react';
import {JSON_SCHEMA_URL} from '../../../services/api';
import {validate as jsonSchemaValidate} from '../../../services/jsonSchemaValidator';
import Qmra from '../../../core/model/qmra/Qmra';
import React, {ChangeEvent, useState} from 'react';

interface IProps {
  onChange: (response: Qmra) => void;
  qmra: Qmra;
}

const JsonUpload = ({onChange, qmra}: IProps) => {
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

  const checkFile = (data: any) => Array.isArray(data.inflow) && Array.isArray(data.exposure) &&
    Array.isArray(data.doseresponse) && Array.isArray(data.health) && data.treatment &&
    Array.isArray(data.treatment.processes) && Array.isArray(data.treatment.schemes);

  const handleConfirm = () => {
    let q = Qmra.fromDefaults();

    if ('config' in data && checkFile(data.config)) {
      q = qmra.fromPayload(data.config);
    }
    if ('data' in data && checkFile(data.data)) {
      q = Qmra.fromObject(data);
    }
    if ('inflow' in data && checkFile(data)) {
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
      setShowModal(true);
      e.push('Invalid JSON');
      setErrors(e);
    }

    const d = JSON.parse(text);

    jsonSchemaValidate(
      d,
      JSON_SCHEMA_URL + '/qmra/qmra.payload.json'
    ).then((r) => {
      if (r[0]) {
        setErrors([]);
        setIsLoading(false);
        setShowModal(true);
        setData(d);
      } else {
        if (Array.isArray(r[1]) && 'message' in r[1][0]) {
          setErrors(r[1].map((e) => e.message));
        }
        setIsLoading(false);
        setShowModal(true);
      }
    });
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
      <input hidden={true} type="file" id="inputField" onChange={handleUploadFile}/>
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
              <Icon name="remove"/> Close
            </Button>
          </Modal.Actions>
        )}
        {errors.length < 1 && (
          <Modal.Actions>
            <Button color="red" onClick={handleTriggerModal}>
              <Icon name="remove"/> No
            </Button>
            <Button color="green" onClick={handleConfirm}>
              <Icon name="checkmark"/> Yes
            </Button>
          </Modal.Actions>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default JsonUpload;
