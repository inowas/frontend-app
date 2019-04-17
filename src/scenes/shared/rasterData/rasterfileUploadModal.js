import PropTypes from 'prop-types';
import React from 'react';
import {
    Button, Dimmer, Form, Grid, Input, Radio, Header, List, Segment, Modal, Loader,
    Dropdown, Message
} from 'semantic-ui-react';
import RasterDataImage from './rasterDataImage';
import {GridSize} from 'core/model/geometry';
import {fetchRasterMetaData, fetchRasterData, uploadRasterfile} from 'services/api';
import math from 'mathjs';

const styles = {
    input: {
        backgroundColor: 'transparent',
        padding: 0
    }
};

class RasterfileUploadModal extends React.Component {
    state = {
        hash: null,
        metadata: null,
        data: null,
        interpolation: 0,
        isLoading: false,
        selectedBand: 0,
        errorFetching: false,
        errorUploading: false,
        errorGridSize: false
    };

    handleSave = () => {
        const {uploadedFile} = this.props;

        if (!uploadedFile) {
            return null;
        }

        this.props.onSave(uploadedFile.data[this.state.selectedBand]);
        return null;
    };

    handleChangeInterpolation = (e, {name, value}) => this.setState({
        interpolation: value
    });

    renderMetaData = () => {
        const {hash, metadata} = this.state;
        if (!hash || !metadata) {
            return null;
        }

        return (
            <Segment color="blue">
                <Header as="h3" style={{'textAlign': 'left'}}>Metadata</Header>
                <List>
                    <List.Item>
                        <List.Icon name="hashtag"/>
                        <List.Content>{hash}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="attach"/>
                        <List.Content>{metadata.driver}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="marker"/>
                        <List.Content>X: {metadata.origin[0]}, Y: {metadata.origin[1]}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="resize horizontal"/>
                        <List.Content>{metadata.pixelSize[0]}</List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Icon name="resize vertical"/>
                        <List.Content>{metadata.pixelSize[1]}</List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name="map outline"/>
                        <List.Content>{metadata.projection}</List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name="grid layout"/>
                        <List.Content>
                            X: {metadata.rasterXSize}, Y: {metadata.rasterYSize}, Z: {metadata.rasterCount}
                        </List.Content>
                    </List.Item>
                </List>
            </Segment>
        );
    };

    renderBands = () => {
        const {data, errorGridSize, selectedBand} = this.state;

        if (errorGridSize) {
            return null;
        }

        const bands = data.map((e, key) => (
            <Form.Field key={key}>
                <Radio
                    label={'Band ' + key}
                    name="radioGroup"
                    value={key}
                    checked={selectedBand === key}
                    onChange={(e, {value}) => this.setState({selectedBand: value})}
                />
            </Form.Field>
        ));

        return (
            <Segment color="blue">
                <Header as="h3" style={{'textAlign': 'left'}}>Data</Header>
                {bands}
            </Segment>
        );
    };

    handleUploadFile = e => {
        const {gridSize} = this.props;
        const files = e.target.files;
        const file = files[0];

        this.setState({isLoading: true});

        uploadRasterfile(file, ({hash}) => {
                this.setState({data: null, fetching: true, hash: hash});

                const fetchOptions = {
                    hash,
                    width: this.props.gridSize.nX,
                    height: this.props.gridSize.nY,
                    method: this.state.interpolation
                };

                fetchRasterMetaData({hash}, response => {
                    this.setState({
                        errorGridSize: this.state.interpolation === 11 && (response.rasterXSize !== gridSize.nX || response.rasterYSize !== gridSize.nY),
                        isLoading: false,
                        metadata: response
                    });
                }, (errorFetching) => this.setState({errorFetching}));

                fetchRasterData(
                    this.state.interpolation === 11 ? {hash} : fetchOptions,
                    data => {
                        this.setState({isLoading: false, data: math.round(data, 3)})
                    },
                    (errorFetching) => this.setState({errorFetching}))
            },
            (errorUploading) => this.setState({errorUploading})
        );
    };

    render() {
        const {data, errorGridSize, interpolation, metadata, selectedBand} = this.state;

        return (
            <Modal size={'large'} open onClose={this.props.onCancel} dimmer={'blurring'}>
                <Modal.Header>Upload Rasterfile</Modal.Header>
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
                                    <Header as="h3" style={{'textAlign': 'left'}}>Important</Header>
                                    <List bulleted>
                                        <List.Item>The rasterfile should have the same bounds as the model
                                            area.</List.Item>
                                        <List.Item>The grid size will be interpolated automatically, if an interpolation
                                            method is selected.</List.Item>
                                    </List>
                                    <Header as="h4" style={{'textAlign': 'left'}}>Interpolation method</Header>
                                    <Dropdown
                                        placeholder='Select interpolation method'
                                        fluid
                                        selection
                                        name='interpolation'
                                        options={[
                                            {key: -1, text: 'No interpolation', value: 11},
                                            {key: 0, text: 'Nearest-neighbor (default)', value: 0},
                                            {key: 1, text: 'Bi-linear', value: 1},
                                            {key: 2, text: 'Bi-quadratic', value: 2},
                                            {key: 3, text: 'Bi-cubic', value: 3},
                                            {key: 4, text: 'Bi-quartic', value: 4},
                                            {key: 5, text: 'Bi-quintic', value: 5}
                                        ]}
                                        value={interpolation}
                                        onChange={this.handleChangeInterpolation}
                                    /><br/>
                                    <Input style={styles.input} type="file" onChange={this.handleUploadFile}/>
                                </Segment>
                                }
                            </Grid.Column>
                            <Grid.Column>
                                {this.renderMetaData()}
                                {errorGridSize &&
                                <Message negative>
                                    <Message.Header>Error</Message.Header>
                                    <p>The grid size of the uploaded raster does not fit the models grid size. Use an
                                        interpolation method or adjust the grid size of the input raster.</p>
                                </Message>
                                }
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                {data && this.renderBands()}
                            </Grid.Column>
                            <Grid.Column>
                                {!errorGridSize && data &&
                                <Segment color={'green'}>
                                    <RasterDataImage
                                        data={data[selectedBand]}
                                        unit={this.props.parameter.unit}
                                        gridSize={this.props.gridSize}
                                    />
                                </Segment>
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        negative
                        onClick={this.props.onCancel}
                    >
                        Cancel
                    </Button>
                    {!errorGridSize &&
                    <Button
                        positive
                        onClick={() => this.props.onChange({
                            data: data[selectedBand],
                            metadata: metadata
                        })}
                    >
                        Apply
                    </Button>
                    }
                </Modal.Actions>
            </Modal>
        );
    }
}

RasterfileUploadModal.propTypes = {
    gridSize: PropTypes.instanceOf(GridSize).isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    parameter: PropTypes.object.isRequired,
    discreteRescaling: PropTypes.bool
};

export default RasterfileUploadModal;
