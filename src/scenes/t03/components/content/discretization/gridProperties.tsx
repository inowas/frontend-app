import * as turf from '@turf/turf';
import {AllGeoJSON} from '@turf/helpers';
import {BasicTileLayer} from '../../../../../services/geoTools/tileLayers';
import {BoundingBox, Cells, Geometry, GridSize} from '../../../../../core/model/modflow';
import {Button, Checkbox, Form, Grid, Icon, InputOnChangeData, Modal} from 'semantic-ui-react';
import {CALCULATE_CELLS_INPUT} from '../../../../modflow/worker/t03.worker';
import {GeoJSON, Map} from 'react-leaflet';
import {GeoJsonObject} from 'geojson';
import {ICells} from '../../../../../core/model/geometry/Cells.type';
import {IGridSize} from '../../../../../core/model/geometry/GridSize.type';
import {asyncWorker} from '../../../../modflow/worker/worker';
import {dxCell, dyCell} from '../../../../../services/geoTools/distance';
import {getStyle} from '../../../../../services/geoTools/mapHelpers';
import {renderAreaLayer} from '../../maps/mapLayers';
import {uniqueId} from 'lodash';
import AffectedCellsLayer from '../../../../../services/geoTools/affectedCellsLayer';
import React, {FormEvent, useEffect, useState} from 'react';
import SliderWithTooltip from '../../../../shared/complexTools/SliderWithTooltip';

interface IProps {
    boundingBox: BoundingBox;
    geometry: Geometry;
    gridSize: GridSize;
    intersection: number;
    onChange: (gridSize: GridSize, intersection: number, rotation: number, cells: Cells) => void;
    rotation: number;
    readonly?: boolean;
}

const style = {
    map: {
        backgroundColor: '#ffffff',
        height: '500px',
        width: '100%'
    }
};

