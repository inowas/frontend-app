import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {uniqueId} from 'lodash';
import {GeoJSON, Map, CircleMarker} from 'react-leaflet';
import {Boundary, Geometry} from 'core/model/modflow';
import {BasicTileLayer} from 'services/geoTools/tileLayers';

import {disableMap, generateKey, getStyle} from './index';
import {getBoundsLatLonFromGeoJSON} from 'services/geoTools/index';


const style = {
    map: {
        height: '200px',
        marginTop: '20px'
    }
};

class BoundaryMap extends Component {
    componentDidMount() {
        disableMap(this.map);
    }

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
                        {...getStyle('op' + selected)}
                    />
                );
            });
        }

        return null;
    }

    // noinspection JSMethodCanBeStatic
    renderBoundary(b) {
        if (b.type === 'wel' || b.type === 'hob') {
            return (
                <CircleMarker
                    key={b.id}
                    center={[
                        b.geometry.coordinates[1],
                        b.geometry.coordinates[0]
                    ]}
                    {...getStyle(b.type, b.metadata.well_type)}
                />
            );
        }

        return (
            <GeoJSON
                key={generateKey(b.geometry)}
                data={b.geometry}
                style={getStyle(b.type)}
            />
        );
    }

    render() {
        const {geometry, boundary} = this.props;

        return (
            <Map
                style={style.map}
                ref={map => {
                    this.map = map
                }}
                zoomControl={false}
                bounds={getBoundsLatLonFromGeoJSON(geometry.toGeoJSON())}
            >
                <BasicTileLayer/>
                <GeoJSON
                    key={generateKey(geometry.toGeoJSON())}
                    data={geometry.toGeoJSON()}
                    style={getStyle('area')}
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
