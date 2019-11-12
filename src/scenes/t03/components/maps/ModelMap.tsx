import {Feature} from 'geojson';
import * as GeoJson from 'geojson';
import {LatLngExpression} from 'leaflet';
import {uniqueId} from 'lodash';
import md5 from 'md5';
import React, {Component} from 'react';
import {CircleMarker, GeoJSON, LayersControl, Map, Polygon, Polyline} from 'react-leaflet';
import BoundingBox from '../../../../core/model/geometry/BoundingBox';
import GridSize from '../../../../core/model/geometry/GridSize';
import {Cells, Geometry} from '../../../../core/model/modflow';
import {Boundary, BoundaryCollection, WellBoundary} from '../../../../core/model/modflow/boundaries';
import ActiveCellsLayer from '../../../../services/geoTools/activeCellsLayer';

import {getStyle} from '../../../../services/geoTools/mapHelpers';
import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';

export interface IPropsModelMap {
    geometry: Geometry;
    boundaries: BoundaryCollection | null;
    boundingBox?: BoundingBox;
    cells?: Cells;
    gridSize?: GridSize;
}

const style = {
    map: {
        height: '400px',
    }
};

class ModelMap extends Component<IPropsModelMap> {

    // noinspection JSMethodCanBeStatic
    public renderBoundaryGeometry(b: Boundary, underlay = false) {
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
    }

    public renderOtherBoundaries(boundaries: BoundaryCollection) {
        return boundaries.boundaries
            .map((b: Boundary) => this.renderBoundaryGeometry(b, true));
    }

    public renderBoundingBox = (boundingBox: BoundingBox) => {
        return (
            <GeoJSON
                key={md5(JSON.stringify(boundingBox.toObject()))}
                data={boundingBox.geoJson as Feature}
                style={getStyle('bounding_box')}
            />
        );
    };

    public renderCells = () => {
        const {boundingBox, cells, gridSize} = this.props;
        if (boundingBox && gridSize && cells) {
            return (
                <ActiveCellsLayer
                    boundingBox={boundingBox}
                    gridSize={gridSize}
                    cells={cells}
                    styles={getStyle('active_cells')}
                />
            );
        }
    };

    public render() {
        const {geometry, boundaries, boundingBox, cells} = this.props;

        return (
            <Map
                style={style.map}
                zoomControl={false}
                bounds={geometry.getBoundsLatLng()}
            >
                <BasicTileLayer/>
                <GeoJSON
                    key={geometry.hash()}
                    data={geometry.toGeoJSON()}
                    style={getStyle('area')}
                />
                {boundaries && this.renderOtherBoundaries(boundaries)}
                {boundingBox && this.renderBoundingBox(boundingBox)}
                {cells &&
                <LayersControl position="topright">
                    <LayersControl.Overlay name="Active cells">
                        {this.renderCells()}
                    </LayersControl.Overlay>
                </LayersControl>}
            </Map>
        );
    }
}

export default ModelMap;
