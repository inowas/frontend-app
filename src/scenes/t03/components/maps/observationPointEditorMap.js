import PropTypes from 'prop-types';
import React from 'react';

import {GeoJSON, Map, CircleMarker} from 'react-leaflet';

import {disableMap, getStyle} from './helpers';
import {uniqueId} from 'lodash';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {nearestPointOnLine} from '@turf/turf';
import {lineString, point} from '@turf/helpers';
import Geometry from 'core/model/modflow/Geometry';

const styles = {
    map: {
        height: '400px',
        width: '100%'
    }
};

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
        this.setState({
            showTemporaryPoint: true,
            selectedPoint: this.props.observationPoint.geometry,
            temporaryPoint: null,
        });
    }

    componentDidMount() {
        disableMap(this.map);
    }

    handleMouseMove = e => {
        const geometry = Geometry.fromObject(this.props.boundary.geometry);
        const line = lineString(geometry.coordinates);
        const pt = point([e.latlng.lng, e.latlng.lat]);
        const snapped = nearestPointOnLine(line, pt);
        this.setState({
            temporaryPoint: snapped.geometry
        });
    };

    handleMouseClick = () => {
        this.setState({selectedPoint: this.state.temporaryPoint});
        this.props.onChange(
            {...this.props.observationPoint, geometry: this.state.temporaryPoint}
        )
    };

    renderClosestPoint = (point, temporary) => {
        if (!point) {
            return null;
        }

        point = Geometry.fromObject(point);
        if (temporary) {
            return (
                <CircleMarker
                    key={uniqueId()}
                    center={point.coordinatesLatLng}
                    {...getStyle('op_temp')}
                />
            );
        }

        return (
            <CircleMarker
                key={uniqueId()}
                center={point.coordinatesLatLng}
                {...getStyle('op_selected')}
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
                        {...getStyle('op')}
                    />
                );
            });
        }

        return null;
    }

    // noinspection JSMethodCanBeStatic
    renderBoundary(boundary) {
        return (
            <GeoJSON
                key={boundary.geometry.hash()}
                data={boundary.geometry}
                style={getStyle(boundary.type)}
            />
        );
    }

    render() {
        const {area, boundary} = this.props;
        const {temporaryPoint, selectedPoint, showTemporaryPoint} = this.state;

        return (
            <Map
                style={styles.map}
                ref={map => {
                    this.map = map;
                }}
                zoomControl={false}
                bounds={area.getBoundsLatLng()}
                onClick={this.handleMouseClick}
                onMouseMove={this.handleMouseMove}
            >
                <BasicTileLayer/>
                <GeoJSON
                    key={area.hash()}
                    data={area.toObject()}
                    style={getStyle('area')}
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
