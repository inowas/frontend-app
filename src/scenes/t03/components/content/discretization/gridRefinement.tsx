import {BoundingBox, GridSize} from '../../../../../core/model/geometry';
import {FeatureGroup, Polygon,} from 'react-leaflet';
import {IBoundingBoxWithDist, IRowsAndColumns, calculateColumns, calculateRows} from '../../../../../services/geoTools';
import {useEffect, useState} from 'react';

interface IProps {
  boundingBox: BoundingBox;
  gridSize: GridSize;
  selectedRowsAndColumns: IRowsAndColumns | null;
}

const GridRefinement = (props: IProps) => {
  const [columns, setColumns] = useState<IBoundingBoxWithDist[]>(calculateColumns(props.boundingBox, props.gridSize).map((b) => b));
  const [rows, setRows] = useState<IBoundingBoxWithDist[]>(calculateRows(props.boundingBox, props.gridSize).map((b) => b));

  useEffect(() => {
    setColumns(calculateColumns(props.boundingBox, props.gridSize).map((b) => b));
    setRows(calculateRows(props.boundingBox, props.gridSize).map((b) => b))
  }, [props.boundingBox, props.gridSize]);

  return (
    <FeatureGroup>
      {columns && columns.map((c) =>
        <Polygon
          color="#000000"
          fill={props.selectedRowsAndColumns ? props.selectedRowsAndColumns.columns.includes(c.dist) : false}
          fillColor="blue"
          key={`columns_${c.dist}`}
          positions={BoundingBox.fromObject(c.boundingBox).getCornersLatLng()}
          weight={1}
        />
      )}
      {rows && rows.map((r) =>
        <Polygon
          color="#000000"
          interactive={true}
          fill={props.selectedRowsAndColumns ? props.selectedRowsAndColumns.rows.includes(r.dist) : false}
          fillColor="red"
          key={`rows_${r.dist}`}
          positions={BoundingBox.fromObject(r.boundingBox).getCornersLatLng()}
          weight={1}
        />
      )}

    </FeatureGroup>
  );
}

export default GridRefinement;
