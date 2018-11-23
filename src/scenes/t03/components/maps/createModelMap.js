import React from 'react';
import PropTypes from 'prop-types';
import {FeatureGroup, GeoJSON, Map} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {calculateActiveCells, getBoundingBox, getGeoJsonFromBoundingBox} from 'services/geoTools';
import md5 from 'md5';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import mapStyles from './styles'
import ActiveCellsLayer from 'services/geoTools/activeCellsLayer';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {Icon, Message} from "semantic-ui-react";

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
            activeCells: props.activeCellsLayer,
            boundingBox: props.boundingBoxLayer,
            geometry: props.geometry,
            gridSize: props.gridSize,
            calculating: false
        }
    }

    componentWillReceiveProps(nextProps) {
        const {gridSize} = nextProps;
        if (!this.state.geometry) {
            return this.setState({gridSize});
        }

        if ((gridSize.n_x !== this.state.gridSize.n_x) || (gridSize.n_y !== this.state.gridSize.n_y)) {
            this.setState({calculating: true});
            const activeCells = calculateActiveCells(this.state.geometry, this.state.boundingBox, gridSize);
            const {boundingBox, geometry} = this.state;
            if (activeCells) {
                return this.setState(
                    {gridSize, activeCells, calculating: false},
                    this.handleChange({activeCells, boundingBox, geometry})
                )
            }
        }
    }

    handleChange = ({activeCells, boundingBox, geometry}) => {
        return this.props.onChange({activeCells, boundingBox, geometry});
    };

    onCreated = e => {
        const polygon = e.layer;
        const geometry = polygon.toGeoJSON().geometry;
        const boundingBox = getBoundingBox(geometry);
        this.setState({calculating: true});

        const activeCells = calculateActiveCells(geometry, boundingBox, this.state.gridSize);
        return this.setState(
            {activeCells, boundingBox, geometry, calculating: false},
            this.handleChange({activeCells, boundingBox, geometry})
        );
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
        return (
            <GeoJSON
                key={md5(JSON.stringify(this.state.boundingBox))}
                data={getGeoJsonFromBoundingBox(this.state.boundingBox)}
                style={mapStyles.bounding_box}
            />
        )
    };

    activeCellsLayer = () => {
        return (
            <ActiveCellsLayer
                boundingBox={this.state.boundingBox}
                gridSize={this.props.gridSize}
                activeCells={this.state.activeCells}
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
            return [
                [this.state.boundingBox[0][1], this.state.boundingBox[0][0]],
                [this.state.boundingBox[1][1], this.state.boundingBox[1][0]]
            ];
        }

        return null;
    };

    render() {
        return (
            <Map
                center={[51.505, -0.09]}
                zoom={2}
                style={style.map}
                bounds={this.getBoundsLatLong()}
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
    activeCells: PropTypes.oneOfType([null, PropTypes.object]).isRequired,
    boundingBox: PropTypes.oneOfType([null, PropTypes.object]).isRequired,
    geometry: PropTypes.oneOfType([null, PropTypes.object]).isRequired,
    gridSize: PropTypes.oneOfType([null, PropTypes.object]).isRequired,
    styles: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default CreateModelMap;
