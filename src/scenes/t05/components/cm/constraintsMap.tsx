import { BasicTileLayer } from '../../../../services/geoTools/tileLayers';
import { Button, Popup } from 'semantic-ui-react';
import { Control } from 'leaflet';
import { EditControl } from 'react-leaflet-draw';
import { FeatureGroup, GeoJSON, MapContainer, Polygon } from 'react-leaflet';
import { Geometry } from '../../../../core/model/geometry';
import { Gis, VectorLayer, VectorLayersCollection } from '../../../../core/model/mcda/gis';
import { heatMapColors } from '../../defaults/gis';
import ActiveCellsLayer from './activeCellsLayer';
import CriteriaRasterMap from '../cd/criteriaRasterMap';
import GridSize from '../../../../core/model/geometry/GridSize';
import React, { useRef, useState } from 'react';
import md5 from 'md5';
import uuidv4 from 'uuid/v4';

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

const ConstraintsMap = (props: IProps) => {
  const [refreshKey, setRefreshKey] = useState<string>(uuidv4());
  const refDrawControl = useRef<Control>(null);

  const handleCreateHole = (e: any) => {
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

  const handleEdited = (e: any) => {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    refDrawControl._toolbars.draw._modes.polygon.handler.enable();
  };

  const areaLayer = () => {
    const { map } = props;

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
      pathOptions={{
        color: 'grey'
      }}
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
        <MapContainer
          key={refreshKey}
          style={style.map}
          bounds={props.map.boundingBox.getBoundsLatLng()}
        >
          <BasicTileLayer />
          {props.mode === 'map' && areaLayer()}
          {props.mode === 'cells' && activeCellsLayer()}
          {props.map.boundingBox && boundingBoxLayer()}
        </MapContainer>
      }
    </div>
  );
};

export default ConstraintsMap;
