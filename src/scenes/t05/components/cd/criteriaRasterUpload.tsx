import React, {useState} from 'react';
import {Button, Checkbox, Form, Grid, Icon, Message, Segment} from 'semantic-ui-react';
import {BoundingBox, GridSize} from '../../../../core/model/geometry';
import {Array2D} from '../../../../core/model/geometry/Array2D.type';
import {Criterion, Rule, RulesCollection} from '../../../../core/model/mcda/criteria';
import {CriteriaType} from '../../../../core/model/mcda/criteria/Criterion.type';
import {RasterLayer} from '../../../../core/model/mcda/gis';
import {RasterParameter} from '../../../../core/model/modflow/soilmodel';
import {dropData} from '../../../../services/api';
import {IRasterFileMetadata} from '../../../../services/api/types';
import {max, min} from '../../../shared/rasterData/helpers';
import RasterfileUploadModal from '../../../shared/rasterData/rasterfileUploadModal';
import {criterionStep} from '../../defaults/defaults';
import CriteriaRasterMap from './criteriaRasterMap';

interface IProps {
    criterion: Criterion;
    gridSize: GridSize;
    onChange: (criterion: Criterion) => any;
    readOnly?: boolean;
}

const criteriaRasterUpload = (props: IProps) => {
    const [showInfo, setShowInfo] = useState<boolean>(true);
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
    const [showBasicLayer, setShowBasicLayer] = useState<boolean>(false);

    const handleDismiss = () => setShowInfo(false);

    const handleUploadClick = () => setShowUploadModal(true);

    const handleCancelModal = () => {
        setShowUploadModal(false);
    };

    const handleChangeRaster = (raster: RasterLayer) => {
        if (props.readOnly) {
            return null;
        }

        const criterion = props.criterion;
        criterion.raster = raster;
        return props.onChange(criterion);
    };

    const handleUploadFile = (result: {
        data: Array2D<number>;
        metadata: IRasterFileMetadata | null;
    }) => {
        if (props.readOnly) {
            return null;
        }
        const {data, metadata} = result;

        const criterion = props.criterion;
        const raster = RasterLayer.fromDefaults();
        dropData(
            JSON.stringify(data),
            (response: any) => {
                raster.url = response.filename;
                raster.data = data;
                raster.min = min(raster.data);
                raster.max = max(raster.data);

                let boundingBox = null;
                if (metadata) {
                    boundingBox = BoundingBox.fromObject([
                        [
                            metadata.origin[0],
                            metadata.origin[1] + metadata.pixelSize[1] * metadata.rasterYSize
                        ],
                        [
                            metadata.origin[0] + metadata.pixelSize[0] * metadata.rasterXSize,
                            metadata.origin[1]
                        ]
                    ]);

                }
                criterion.raster = raster;
                criterion.step = criterionStep.AFTER_CONSTRAINTS;
                criterion.suitability = RasterLayer.fromDefaults();
                criterion.constraintRaster = RasterLayer.fromDefaults();

                if (boundingBox) {
                    raster.boundingBox = boundingBox;
                    criterion.constraintRaster.boundingBox = boundingBox;
                }

                criterion.rulesCollection = new RulesCollection();
                if (criterion.type === CriteriaType.CONTINUOUS) {
                    const rule = Rule.fromDefaults();
                    rule.from = raster.min;
                    rule.to = raster.max;
                    criterion.rulesCollection = criterion.rulesCollection.add(rule.toObject());
                }
                if (criterion.type === CriteriaType.DISCRETE) {
                    const uniqueValues = criterion.raster.uniqueValues;
                    uniqueValues.forEach((value) => {
                        const rule = Rule.fromDefaults();
                        rule.from = value;
                        rule.to = value;
                        criterion.rulesCollection = criterion.rulesCollection.add(rule.toObject());
                    });
                    criterion.constraintRules = criterion.rulesCollection;
                }

                criterion.calculateConstraints();

                setShowUploadModal(false);
                return props.onChange(criterion);
            },
            (response: string) => {
                throw new Error(response);
            }
        );
    };

    const handleToggleBasicLayer = () => setShowBasicLayer(!showBasicLayer);

    return (
        <Grid>
            {showInfo &&
            <Grid.Row>
                <Grid.Column width={16}>
                    <Message onDismiss={handleDismiss}>
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
                    {!props.readOnly &&
                    <div>
                        <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                            Upload
                        </Segment>
                        <Segment>
                            <Form>
                                <Form.Group>
                                    <Button
                                        primary={true}
                                        icon={true}
                                        labelPosition="left"
                                        fluid={true}
                                        onClick={handleUploadClick}
                                    >
                                        <Icon name="upload"/>Upload Raster File
                                    </Button>
                                </Form.Group>
                                <Form.Group>
                                    <Checkbox
                                        toggle={true}
                                        label={`Turn ${showBasicLayer ? 'off' : 'on'} base map`}
                                        onClick={handleToggleBasicLayer}
                                    />
                                </Form.Group>
                            </Form>
                        </Segment>
                    </div>
                    }
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                        Bounding Box
                    </Segment>
                    {props.criterion.raster && props.criterion.raster.boundingBox &&
                    <div>
                        <table style={{textAlign: 'right', width: '90%'}}>
                            <tbody>
                            <tr>
                                <td/>
                                <td>{props.criterion.raster.boundingBox.yMax.toFixed(3)}</td>
                                <td/>
                            </tr>
                            <tr>
                                <td>{props.criterion.raster.boundingBox.xMin.toFixed(3)}</td>
                                <td/>
                                <td>{props.criterion.raster.boundingBox.xMax.toFixed(3)}</td>
                            </tr>
                            <tr>
                                <td/>
                                <td>{props.criterion.raster.boundingBox.yMin.toFixed(3)}</td>
                                <td/>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    }
                </Grid.Column>
                <Grid.Column width={11}>
                    {props.criterion.raster && props.criterion.raster.data.length > 0 &&
                    <CriteriaRasterMap
                        gridSize={props.gridSize}
                        onChange={handleChangeRaster}
                        raster={props.criterion.raster}
                        showBasicLayer={showBasicLayer}
                        showButton={true}
                        showLegend={true}
                        legend={props.criterion.generateLegend()}
                    />
                    }
                </Grid.Column>
            </Grid.Row>
            {showUploadModal &&
            <RasterfileUploadModal
                gridSize={props.gridSize}
                onCancel={handleCancelModal}
                onChange={handleUploadFile}
                parameter={RasterParameter.fromObject({
                    defaultValue: 0,
                    isActive: true,
                    id: '',
                    title: '',
                    unit: props.criterion.unit
                })}
                discreteRescaling={props.criterion.type === 'discrete'}
            />
            }
        </Grid>
    );
};

export default criteriaRasterUpload;
