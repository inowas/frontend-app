import React from 'react';
import PropTypes from 'prop-types';
import {FeatureGroup, GeoJSON, Map, Polygon} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {calculateActiveCells} from 'services/geoTools';
import md5 from 'md5';

import ActiveCellsLayer from 'services/geoTools/activeCellsLayer';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {ActiveCells, BoundingBox, Geometry, GridSize} from 'core/model/geometry';
import {getStyle} from './index';
import {pure} from 'recompose';
import {uniqueId} from 'recharts/es6/util/DataUtils';

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
            activeCells: props.activeCells ? props.activeCells.toArray() : null,
            boundingBox: props.boundingBox ? props.boundingBox.toArray() : null,
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
            const activeCells = calculateActiveCells(geometry, boundingBox, gridSize);
            resolve(activeCells);
            this.forceUpdate();
        })
    };

    recalculate = () => {
        if (!this.state.geometry) {
            return null;
        }

        const boundingBox = BoundingBox.fromArray(this.state.boundingBox);
        const geometry = Geometry.fromObject(this.state.geometry);
        const gridSize = GridSize.fromObject(this.state.gridSize);

        this.setState({calculating: true});
        this.calculate(geometry, boundingBox, gridSize)
            .then(activeCells => this.setState({
                    activeCells: activeCells.toArray(),
                    gridSize: gridSize.toObject(),
                    calculating: false
                }, this.handleChange({activeCells, boundingBox, geometry})
            ));
    };

    handleChange = ({activeCells, boundingBox, geometry}) => {
        return this.props.onChange({activeCells, boundingBox, geometry});
    };

    onCreated = e => {
        const polygon = e.layer;
        const geometry = Geometry.fromGeoJson(polygon.toGeoJSON());
        const boundingBox = BoundingBox.fromGeoJson(polygon.toGeoJSON());
        const gridSize = GridSize.fromObject(this.state.gridSize);

        this.setState({calculating: true});
        this.calculate(geometry, boundingBox, gridSize).then(
            activeCells => {
                return this.setState({
                        activeCells: activeCells.toArray(),
                        boundingBox: boundingBox.toArray(),
                        geometry: geometry.toObject(),
                        calculating: false
                    },
                    this.handleChange({activeCells, boundingBox, geometry})
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
                    polygon: this.state.geometry == null
                }}
                edit={{
                    edit: this.state.geometry != null,
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
        const boundingBox = BoundingBox.fromArray(this.state.boundingBox);
        return (
            <GeoJSON
                key={md5(JSON.stringify(boundingBox.toArray()))}
                data={boundingBox.geoJson}
                style={getStyle('bounding_box')}
            />
        )
    };

    activeCellsLayer = () => {
        return (
            <ActiveCellsLayer
                boundingBox={BoundingBox.fromArray(this.state.boundingBox)}
                gridSize={GridSize.fromObject(this.state.gridSize)}
                activeCells={ActiveCells.fromArray(this.state.activeCells)}
                styles={getStyle('active_cells')}
            />
        )
    };

    getBoundsLatLng = () => {
        if (this.state.boundingBox) {
            return BoundingBox.fromArray(this.state.boundingBox).getBoundsLatLng();
        }

        return [[60, 10], [45, 30]];
    };

    handleClickOnMap = ({latlng}) => {
        if (!this.state.activeCells) {
            return null;
        }

        const activeCells = ActiveCells.fromArray(this.state.activeCells);
        const boundingBox = BoundingBox.fromArray(this.state.boundingBox);
        const geometry = Geometry.fromObject(this.state.geometry);
        const gridSize = GridSize.fromObject(this.state.gridSize);
        const x = latlng.lng;
        const y = latlng.lat;

        this.setState({
            activeCells: activeCells.toggle([x, y], boundingBox, gridSize).toArray()
        }, () => this.handleChange({activeCells, boundingBox, geometry}))
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
                {this.state.activeCells && this.activeCellsLayer()}
            </Map>
        )
    }
}

ModelDiscretizationMap.proptypes = {
    activeCells: PropTypes.instanceOf(ActiveCells),
    boundingBox: PropTypes.instanceOf(BoundingBox),
    geometry: PropTypes.instanceOf(Geometry),
    gridSize: PropTypes.instanceOf(GridSize).isRequired,
    styles: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default pure(ModelDiscretizationMap);
