import {LineString, Point} from 'geojson';
import {LatLngExpression} from 'leaflet';
import {uniqueId} from 'lodash';
import React from 'react';
import {CircleMarker, FeatureGroup, GeoJSON, Map, Polygon, Polyline} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {Grid, Icon, List} from 'semantic-ui-react';
import BoundingBox from '../../../../core/model/geometry/BoundingBox';
import {GeoJson} from '../../../../core/model/geometry/Geometry.type';
import GridSize from '../../../../core/model/geometry/GridSize';
import {Cells, Geometry, ModflowModel} from '../../../../core/model/modflow';
import {
    Boundary,
    BoundaryCollection,
    LineBoundary, WellBoundary,
} from '../../../../core/model/modflow/boundaries';
import AffectedCellsLayer from '../../../../services/geoTools/affectedCellsLayer';
import {rotateCoordinateAroundPoint} from '../../../../services/geoTools/getCellFromClick';
import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';
import {getStyle} from './index';

const style = {
    map: {
        height: '500px',
        width: '100%'
    }
};

interface IProps {
    model: ModflowModel;
    boundary: Boundary;
    boundaries: BoundaryCollection;
    onChange: (boundary: Boundary) => void;
    readOnly: boolean;
    showActiveCells: boolean;
    showBoundaryGeometry: boolean;
}

