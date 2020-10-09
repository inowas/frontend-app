import * as turf from '@turf/turf';
import {GeoJsonObject} from 'geojson';
import {uniqueId} from 'lodash';
import React, {FormEvent, useEffect, useState} from 'react';
import {GeoJSON, Map} from 'react-leaflet';
import {Button, Checkbox, Form, Grid, Icon, InputOnChangeData, Modal} from 'semantic-ui-react';
import {IBoundingBox} from '../../../../../core/model/geometry/BoundingBox.type';
import {ICells} from '../../../../../core/model/geometry/Cells.type';
import {IGridSize} from '../../../../../core/model/geometry/GridSize.type';
import {BoundingBox, Cells, Geometry, GridSize} from '../../../../../core/model/modflow';
import AffectedCellsLayer from '../../../../../services/geoTools/affectedCellsLayer';
import {getStyle} from '../../../../../services/geoTools/mapHelpers';
import synchronizeGeometry from '../../../../../services/geoTools/synchronizeGeometry';
import {BasicTileLayer} from '../../../../../services/geoTools/tileLayers';
import SliderWithTooltip from '../../../../shared/complexTools/SliderWithTooltip';
import {CALCULATE_CELLS_INPUT} from '../../../worker/t03.worker';
import {asyncWorker} from '../../../worker/worker';
import {renderAreaLayer} from '../../maps/mapLayers';

interface IProps {
    boundingBox: BoundingBox;
    geometry: Geometry;
    gridSize: GridSize;
    intersection: number;
    onChange: (boundingBox: BoundingBox, gridSize: GridSize, intersection: number, rotation: number, cells: Cells)
        => void;
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

const gridProperties = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [activeValue, setActiveValue] = useState<string>('');
    const [boundingBox, setBoundingBox] = useState<IBoundingBox>(props.boundingBox.toObject());
    const [boundingBoxPreview, setBoundingBoxPreview] = useState<GeoJsonObject | null>(null);
    const [boundingBoxIsFixed, setBoundingBoxIsFixed] = useState<boolean>(true);
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
    }, [isCalculating]);

    const calculateRotation = (r: number) => {
        // No rotation:
        if (r % 360 === 0) {
            asyncWorker({
                type: CALCULATE_CELLS_INPUT,
                data: {
                    geometry: props.geometry.toGeoJSON(),
                    boundingBox,
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
        asyncWorker({
            type: CALCULATE_CELLS_INPUT,
            data: {
                geometry: Geometry.fromGeoJson(withRotation).toObject(),
                boundingBox,
                gridSize,
                intersection
            }
        }).then((c: ICells) => {
            setCells(c);
        });
    };

    const handleBlurCellSize = () => {
        if (!activeInput) {
            return null;
        }
        const parsedInput = parseFloat(activeValue);
        const value = isNaN(parsedInput) || parsedInput <= 0 ?
            (activeInput === 'cH' ? cellSize[0] : cellSize[1]) : parsedInput;
        const cCellSize: [number, number] = activeInput === 'cH' ? [value, cellSize[1]] : [cellSize[0], value];

        const result = synchronizeGeometry(
            props.geometry, boundingBoxIsFixed, cCellSize, null
        );

        setActiveInput(null);
        setBoundingBox(result.boundingBox.toObject());
        setBoundingBoxPreview(result.boundingBoxWithRotation);
        setCellSize(result.cellSize);
        setGridSize(result.gridSize.toObject());
    };

    const handleBlurGridSize = () => {
        const g = GridSize.fromObject(gridSize);
        if (activeInput === 'nX') {
            g.nX = parseFloat(activeValue);
        }
        if (activeInput === 'nY') {
            g.nY = parseFloat(activeValue);
        }
        const result = synchronizeGeometry(
            props.geometry, boundingBoxIsFixed, null, g
        );
        setActiveInput(null);
        setCellSize(result.cellSize);
        setGridSize(result.gridSize.toObject());
    };

    const handleChangeInput = (e: FormEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        setActiveInput(name);
        setActiveValue(value);
    };

    const handleChangeIntersection = (value: number) => {
        setIntersection(value);
    };

    const handleChangeRotation = (value: number) => setRotation(value);

    const handleClickApply = () => {
        setShowModal(false);
        if (!cells) {
            return null;
        }
        return props.onChange(
            BoundingBox.fromObject(boundingBox),
            GridSize.fromObject(gridSize), intersection, rotation, Cells.fromObject(cells)
        );
    };

    const handleClickCalculation = () => setIsCalculating(true);

    const handleClickRedo = () => {
        if (rotation % 360 !== 0) {
            const withRotation =
                turf.transformRotate(props.geometry, rotation, {pivot: props.boundingBox.rotationPoint});
            setBoundingBox(BoundingBox.fromGeoJson(withRotation).toObject());
        } else {
            setBoundingBox(props.boundingBox.toObject());
        }
        setCells(null);
        setBoundingBoxPreview(null);
    };

    const handleChangeEditingMode = (mode: string) => () => {
        if (mode === 'gridSize') {
            setBoundingBoxIsFixed(true);
        }
        setEditingMode(mode);
    };

    const handleToggleModal = () => setShowModal(!showModal);

    const renderCells = () => {
        if (!cells || !boundingBoxPreview) {
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
                            data={boundingBoxPreview}
                            style={getStyle('bounding_box')}
                        />
                        <AffectedCellsLayer
                            boundingBox={BoundingBox.fromObject(boundingBox)}
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
                        <Grid.Column width={8}>
                            <Checkbox
                                radio={true}
                                label="Set by grid size"
                                checked={editingMode === 'gridSize'}
                                onChange={handleChangeEditingMode('gridSize')}
                            />
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Checkbox
                                radio={true}
                                label="Set by cell size"
                                checked={editingMode === 'cellSize'}
                                onChange={handleChangeEditingMode('cellSize')}
                            />
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Checkbox
                                label="Fixed Boundingbox"
                                disabled={editingMode === 'gridSize'}
                                checked={boundingBoxIsFixed}
                                onChange={() => setBoundingBoxIsFixed(!boundingBoxIsFixed)}
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
                            {boundingBoxPreview &&
                            <GeoJSON
                                key={uniqueId()}
                                data={boundingBoxPreview}
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

export default gridProperties;
