import React from 'react';
import PropTypes from 'prop-types';

import {CircleMarker, FeatureGroup, GeoJSON, Map, Polygon, Polyline} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';


import ActiveCellsLayer from 'services/geoTools/activeCellsLayer';

import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {calculateActiveCells} from 'services/geoTools';
import {getStyle} from './index';

import {
    Boundary,
    BoundaryCollection,
    Geometry,
    ModflowModel
} from 'core/model/modflow';

const style = {
    map: {
        height: '500px',
        width: '100%'
    }
};

class BoundaryDiscretizationMap extends React.Component {


    calculate = (geometry, boundingBox, gridSize) => {
        return new Promise(resolve => {
            const activeCells = calculateActiveCells(geometry, boundingBox, gridSize);
            resolve(activeCells);
        })
    };

    onEdited = e => {
        const {boundary, model, onChange} = this.props;
        const {boundingBox, gridSize} = model;

        e.layers.eachLayer(layer => {
            const geometry = Geometry.fromGeoJson(layer.toGeoJSON());
            this.calculate(geometry, boundingBox, gridSize)
                .then(activeCells => {
                    boundary.activeCells = activeCells;
                    boundary.geometry = geometry;
                    return onChange(boundary);
                });
        });
    };

    // noinspection JSMethodCanBeStatic
    renderBoundaryGeometry(b) {
        const geometryType = b.geometryType;

        switch (geometryType.toLowerCase()) {
            case 'point':
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
            case 'linestring':
                return (
                    <Polyline
                        key={b.id}
                        positions={b.geometry.coordinatesLatLng}
                    />
                );
            case 'polygon':
                return (
                    <Polygon
                        key={b.id}
                        positions={b.geometry.coordinatesLatLng}
                    />
                );
            default:
                return null;
        }
    }

    showBoundaryGeometry = () => {
        const {boundary, readOnly, showActiveCells} = this.props;

        if (readOnly) {
            return (this.renderBoundaryGeometry(boundary));
        }

        // When rendering Cells, the geometry should not be editable
        if (showActiveCells) {
            return (this.renderBoundaryGeometry(boundary));
        }

        return (
            <FeatureGroup>
                <EditControl
                    position='topright'
                    draw={{
                        circle: false,
                        circlemarker: false,
                        marker: false,
                        polyline: false,
                        rectangle: false,
                        polygon: false
                    }}
                    edit={{
                        edit: true,
                        remove: false
                    }}
                    onEdited={this.onEdited}
                />
                {this.renderBoundaryGeometry(boundary)}
            </FeatureGroup>
        )
    };

    modelGeometryLayer = () => {
        const geometry = this.props.model.geometry;
        return (
            <GeoJSON
                key={geometry.hash()}
                data={geometry.toGeoJSON()}
                style={getStyle('area')}
            />
        )
    };

    activeCellsLayer = () => {
        return (
            <ActiveCellsLayer
                boundingBox={this.props.model.boundingBox}
                gridSize={this.props.model.gridSize}
                activeCells={this.props.boundary.cells}
                styles={getStyle('active_cells')}
            />
        )
    };

    handleClickOnMap = ({latlng}) => {
        if (!this.props.showActiveCells) {
            return null;
        }

        if (this.props.readOnly) {
            return null;
        }

        const activeCells = this.props.boundary.cells;
        const boundingBox = this.props.model.boundingBox;
        const gridSize = this.props.model.gridSize;
        const x = latlng.lng;
        const y = latlng.lat;

        activeCells.toggle([x, y], boundingBox, gridSize).toArray();
        const boundary = this.props.boundary;
        boundary.cells = activeCells;
        this.props.onChange(boundary);
    };

    render() {
        return (
            <Map
                style={style.map}
                bounds={this.props.model.boundingBox.getBoundsLatLng()}
                onClick={!this.props.readOnly && this.handleClickOnMap}
            >
                <BasicTileLayer/>
                {this.props.showBoundaryGeometry && this.showBoundaryGeometry()}
                {this.modelGeometryLayer()}
                {this.props.showActiveCells && this.activeCellsLayer()}
            </Map>
        )
    }
}

BoundaryDiscretizationMap.proptypes = {
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    boundary: PropTypes.instanceOf(Boundary).isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection),
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    showActiveCells: PropTypes.bool.isRequired,
    showBoundaryGeometry: PropTypes.bool.isRequired,
};

export default BoundaryDiscretizationMap;
