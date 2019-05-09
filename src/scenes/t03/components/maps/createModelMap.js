import React from 'react';
import PropTypes from 'prop-types';
import {FeatureGroup, GeoJSON, Map} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {calculateActiveCells} from 'services/geoTools';
import md5 from 'md5';

import ActiveCellsLayer from 'services/geoTools/activeCellsLayer';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {Icon, Message} from 'semantic-ui-react';
import {Cells, BoundingBox, Geometry, GridSize} from 'core/model/geometry';
import {getStyle} from './index';
import {pure} from 'recompose';

const style = {
    map: {
        height: '500px',
        width: '100%'
    }
};

class CreateModelMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cells: null,
            boundingBox: null,
            geometry: null,
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
            .then(cells => this.setState({
                    cells: cells.toArray(),
                    gridSize: gridSize.toObject(),
                    calculating: false
                }, this.handleChange({cells: cells, boundingBox, geometry})
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
                        cells: cells.toArray(),
                        boundingBox: boundingBox.toArray(),
                        geometry: geometry.toObject(),
                        calculating: false
                    },
                    this.handleChange({cells, boundingBox, geometry})
                )
            }
        )
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
                    remove: this.state.geometry != null
                }}
                onCreated={this.onCreated}
            />
        </FeatureGroup>
    );

    areaLayer = () => {
        return (
            <GeoJSON
                key={md5(JSON.stringify(this.state.geometry))}
                data={this.state.geometry}
                style={getStyle('area')}
            />
        )
    };

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

    cellsLayer = () => {
        return (
            <ActiveCellsLayer
                boundingBox={BoundingBox.fromArray(this.state.boundingBox)}
                gridSize={GridSize.fromObject(this.state.gridSize)}
                activeCells={Cells.fromArray(this.state.cells)}
                styles={getStyle('active_cells')}
            />
        )
    };

    renderCalculationMessage = () => {
        if (!this.state.calculating) {
            return null;
        }

        return (
            <Message key={Math.random()} icon style={{
                zIndex: 1000000,
                width: '50%',
                marginLeft: '25%',
                marginTop: '150px',
            }}>
                <Icon name='circle notched' loading/>
                <Message.Content>
                    <Message.Header>Just one second</Message.Header>
                    We are calculating the active cells for you.
                </Message.Content>
            </Message>
        )
    };

    getBoundsLatLng = () => {
        if (this.state.boundingBox) {
            return BoundingBox.fromArray(this.state.boundingBox).getBoundsLatLng();
        }

        return [[60, 10], [45, 30]];
    };

    handleClickOnMap = ({latlng}) => {
        if (!this.state.cells) {
            return null;
        }

        const activeCells = Cells.fromArray(this.state.cells);
        const boundingBox = BoundingBox.fromArray(this.state.boundingBox);
        const gridSize = GridSize.fromObject(this.state.gridSize);
        const x = latlng.lng;
        const y = latlng.lat;

        this.setState({
            cells: activeCells.toggle([x, y], boundingBox, gridSize).toArray()
        })
    };

    render() {
        return (
            <Map
                style={style.map}
                bounds={this.getBoundsLatLng()}
                onClick={this.handleClickOnMap}
            >
                <BasicTileLayer/>
                {!this.state.geometry && this.editControl()}
                {this.state.geometry && this.areaLayer()}
                {this.state.boundingBox && this.boundingBoxLayer()}
                {this.state.cells && this.cellsLayer()}
                {this.renderCalculationMessage()}
            </Map>
        )
    }
}

CreateModelMap.propTypes = {
    gridSize: PropTypes.instanceOf(GridSize).isRequired,
    styles: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default pure(CreateModelMap);
