import React from 'react';
import PropTypes from 'prop-types';
import {FeatureGroup, GeoJSON, Map, Polygon} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import md5 from 'md5';
import uuidv4 from 'uuid/v4';

import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {BoundingBox, Geometry} from 'core/geometry';
import {pure} from 'recompose';
import {Button, Popup} from 'semantic-ui-react';
import {GisArea, GisAreasCollection, GisMap} from 'core/mcda/gis';
import ActiveCellsLayer from 'services/geoTools/activeCellsLayer';

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
            shapes: props.constraints.areasCollection.toArray(),
            refreshKey: uuidv4()
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            shapes: nextProps.constraints.areasCollection.toArray()
        });
    }

    handleChange = () => {
        const constraints = this.props.constraints;
        constraints.areasCollection = GisAreasCollection.fromArray(this.state.shapes);
        return this.props.onChange(constraints);
    };

    onCreateArea = e => {
        const polygon = e.layer.toGeoJSON();

        const area = new GisArea();
        area.boundingBox = BoundingBox.fromGeoJson(polygon);
        area.geometry = Geometry.fromGeoJson(polygon);

        return this.setState(prevState => ({
            shapes: GisAreasCollection.fromArray(prevState.shapes).add(area).toArray(),
            refreshKey: uuidv4()
        }), this.handleChange);
    };

    onCreateHole = e => {
        const polygon = e.layer.toGeoJSON();

        const hole = new GisArea();
        hole.type = 'hole';
        hole.color = 'red';
        hole.geometry = Geometry.fromGeoJson(polygon);

        this.setState(prevState => ({
            shapes: GisAreasCollection.fromArray(prevState.shapes).add(hole).toArray(),
            refreshKey: uuidv4()
        }), this.handleChange);
    };

    // TODO: Delete single shapes
    onDeleted = () => this.setState({
        shapes: []
    }, this.handleChange);

    onEdited = e => {
        const shapes = GisAreasCollection.fromArray(this.state.shapes);

        e.layers.eachLayer(layer => {
            let shape = shapes.findById(layer.options.id);

            if (!shape) {
                return null;
            }

            shape.geometry = Geometry.fromGeoJson(layer.toGeoJSON().geometry);
            shapes.update(shape);
        });

        this.setState({
            shapes: shapes.toArray(),
            refreshKey: uuidv4()
        }, this.handleChange);
    };

    onClickDrawArea = () => {
        drawControl._toolbars.draw._modes.polygon.handler.enable();
    };

    areaLayer = () => {
        const {shapes} = this.state;

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
                    onCreated={shapes.length === 0 ? this.onCreateArea : this.onCreateHole}
                    onDeleted={this.onDeleted}
                    onEdited={this.onEdited}
                    onMounted={e => drawControl = e}
                />
                {shapes.map(shape => {
                    const area = GisArea.fromObject(shape);
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
        const area = this.props.constraints.areasCollection.findBy('type', 'area', true);

        if (!area) {
            return null;
        }

        return (
            <ActiveCellsLayer
                boundingBox={area.boundingBox}
                gridSize={this.props.constraints.gridSize}
                activeCells={this.props.constraints.activeCells}
                styles={{
                    line: {
                        color: 'black',
                        weight: 0.3
                    }
                }}
            />
        );
    };

    boundingBoxLayer = () => {
        const area = GisAreasCollection.fromArray(this.state.shapes).findBy('type', 'area', true);

        if (!area) {
            return null;
        }

        return (
            <GeoJSON
                key={md5(JSON.stringify(area.boundingBox.toArray()))}
                data={area.boundingBox.geoJson}
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
        const {mode, readOnly} = this.props;
        const {shapes} = this.state;

        return (
            <div>
                <Button.Group attached='top'>
                    <Popup
                        trigger={
                            <Button
                                disabled={readOnly || shapes.length > 0 || mode !== 'map'}
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
                                disabled={readOnly || shapes.length === 0 || mode !== 'map'}
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
                    {shapes.length > 0 && this.boundingBoxLayer()}
                </Map>
            </div>
        )
    }
}

ConstraintsMap.proptypes = {
    constraints: PropTypes.instanceOf(GisMap).isRequired,
    onChange: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,
    readOnly: PropTypes.bool
};

export default pure(ConstraintsMap);
