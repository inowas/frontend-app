import { BoundaryCollection } from '../../../core/model/modflow/boundaries';
import {
  BoundingBox,
  Cells,
  Geometry,
  GridSize,
  Soilmodel,
  Stressperiods,
  Transport,
  VariableDensity,
} from '../../../core/model/modflow';
import { Button, Dimmer, Grid, Header, List, Loader, Modal, Segment } from 'semantic-ui-react';
import { ChangeEvent, useState } from 'react';
import { CoordinateSystemDisclaimer } from '../../shared/complexTools';
import { IBoundary } from '../../../core/model/modflow/boundaries/Boundary.type';
import { IFlopyPackages } from '../../../core/model/flopy/packages/FlopyPackages.type';
import { IModflowModel } from '../../../core/model/modflow/ModflowModel.type';
import { ISoilmodel } from '../../../core/model/modflow/soilmodel/Soilmodel.type';
import { ITransport } from '../../../core/model/modflow/transport/Transport.type';
import { IVariableDensity } from '../../../core/model/modflow/variableDensity/VariableDensity.type';
import { JSON_SCHEMA_URL, sendCommand } from '../../../services/api';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ValidationError } from 'ajv';
import { dxGeometry, dyGeometry } from '../../../services/geoTools/distance';
import { validate } from '../../../services/jsonSchemaValidator';
import ModelImportMap from './ModelImportMap';
import ModflowModelCommand from '../../t03/commands/modflowModelCommand';
import Uuid from 'uuid';

interface IPayload extends IModflowModel {
  boundaries: IBoundary[];
  packages: IFlopyPackages;
  soilmodel: ISoilmodel;
  transport: ITransport;
  variableDensity: IVariableDensity;
}

