import PropTypes from 'prop-types';
import React from 'react';
import {Button, Dimmer, Form, Grid, Input, Radio, Header, List, Segment, Modal, Loader} from 'semantic-ui-react';
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
        isLoading: false,
        selectedBand: 0,
        errorFetching: false,
        errorUploading: false,
    };

    handleSave = () => {
        const {uploadedFile} = this.props;

        if (!uploadedFile) {
            return null;
        }

        this.props.onSave(uploadedFile.data[this.state.selectedBand]);
        return null;
    };


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
        const {data, selectedBand} = this.state;
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
        const {discreteRescaling} = this.props;
        const files = e.target.files;
        const file = files[0];

        this.setState({isLoading: true});

        uploadRasterfile(file, ({hash}) => {
                this.setState({fetching: true, hash: hash});

                const fetchOptions = {
                    hash,
                    width: this.props.gridSize.nX,
                    height: this.props.gridSize.nY,
                    method: discreteRescaling ? 0 : 1
                };

                fetchRasterMetaData({hash}, response => {
                    this.setState({isLoading: false, metadata: response});
                }, (errorFetching) => this.setState({errorFetching}));

                fetchRasterData(
                    fetchOptions,
                    data => {
                        this.setState({isLoading: false, data: math.round(data, 3)})
                    },
                    (errorFetching) => this.setState({errorFetching}))
            },
            (errorUploading) => this.setState({errorUploading})
        );
    };

    render() {
        const {data, metadata, selectedBand} = this.state;

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
                                        <List.Item>The gridsize will interpolated automatically.</List.Item>
                                    </List>
                                    <Input style={styles.input} type="file" onChange={this.handleUploadFile}/>
                                </Segment>
                                }
                            </Grid.Column>
                            <Grid.Column>
                                {this.renderMetaData()}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                {data && this.renderBands()}
                            </Grid.Column>
                            <Grid.Column>
                                {data &&
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
                    <Button
                        positive
                        onClick={() => this.props.onChange({
                            data: data[selectedBand],
                            metadata: metadata
                        })}
                    >
                        Apply
                    </Button>
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
