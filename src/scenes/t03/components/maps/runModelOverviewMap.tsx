import { BasicTileLayer } from '../../../../services/geoTools/tileLayers';
import { GeoJSON, MapContainer } from 'react-leaflet';
import { ModflowModel } from '../../../../core/model/modflow';
import { disableMap, getStyle, invalidateSize } from './index';
import { uniqueId } from 'lodash';
import AffectedCellsLayer from '../../../../services/geoTools/groupedAffectedCellsLayer';
import React from 'react';

interface IProps {
  model: ModflowModel;
}

const styles = {
  map: {
    minHeight: 300,
  },
};

const runModelOverviewMap = (props: IProps) => {
  const { cells, boundingBox, geometry, gridSize, rotation } = props.model;

  const getBoundsLatLng = () => {
    return geometry.getBoundsLatLng();
  };

  const renderBoundingBox = () => {
    const data = rotation ? boundingBox.geoJsonWithRotation(rotation, geometry.centerOfMass) : boundingBox.geoJson;
    return <GeoJSON key={uniqueId()} data={data} style={getStyle('bounding_box')} />;
  };

  return (
    <MapContainer
      style={styles.map}
      ref={(map: any) => {
        disableMap(map);
        invalidateSize(map);
      }}
      zoomControl={false}
      bounds={getBoundsLatLng()}
    >
      <BasicTileLayer />
      <GeoJSON key={geometry.hash()} data={geometry.toGeoJSON()} style={getStyle('area')} />
      {renderBoundingBox()}
      <AffectedCellsLayer
        boundingBox={boundingBox}
        gridSize={gridSize}
        cells={cells}
        rotation={rotation % 369 !== 0 ? { geometry, angle: rotation } : undefined}
      />
    </MapContainer>
  );
};

export default runModelOverviewMap;
