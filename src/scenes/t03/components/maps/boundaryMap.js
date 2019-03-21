import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {uniqueId} from 'lodash';
import {GeoJSON, Map, CircleMarker, Polyline, Polygon} from 'react-leaflet';
import {Boundary, BoundaryCollection, Geometry, LineBoundary} from 'core/model/modflow';
import {BasicTileLayer} from 'services/geoTools/tileLayers';

import {getStyle} from './index';


const style = {
    map: {
        height: '400px',
    }
};

class BoundaryMap extends Component {

    renderObservationPoints(b) {
        if (!(b instanceof LineBoundary)) {
            return null;
        }

        if (b.observationPoints.length <= 1) {
            return null;
        }

        const observationPoints = b.observationPoints;
        return observationPoints.map(op => {
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
        });
    }

    // noinspection JSMethodCanBeStatic
    renderBoundaryGeometry(b, underlay = false) {
        const geometryType = b.geometryType;

        if (underlay) {
            switch (geometryType.toLowerCase()) {
                case 'point':
                    return (
                        <CircleMarker
                            key={Geometry.fromObject(b.geometry).hash()}
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
                            key={Geometry.fromObject(b.geometry).hash()}
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
                        key={Geometry.fromObject(b.geometry).hash()}
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
                        key={Geometry.fromObject(b.geometry).hash()}
                        positions={Geometry.fromObject(b.geometry).coordinatesLatLng}
                    />
                );
            case 'polygon':
                return (
                    <Polygon
                        key={Geometry.fromObject(b.geometry).hash()}
                        positions={Geometry.fromObject(b.geometry).coordinatesLatLng}
                    />
                );
            default:
                return null;
        }
    }

    renderOtherBoundaries(boundaries) {
        return boundaries.boundaries
            .filter(b => b.id !== this.props.boundary.id)
            .map(b => this.renderBoundaryGeometry(b, true));
    }

    render() {
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

BoundaryMap.propTypes = {
    boundary: PropTypes.instanceOf(Boundary).isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    geometry: PropTypes.instanceOf(Geometry).isRequired,
    selectedObservationPointId: PropTypes.string,
    onClick: PropTypes.func
};

export default BoundaryMap;