const GridProperties = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [activeValue, setActiveValue] = useState<string>('');
    const [boundingBox, setBoundingBox] = useState<GeoJsonObject>(props.boundingBox.geoJson);
    const [boundingBoxRotated, setBoundingBoxRotated] = useState<GeoJsonObject | null>(null);
    const [cells, setCells] = useState<ICells | null>(null);
    const [cellSize, setCellSize] = useState<[number, number]>([0, 0]);
    const [editingMode, setEditingMode] = useState<string>('gridSize');
    const [gridSize, setGridSize] = useState<IGridSize>(props.gridSize.toObject());
    const [intersection, setIntersection] = useState<number>(props.intersection);
    const [isCalculating, setIsCalculating] = useState<boolean>(false);
    const [rotation, setRotation] = useState<number>(props.rotation);
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        handleChangeRotation(props.rotation);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (cells) {
            setIsCalculating(false);
        }
    }, [cells]);

    useEffect(() => {
        if (isCalculating) {
            return calculateRotation(rotation);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCalculating]);

    useEffect(() => {
        setCellSize([
            Math.round(dyCell(BoundingBox.fromGeoJson(boundingBox as AllGeoJSON),
                GridSize.fromObject(gridSize)) * 10000) / 10,
            Math.round(dxCell(BoundingBox.fromGeoJson(boundingBox as AllGeoJSON),
                GridSize.fromObject(gridSize)) * 10000) / 10
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gridSize]);

    useEffect(() => {
      setGridSize(props.gridSize.toObject());
    }, [props.gridSize]);

    const calculateRotation = (r: number) => {
        // No rotation:
        let bbox = BoundingBox.fromGeoJson(props.geometry.toGeoJSON());
        if (r % 360 === 0) {
            setBoundingBox(bbox.geoJson);
            setBoundingBoxRotated(bbox.geoJson);
            asyncWorker({
                type: CALCULATE_CELLS_INPUT,
                data: {
                    geometry: props.geometry.toGeoJSON(),
                    boundingBox: bbox.toObject(),
                    gridSize,
                    intersection
                }
            }).then((c: ICells) => {
                setCells(c);
            });
            return;
        }
        // With rotation:
        const withRotation = turf.transformRotate(
            props.geometry.toGeoJSON(), -1 * r, {pivot: props.geometry.centerOfMass}
        );
        bbox = BoundingBox.fromGeoJson(withRotation);
        const bboxWithRotation = bbox.geoJsonWithRotation(r, props.geometry.centerOfMass);
        setBoundingBox(bbox.geoJson);
        setBoundingBoxRotated(bboxWithRotation);
        asyncWorker({
            type: CALCULATE_CELLS_INPUT,
            data: {
                geometry: Geometry.fromGeoJson(withRotation).toObject(),
                boundingBox: bbox.toObject(),
                gridSize,
                intersection
            }
        }).then((c: ICells) => {
            setCells(c);
        });
    };

    const handleBlurCellSize = () => {
        const value = parseFloat(activeValue);

        const cBoundingBox = BoundingBox.fromGeoJson(boundingBox as AllGeoJSON);
        const length = activeInput === 'cH' ? cBoundingBox.heightInMeters : cBoundingBox.widthInMeters;
        const amount = Math.floor(length / value);

        const cGridSize = GridSize.fromObject(gridSize);
        if (activeInput === 'cH') {
            cGridSize.nY = amount;
        }
        if (activeInput === 'cW') {
            cGridSize.nX = amount;
        }

        setActiveInput(null);
        setGridSize(cGridSize.toObject());
    };

    const handleBlurGridSize = () => {
        const g = GridSize.fromObject(gridSize);
        if (activeInput === 'nX') {
            g.nX = parseFloat(activeValue);
        }
        if (activeInput === 'nY') {
            g.nY = parseFloat(activeValue);
        }
        setActiveInput(null);
        setGridSize(g.toObject());
    };

    const handleChangeInput = (e: FormEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        setActiveInput(name);
        setActiveValue(value);
    };

    const handleChangeIntersection = (value: number) => {
        setIntersection(value);
    };

    const handleChangeRotation = (value: number, remainder?: [number, number]) => {
        const withRotation = turf.transformRotate(
            props.geometry.toGeoJSON(), -1 * value, {pivot: props.geometry.centerOfMass}
        );
        let bbox = BoundingBox.fromGeoJson(withRotation);
        if (remainder) {
            bbox = BoundingBox.fromPoints([
                {type: 'Point', coordinates: [bbox.xMin - remainder[0], bbox.yMin - remainder[1]]},
                {type: 'Point', coordinates: [bbox.xMax + remainder[0], bbox.yMax + remainder[1]]}
            ]);
        }
        const bboxWithRotation = bbox.geoJsonWithRotation(value, props.geometry.centerOfMass);
        setBoundingBoxRotated(bboxWithRotation);
        setRotation(value);
    };

    const handleClickApply = () => {
        setShowModal(false);
        if (!cells) {
            return null;
        }
        return props.onChange(GridSize.fromObject(gridSize), intersection, rotation, Cells.fromObject(cells));
    };

    const handleClickCalculation = () => setIsCalculating(true);

    const handleClickRedo = () => {
        if (rotation % 360 !== 0) {
            const withRotation =
                turf.transformRotate(props.geometry, rotation, {pivot: props.boundingBox.rotationPoint});
            setBoundingBox(BoundingBox.fromGeoJson(withRotation).geoJson);
        } else {
            setBoundingBox(props.boundingBox.geoJson);
        }
        setCells(null);
        setBoundingBoxRotated(null);
    };

    const handleToggleModal = () => setShowModal(!showModal);

    const renderCells = () => {
        if (!cells || !boundingBoxRotated) {
            return null;
        }
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Button
                            onClick={handleClickRedo}
                            icon={true}
                            fluid={true}
                            labelPosition="left"
                        >
                            <Icon name="redo"/>
                            Redo
                        </Button>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Button
                            primary={true}
                            onClick={handleClickApply}
                            icon={true}
                            fluid={true}
                            labelPosition="left"
                        >
                            <Icon name="save"/>
                            Apply
                        </Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Map
                        style={style.map}
                        bounds={props.boundingBox.getBoundsLatLng()}
                    >
                        <BasicTileLayer/>
                        <GeoJSON
                            key={uniqueId()}
                            data={boundingBoxRotated}
                            style={getStyle('bounding_box')}
                        />
                        <AffectedCellsLayer
                            boundingBox={BoundingBox.fromGeoJson(boundingBox as AllGeoJSON)}
                            cells={Cells.fromObject(cells)}
                            gridSize={GridSize.fromObject(gridSize)}
                            rotation={{geometry: props.geometry, angle: rotation}}
                        />
                        {renderAreaLayer(props.geometry)}
                    </Map>
                </Grid.Row>
            </Grid>
        );
    };

    const renderPreview = () => {
        return (
            <Form>
                <Grid>
                    <Grid.Row>
                        <p>Edit by</p>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Checkbox
                                radio={true}
                                label="Set by grid size"
                                name="checkboxRadioGroup"
                                checked={editingMode === 'gridSize'}
                                onChange={() => setEditingMode('gridSize')}
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Checkbox
                                radio={true}
                                label="Set by cell size"
                                name="checkboxRadioGroup"
                                checked={editingMode === 'cellSize'}
                                onChange={() => setEditingMode('cellSize')}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Form.Group>
                                <Form.Input
                                    type="number"
                                    label="Rows"
                                    name={'nY'}
                                    value={activeInput === 'nY' ? activeValue : gridSize.n_y}
                                    onChange={handleChangeInput}
                                    onBlur={handleBlurGridSize}
                                    readOnly={editingMode === 'cellSize'}
                                />
                                <Form.Input
                                    type="number"
                                    label="Columns"
                                    name={'nX'}
                                    value={activeInput === 'nX' ? activeValue : gridSize.n_x}
                                    onChange={handleChangeInput}
                                    onBlur={handleBlurGridSize}
                                    readOnly={editingMode === 'cellSize'}
                                />
                            </Form.Group>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Form.Group>
                                <Form.Input
                                    label="Cell height"
                                    name="cH"
                                    value={activeInput === 'cH' ? activeValue : cellSize[0]}
                                    onChange={handleChangeInput}
                                    onBlur={handleBlurCellSize}
                                    readOnly={editingMode === 'gridSize'}
                                />
                                <Form.Input
                                    label="Cell width"
                                    name="cW"
                                    value={activeInput === 'cW' ? activeValue : cellSize[1]}
                                    onChange={handleChangeInput}
                                    onBlur={handleBlurCellSize}
                                    readOnly={editingMode === 'gridSize'}
                                />
                            </Form.Group>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Form.Input
                                label="Rotation angle"
                                value={rotation}
                            />
                        </Grid.Column>
                        <Grid.Column width={13} verticalAlign="middle">
                            <label>&nbsp;</label>
                            <SliderWithTooltip
                                disabled={isCalculating}
                                onChange={handleChangeRotation}
                                max={360}
                                min={-360}
                                value={rotation}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Form.Input
                                label="Intersection"
                                value={intersection}
                            />
                        </Grid.Column>
                        <Grid.Column width={13} verticalAlign="middle">
                            <label>&nbsp;</label>
                            <SliderWithTooltip
                                disabled={isCalculating}
                                onChange={handleChangeIntersection}
                                max={1}
                                min={0}
                                step={0.1}
                                value={intersection}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Button
                            loading={isCalculating}
                            onClick={handleClickCalculation}
                            primary={true}
                            icon={true}
                            fluid={true}
                            labelPosition="left"
                        >
                            <Icon name="calculator"/>
                            Calculate cells
                        </Button>
                    </Grid.Row>
                    <Grid.Row>
                        <Map
                            style={style.map}
                            bounds={props.boundingBox.getBoundsLatLng()}
                        >
                            {renderAreaLayer(props.geometry)}
                            {boundingBoxRotated &&
                            <GeoJSON
                                key={uniqueId()}
                                data={boundingBoxRotated}
                                style={getStyle('bounding_box')}
                            />
                            }
                        </Map>
                    </Grid.Row>
                </Grid>
            </Form>
        );
    };

    return (
        <React.Fragment>
            <Form>
                <Form.Group>
                    <Form.Input
                        label="Rows"
                        value={gridSize.n_y}
                        readOnly={true}
                        style={{width: '150px'}}
                    />
                    <Form.Input
                        label="Columns"
                        value={gridSize.n_x}
                        readOnly={true}
                        style={{width: '150px'}}
                    />
                    <Form.Input
                        label="Grid rotation"
                        value={props.rotation || 0}
                        readOnly={true}
                        style={{width: '150px'}}
                    />
                    <Form.Input
                        label="Intersection"
                        value={props.intersection || 0}
                        readOnly={true}
                        style={{width: '150px'}}
                    />
                    <Form.Button
                        fluid={true}
                        icon="pencil"
                        label="&nbsp;"
                        onClick={handleToggleModal}
                        disabled={props.readonly}
                    />
                </Form.Group>
            </Form>
            <Modal
                open={showModal}
                onClose={handleToggleModal}
            >
                <Modal.Header>Grid Properties</Modal.Header>
                <Modal.Content>
                    {cells ? renderCells() : renderPreview()}
                </Modal.Content>
            </Modal>
        </React.Fragment>
    );
};

export default GridProperties;
