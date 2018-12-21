import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {GeoJSON, Map, CircleMarker, FeatureGroup} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';

import {BoundaryFactory, Geometry} from 'core/model/modflow';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {getStyle} from './index';

const style = {
    map: {
        height: '400px',
        marginTop: '20px'
    }
};

class CreateBoundaryMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            geometry: null
        }
    }

    onCreated = e => this.props.onChangeGeometry(Geometry.fromGeoJson(e.layer.toGeoJSON()));

    editControl = () => {

        const geometryType = BoundaryFactory.fromType(this.props.type).geometryType;
        return (
            <FeatureGroup>
                <EditControl
                    position='topright'
                    draw={{
                        circle: false,
                        circlemarker: geometryType.toLowerCase() === 'point',
                        marker: false,
                        polyline: geometryType.toLowerCase() === 'linestring',
                        rectangle: false,
                        polygon: geometryType.toLowerCase() === 'polygon'
                    }}
                    edit={{
                        edit: false,
                        remove: false
                    }}
                    onCreated={this.onCreated}
                />
            </FeatureGroup>
        );
    };

    // noinspection JSMethodCanBeStatic
    renderBoundaryGeometry(b) {
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
                key={b.geometry.hash()}
                data={b.geometry}
                style={getStyle(b.type)}
            />
        );
    }

    render() {
        const {geometry} = this.props;
        return (
            <Map
                style={style.map}
                bounds={geometry.getBoundsLatLng()}
            >
                <BasicTileLayer/>
                {this.editControl()}
                <GeoJSON
                    key={geometry.hash()}
                    data={geometry.toGeoJSON()}
                    style={getStyle('area')}
                />
            </Map>
        );
    }
}

CreateBoundaryMap.propTypes = {
    geometry: PropTypes.instanceOf(Geometry).isRequired,
    onChangeGeometry: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired
};

export default CreateBoundaryMap;
