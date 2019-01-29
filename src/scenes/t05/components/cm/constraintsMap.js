import React from 'react';
import PropTypes from 'prop-types';
import {FeatureGroup, GeoJSON, Map, Polygon} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import md5 from 'md5';
import uuidv4 from 'uuid/v4';
import {pure} from 'recompose';
import {Button, Popup} from 'semantic-ui-react';
import ActiveCellsLayer from 'services/geoTools/activeCellsLayer';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {BoundingBox, Geometry} from 'core/model/geometry';
import {GisArea, GisAreasCollection, GisMap} from 'core/model/mcda/gis';

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
            refreshKey: uuidv4()
        }
    }

    onCreateArea = e => {
        const polygon = e.layer.toGeoJSON();

        const area = new GisArea();
        area.geometry = Geometry.fromGeoJson(polygon);

        const map = this.props.map;
        map.boundingBox = BoundingBox.fromGeoJson(polygon);
        map.areasCollection.add(area);

        this.setState({
            refreshKey: uuidv4()
        }, this.props.onChange(map));
    };

    onCreateHole = e => {
        const polygon = e.layer.toGeoJSON();

        const hole = new GisArea();
        hole.type = 'hole';
        hole.color = 'red';
        hole.geometry = Geometry.fromGeoJson(polygon);

        const map = this.props.map;
        map.areasCollection.add(hole);

        this.setState({
            refreshKey: uuidv4()
        }, this.props.onChange(map));
    };

    // TODO: Delete single shapes
    onDeleted = () => {
        const map = this.props.map;
        map.areasCollection = new GisAreasCollection();
        this.props.onChange(map)
    };

    onEdited = e => {
        const map = this.props.map;

        e.layers.eachLayer(layer => {
            let area = map.areasCollection.findById(layer.options.id);

            if (!area) {
                return null;
            }

            area.geometry = Geometry.fromGeoJson(layer.toGeoJSON().geometry);
            map.areasCollection.update(area);
        });

        this.setState({
            refreshKey: uuidv4()
        }, this.props.onChange(map));
    };

    onClickDrawArea = () => {
        drawControl._toolbars.draw._modes.polygon.handler.enable();
    };

    areaLayer = () => {
        const {map} = this.props;

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
                        polygon: !this.props.readOnly
                    }}
                    edit={{
                        edit: !this.props.readOnly,
                        remove: !this.props.readOnly
                    }}
                    onClick={this.onDeleted}
                    onCreated={map.areasCollection.length === 0 ? this.onCreateArea : this.onCreateHole}
                    onDeleted={this.onDeleted}
                    onEdited={this.onEdited}
                    onMounted={e => drawControl = e}
                />
                {map.areasCollection.all.map(area => {
                    return (
                        <Polygon
                            id={area.id}
                            color={area.color}
                            key={md5(JSON.stringify(area.geometry.toObject()))}
                            positions={area.geometry.coordinatesLatLng}
                        />
                    );
                })}
            </FeatureGroup>
        );
    };

    activeCellsLayer = () => {
        return (
            <ActiveCellsLayer
                boundingBox={this.props.map.boundingBox}
                gridSize={this.props.map.gridSize}
                activeCells={this.props.map.activeCells}
                styles={{
                    line: {
                        color: 'black',
                        weight: 0.3
                    }
                }}
            />
        );
    };

    boundingBoxLayer = () => <GeoJSON
        key={md5(JSON.stringify(this.props.map.boundingBox.toArray()))}
        data={this.props.map.boundingBox.geoJson}
        color='grey'
    />;

    getBoundsLatLng = () => {
        if (this.props.map.boundingBox) {
            return this.props.map.boundingBox.getBoundsLatLng();
        }

        return [[60, 10], [45, 30]];
    };

    render() {
        const {map, mode, readOnly} = this.props;

        return (
            <div>
                <Button.Group attached='top'>
                    <Popup
                        trigger={
                            <Button
                                disabled={readOnly || map.areasCollection.length > 0 || mode !== 'map'}
                                icon='map outline'
                                onClick={this.onClickDrawArea}
                            />
                        }
                        content='Define project area'
                        position='top center'
                    />
                    <Popup
                        trigger={
                            <Button
                                disabled={readOnly || map.areasCollection.length === 0 || mode !== 'map'}
                                icon='eraser'
                                onClick={this.onClickDrawArea}
                            />
                        }
                        content='Define clip features'
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
                    {mode === 'map' && this.areaLayer()}
                    {mode === 'cells' && this.activeCellsLayer()}
                    {map.boundingBox && this.boundingBoxLayer()}
                </Map>
            </div>
        )
    }
}

ConstraintsMap.proptypes = {
    map: PropTypes.instanceOf(GisMap).isRequired,
    onChange: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,
    readOnly: PropTypes.bool
};

export default pure(ConstraintsMap);
