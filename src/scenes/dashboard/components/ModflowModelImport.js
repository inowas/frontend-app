import React from 'react';
import {withRouter} from 'react-router-dom';

import Uuid from 'uuid';
import {Button, Dimmer, Grid, Header, Modal, List, Loader, Segment} from 'semantic-ui-react';
import ModflowModelCommand from '../../t03/commands/modflowModelCommand';
import {BoundaryCollection, BoundingBox, Cells, Geometry, GridSize, Soilmodel, Stressperiods} from '../../../core/model/modflow';
import PropTypes from 'prop-types';
import ModelImportMap from './ModelImportMap';

import {JSON_SCHEMA_URL, sendCommand} from '../../../services/api';
import {dxGeometry, dyGeometry} from '../../../services/geoTools/distance';
import {validate} from '../../../services/jsonSchemaValidator';

class ModflowModelImport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: null,
            payload: null,
            isLoading: false,
            showJSONImportModal: false
        };

        this.fileReader = new FileReader();
        this.fileReader.onload = (event) => {
            this.parseFileContent(event.target.result);
        }
    }

    parseFileContent = (text) => {
        const data = JSON.parse(text);
        const schemaUrl = JSON_SCHEMA_URL + '/import/modflowModel.json';
        validate(data, schemaUrl).then(([isValid, errors]) => {
            if (!isValid) {
                return this.setState({errors, payload: null});
            }

            const id = Uuid.v4();
            const geometry = Geometry.fromGeoJson(data.discretization.geometry);
            const boundingBox = BoundingBox.fromGeoJson(data.discretization.geometry);
            const gridSize = Array.isArray(data.discretization.grid_size) ? GridSize.fromArray(data.discretization.grid_size) : GridSize.fromObject(data.discretization.grid_size);
            const stressperiods = Stressperiods.fromImport(data.discretization.stressperiods);
            const soilmodel = data.soilmodel;

            soilmodel.layers = soilmodel.layers.map(l => {
                l.id = Uuid.v4();
                return l;
            });

            const payload = {
                id,
                name: data.name,
                description: data.description,
                public: data.public,
                discretization: {
                    geometry: geometry.toObject(),
                    bounding_box: boundingBox.toArray(),
                    grid_size: gridSize.toObject(),
                    cells: Cells.fromGeometry(geometry, boundingBox, gridSize).toArray(),
                    stressperiods: stressperiods.toObject(),
                    length_unit: data.discretization.length_unit,
                    time_unit: data.discretization.time_unit,
                },
                soilmodel: {
                    layers: Soilmodel.fromObject(soilmodel).toObject().layers
                },
                boundaries: BoundaryCollection.fromImport(data.boundaries, boundingBox, gridSize).toObject()
            };

            return this.setState({payload, errors: null});
        })
    };

    sendImportCommand = () => {
        const {payload} = this.state;

        if (payload) {
            sendCommand(ModflowModelCommand.importModflowModel(payload),
                () => this.props.history.push('/tools/T03/' + payload.id)
            )
        }
    };

    handleUploadJson = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            this.fileReader.readAsText(files[0]);
        }
    };

    onClickUpload = () => this.setState({showJSONImportModal: true});

    renderMetaData = (payload) => {
        const {name, description, discretization} = payload;
        const {grid_size} = discretization;
        const geometry = Geometry.fromObject(discretization.geometry);
        const isPublic = payload.public;
        return (
            <Segment color="blue">
                <Header as="h3" style={{'textAlign': 'left'}}>Metadata</Header>
                <List>
                    <List.Item>
                        <List.Icon name="file outline"/>
                        <List.Content>{name}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="file alternate outline"/>
                        <List.Content>{description}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="chess board"/>
                        <List.Content>Cols: {grid_size.n_x}, Rows: {grid_size.n_y}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="eye"/>
                        <List.Content>{(isPublic && 'public') || 'private'}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="arrows alternate horizontal"/>
                        <List.Content>{dxGeometry(geometry) + ' m'}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="arrows alternate vertical"/>
                        <List.Content>{dyGeometry(geometry) + ' m'}</List.Content>
                    </List.Item>
                </List>
            </Segment>
        )
    };

    renderValidationErrors = (errors) => {

        console.log(errors);
        return (
            <Segment color="red" inverted>
                <Header as="h3" style={{'textAlign': 'left'}}>Validation Errors</Header>
                <List>
                    {errors.map((e, idx) => (
                        <List.Item key={idx}>
                            <List.Icon name="eye"/>
                            <List.Content>{e.message}</List.Content>
                        </List.Item>
                    ))}
                </List>
            </Segment>
        )
    };

    renderMap = (payload) => {
        const {discretization} = payload;
        const boundaries = BoundaryCollection.fromObject(payload.boundaries);
        const boundingBox = BoundingBox.fromArray(discretization.bounding_box);
        const geometry = Geometry.fromObject(discretization.geometry);

        return (
            <Segment color="blue">
                <Header as="h3" style={{'textAlign': 'left'}}>Map</Header>
                <ModelImportMap
                    boundaries={boundaries}
                    boundingBox={boundingBox}
                    geometry={geometry}
                />
            </Segment>
        );
    };

    renderJSONImportModal = () => (
        <Modal open onClose={this.props.onCancel} dimmer={'blurring'}>
            <Modal.Header>Import Model</Modal.Header>
            <Modal.Content>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            {this.state.isLoading &&
                            <Dimmer active inverted>
                                <Loader>Uploading</Loader>
                            </Dimmer>
                            }
                            {!this.state.isLoading &&
                            <Segment color={'green'}>
                                <Header as="h3" style={{'textAlign': 'left'}}>File Requirements</Header>
                                <List bulleted>
                                    <List.Item>
                                        The file has to be a json-file.
                                    </List.Item>
                                    <List.Item>
                                        The file will be validated against <a
                                        href='https://schema.inowas.com/import/modflowModel.json' target='_blank'
                                        rel='noopener noreferrer'>this</a> json-schema.
                                    </List.Item>
                                    <List.Item>
                                        Examples can be found <a
                                        href='https://github.com/inowas/inowas-dss-cra/blob/master/imports'
                                        target='_blank' rel='noopener noreferrer'>here</a>.
                                    </List.Item>
                                </List>
                                <Button
                                    primary
                                    fluid
                                    as='label'
                                    htmlFor={'inputField'}
                                    icon='file alternate'
                                    content='Select File'
                                    labelPosition='left'
                                />
                                <input
                                    hidden
                                    type='file'
                                    id='inputField'
                                    onChange={this.handleUploadJson}
                                />
                            </Segment>
                            }
                        </Grid.Column>
                        <Grid.Column>
                            {this.state.payload && this.renderMetaData(this.state.payload)}
                            {this.state.errors && this.renderValidationErrors(this.state.errors)}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {this.state.payload && this.renderMap(this.state.payload)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => this.setState({showJSONImportModal: false})}>Cancel</Button>
                <Button
                    disabled={!this.state.payload}
                    positive
                    onClick={this.sendImportCommand}
                >
                    Import
                </Button>
            </Modal.Actions>
        </Modal>
    );

    render() {
        const {showJSONImportModal} = this.state;
        return (
            <div>
                <Button
                    primary
                    icon='upload'
                    content='Import'
                    labelPosition='left'
                    onClick={this.onClickUpload}
                />
                {showJSONImportModal && this.renderJSONImportModal()}
            </div>
        );
    }
}

ModflowModelImport.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
};

export default withRouter(ModflowModelImport);
