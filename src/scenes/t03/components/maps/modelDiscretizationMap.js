import React from 'react';
import PropTypes from 'prop-types';
import {FeatureGroup, GeoJSON, Map, Polygon} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {calculateActiveCells} from '../../../../services/geoTools';
import md5 from 'md5';

import ActiveCellsLayer from '../../../../services/geoTools/activeCellsLayer';
import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';
import {Cells, BoundingBox, Geometry, GridSize} from '../../../../core/model/geometry';
import {getStyle} from './index';
import {pure} from 'recompose';
import {uniqueId} from 'lodash';

const style = {
    map: {
        height: '400px',
        width: '100%'
    }
};

class ModelDiscretizationMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cells: props.cells ? props.cells.toObject() : null,
            boundingBox: props.boundingBox ? props.boundingBox.toObject() : null,
            geometry: props.geometry ? props.geometry.toObject() : null,
            gridSize: props.gridSize.toObject(),
            calculating: false
        }
    }

    componentWillReceiveProps(nextProps) {
        const {gridSize} = nextProps;
        if (!nextProps.gridSize.sameAs(GridSize.fromObject(this.state.gridSize))) {
            this.setState(() => ({gridSize: gridSize.toObject()}), () => this.recalculate());
        }


    }

    calculate = (geometry, boundingBox, gridSize) => {
        return new Promise(resolve => {
            const cells = calculateActiveCells(geometry, boundingBox, gridSize);
            resolve(cells);
            this.forceUpdate();
        })
    };

    recalculate = () => {
        if (!this.state.geometry) {
            return null;
        }

        const boundingBox = BoundingBox.fromObject(this.state.boundingBox);
        const geometry = Geometry.fromObject(this.state.geometry);
        const gridSize = GridSize.fromObject(this.state.gridSize);

        this.setState({calculating: true});
        this.calculate(geometry, boundingBox, gridSize)
            .then(cells => this.setState({
                    cells: cells.toObject(),
                    gridSize: gridSize.toObject(),
                    calculating: false
                }, this.handleChange({cells, boundingBox, geometry})
            ));
    };

    handleChange = ({cells, boundingBox, geometry}) => {
        return this.props.onChange({cells, boundingBox, geometry});
    };

    onCreated = e => {
        const polygon = e.layer;
        const geometry = Geometry.fromGeoJson(polygon.toGeoJSON());
        const boundingBox = BoundingBox.fromGeoJson(polygon.toGeoJSON());
        const gridSize = GridSize.fromObject(this.state.gridSize);

        this.setState({calculating: true});
        this.calculate(geometry, boundingBox, gridSize).then(
            cells => {
                return this.setState({
                        cells: cells.toObject(),
                        boundingBox: boundingBox.toObject(),
                        geometry: geometry.toObject(),
                        calculating: false
                    },
                    this.handleChange({cells, boundingBox, geometry})
                )
            }
        )
    };

    onEdited = e => {
        e.layers.eachLayer(layer => {
            const geometry = layer.toGeoJSON().geometry;
            this.setState({
                geometry
            }, () => this.recalculate())
        });
    };

    editControl = () => (
        <FeatureGroup>
            <EditControl
                position='topright'
                draw={{
                    circle: false,
                    circlemarker: false,
                    marker: false,
                    polyline: false,
                    rectangle: false,
                    polygon: !this.props.readOnly && this.state.geometry == null
                }}
                edit={{
                    edit: !this.props.readOnly && this.state.geometry != null,
                    remove: false
                }}
                onCreated={this.onCreated}
                onEdited={this.onEdited}
            />
            {this.state.geometry &&
            <Polygon
                key={uniqueId()}
                positions={Geometry.fromObject(this.state.geometry).coordinatesLatLng}
            />
            }
        </FeatureGroup>
    );

    boundingBoxLayer = () => {
        const boundingBox = BoundingBox.fromObject(this.state.boundingBox);
        return (
            <GeoJSON
                key={md5(JSON.stringify(boundingBox.toObject()))}
                data={boundingBox.geoJson}
                style={getStyle('bounding_box')}
            />
        )
    };

    cellsLayer = () => {
        return (
            <ActiveCellsLayer
                boundingBox={BoundingBox.fromObject(this.state.boundingBox)}
                gridSize={GridSize.fromObject(this.state.gridSize)}
                cells={Cells.fromObject(this.state.cells)}
                styles={getStyle('active_cells')}
            />
        )
    };

    getBoundsLatLng = () => {
        if (this.state.boundingBox) {
            return BoundingBox.fromObject(this.state.boundingBox).getBoundsLatLng();
        }

        return [[60, 10], [45, 30]];
    };

    handleClickOnMap = ({latlng}) => {
        if (!this.state.cells) {
            return null;
        }

        const cells = Cells.fromObject(this.state.cells);
        const boundingBox = BoundingBox.fromObject(this.state.boundingBox);
        const geometry = Geometry.fromObject(this.state.geometry);
        const gridSize = GridSize.fromObject(this.state.gridSize);
        const x = latlng.lng;
        const y = latlng.lat;

        this.setState({
            cells: cells.toggle([x, y], boundingBox, gridSize).toObject()
        }, () => this.handleChange({cells, boundingBox, geometry}))
    };

    render() {
        return (
            <Map
                style={style.map}
                bounds={this.getBoundsLatLng()}
                onClick={this.handleClickOnMap}
            >
                <BasicTileLayer/>
                {this.editControl()}
                {this.state.boundingBox && this.boundingBoxLayer()}
                {this.state.cells && this.cellsLayer()}
            </Map>
        )
    }
}

ModelDiscretizationMap.propTypes = {
    cells: PropTypes.instanceOf(Cells),
    boundingBox: PropTypes.instanceOf(BoundingBox),
    geometry: PropTypes.instanceOf(Geometry),
    gridSize: PropTypes.instanceOf(GridSize).isRequired,
    styles: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired
};

export default pure(ModelDiscretizationMap);
