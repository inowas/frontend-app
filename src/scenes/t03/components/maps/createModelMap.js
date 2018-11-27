import React from 'react';
import PropTypes from 'prop-types';
import {FeatureGroup, GeoJSON, Map} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {calculateActiveCells} from 'services/geoTools';
import md5 from 'md5';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import mapStyles from './styles'
import ActiveCellsLayer from 'services/geoTools/activeCellsLayer';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {Icon, Message} from 'semantic-ui-react';
import ActiveCells from 'core/model/modflow/ActiveCells';
import BoundingBox from 'core/model/modflow/BoundingBox';
import Geometry from 'core/model/modflow/Geometry';
import GridSize from 'core/model/modflow/GridSize';

const style = {
    map: {
        height: '400px',
        width: '100%'
    }
};

class CreateModelMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeCells: null,
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
                style={mapStyles.area}
            />
        )
    };

    boundingBoxLayer = () => {
        const boundingBox = BoundingBox.fromArray(this.state.boundingBox);
        return (
            <GeoJSON
                key={md5(JSON.stringify(boundingBox.toArray()))}
                data={boundingBox.geoJson}
                style={mapStyles.bounding_box}
            />
        )
    };

    activeCellsLayer = () => {
        return (
            <ActiveCellsLayer
                boundingBox={BoundingBox.fromArray(this.state.boundingBox)}
                gridSize={GridSize.fromObject(this.state.gridSize)}
                activeCells={ActiveCells.fromArray(this.state.activeCells)}
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

    getBoundsLatLong = () => {
        if (this.state.boundingBox) {
            const boundingBox = BoundingBox.fromArray(this.state.boundingBox);
            return [
                [boundingBox.yMin, boundingBox.xMin],
                [boundingBox.yMax, boundingBox.xMax]
            ];
        }

        return null;
    };

    handleClickOnMap = ({latlng}) => {
        if (!this.state.activeCells) {
            return null;
        }

        const activeCells = ActiveCells.fromArray(this.state.activeCells);
        const boundingBox = BoundingBox.fromArray(this.state.boundingBox);
        const gridSize = GridSize.fromObject(this.state.gridSize);
        const x = latlng.lng;
        const y = latlng.lat;

        this.setState({
            activeCells: activeCells.toggle([x, y], boundingBox, gridSize).toArray()
        })
    };

    render() {
        return (
            <Map
                center={[51.505, -0.09]}
                zoom={2}
                style={style.map}
                bounds={this.getBoundsLatLong()}
                onClick={this.handleClickOnMap}
            >
                <BasicTileLayer/>
                {!this.state.geometry && this.editControl()}
                {this.state.geometry && this.areaLayer()}
                {this.state.boundingBox && this.boundingBoxLayer()}
                {this.state.activeCells && this.activeCellsLayer()}
                {this.renderCalculationMessage()}
            </Map>
        )
    }
}

CreateModelMap.proptypes = {
    gridSize: PropTypes.instanceOf(GridSize).isRequired,
    styles: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default CreateModelMap;
