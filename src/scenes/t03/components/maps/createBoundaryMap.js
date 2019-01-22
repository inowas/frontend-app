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

    onCreated = e => {
        const geometry = Geometry.fromGeoJson(e.layer.toGeoJSON());
        this.props.onChangeGeometry(geometry);
        this.setState({geometry});
    };

    onEdited = e => {
        e.layers.eachLayer(layer => {
            const geometry = Geometry.fromGeoJson(layer.toGeoJSON());
            this.setState({geometry});
            this.props.onChangeGeometry(geometry);
        });
    };

    editControl = () => {
        const geometryType = BoundaryFactory.fromType(this.props.type).geometryType;
        return (
            <FeatureGroup>
                <EditControl
                    position='topright'
                    draw={{
                        circle: false,
                        circlemarker: geometryType.toLowerCase() === 'point' && !this.state.geometry,
                        marker: false,
                        polyline: geometryType.toLowerCase() === 'linestring' && !this.state.geometry,
                        rectangle: false,
                        polygon: geometryType.toLowerCase() === 'polygon' && !this.state.geometry
                    }}
                    edit={{
                        edit: !!this.state.geometry,
                        remove: false
                    }}
                    onCreated={this.onCreated}
                    onEdited={this.onEdited}
                >
                    {this.state.geometry && this.renderGeometry(this.state.geometry)}
                </EditControl>
            </FeatureGroup>
        );
    };

    renderGeometry(geometry) {
        const gType = BoundaryFactory.fromType(this.props.type).geometryType.toLowerCase();
        if (gType === 'point') {
            return (
                <CircleMarker
                    key={Math.random()}
                    center={geometry.coordinatesLatLng}
                    {...getStyle(this.props.type)}
                />
            );
        }

        return (
            <GeoJSON
                key={geometry.hash()}
                data={geometry}
                style={getStyle(this.props.type)}
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
