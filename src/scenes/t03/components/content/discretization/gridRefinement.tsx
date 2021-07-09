import {BoundingBox, Geometry, GridSize} from '../../../../../core/model/geometry';
import {FeatureGroup, GeoJSON} from 'react-leaflet';
import {IBoundingBoxWithDist, IRowsAndColumns, calculateColumns, calculateRows} from '../../../../../services/geoTools';
import {useEffect, useState} from 'react';
import uuid from 'uuid';

interface IProps {
  boundingBox: BoundingBox;
  geometry?: Geometry;
  gridSize: GridSize;
  rotation?: number;
  selectedRowsAndColumns: IRowsAndColumns | null;
}

const GridRefinement = (props: IProps) => {
  const [columns, setColumns] = useState<IBoundingBoxWithDist[]>(calculateColumns(props.boundingBox, props.gridSize).map((b) => b));
  const [rows, setRows] = useState<IBoundingBoxWithDist[]>(calculateRows(props.boundingBox, props.gridSize).map((b) => b));
  const [renderKey, setRenderKey] = useState<string>(uuid.v4());

  useEffect(() => {
    setColumns(calculateColumns(props.boundingBox, props.gridSize).map((b) => b));
    setRows(calculateRows(props.boundingBox, props.gridSize).map((b) => b))
    setRenderKey(uuid.v4());
  }, [props.boundingBox, props.gridSize]);

  return (
    <FeatureGroup key={renderKey}>
      {columns && columns.map((c) =>
        <GeoJSON
          color="#000000"
          fill={props.selectedRowsAndColumns ? props.selectedRowsAndColumns.columns.includes(c.dist) : false}
          fillColor="blue"
          key={`columns_${c.dist}`}
          data={props.geometry && props.rotation ?
            BoundingBox.fromObject(c.boundingBox).geoJsonWithRotation(props.rotation, props.geometry.centerOfMass) :
            BoundingBox.fromObject(c.boundingBox).geoJson}
          weight={1}
        />
      )}
      {rows && rows.map((r) =>
        <GeoJSON
          color="#000000"
          fill={props.selectedRowsAndColumns ? props.selectedRowsAndColumns.rows.includes(r.dist) : false}
          fillColor="red"
          key={`rows_${r.dist}`}
          data={props.geometry && props.rotation ?
            BoundingBox.fromObject(r.boundingBox).geoJsonWithRotation(props.rotation, props.geometry.centerOfMass) :
            BoundingBox.fromObject(r.boundingBox).geoJson}
          weight={1}
        />
      )}

    </FeatureGroup>
  );
}

export default GridRefinement;
