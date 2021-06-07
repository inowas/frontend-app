import {BoundaryType, IBoundary, IBoundaryExport} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import {Button, Divider, Grid, Header, List, Modal, Segment} from 'semantic-ui-react';
import {CALCULATE_BOUNDARIES_IMPORT_INPUT} from '../../../../modflow/worker/t03.worker';
import {CoordinateSystemDisclaimer} from '../../../../shared/complexTools';
import {ICalculateBoundaryImportInputData} from '../../../../modflow/worker/t03.worker.type';
import {JSON_SCHEMA_URL} from '../../../../../services/api';
import {
  ModflowModel,
} from '../../../../../core/model/modflow';
import {asyncWorker} from '../../../../modflow/worker/worker';
import {validate} from '../../../../../services/jsonSchemaValidator';
import BoundaryCollection from '../../../../../core/model/modflow/boundaries/BoundaryCollection';
import BoundaryComparator from './boundaryComparator';
import React, {useState} from 'react';
import Soilmodel from '../../../../../core/model/modflow/soilmodel/Soilmodel';

interface IProps {
  model: ModflowModel;
  soilmodel: Soilmodel;
  boundaries: BoundaryCollection;
  onChange: (boundaries: BoundaryCollection) => void;
  types?: BoundaryType[];
}

const BoundaryImport = (props: IProps) => {
  const [importedBoundaries, setImportedBoundaries] = useState<IBoundary[] | null>(null);
  const [selectedBoundary, setSelectedBoundary] = useState<string | null>(null);
  const [errors, setErrors] = useState<Array<{message: string}> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  const fileReader: FileReader = new FileReader();
  fileReader.onload = (event: any) => {
    if (event && event.target && event.target.result) {
      parseFileContent(event.target.result);
    }
  };

  const handleBoundaryClick = (id: string) => setSelectedBoundary(id);

  const handleCancel = () => setShowImportModal(false);

  const handleFileData = (iBoundaries: IBoundaryExport[]) => {
    const {boundingBox, gridSize} = props.model;

    asyncWorker({
      type: CALCULATE_BOUNDARIES_IMPORT_INPUT,
      data: {
        boundingBox: boundingBox.toObject(),
        gridSize: gridSize.toObject(),
        boundaries: iBoundaries
      } as ICalculateBoundaryImportInputData
    }).then((bc) => {
      const boundaries = BoundaryCollection.fromObject(bc);
      setImportedBoundaries(boundaries.toObject());
      setSelectedBoundary(boundaries.first && boundaries.first.id);
      setIsLoading(false);
    });
  };

  const isValidJson = (text: string) => {
    try {
      JSON.parse(text);
    } catch (e) {
      return false;
    }
    return true;
  };

  const parseFileContent = (text: string) => {
    setImportedBoundaries(null);
    setErrors(null);
    if (!isValidJson(text)) {
      setErrors([{message: 'Invalid JSON'}]);
    }
    const data = JSON.parse(text);
    const schemaUrl = JSON_SCHEMA_URL + '/import/boundaries.json';
    validate(data, schemaUrl).then(([isValid, e]) => {
      if (!isValid) {
        setIsLoading(false);
        setErrors(e);
      }
      return handleFileData(data);
    });
  };

  const download = () => {
    const filename = 'boundaries.json';
    const boundaries: IBoundaryExport[] = props.boundaries.toExport(props.model.stressperiods);
    const text = JSON.stringify(boundaries, null, 2);

    const element: HTMLAnchorElement = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleUpload = (e: any) => {
    const files = e.target.files;
    if (files.length > 0) {
      setIsLoading(true);
      fileReader.readAsText(files[0]);
    }
  };

  const handleClickUpload = () => setShowImportModal(true);

  const renderValidationErrors = (errors: Array<{ message: string }>) => (
    <Segment color="red" inverted={true}>
      <Header as="h3" style={{textAlign: 'left'}}>Validation Errors</Header>
      <List>
        {errors.map((e, idx) => (
          <List.Item key={idx}>
            <List.Icon name="eye"/>
            <List.Content>{e.message}</List.Content>
          </List.Item>
        ))}
      </List>
    </Segment>
  );

  const handleFileUploadClick = () => setImportedBoundaries(null);

  const renderBoundaries = () => {
    if (importedBoundaries) {
      return (
        <BoundaryComparator
          currentBoundaries={props.boundaries}
          soilmodel={props.soilmodel}
          newBoundaries={BoundaryCollection.fromObject(importedBoundaries)}
          model={props.model}
          selectedBoundary={selectedBoundary}
          onBoundaryClick={handleBoundaryClick}
        />
      );
    }
  };

  const renderImportModal = () => (
    <Modal
      trigger={<Button>Show Modal</Button>}
      closeIcon={true}
      open={true}
      onClose={handleCancel}
      dimmer={'blurring'}
    >
      <Modal.Header>Import Boundaries</Modal.Header>
      <Modal.Content>
        {importedBoundaries == null && <div>
          <CoordinateSystemDisclaimer/>
          <Grid stackable={true}>
            <Grid.Row>
              <Grid.Column>
                <Segment basic={true} placeholder={true} style={{minHeight: '10rem'}}>
                  <Grid columns={2} stackable={true} textAlign="center">
                    <Divider vertical={true}/>
                    <Grid.Row verticalAlign="top">
                      <Grid.Column>
                        {!errors &&
                        <div>
                          <Header as={'h3'}>
                            Download the list of boundaries.
                          </Header>
                          <Button
                            basic={true}
                            color="blue"
                            htmlFor={'inputField'}
                            content={'Get JSON File'}
                            onClick={download}
                          />
                        </div>
                        }
                        {errors && renderValidationErrors(errors)}
                      </Grid.Column>
                      <Grid.Column>
                        <Header as={'h3'}>
                          Upload Boundaries
                        </Header>
                        <Button
                          color={'grey'}
                          as={'label'}
                          htmlFor={'inputField'}
                          icon={'file alternate'}
                          content={'Select File'}
                          labelPosition={'left'}
                          loading={isLoading}
                          size={'large'}
                        />
                        <input
                          hidden={true}
                          type={'file'}
                          id={'inputField'}
                          onChange={handleUpload}
                          onClick={handleFileUploadClick}
                          value={''}
                        />
                        <br/>
                        <p>The file has to be a valid json-file.</p>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>}
        {importedBoundaries !== null && <Grid stackable={true}>
          <Grid.Row>
            <Grid.Column>
              {renderBoundaries()}
            </Grid.Column>
          </Grid.Row>
        </Grid>}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleCancel}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );

  return (
    <div>
      <Button
        primary={true}
        fluid={true}
        icon="download"
        content="Import Boundaries"
        labelPosition="left"
        onClick={handleClickUpload}
      />
      {showImportModal && renderImportModal()}
    </div>
  );
}

export default BoundaryImport;
