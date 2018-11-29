import React, {Component} from 'react';
import PropTypes from 'prop-types';
import md5 from 'md5';
import {uniqueId} from 'lodash';
import {GeoJSON, Map, CircleMarker} from 'react-leaflet';
import {Boundary, Geometry} from 'core/model/modflow';
import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';
import {getBoundsLatLonFromGeoJSON} from '../../../../services/geoTools';

const disableMap = (map) => {
    if (map) {
        map.leafletElement._handlers.forEach(function (handler) {
            handler.disable();
        });
    }
};

class BoundaryMap extends Component {
    componentDidMount() {
        disableMap(this.map);
    }

    generateKeyFunction = geometry => {
        return md5(JSON.stringify(geometry));
    };

    renderObservationPoints(b) {
        if (b.observation_points && b.observation_points.length > 1) {
            return b.observation_points.map(op => {
                const selected = (op.id === this.props.selectedObservationPointId) ? '_selected' : '';
                return (
                    <CircleMarker
                        key={uniqueId(op.id)}
                        center={[
                            op.geometry.coordinates[1],
                            op.geometry.coordinates[0]
                        ]}
                        {...this.getStyle('op' + selected)}
                    />
                );
            });
        }

        return null;
    }

    renderBoundary(b) {
        if (b.type === 'wel' || b.type === 'hob') {
            return (
                <CircleMarker
                    key={b.id}
                    center={[
                        b.geometry.coordinates[1],
                        b.geometry.coordinates[0]
                    ]}
                    radius={20}
                />
            );
        }

        return (
            <GeoJSON
                key={this.generateKeyFunction(b.geometry)}
                data={b.geometry}
            />
        );
    }

    render() {
        const {geometry, boundary} = this.props;

        return (
            <Map
                style={{height: '200px', marginTop: '20px'}}
                ref={map => {this.map = map;}}
                zoomControl={false}
                bounds={getBoundsLatLonFromGeoJSON(geometry.toGeoJSON())}
            >
                <BasicTileLayer/>
                <GeoJSON
                    key={this.generateKeyFunction(geometry.toGeoJSON())}
                    data={geometry.toGeoJSON()}
                />
                {this.renderBoundary(boundary)}
                {this.renderObservationPoints(boundary)}
            </Map>
        );
    }
}

BoundaryMap.propTypes = {
    boundary: PropTypes.instanceOf(Boundary).isRequired,
    geometry: PropTypes.instanceOf(Geometry).isRequired,
    selectedObservationPointId: PropTypes.string,
};

export default BoundaryMap;
