import React from 'react';
import {withRouter} from 'react-router-dom';

import Uuid from 'uuid';
import {Button, Dimmer, Grid, Header, Modal, List, Loader, Segment} from 'semantic-ui-react';
import {validate} from 'services/jsonSchemaValidator';
import {JSON_SCHEMA_URL, sendCommand} from 'services/api';
import ModflowModelCommand from '../../t03/commands/modflowModelCommand';
import {BoundaryCollection, BoundingBox, Cells, Geometry, GridSize, Soilmodel, Stressperiods} from 'core/model/modflow';
import PropTypes from 'prop-types';

class ModflowModelImport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            payload: null,
            errors: null,
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
        console.log(JSON_SCHEMA_URL, schemaUrl);
        validate(data, schemaUrl).then(([isValid, errors]) => {
            if (!isValid) {
                return this.setState({errors});
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

           return this.setState({payload});
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

    renderMetaData = () => (
            <Segment color="blue">
                <Header as="h3" style={{'textAlign': 'left'}}>Metadata</Header>
            </Segment>
        );

    renderData = () => (
            <Segment color="blue">
                <Header as="h3" style={{'textAlign': 'left'}}>Data</Header>
            </Segment>
        );



    renderJSONImportModal = () => (
            <Modal open onClose={this.props.onCancel} dimmer={'blurring'}>
                <Modal.Header>Import JSON File</Modal.Header>
                <Modal.Content>
                    <Grid divided={'vertically'}>
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
                                        <List.Item>The rasterfile should have the same bounds as the model
                                            area.</List.Item>
                                        <List.Item>The gridsize will interpolated automatically.</List.Item>
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
                                {this.renderMetaData()}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                {this.renderData()}
                            </Grid.Column>
                            <Grid.Column>
                                <Segment color={'green'}>

                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={()=>this.setState({showJSONImportModal: false})}>Cancel</Button>
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
        console.warn(this.state.errors);
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

ModflowModelImport.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
};

export default withRouter(ModflowModelImport);
