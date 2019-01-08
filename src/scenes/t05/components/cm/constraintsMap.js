import React from 'react';
import PropTypes from 'prop-types';
import {FeatureGroup, GeoJSON, Map, Polygon} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import md5 from 'md5';
import uuidv4 from 'uuid/v4';

import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {BoundingBox, Geometry, GridSize} from 'core/geometry';
import {pure} from 'recompose';
import {Button, Popup} from 'semantic-ui-react';

const style = {

    map: {
        height: '400px',
        width: '100%'
    }
};

let drawControl;

class ConstraintsMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            area: null,
            gridSize: props.gridSize.toObject(),
            refreshKey: uuidv4()
        }
    }

    handleChange = ({boundingBox, geometry}) => {
        return this.props.onChange({boundingBox, geometry});
    };

    onCreateArea = e => {
        const polygon = e.layer;
        const geometry = Geometry.fromGeoJson(polygon.toGeoJSON());
        const boundingBox = BoundingBox.fromGeoJson(polygon.toGeoJSON());

        const area = {
            boundingBox: boundingBox.toArray(),
            geometry: geometry.toObject()
        };

        return this.setState({
            area: area,
            refreshKey: uuidv4()
        });
    };

    onCreateHole = e => {
        const polygon = e.layer.toGeoJSON();

        const area = this.state.area;
        area.geometry.coordinates = area.geometry.coordinates.concat(polygon.geometry.coordinates);
        return this.setState({
            area: area,
            refreshKey: uuidv4()
        });
    };

    onEdited = (e) => {
        console.log('ON EDIT', e);
        e.layers.eachLayer(layer => {
            console.log('LAYER', layer);
        });
    };

    onClickDrawArea = () => {
        drawControl._toolbars.draw._modes.polygon.handler.enable();
    };

    areaLayer = () => {
        console.log('STATE', this.state);
        const geometry = this.state.area ? Geometry.fromObject(this.state.area.geometry) : null;

        return (
            <FeatureGroup ref='featureGroup'>
                <EditControl
                    position='topright'
                    draw={{
                        circle: false,
                        circlemarker: false,
                        marker: false,
                        polyline: false,
                        rectangle: false,
                        polygon: true
                    }}
                    edit={{
                        edit: true, // this.state.area !== null,
                        remove: this.state.area !== null
                    }}
                    onCreated={!this.state.area ? this.onCreateArea : this.onCreateHole}
                    onEditStart={this.onEditStart}
                    onEdited={this.onEdited}
                    onMounted={e => drawControl = e}
                />
                {this.state.area !== null &&
                <Polygon
                    id={this.state.area.id}
                    key={md5(JSON.stringify(this.state.area.geometry))}
                    positions={geometry.coordinates.map(c => geometry.getLatLngFromXY(c))}
                />
                }
            </FeatureGroup>
        )
    };

    boundingBoxLayer = () => {
        const boundingBox = BoundingBox.fromArray(this.state.area.boundingBox);
        return (
            <GeoJSON
                key={md5(JSON.stringify(boundingBox.toArray()))}
                data={boundingBox.geoJson}
                color='grey'
            />
        )
    };

    getBoundsLatLng = () => {
        if (this.state.area) {
            return BoundingBox.fromArray(this.state.area.boundingBox).getBoundsLatLng();
        }

        return [[60, 10], [45, 30]];
    };

    render() {
        return (
            <div>
                <Button.Group attached='top'>
                    <Popup
                        trigger={
                            <Button
                                disabled={this.state.area !== null}
                                icon='map outline'
                                onClick={this.onClickDrawArea}
                            />
                        }
                        content='Define suitable area'
                        position='top center'
                    />
                    <Popup
                        trigger={
                            <Button
                                disabled={this.state.area === null}
                                icon='cut'
                                onClick={this.onClickDrawArea}
                            />
                        }
                        content='Cut out unsuitable areas'
                        position='top center'
                    />
                </Button.Group>
                <Map
                    key={this.state.refreshKey}
                    style={style.map}
                    bounds={this.getBoundsLatLng()}
                    onClick={this.handleClickOnMap}
                >
                    <BasicTileLayer/>
                    {this.areaLayer()}
                    {this.state.area && this.boundingBoxLayer()}
                </Map>
            </div>
        )
    }
}

ConstraintsMap.proptypes = {
    gridSize: PropTypes.instanceOf(GridSize).isRequired,
    onChange: PropTypes.func.isRequired
};

export default pure(ConstraintsMap);
