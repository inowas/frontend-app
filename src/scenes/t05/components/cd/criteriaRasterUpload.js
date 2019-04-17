import React from 'react';
import PropTypes from 'prop-types';
import {Criterion} from 'core/model/mcda/criteria';
import {Grid, Button, Icon, Message, Form, Segment, Checkbox} from 'semantic-ui-react';
import RasterfileUploadModal from '../../../shared/rasterData/rasterfileUploadModal';
import CriteriaRasterMap from './criteriaRasterMap';
import {Rule, RulesCollection} from 'core/model/mcda/criteria';
import {Raster} from 'core/model/mcda/gis';
import {min, max} from 'scenes/shared/rasterData/helpers';
import {BoundingBox, GridSize} from 'core/model/geometry';
import {dropData} from 'services/api';
import UploadJsonModal from './uploadJsonModal';

class CriteriaRasterUpload extends React.Component {
    state = {
        hash: null,
        metadata: null,
        selectedBand: 0,
        showInfo: true,
        showUploadModal: false,
        showUploadJSON: false,
        errorFetching: false,
        errorUploading: false,
        showBasicLayer: false
    };

    handleDismiss = () => this.setState({showInfo: false});

    handleUploadClick = () => this.setState({showUploadModal: true});

    handleUploadJSONClick = () => this.setState({showUploadJSON: true});

    handleCancelModal = () => this.setState({
        showUploadJSON: false,
        showUploadModal: false
    });

    handleChangeRaster = raster => {
        if (!(raster instanceof Raster)) {
            throw new Error('Raster expected to be instance of Raster.');
        }

        const criterion = this.props.criterion;
        criterion.raster = raster;
        return this.props.onChange(criterion);
    };

    handleUploadFile = result => {
        const {data, metadata} = result;

        const criterion = this.props.criterion;
        const raster = new Raster();
        dropData(
            JSON.stringify(data),
            response => {
                raster.url = response.filename;
                raster.data = data;
                raster.min = min(raster.data);
                raster.max = max(raster.data);
                raster.gridSize = this.props.gridSize;

                let boundingBox = null;
                if (metadata) {
                    boundingBox = BoundingBox.fromPoints([
                        [parseFloat(metadata.origin[0]), parseFloat(metadata.origin[1] + metadata.pixelSize[1] * metadata.rasterYSize)],
                        [parseFloat(metadata.origin[0] + metadata.pixelSize[0] * metadata.rasterXSize), parseFloat(metadata.origin[1])]
                    ]);
                }
                raster.boundingBox = boundingBox;
                criterion.raster = raster;
                criterion.step = 1;

                criterion.suitability = new Raster();
                criterion.constraintRaster = new Raster();
                criterion.constraintRaster.boundingBox = boundingBox;
                criterion.constraintRaster.gridSize = this.props.gridSize;

                criterion.rulesCollection = new RulesCollection();
                if (criterion.type === 'continuous') {
                    const rule = new Rule();
                    rule.from = raster.min;
                    rule.to = raster.max;
                    criterion.rulesCollection.add(rule);
                }
                if (criterion.type === 'discrete') {
                    const uniqueValues = criterion.raster.uniqueValues;
                    uniqueValues.forEach(value => {
                        const rule = new Rule();
                        rule.from = value;
                        rule.to = value;
                        criterion.rulesCollection.add(rule);
                    });
                    criterion.constraintRules = criterion.rulesCollection;
                }

                this.setState({
                    showUploadModal: false
                });
                return this.props.onChange(criterion);
            },
            response => {
                throw new Error(response);
            }
        );
    };

    onToggleBasicLayer = () => this.setState({showBasicLayer: !this.state.showBasicLayer});

    render() {
        const {showInfo, showBasicLayer, showUploadJSON, showUploadModal} = this.state;
        const {raster} = this.props.criterion;

        return (
            <Grid>
                {showInfo &&
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Message onDismiss={this.handleDismiss}>
                            <Message.Header>Upload raster</Message.Header>
                            <p>
                                Before uploading raster data, it is necessary to set the desired grid size on the bottom
                                left frame. The grid size is set for the whole project including the resulting
                                suitability map.
                            </p>
                            <p>
                                At this development state of the app, it is necessary, that raster files for the
                                different criteria have the exact same bounds. Please be sure, that all files fulfill
                                the following conditions:
                            </p>
                            <p><b>
                                File size: smaller than 100 MB | File type: geoTiff | Projection: EPSG:4326 - WGS 84
                            </b></p>
                        </Message>
                    </Grid.Column>
                </Grid.Row>
                }
                <Grid.Row>
                    <Grid.Column width={5}>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Upload
                        </Segment>
                        <Segment>
                            <Form>
                                <Form.Group>
                                    <Button
                                        primary
                                        icon
                                        labelPosition='left'
                                        fluid
                                        onClick={this.handleUploadClick}
                                    >
                                        <Icon name='upload'/>Upload Raster File
                                    </Button>
                                </Form.Group>
                                {false &&
                                    <Form.Group>
                                        <Button
                                            primary
                                            icon
                                            labelPosition='left'
                                            fluid
                                            onClick={this.handleUploadJSONClick}
                                        >
                                            <Icon name='file alternate'/>Upload GeoJSON
                                        </Button>
                                    </Form.Group>
                                }
                                <Form.Group>
                                    <Checkbox toggle label='Basic Tile Layer' onClick={this.onToggleBasicLayer}/>
                                </Form.Group>
                            </Form>
                        </Segment>
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Bounding Box
                        </Segment>
                        {raster && raster.boundingBox &&
                        <div>
                            <table width='90%' style={{textAlign: 'right'}}>
                                <tbody>
                                <tr>
                                    <td/>
                                    <td>{raster.boundingBox.yMax.toFixed(3)}</td>
                                    <td/>
                                </tr>
                                <tr>
                                    <td>{raster.boundingBox.xMin.toFixed(3)}</td>
                                    <td/>
                                    <td>{raster.boundingBox.xMax.toFixed(3)}</td>
                                </tr>
                                <tr>
                                    <td/>
                                    <td>{raster.boundingBox.yMin.toFixed(3)}</td>
                                    <td/>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        }
                    </Grid.Column>
                    <Grid.Column width={11}>
                        {raster && raster.data.length > 0 &&
                        <CriteriaRasterMap
                            onChange={this.handleChangeRaster}
                            raster={raster}
                            showBasicLayer={showBasicLayer}
                            showButton={true}
                            legend={this.props.criterion.generateLegend()}
                        />
                        }
                    </Grid.Column>
                </Grid.Row>
                {showUploadJSON &&
                <UploadJsonModal
                    boundingBox={raster.boundingBox}
                    gridSize={this.props.gridSize}
                    onCancel={this.handleCancelModal}
                />
                }
                {showUploadModal &&
                <RasterfileUploadModal
                    gridSize={this.props.gridSize}
                    onCancel={this.handleCancelModal}
                    onChange={this.handleUploadFile}
                    parameter={{unit: this.props.criterion.unit}}
                    discreteRescaling={this.props.criterion.type === 'discrete'}
                />
                }
            </Grid>
        )
    }
}

CriteriaRasterUpload.proptypes = {
    criterion: PropTypes.instanceOf(Criterion).isRequired,
    gridSize: PropTypes.instanceOf(GridSize).isRequired,
    onChange: PropTypes.func.isRequired
};

export default CriteriaRasterUpload;