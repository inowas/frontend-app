import { BoundingBox, Cells, GridSize } from '../../core/model/geometry';
import { GeoJSON } from 'react-leaflet';
import { GroupedLayer } from '../../scenes/shared/leaflet/LayerControl';
import { IBoundingBox } from '../../core/model/geometry/BoundingBox.type';
import { IRotationProperties } from '../../core/model/geometry/Geometry.type';
import { GeoJSON as LeafletGeoJSON } from 'leaflet';
import { createCellsPolygon } from './createCellsPolygon';
import { useEffect, useRef, useState } from 'react';

interface IProps {
  boundingBox: BoundingBox;
  gridSize: GridSize;
  cells: Cells;
  rotation?: IRotationProperties;
}

const styles = {
  inactive: {
    stroke: false,
    fill: true,
    fillColor: '#888888',
    fillOpacity: 0.6,
  },
};

const IBoundLayer = (props: IProps) => {
  const [boundingBox, setBoundingBox] = useState<IBoundingBox>(props.boundingBox.toObject());

  const layerRef = useRef<LeafletGeoJSON | null>(null);

  useEffect(() => {
    setBoundingBox(props.boundingBox.toObject());
  }, [props.boundingBox]);

  useEffect(() => {
    if (props.rotation) {
      const bbox = BoundingBox.fromGeometryAndRotation(props.rotation.geometry, props.rotation.angle);
      setBoundingBox(bbox.toObject());
    }
  }, [props.rotation]);

  useEffect(() => {
    const polygon = createCellsPolygon(
      BoundingBox.fromObject(boundingBox),
      props.gridSize,
      props.cells.invert(props.gridSize),
      props.rotation
    );
    const layer = layerRef.current;
    if (layer && polygon) {
      layer.clearLayers().addData(polygon);
      layer.setStyle(styles.inactive);
    }
  }, [boundingBox, props.cells, props.gridSize, props.rotation]);

  return (
    <GroupedLayer checked name="Inactive cells" group="Discretization">
      <GeoJSON ref={layerRef} data={props.boundingBox.geoJson} />
    </GroupedLayer>
  );
};

export default IBoundLayer;
