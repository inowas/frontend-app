import * as GeoJson from 'geojson';
import {LatLngExpression} from 'leaflet';
import {uniqueId} from 'lodash';
import React, {Component} from 'react';
import {CircleMarker, GeoJSON, Map, Polygon, Polyline} from 'react-leaflet';
import {Geometry} from '../../../../core/model/modflow';
import {Boundary, BoundaryCollection, LineBoundary} from '../../../../core/model/modflow/boundaries';
import WellBoundary from '../../../../core/model/modflow/boundaries/WellBoundary';
import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';
import {getStyle} from './index';

interface IProps {
    boundary: Boundary;
    boundaries: BoundaryCollection;
    geometry: Geometry;
    selectedObservationPointId?: string;
    onClick?: (bid: string) => any;
}

const style = {
    map: {
        height: '400px',
    }
};

class BoundaryMap extends Component<IProps> {

    public renderObservationPoints(b: Boundary) {
        if (!(b instanceof LineBoundary)) {
            return null;
        }

        if (b.observationPoints.length <= 1) {
            return null;
        }

        const observationPoints = b.observationPoints;
        return observationPoints.map((op) => {
            if (op.geometry) {
                const selected = (op.id === this.props.selectedObservationPointId) ? '_selected' : '';
                return (
                    <CircleMarker
                        key={uniqueId(op.id)}
                        center={[
                            op.geometry.coordinates[1],
                            op.geometry.coordinates[0]
                        ]}
                        {...getStyle('op' + selected)}
                    />
                );
            }
        });
    }

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
                            onClick={this.handleClickBoundary(b.id)}
                        />
                    );
                case 'linestring':
                    return (
                        <Polyline
                            key={uniqueId(Geometry.fromObject(geometry as GeoJson.LineString).hash())}
                            positions={Geometry.fromObject(geometry as GeoJson.LineString).coordinatesLatLng}
                            {...getStyle('underlay')}
                            onClick={this.handleClickBoundary(b.id)}
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
            .filter((b: Boundary) => b.id !== this.props.boundary.id)
            .map((b: Boundary) => this.renderBoundaryGeometry(b, true));
    }

    public render() {
        const {geometry, boundary, boundaries} = this.props;

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
                {this.renderOtherBoundaries(boundaries)}
                {this.renderBoundaryGeometry(boundary)}
                {this.renderObservationPoints(boundary)}
            </Map>
        );
    }

    private handleClickBoundary = (bid: string) => () => {
        if (!!this.props.onClick) {
            return this.props.onClick(bid);
        }
    };
}

export default BoundaryMap;