const boundaryDiscretizationMap = (props: IProps) => {
    const calculate = (boundary: Boundary, geometry: Geometry, boundingBox: BoundingBox, gridSize: GridSize) => {
        return new Promise((resolve) => {
            const cells = Cells.fromGeometry(geometry, boundingBox, gridSize);
            if (boundary instanceof LineBoundary) {
                cells.calculateValues(boundary, boundingBox, gridSize);
            }
            resolve(cells);
        });
    };

    const handleOnEdited = (e: any) => {
        const {boundary, model, onChange} = props;
        const {boundingBox, gridSize} = model;

        e.layers.eachLayer((layer: any) => {
            const geometry = Geometry.fromGeoJson(layer.toGeoJSON());
            calculate(boundary, geometry, boundingBox, gridSize)
                .then((cells) => {
                    if (cells instanceof Cells) {
                        boundary.cells = cells;
                        boundary.geometry = geometry;
                        return onChange(boundary);
                    }
                });
        });
    };

    const renderBoundaryGeometry = (b: Boundary, underlay = false) => {
        const geometryType = b.geometryType;

        if (underlay) {
            switch (geometryType.toLowerCase()) {
                case 'point':
                    return (
                        <CircleMarker
                            key={uniqueId(Geometry.fromObject(b.geometry as Point).hash())}
                            center={[
                                b.geometry.coordinates[1],
                                b.geometry.coordinates[0]
                            ]}
                            {...getStyle('underlay')}
                        />
                    );
                case 'linestring':
                    return (
                        <Polyline
                            key={uniqueId(Geometry.fromObject(b.geometry as LineString).hash())}
                            positions={Geometry.fromObject(b.geometry as LineString).coordinatesLatLng}
                            {...getStyle('underlay')}
                        />
                    );
                default:
                    return null;
            }
        }

        switch (geometryType.toLowerCase()) {
            case 'point':
                return (
                    <CircleMarker
                        key={uniqueId(Geometry.fromObject(b.geometry as Point).hash())}
                        center={[
                            b.geometry.coordinates[1],
                            b.geometry.coordinates[0]
                        ]}
                        {...getStyle(b.type, (b as WellBoundary).wellType)}
                    />
                );
            case 'linestring':
                return (
                    <Polyline
                        key={uniqueId(Geometry.fromObject(b.geometry as GeoJson).hash())}
                        positions={
                            Geometry.fromObject(b.geometry as LineString).coordinatesLatLng as LatLngExpression[]
                        }
                    />
                );
            case 'polygon':
                return (
                    <Polygon
                        key={Geometry.fromObject(b.geometry as GeoJson).hash()}
                        positions={
                            Geometry.fromObject(b.geometry as GeoJSON.Polygon).coordinatesLatLng as LatLngExpression[][]
                        }
                    />
                );
            default:
                return null;
        }
    };

    const renderOtherBoundaries = (boundaries: BoundaryCollection) => {
        return boundaries.boundaries
            .filter((b) => b.id !== props.boundary.id)
            .map((b) => renderBoundaryGeometry(b, true));
    };

    const showBoundaryGeometry = () => {
        const {boundary, readOnly, showActiveCells} = props;

        // When rendering Cells, the geometry should not be editable
        if (readOnly || showActiveCells) {
            return (renderBoundaryGeometry(boundary));
        }

        return (
            <FeatureGroup>
                <EditControl
                    position="topright"
                    draw={{
                        circle: false,
                        circlemarker: false,
                        marker: false,
                        polyline: false,
                        rectangle: false,
                        polygon: false
                    }}
                    edit={{
                        edit: true,
                        remove: false
                    }}
                    onEdited={handleOnEdited}
                />
                {renderBoundaryGeometry(boundary)}
            </FeatureGroup>
        );
    };

    const modelGeometryLayer = () => {
        const {geometry} = props.model;
        return (
            <GeoJSON
                key={geometry.hash()}
                data={geometry.toGeoJSON()}
                style={getStyle('area')}
            />
        );
    };

    const affectedCellsLayer = () => {
        return (
            <AffectedCellsLayer
                boundary={props.boundary}
                boundingBox={props.model.boundingBox}
                gridSize={props.model.gridSize}
                cells={props.model.cells}
                rotation={{
                    geometry: props.model.geometry,
                    angle: props.model.rotation
                }}
            />
        );
    };

    const handleClickOnMap = ({latlng}: { latlng: { lng: number, lat: number } }) => {
        if (!props.showActiveCells || props.readOnly) {
            return null;
        }

        const boundary = props.boundary;
        const cells = Cells.fromObject(boundary.cells.cells);
        const boundingBox = props.model.boundingBox;
        const gridSize = props.model.gridSize;

        const latlngRot = props.model.rotation ?
            rotateCoordinateAroundPoint(latlng, props.model.geometry.centerOfMass, props.model.rotation) : latlng;

        const x = latlngRot.lng;
        const y = latlngRot.lat;

        cells.toggle([x, y], boundingBox, gridSize);

        if (boundary instanceof LineBoundary) {
            cells.calculateValues(boundary, boundingBox, gridSize);
        }

        boundary.cells = Cells.fromObject(cells.toObject());
        props.onChange(boundary);
    };

    const legend = [
        {active: true, name: 'AFFECTED', color: '#393B89'},
        {active: true, name: 'INACTIVE', color: '#888888'},
        {active: true, name: 'OTHER', color: '#9C9EDE'}
    ];

    return (
        <Grid>
            <Grid.Column width={props.showActiveCells ? 13 : 16}>
                <Map
                    style={style.map}
                    bounds={props.model.boundingBox.getBoundsLatLng()}
                    onClick={!props.readOnly && handleClickOnMap}
                >
                    <BasicTileLayer/>
                    {renderOtherBoundaries(props.boundaries)}
                    {props.showBoundaryGeometry && showBoundaryGeometry()}
                    {modelGeometryLayer()}
                    {props.showActiveCells && affectedCellsLayer()}
                </Map>
            </Grid.Column>
            {props.showActiveCells &&
            <Grid.Column width={3}>
                <List>
                    <List.Item>
                        {legend.map((c, key) =>
                            <List.Item
                                key={key}
                            >
                                <Icon
                                    style={{
                                        color: c.color
                                    }}
                                    name="square"
                                />
                                {c.name}
                            </List.Item>
                        )}
                    </List.Item>
                </List>
            </Grid.Column>
            }
        </Grid>
    );
};

export default boundaryDiscretizationMap;
