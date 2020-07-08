import _ from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Dimmer, Form, Grid, Header, Progress} from 'semantic-ui-react';
import {BoundingBox, Cells, Geometry, GridSize, ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {IRootReducer} from '../../../../../reducers';
import {calculateActiveCells} from '../../../../../services/geoTools';
import {dxCell, dyCell} from '../../../../../services/geoTools/distance';
import ContentToolBar from '../../../../shared/ContentToolbar2';
import {addMessage, updateBoundaries, updateLayer, updateSoilmodel} from '../../../actions/actions';
import {messageError} from '../../../defaults/messages';
import UploadGeoJSONModal from '../create/UploadGeoJSONModal';
import {DiscretizationMap, GridProperties} from './index';
import {boundaryUpdater, layersUpdater, zonesUpdater} from './updater';

interface IProps {
    model: ModflowModel;
    onChange: (modflowModel: ModflowModel) => void;
    onSave: () => void;
    onUndo: () => void;
}

interface IBoundaryUpdaterStatus {
    task: number;
    message: string;
}

const gridEditor = (props: IProps) => {
    const [intersection, setIntersection] = useState<number>(50);
    const [gridSizeLocal, setGridSizeLocal] = useState<GridSize | null>(null);
    const [updaterStatus, setUpdaterStatus] = useState<IBoundaryUpdaterStatus | null>(null);

    const intersectionRef = useRef<number>();

    const dispatch = useDispatch();

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const boundaryCollection = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
    const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;

    if (!soilmodel || !boundaryCollection) {
        return null;
    }

    useEffect(() => {
        setGridSizeLocal(props.model.gridSize);
        intersectionRef.current = 50;
    }, []);

    useEffect(() => {
        intersectionRef.current = intersection;
    }, [intersection]);

    useEffect(() => {
        if (gridSizeLocal && (gridSizeLocal.nX !== gridSize.nX || gridSizeLocal.nY !== gridSize.nY)) {
            setGridSizeLocal(props.model.gridSize);
        }
    }, [props.model.gridSize.nX, props.model.gridSize.nY]);

    const readOnly = props.model.readOnly;

    const calculate = (g: Geometry, bb: BoundingBox, gz: GridSize, i = 0) => {
        return new Promise((resolve: (cells: Cells) => void) => {
            resolve(calculateActiveCells(g, bb, gz, i / 100));
        });
    };

    const update = (model: ModflowModel) => {
        if (!boundaryCollection) {
            return null;
        }
        boundaryUpdater(
            _.cloneDeep(boundaryCollection),
            model,
            (b, l) => setUpdaterStatus({
                task: 1 + boundaryCollection.length - l,
                message: `Updating ${b.name}`
            }),
            (bc) => {
                dispatch(updateBoundaries(bc));
                if (soilmodel.zonesCollection.length > 1) {
                    zonesUpdater(
                        model,
                        soilmodel,
                        soilmodel.zonesCollection,
                        (z, l) => setUpdaterStatus({
                            task: 1 + boundaryCollection.length + soilmodel.zonesCollection.length - l,
                            message: `Updating ${z.name}`
                        }),
                        (zc) => {
                            soilmodel.zonesCollection = zc;
                            dispatch(updateSoilmodel(soilmodel));
                            layersUpdater(
                                model,
                                soilmodel.layersCollection,
                                zc,
                                (layer, l) => {
                                    dispatch(updateLayer(layer));
                                    setUpdaterStatus({
                                        task: 1 + boundaryCollection.length + soilmodel.zonesCollection.length +
                                            soilmodel.layersCollection.length - l,
                                        message: `Updating ${layer.name}`
                                    });
                                },
                                () => {
                                    setUpdaterStatus(null);
                                },
                                (e) => dispatch(addMessage(messageError('layersUpdater', e)))
                            );
                        },
                        (e) => dispatch(addMessage(messageError('zonesUpdater', e)))
                    );
                } else {
                    setUpdaterStatus(null);
                }
            },
            (e) => dispatch(addMessage(messageError('boundariesUpdater', e)))
        );
    };

    const handleChangeIntersection = (i: number) => {
        setIntersection(i);
        calculate(props.model.geometry, props.model.boundingBox, props.model.gridSize, i).then(
            (c: Cells) => {
                const model = props.model.getClone();
                model.cells = Cells.fromObject(c.toObject());
                return props.onChange(model);
            }
        );
    };

    const handleChangeCells = (c: Cells) => {
        const model = props.model.getClone();
        model.cells = c;
        props.onChange(model);
    };

    const handleChangeGeometry = (g: Geometry) => {
        const rotation = props.model.rotation;
        let geometryWithRotation: null | Geometry = null;
        let bb: BoundingBox = BoundingBox.fromGeoJson(g);
        if (rotation % 360 !== 0) {
            geometryWithRotation = Geometry.fromGeoJson(g.toGeoJSONWithRotation(rotation, g.centerOfMass));
            bb = BoundingBox.fromGeometryAndRotation(g, rotation);
        }
        calculate(geometryWithRotation || g, bb, props.model.gridSize, props.model.intersection).then((c: Cells) => {
            const model = props.model.getClone();
            model.cells = Cells.fromObject(c.toObject());
            model.geometry = Geometry.fromObject(g.toObject());
            model.boundingBox = BoundingBox.fromObject(bb.toObject());
            update(model);
            return props.onChange(model);
        });
    };

    const handleChangeRotation = (g: GridSize, i: number, r: number, c: Cells) => {
        const model = props.model.getClone();
        model.boundingBox = r % 360 !== 0 ? BoundingBox.fromGeometryAndRotation(model.geometry, r) :
            BoundingBox.fromGeoJson(model.geometry.toGeoJSON());
        model.cells = c;
        model.gridSize = g;
        model.intersection = i;
        model.rotation = r;
        update(model);
        return props.onChange(model);
    };

    if (!gridSizeLocal) {
        return null;
    }

    const {boundingBox, geometry, gridSize} = props.model;

    const tasks = boundaryCollection.length + soilmodel.zonesCollection.length + soilmodel.layersCollection.length;

    return (
        <Grid>
            {!!updaterStatus &&
            <Dimmer active={true} page={true}>
                <Header as="h2" icon={true} inverted={true}>
                    {updaterStatus.message}
                </Header>
                <Progress
                    percent={(100 * (updaterStatus.task / tasks)).toFixed(0)}
                    indicating={true}
                    progress={true}
                />
            </Dimmer>
            }
            {!readOnly &&
            <Grid.Row>
                <Grid.Column width={16}>
                    <ContentToolBar
                        buttonSave={true}
                        buttonImport={
                            <UploadGeoJSONModal
                                onChange={handleChangeGeometry}
                                geometry={'polygon'}
                                size="medium"
                            />
                        }
                        onSave={props.onSave}
                        onUndo={props.onUndo}
                    />
                </Grid.Column>
            </Grid.Row>}
            <Grid.Row>
                <Grid.Column>
                    <Form>
                        <Form.Group>
                            <Form.Input
                                label="Cell height"
                                value={Math.round(dyCell(boundingBox, gridSize) * 10000) / 10}
                                width={'6'}
                                readOnly={true}
                            />
                            <Form.Input
                                label="Cell width"
                                value={Math.round(dxCell(boundingBox, gridSize) * 10000) / 10}
                                width={'6'}
                                readOnly={true}
                            />
                            <Form.Select
                                compact={true}
                                label="Length unit"
                                options={[{key: 2, text: 'meters', value: 2}]}
                                value={props.model.lengthUnit.toInt()}
                                disabled={readOnly}
                            />
                        </Form.Group>
                    </Form>
                    <GridProperties
                        boundingBox={boundingBox}
                        geometry={geometry}
                        gridSize={gridSize}
                        intersection={props.model.intersection}
                        onChange={handleChangeRotation}
                        rotation={props.model.rotation}
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <DiscretizationMap
                        cells={props.model.cells}
                        boundingBox={boundingBox}
                        boundaries={boundaryCollection}
                        geometry={geometry}
                        gridSize={gridSize}
                        intersection={intersection}
                        onChangeGeometry={handleChangeGeometry}
                        onChangeCells={handleChangeCells}
                        onChangeIntersection={handleChangeIntersection}
                        readOnly={readOnly}
                        rotation={props.model.rotation}
                    />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column width={16}/>
            </Grid.Row>
        </Grid>
    );
};

export default gridEditor;
