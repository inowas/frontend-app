import { BoundingBox, Geometry, GridSize } from '../../../../../core/model/geometry';
import { FeatureGroup, GeoJSON } from 'react-leaflet';
import {
  IBoundingBoxWithDist,
  IRowsAndColumns,
  calculateColumns,
  calculateRows,
} from '../../../../../services/geoTools';
import { useEffect, useState } from 'react';
import md5 from 'md5';

interface IProps {
  boundingBox: BoundingBox;
  geometry?: Geometry;
  gridSize: GridSize;
  rotation?: number;
  selectedRowsAndColumns: IRowsAndColumns | null;
}

const GridRefinement = (props: IProps) => {
  const [columns, setColumns] = useState<IBoundingBoxWithDist[]>(
    calculateColumns(props.boundingBox, props.gridSize).map((b) => b)
  );
  const [rows, setRows] = useState<IBoundingBoxWithDist[]>(
    calculateRows(props.boundingBox, props.gridSize).map((b) => b)
  );
  //TODO: const [renderKey, setRenderKey] = useState<string>(uuid.v4());

  useEffect(() => {
    setColumns(calculateColumns(props.boundingBox, props.gridSize).map((b) => b));
    setRows(calculateRows(props.boundingBox, props.gridSize).map((b) => b));
    //setRenderKey(uuid.v4());
  }, [props.boundingBox, props.gridSize]);

  const renderGeoJSON = (p: IBoundingBoxWithDist) => {
    const data =
      props.geometry && props.rotation
        ? BoundingBox.fromObject(p.boundingBox).geoJsonWithRotation(props.rotation, props.geometry.centerOfMass)
        : BoundingBox.fromObject(p.boundingBox).geoJson;

    return (
      <GeoJSON
        key={md5(JSON.stringify(data))}
        data={data}
        style={{
          color: '#000000',
          fill: props.selectedRowsAndColumns ? props.selectedRowsAndColumns.columns.includes(p.dist) : false,
          fillColor: 'blue',
          weight: 1,
        }}
      />
    );
  };

  return (
    <FeatureGroup>
      {columns && columns.map((c) => renderGeoJSON(c))}
      {rows && rows.map((r) => renderGeoJSON(r))}
    </FeatureGroup>
  );
};

export default GridRefinement;
