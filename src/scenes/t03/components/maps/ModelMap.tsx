import * as GeoJson from 'geojson';
import {LatLngExpression} from 'leaflet';
import {uniqueId} from 'lodash';
import md5 from 'md5';
import React from 'react';
import {CircleMarker, GeoJSON, Map, Polygon, Polyline} from 'react-leaflet';
import BoundingBox from '../../../../core/model/geometry/BoundingBox';
import GridSize from '../../../../core/model/geometry/GridSize';
import {Cells, Geometry} from '../../../../core/model/modflow';
import {Boundary, BoundaryCollection, WellBoundary} from '../../../../core/model/modflow/boundaries';
import AffectedCellsLayer from '../../../../services/geoTools/affectedCellsLayer';
import {getStyle} from '../../../../services/geoTools/mapHelpers';
import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';

export interface IProps {
    geometry: Geometry;
    boundaries: BoundaryCollection | null;
    boundingBox?: BoundingBox;
    cells?: Cells;
    gridSize?: GridSize;
    rotation?: number;
}

const style = {
    map: {
        height: '400px',
    }
};

const modelMap = (props: IProps) => {
    const renderBoundaryGeometry = (b: Boundary, underlay = false) => {
        const geometry = b.geometry;

        if (!geometry) {
            return;
        }

        if (underlay) {
            switch (geometry.type.toLowerCase()) {
                case 'point':
                    return (
                        <CircleMarker
                            key={uniqueId(Geometry.fromObject(geometry as GeoJson.Point).hash())}
                            center={[
                                geometry.coordinates[1],
                                geometry.coordinates[0]
                            ]}
                            {...getStyle('underlay')}
                        />
                    );
                case 'linestring':
                    return (
                        <Polyline
                            key={uniqueId(Geometry.fromObject(geometry as GeoJson.LineString).hash())}
                            positions={Geometry.fromObject(geometry as GeoJson.LineString).coordinatesLatLng}
                            {...getStyle('underlay')}
                        />
                    );
                default:
                    return null;
            }
        }

        switch (geometry.type.toLowerCase()) {
            case 'point':
                return b instanceof WellBoundary ? (
                    <CircleMarker
                        key={uniqueId(Geometry.fromObject(geometry as GeoJson.Point).hash())}
                        center={[
                            geometry.coordinates[1],
                            geometry.coordinates[0]
                        ]}
                        {...getStyle(b.type, b.wellType)}
                    />
                ) : null;
            case 'linestring':
                return (
                    <Polyline
                        key={uniqueId(Geometry.fromObject(geometry as GeoJson.LineString).hash())}
                        positions={
                            Geometry.fromObject(geometry as GeoJson.LineString).coordinatesLatLng as LatLngExpression[]
                        }
                    />
                );
            case 'polygon':
                return (
                    <Polygon
                        key={uniqueId(Geometry.fromObject(geometry as GeoJson.Polygon).hash())}
                        positions={
                            Geometry.fromObject(geometry as GeoJson.Polygon).coordinatesLatLng as LatLngExpression[]
                        }
                    />
                );
            default:
                return null;
        }
    };

    const renderOtherBoundaries = (boundaries: BoundaryCollection) => {
        return boundaries.boundaries
            .map((b: Boundary) => renderBoundaryGeometry(b, true));
    };

    const renderBoundingBox = (boundingBox: BoundingBox) => {
        const data = props.rotation && props.geometry ?
            boundingBox.geoJsonWithRotation(props.rotation, props.geometry.centerOfMass) :
            boundingBox.geoJson;
        return (
            <GeoJSON
                key={md5(JSON.stringify(data))}
                data={data}
                style={getStyle('bounding_box')}
            />
        );
    };

    return (
        <Map
            style={style.map}
            zoomControl={false}
            bounds={props.geometry.getBoundsLatLng()}
        >
            <BasicTileLayer/>
            <GeoJSON
                key={props.geometry.hash()}
                data={props.geometry.toGeoJSON()}
                style={getStyle('area')}
            />
            {props.boundaries && renderOtherBoundaries(props.boundaries)}
            {props.boundingBox && renderBoundingBox(props.boundingBox)}
            {props.cells && props.boundingBox && props.gridSize &&
            <AffectedCellsLayer
                boundingBox={props.boundingBox}
                cells={props.cells}
                gridSize={props.gridSize}
                rotation={props.rotation ? {geometry: props.geometry, angle: props.rotation} : undefined}
            />
            }
        </Map>
    );
};

export default modelMap;
