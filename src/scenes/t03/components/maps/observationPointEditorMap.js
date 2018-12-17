import md5 from 'md5';
import PropTypes from 'prop-types';
import React from 'react';

import {GeoJSON, Map, CircleMarker, TileLayer} from 'react-leaflet';
import {polygon as leafletPolygon, geoJSON as leafletGeoJSON} from 'leaflet';
//import {disableMap, closestPointOnGeometry} from '../../core/geospatial';
import {uniqueId} from 'lodash';


class ObservationPointEditorMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showTemporaryPoint: false,
            temporaryPoint: null,
            selectedPoint: null
        };
    }

    componentWillMount() {
        const {geometry} = this.props.observationPoint;

        if (geometry && geometry.coordinates) {
            this.setState({
                showTemporaryPoint: true,
                selectedPoint: {
                    lat: geometry.coordinates[1],
                    lng: geometry.coordinates[0]
                },
                temporaryPoint: null,
            });

            return;
        }

        this.setState({
            showTemporaryPoint: true,
            temporaryPoint: null,
            selectedPoint: null
        });
    }

    componentDidMount() {
        //disableMap(this.map);
    }

    generateKeyFunction = geometry => {
        return md5(JSON.stringify(geometry));
    };

    getBounds = geometry => {
        return leafletGeoJSON(geometry).getBounds();
    };

    handleMouseMove = e => {
        const {geometry} = this.props.boundary;

        const layers = leafletGeoJSON(geometry)._layers;
        const key = Object.keys(layers)[0];
        const latLngs = layers[key].getLatLngs();
        const polygon = leafletPolygon(latLngs);

        this.setState({
            //temporaryPoint: closestPointOnGeometry(e.target, polygon, e.latlng)
        });
    };

    handleMouseClick = () => {
        const newPoint = this.state.temporaryPoint;
        this.setState({
            selectedPoint: newPoint
        });

        this.props.onChange(newPoint);
    };

    getStyle = (type, subtype) => {
        const styles = this.props.mapStyles;

        if (!(type in styles)) {
            return styles.default;
        }

        if (subtype === undefined) {
            return styles[type];
        }

        if (!(subtype in styles[type])) {
            return styles.default;
        }

        return styles[type][subtype];
    };

    renderClosestPoint = (point, temporary) => {
        if (!point) {
            return null;
        }

        if (temporary) {
            return (
                <CircleMarker
                    key={uniqueId()}
                    center={point}
                    {...this.getStyle('op_temp')}
                />
            );
        }

        return (
            <CircleMarker
                key={uniqueId()}
                center={point}
                {...this.getStyle('op_selected')}
            />
        );
    };

    renderObservationPoints(b) {
        if (b.observation_points && b.observation_points.length > 1) {
            return b.observation_points.map(op => {
                if (this.props.observationPoint && op.id === this.props.observationPoint.id) {
                    return null;
                }

                return (
                    <CircleMarker
                        key={op.id}
                        center={[
                            op.geometry.coordinates[1],
                            op.geometry.coordinates[0]
                        ]}
                        {...this.getStyle('op')}
                    />
                );
            });
        }

        return null;
    }

    renderBoundary(boundary) {
        return (
            <GeoJSON
                key={this.generateKeyFunction(boundary.geometry)}
                data={boundary.geometry}
                style={this.getStyle(boundary.type)}
            />
        );
    }

    render() {
        const {area, boundary} = this.props;
        const {temporaryPoint, selectedPoint, showTemporaryPoint} = this.state;

        return (
            <Map
                className="observationPointMap"
                ref={map => {
                    this.map = map;
                }}
                zoomControl={false}
                bounds={this.getBounds(area)}
                onClick={this.handleMouseClick}
                onMouseMove={this.handleMouseMove}
            >
                <TileLayer url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"/>
                <GeoJSON
                    key={this.generateKeyFunction(area)}
                    data={area}
                    style={this.getStyle('area')}
                />
                {this.renderBoundary(boundary)}
                {this.renderObservationPoints(boundary)}

                {this.renderClosestPoint(selectedPoint, false)}
                {showTemporaryPoint && this.renderClosestPoint(temporaryPoint, true)}
            </Map>
        );
    }
}

ObservationPointEditorMap.propTypes = {
    area: PropTypes.object,
    boundary: PropTypes.object,
    observationPoint: PropTypes.object,
    mapStyles: PropTypes.object,
    onChange: PropTypes.func
};

export default ObservationPointEditorMap;
