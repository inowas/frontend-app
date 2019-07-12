import {uniqueId} from 'lodash';
import React, {Component} from 'react';
import {CircleMarker, GeoJSON, Map, Polygon, Polyline} from 'react-leaflet';
import {GeoJson} from '../../../../core/model/geometry/Geometry';
import {Boundary, BoundaryCollection, Geometry, LineBoundary} from '../../../../core/model/modflow';
import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';
import {getStyle} from './index';

interface IProps {
    boundary: Boundary;
    boundaries: BoundaryCollection;
    geometry: Geometry;
    selectedObservationPointId?: string;
    onClick?: () => any;
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
        const geometryType: GeoJson = b.geometryType;

        if (underlay && geometryType) {
            switch (geometryType.toLowerCase()) {
                case 'point':
                    return (
                        <CircleMarker
                            key={uniqueId(Geometry.fromObject(geometryType).hash())}
                            center={[
                                b.geometry.coordinates[1],
                                b.geometry.coordinates[0]
                            ]}
                            {...getStyle('underlay')}
                            onClick={() => this.props.onClick(b.id)}
                        />
                    );
                case 'linestring':
                    return (
                        <Polyline
                            key={uniqueId(Geometry.fromObject(b.geometry).hash())}
                            positions={Geometry.fromObject(b.geometry).coordinatesLatLng}
                            {...getStyle('underlay')}
                            onClick={() => this.props.onClick(b.id)}
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
                        key={uniqueId(Geometry.fromObject(b.geometry).hash())}
                        center={[
                            b.geometry.coordinates[1],
                            b.geometry.coordinates[0]
                        ]}
                        {...getStyle(b.type, b.wellType)}
                    />
                );
            case 'linestring':
                return (
                    <Polyline
                        key={uniqueId(Geometry.fromObject(b.geometry).hash())}
                        positions={Geometry.fromObject(b.geometry).coordinatesLatLng}
                    />
                );
            case 'polygon':
                return (
                    <Polygon
                        key={uniqueId(Geometry.fromObject(b.geometry).hash())}
                        positions={Geometry.fromObject(b.geometry).coordinatesLatLng}
                    />
                );
            default:
                return null;
        }
    }

    public renderOtherBoundaries(boundaries) {
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
}

export default BoundaryMap;
