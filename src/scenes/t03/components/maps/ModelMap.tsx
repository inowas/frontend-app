import * as GeoJson from 'geojson';
import {LatLngExpression} from 'leaflet';
import {uniqueId} from 'lodash';
import React, {Component} from 'react';
import {CircleMarker, GeoJSON, Map, Polygon, Polyline} from 'react-leaflet';
import {Geometry} from '../../../../core/model/modflow';
import {Boundary, BoundaryCollection, WellBoundary} from '../../../../core/model/modflow/boundaries';

import {getStyle} from '../../../../services/geoTools/mapHelpers';
import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';

export interface IPropsModelMap {
    geometry: Geometry;
    boundaries: BoundaryCollection | null;
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

    public render() {
        const {geometry, boundaries} = this.props;

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
            </Map>
        );
    }
}

export default ModelMap;