const ModflowModelImport = (props: RouteComponentProps) => {
  const [errors, setErrors] = useState<ValidationError[] | null>(null);
  const [payload, setPayload] = useState<IPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showJSONImportModal, setShowJSONImportModal] = useState<boolean>(false);

  const fileReader = new FileReader();
  fileReader.onload = (event) => {
    if (event.target && event.target instanceof FileReader) {
      const target = event.target;
      if (typeof target.result === 'string') {
        parseFileContent(target.result);
      }
    }
  };

  const parseFileContent = (text: string) => {
    const data = JSON.parse(text);
    const schemaUrl = JSON_SCHEMA_URL + '/import/modflowModel.json';
    setIsLoading(true);
    validate(data, schemaUrl).then(([isValid, cErrors]) => {
      if (!isValid) {
        setErrors(cErrors);
        return setPayload(null);
      }

      const id = Uuid.v4();
      const geometry = Geometry.fromGeoJson(data.discretization.geometry);
      const boundingBox = BoundingBox.fromGeoJson(data.discretization.geometry);
      const gridSize = Array.isArray(data.discretization.grid_size)
        ? GridSize.fromArray(data.discretization.grid_size)
        : GridSize.fromObject(data.discretization.grid_size);
      const stressPeriods = Stressperiods.fromImport(data.discretization.stressperiods);

      const nPayload: IPayload = {
        id,
        name: data.name,
        description: data.description,
        public: data.public,
        discretization: {
          geometry: geometry.toObject(),
          bounding_box: boundingBox.toObject(),
          grid_size: gridSize.toObject(),
          cells: data.cells ? Cells.fromObject(data.cells).toObject() : Cells.fromGeometry(geometry, boundingBox, gridSize).toObject(),
          stressperiods: stressPeriods.toObject(),
          length_unit: data.discretization.length_unit,
          time_unit: data.discretization.time_unit,
        },
        permissions: 'rwx',
        calculation_id: data.calculation_id,
        is_scenario: false,
        boundaries: BoundaryCollection.fromExport(data.boundaries, boundingBox, gridSize).toObject(),
        packages: { ...data.packages, model_id: id },
        soilmodel: Soilmodel.fromExport(data.soilmodel).toObject(),
        transport: Transport.fromObject(data.transport).toObject(),
        variableDensity: VariableDensity.fromObject(data.variableDensity).toObject(),
      };

      setPayload(nPayload);
      setIsLoading(false);
      return setErrors(null);
    });
  };

  const sendImportCommand = () => {
    if (payload) {
      sendCommand(ModflowModelCommand.importModflowModel(payload), () =>
        props.history.push('/tools/T03/' + payload.id),
      );
    }
  };

  const handleUploadJson = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      fileReader.readAsText(files[0]);
    }
  };

  const handleClickUpload = () => setShowJSONImportModal(true);

  const renderMetaData = (cPayload: IPayload) => {
    const { name, description, discretization } = cPayload;
    const { grid_size } = discretization;
    const geometry = Geometry.fromObject(discretization.geometry);
    const isPublic = cPayload.public;
    return (
      <Segment color='blue'>
        <Header as='h3' style={{ textAlign: 'left' }}>
          Metadata
        </Header>
        <List>
          <List.Item>
            <List.Icon name='file outline' />
            <List.Content>{name}</List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name='file alternate outline' />
            <List.Content>{description}</List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name='chess board' />
            <List.Content>
              Cols: {grid_size.n_x}, Rows: {grid_size.n_y}
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name='eye' />
            <List.Content>{(isPublic && 'public') || 'private'}</List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name='arrows alternate horizontal' />
            <List.Content>{dxGeometry(geometry) + ' m'}</List.Content>
          </List.Item>
          <List.Item>
            <List.Icon name='arrows alternate vertical' />
            <List.Content>{dyGeometry(geometry) + ' m'}</List.Content>
          </List.Item>
        </List>
      </Segment>
    );
  };

  const renderValidationErrors = (cErrors: ValidationError[]) => (
    <Segment color='red' inverted={true}>
      <Header as='h3' style={{ textAlign: 'left' }}>
        Validation Errors
      </Header>
      <List>
        {cErrors.map((e, idx) => (
          <List.Item key={idx}>
            <List.Icon name='eye' />
            <List.Content>{e.message}</List.Content>
          </List.Item>
        ))}
      </List>
    </Segment>
  );

  const renderMap = (cPayload: IPayload) => {
    const { discretization } = cPayload;
    const boundaries = BoundaryCollection.fromObject(cPayload.boundaries);
    const boundingBox = BoundingBox.fromObject(discretization.bounding_box);
    const geometry = Geometry.fromObject(discretization.geometry);

    return (
      <Segment color='blue'>
        <Header as='h3' style={{ textAlign: 'left' }}>
          Map
        </Header>
        <ModelImportMap boundaries={boundaries} boundingBox={boundingBox} geometry={geometry} />
      </Segment>
    );
  };

  const renderJSONImportModal = () => (
    <Modal open={true} dimmer={'blurring'}>
      <Modal.Header>Import Model</Modal.Header>
      <Modal.Content>
        <CoordinateSystemDisclaimer />
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column>
              {isLoading && (
                <Dimmer active={true} inverted={true}>
                  <Loader>Uploading</Loader>
                </Dimmer>
              )}
              {!isLoading && (
                <Segment color={'green'}>
                  <Header as='h3' style={{ textAlign: 'left' }}>
                    File Requirements
                  </Header>
                  <List bulleted={true}>
                    <List.Item>The file has to be a json-file.</List.Item>
                    <List.Item>
                      The file will be validated against&nbsp;
                      <a
                        href='https://schema.inowas.com/import/modflowModel.json'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        this
                      </a>{' '}
                      json-schema.
                    </List.Item>
                    <List.Item>
                      Examples can be found&nbsp;
                      <a
                        href='https://github.com/inowas/inowas-dss-cra/blob/master/imports'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        here
                      </a>
                      .
                    </List.Item>
                  </List>
                  <Button
                    primary={true}
                    fluid={true}
                    as='label'
                    htmlFor={'inputField'}
                    icon='file alternate'
                    content='Select File'
                    labelPosition='left'
                  />
                  <input hidden={true} type='file' id='inputField' onChange={handleUploadJson} />
                </Segment>
              )}
            </Grid.Column>
            <Grid.Column>
              {payload && renderMetaData(payload)}
              {errors && renderValidationErrors(errors)}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>{payload && renderMap(payload)}</Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setShowJSONImportModal(false)}>Cancel</Button>
        <Button disabled={!payload} positive={true} onClick={sendImportCommand}>
          Import
        </Button>
      </Modal.Actions>
    </Modal>
  );

  return (
    <div>
      <Button primary={true} icon='upload' content='Import' labelPosition='left' onClick={handleClickUpload} />
      {showJSONImportModal && renderJSONImportModal()}
    </div>
  );
};

export default withRouter(ModflowModelImport);
