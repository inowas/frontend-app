import React from 'react';
import PropTypes from 'prop-types';

import {CircleMarker, FeatureGroup, GeoJSON, Map, Polygon, Polyline} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';

import ActiveCellsLayer from 'services/geoTools/activeCellsLayer';
import {BasicTileLayer} from 'services/geoTools/tileLayers';

import {getStyle} from './index';

import {
    Boundary,
    BoundaryCollection,
    Geometry, LineBoundary,
    ModflowModel
} from 'core/model/modflow';

import Cells from 'core/model/geometry/Cells';
import {uniqueId} from 'recharts/es6/util/DataUtils';

const style = {
    map: {
        height: '500px',
        width: '100%'
    }
};

class BoundaryDiscretizationMap extends React.Component {

    calculate = (boundary, geometry, boundingBox, gridSize) => {
        return new Promise(resolve => {
            const cells = Cells.fromGeometry(geometry, boundingBox, gridSize);
            if (boundary instanceof LineBoundary) {
                cells.calculateValues(boundary, boundingBox, gridSize);
            }
            resolve(cells);
        })
    };

    onEdited = e => {
        const {boundary, model, onChange} = this.props;
        const {boundingBox, gridSize} = model;

        e.layers.eachLayer(layer => {
            const geometry = Geometry.fromGeoJson(layer.toGeoJSON());
            this.calculate(boundary, geometry, boundingBox, gridSize)
                .then(cells => {
                    boundary.cells = cells.toArray();
                    boundary.geometry = geometry.toObject();
                    return onChange(boundary);
                });
        });
    };

    // noinspection JSMethodCanBeStatic
    renderBoundaryGeometry(b, underlay = false) {
        const geometryType = b.geometryType;

        if (underlay) {
            switch (geometryType.toLowerCase()) {
                case 'point':
                    return (
                        <CircleMarker
                            key={uniqueId(Geometry.fromObject(b.geometry).hash())}
                            center={[
                                b.geometry.coordinates[1],
                                b.geometry.coordinates[0]
                            ]}
                            {...getStyle('underlay')}
                        />
                    );
                case 'linestring':
                    return (
                        <Polyline
                            key={uniqueId(Geometry.fromObject(b.geometry).hash())}
                            positions={Geometry.fromObject(b.geometry).coordinatesLatLng}
                            {...getStyle('underlay')}
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
        const {geometry} = this.props.model;
        return (
            <GeoJSON
                key={geometry.hash()}
                data={geometry.toGeoJSON()}
                style={getStyle('area')}
            />
        )
    };

    activeCellsLayer = () => {
        const {boundingBox, gridSize} = this.props.model;
        return (
            <ActiveCellsLayer
                boundingBox={boundingBox}
                gridSize={gridSize}
                cells={Cells.fromArray(this.props.boundary.cells)}
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

        const boundary = this.props.boundary;
        const cells = Cells.fromArray(boundary.cells);
        const boundingBox = this.props.model.boundingBox;
        const gridSize = this.props.model.gridSize;
        const x = latlng.lng;
        const y = latlng.lat;

        cells.toggle([x, y], boundingBox, gridSize);

        if (boundary instanceof LineBoundary) {
            cells.calculateValues(this.props.boundary, boundingBox, gridSize);
        }

        boundary.cells = cells.toArray();
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
                {this.renderOtherBoundaries(this.props.boundaries)}
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
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    showActiveCells: PropTypes.bool.isRequired,
    showBoundaryGeometry: PropTypes.bool.isRequired,
};

export default BoundaryDiscretizationMap;
