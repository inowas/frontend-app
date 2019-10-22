import {Control, DrawEvents} from 'leaflet';
import md5 from 'md5';
import React, {useRef, useState} from 'react';
import {FeatureGroup, GeoJSON, Map, Polygon} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {pure} from 'recompose';
import {Button, Popup} from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
import {Geometry} from '../../../../core/model/geometry';
import GridSize from '../../../../core/model/geometry/GridSize';
import {Gis, VectorLayer, VectorLayersCollection} from '../../../../core/model/mcda/gis';
import ActiveCellsLayer from '../../../../services/geoTools/activeCellsLayer';
import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';
import {heatMapColors} from '../../defaults/gis';
import CriteriaRasterMap from '../cd/criteriaRasterMap';

interface IProps {
    gridSize: GridSize;
    map: Gis;
    onChange: (map: Gis) => any;
    mode: string;
    readOnly: boolean;
}

const style = {
    map: {
        height: '600px',
        width: '100%'
    }
};

const constraintsMap = (props: IProps) => {
    const [refreshKey, setRefreshKey] = useState<string>(uuidv4());
    const refDrawControl = useRef<Control>(null);

    const handleCreateHole = (e: DrawEvents.Created) => {
        const polygon = e.layer.toGeoJSON();

        const hole = VectorLayer.fromObject({
            id: uuidv4(),
            type: 'hole',
            color: 'red',
            geometry: Geometry.fromGeoJson(polygon).toObject()
        });

        const map = props.map;
        map.vectorLayers.add(hole.toObject());

        setRefreshKey(uuidv4());
        return props.onChange(map);
    };

    // TODO: Delete single shapes
    const handleDeleted = () => {
        const map = props.map;
        map.vectorLayers = new VectorLayersCollection();
        return props.onChange(map);
    };

    const handleEdited = (e: DrawEvents.Edited) => {
        const map = props.map;

        e.layers.eachLayer((layer: any) => {
            const area = map.vectorLayers.findById(layer.options.id);

            if (!area) {
                return null;
            }

            area.geometry = Geometry.fromGeoJson(layer.toGeoJSON().geometry).toObject();
            map.vectorLayers.update(area);
        });

        setRefreshKey(uuidv4());
        return props.onChange(map);
    };

    const handleClickDrawArea = () => {
        // @ts-ignore
        refDrawControl._toolbars.draw._modes.polygon.handler.enable();
    };

    const areaLayer = () => {
        const {map} = props;

        return (
            <FeatureGroup>
                <EditControl
                    position="topright"
                    draw={{
                        circle: false,
                        circlemarker: false,
                        marker: false,
                        polyline: false,
                        rectangle: false,
                        polygon: !props.readOnly
                    }}
                    edit={{
                        edit: !props.readOnly,
                        remove: !props.readOnly
                    }}
                    onClick={handleDeleted}
                    onCreated={handleCreateHole}
                    onDeleted={handleDeleted}
                    onEdited={handleEdited}
                    ref={refDrawControl}
                />
                {map.vectorLayers.all.map((area) => {
                    return (
                        <Polygon
                            id={area.id}
                            color={area.color}
                            key={md5(JSON.stringify(area.geometry))}
                            positions={Geometry.fromObject(area.geometry).getBoundsLatLng()}
                        />
                    );
                })}
            </FeatureGroup>
        );
    };

    const activeCellsLayer = () => {
        return (
            <ActiveCellsLayer
                boundingBox={props.map.boundingBox}
                gridSize={props.gridSize}
                cells={props.map.cells}
                styles={{
                    line: {
                        color: 'black',
                        weight: 0.3
                    }
                }}
            />
        );
    };

    const boundingBoxLayer = () => (
        <GeoJSON
            key={md5(JSON.stringify(props.map.boundingBox.toObject()))}
            data={props.map.boundingBox.geoJson}
            color="grey"
        />
    );

    return (
        <div>
            <Button.Group attached="top">
                <Popup
                    trigger={
                        <Button
                            disabled={props.readOnly || props.mode !== 'map'}
                            icon="eraser"
                            onClick={handleClickDrawArea}
                        />
                    }
                    content="Define clip features"
                    position="top center"
                />
            </Button.Group>
            {props.mode === 'raster' &&
            <CriteriaRasterMap
                gridSize={props.gridSize}
                raster={props.map.rasterLayer}
                showBasicLayer={true}
                showButton={false}
                showLegend={true}
                legend={props.map.rasterLayer.generateRainbow(heatMapColors.colorBlind)}
            />
            }
            {props.mode !== 'raster' && props.map.boundingBox &&
            <Map
                key={refreshKey}
                style={style.map}
                bounds={props.map.boundingBox.getBoundsLatLng()}
            >
                <BasicTileLayer/>
                {props.mode === 'map' && areaLayer()}
                {props.mode === 'cells' && activeCellsLayer()}
                {props.map.boundingBox && boundingBoxLayer()}
            </Map>
            }
        </div>
    );
};

export default pure(constraintsMap);
