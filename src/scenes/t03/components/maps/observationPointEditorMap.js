import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';
import {Boundary, ObservationPoint} from '../../../../core/model/modflow/boundaries';
import {CircleMarker, GeoJSON, Map} from 'react-leaflet';
import {Geometry} from '../../../../core/model/geometry';
import {disableMap, getStyle} from './index';
import {lineString, point} from '@turf/helpers';
import {nearestPointOnLine} from '@turf/turf';
import {uniqueId} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

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

    UNSAFE_componentWillMount() {
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
        const op = ObservationPoint.fromObject(this.props.observationPoint.toObject());
        op.geometry = this.state.temporaryPoint;
        this.props.onChange(op);
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
        if (b.observationPoints && Array.isArray(b.observationPoints)) {
            return b.observationPoints.map(op => {
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
                key={Geometry.fromObject(boundary.geometry).hash()}
                data={Geometry.fromObject(boundary.geometry)}
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
    boundary: PropTypes.instanceOf(Boundary).isRequired,
    observationPoint: PropTypes.instanceOf(ObservationPoint).isRequired,
    mapStyles: PropTypes.object,
    onChange: PropTypes.func
};

export default ObservationPointEditorMap;
