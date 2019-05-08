import PropTypes from 'prop-types';
import React from 'react';
import {Button, Dimmer, Grid, Input, Header, List, Segment, Modal, Loader, Form} from 'semantic-ui-react';
import {BoundingBox, GridSize} from 'core/model/geometry';
import {Raster} from 'core/model/mcda/gis';
import {booleanPointInPolygon} from '@turf/turf';

const styles = {
    input: {
        backgroundColor: 'transparent',
        padding: 0
    }
};

class UploadJsonModal extends React.Component {
    state = {
        file: null,
        messages: [],
        noValue: 0,
        property: 'HGEnv2',
        reclassification: {
            'Consolidated Sedimentary - F': 5
        }
    };

    handleClickCalculate = () => {
        const messages = this.state.messages;
        const mode = 'CENTER';

        const raster = new Raster();
        raster.boundingBox = new BoundingBox(11, 41, -35, -5); //TODO
        raster.gridSize = new GridSize(500, 500); // TODO

        const data = new Array(raster.gridSize.nY).fill(0).map(() => new Array(raster.gridSize.nX).fill(0));

        const dx = raster.boundingBox.xMax - raster.boundingBox.xMin / raster.gridSize.nX;
        const dy = raster.boundingBox.yMax - raster.boundingBox.yMin / raster.gridSize.nY;

        for (let x = 0; x < raster.gridSize.nX; x++) {
            for (let y = 0; y < raster.gridSize.nY; y++) {
                if (mode === 'CENTER') {
                    const cx = raster.boundingBox.xMin + x * dx / 2;
                    const cy = raster.boundingBox.yMin + y * dy / 2;

                    const cp = {
                        type: 'Point',
                        coordinates: [cx, cy]
                    };

                    const fittingFeatures = this.state.file.features.filter(feature => booleanPointInPolygon(cp, feature.geometry));

                    if (fittingFeatures.length > 0) {
                        if (fittingFeatures.length > 1) {
                            messages.push(`Multiple features found for cell ${x} ${y}. Used first feature.`);
                        }
                        data[x][y] = fittingFeatures[0].properties[this.state.property];
                    }
                    if (fittingFeatures.length === 0) {
                        messages.push(`Couldn't find feature for cell ${x} ${y}. Used noValue.`);
                        data[x][y] = this.state.noValue;
                    }
                }
            }
        }

        console.log('DONE', data);
    };

    handleSave = () => {
        const {uploadedFile} = this.props;

        if (!uploadedFile) {
            return null;
        }

        this.props.onSave(uploadedFile.data[this.state.selectedBand]);
        return null;
    };

    handleUploadFile = e => {
        const files = e.target.files;
        if (files.length > 0) {
            const fr = new FileReader();
            fr.onload = f => this.setState({
                    file: JSON.parse(f.target.result)
                });
            fr.readAsText(files.item(0));
        }
    };

    render() {
        return (
            <Modal size={'large'} open onClose={this.props.onCancel} dimmer={'blurring'}>
                <Modal.Header>Upload GeoJson file</Modal.Header>
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
                                    <Header as="h3" style={{'textAlign': 'left'}}>Upload</Header>
                                    <Input style={styles.input} type="file" onChange={this.handleUploadFile}/>
                                </Segment>
                                }
                            </Grid.Column>
                            <Grid.Column>
                                {this.state.file &&
                                <Segment color="blue">
                                    <Header as="h3" style={{'textAlign': 'left'}}>Metadata</Header>
                                    <List>
                                        <List.Item>
                                            <List.Content>{this.state.file.features.length} features</List.Content>
                                        </List.Item>
                                    </List>
                                </Segment>
                                }
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Segment color='black'>
                                    <Header as="h3" style={{'textAlign': 'left'}}>Bounds</Header>
                                    <Form>
                                        <Button
                                            fluid
                                            onClick={this.handleClickCalculate}
                                        >
                                            Start Calculation
                                        </Button>
                                    </Form>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>

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
                    >
                        Apply
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

UploadJsonModal.propTypes = {
    boundingBox: PropTypes.instanceOf(BoundingBox),
    gridSize: PropTypes.instanceOf(GridSize).isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default UploadJsonModal;
