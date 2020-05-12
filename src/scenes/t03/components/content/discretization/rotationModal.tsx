import {AllGeoJSON, Point} from '@turf/helpers';
import * as turf from '@turf/turf';
import {Feature, GeoJsonObject} from 'geojson';
import {uniqueId} from 'lodash';
import React, {useEffect, useState} from 'react';
import {GeoJSON, Map} from 'react-leaflet';
import {Button, Form, Grid, Icon, Modal} from 'semantic-ui-react';
import uuid from 'uuid';
import {ICells} from '../../../../../core/model/geometry/Cells.type';
import {GeoJson} from '../../../../../core/model/geometry/Geometry.type';
import {BoundingBox, Cells, Geometry, GridSize, ModflowModel} from '../../../../../core/model/modflow';
import {calculateActiveCells} from '../../../../../services/geoTools';
import AffectedCellsLayer from '../../../../../services/geoTools/affectedCellsLayer';
import {getStyle} from '../../../../../services/geoTools/mapHelpers';
import SliderWithTooltip from '../../../../shared/complexTools/SliderWithTooltip';

interface IProps {
    model: ModflowModel;
    onChange: (rotation: number, cells: Cells) => void;
    onClose: () => void;
}

const style = {
    map: {
        height: '500px',
        width: '100%'
    }
};

const rotationModal = (props: IProps) => {
    const originalArea = props.model.geometry.toGeoJSON();
    const centerOfMass = turf.centerOfMass(originalArea) as Feature<Point>;

    const [boundingBox, setBoundingBox] = useState<GeoJsonObject>(props.model.boundingBox.geoJson);
    const [boundingBoxRotated, setBoundingBoxRotated] = useState<GeoJsonObject | null>(null);
    const [cells, setCells] = useState<ICells | null>(null);
    const [geometry, setGeometry] = useState<GeoJson>(originalArea);
    const [intersection, setIntersection] = useState<number>(50);
    const [isCalculating, setIsCalculating] = useState<boolean>(false);
    const [rotation, setRotation] = useState<number>(0);

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

    const calculate = (g: Geometry, bb: BoundingBox, gz: GridSize, i = 0) => {
        return new Promise((resolve: (cells: Cells) => void) => {
            resolve(calculateActiveCells(g, bb, gz, i / 100));
        });
    };

    const calculateRotation = (r: number) => {
        const withRotation = turf.transformRotate(originalArea, -1 * r, {pivot: centerOfMass});
        const bbox = BoundingBox.fromGeoJson(withRotation);
        const bboxWithRotation = bbox.geoJsonWithRotation(r, centerOfMass);
        setBoundingBox(bbox.geoJson);
        setBoundingBoxRotated(bboxWithRotation);
        calculate(Geometry.fromGeoJson(withRotation), bbox, props.model.gridSize, intersection).then(
            (c: Cells) => {
                setCells(c.toObject());
            }
        );
    };

    const handleChangeIntersection = (value: number) => {
        setIntersection(value);
    };

    const handleChangeRotation = (value: number) => {
        const withRotation = turf.transformRotate(originalArea, value, {pivot: centerOfMass});
        setBoundingBox(BoundingBox.fromGeoJson(withRotation).geoJson);
        setGeometry(withRotation);
        setRotation(value);
    };

    const handleClickApply = () => {
        if (!cells) {
            return null;
        }
        return props.onChange(rotation, Cells.fromObject(cells));
    };

    const handleClickCalculation = () => setIsCalculating(true);

    const handleClickRedo = () => {
        const withRotation = turf.transformRotate(originalArea, rotation, {pivot: centerOfMass});
        setBoundingBox(BoundingBox.fromGeoJson(withRotation).geoJson);
        setCells(null);
        setBoundingBoxRotated(null);
    };

    const handleCloseModal = () => props.onClose();

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
                        bounds={props.model.boundingBox.getBoundsLatLng()}
                    >
                        <GeoJSON
                            key={uniqueId()}
                            data={boundingBoxRotated}
                            style={getStyle('bounding_box')}
                        />
                        <AffectedCellsLayer
                            boundingBox={BoundingBox.fromGeoJson(boundingBox as AllGeoJSON)}
                            cells={Cells.fromObject(cells)}
                            gridSize={props.model.gridSize}
                            rotation={{geometry: props.model.geometry, angle: rotation}}
                        />
                        <GeoJSON
                            key={uuid.v4()}
                            data={props.model.geometry.toGeoJSON()}
                            style={getStyle('area')}
                        />
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
                                min={0}
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
                                max={100}
                                min={0}
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
                            bounds={props.model.boundingBox.getBoundsLatLng()}
                        >
                            <GeoJSON
                                key={uuid.v4()}
                                data={geometry}
                                style={getStyle('area')}
                            />
                            <GeoJSON
                                key={uuid.v4()}
                                data={boundingBox}
                                style={getStyle('bounding_box')}
                            />
                        </Map>
                    </Grid.Row>
                </Grid>
            </Form>
        );
    };

    return (
        <Modal
            open={true}
            onClose={handleCloseModal}
        >
            <Modal.Header>Grid rotation</Modal.Header>
            <Modal.Content>
                {cells ? renderCells() : renderPreview()}
            </Modal.Content>
        </Modal>
    );
};

export default rotationModal;
