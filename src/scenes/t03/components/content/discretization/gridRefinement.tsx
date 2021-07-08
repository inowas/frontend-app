import {BoundingBox, GridSize} from '../../../../../core/model/geometry';
import {FeatureGroup, Polygon, Rectangle} from 'react-leaflet';
import {IBoundingBox} from '../../../../../core/model/geometry/BoundingBox.type';
import {IRowsAndColumns, calculateColumns, calculateRows} from '../../../../../services/geoTools';
import {createRef, useEffect, useRef, useState} from 'react';

interface IProps {
  boundingBox: BoundingBox;
  gridSize: GridSize;
  onChange: (g?: GridSize) => void;
  selectedRowsAndColumns: IRowsAndColumns | null;
}

const GridRefinement = (props: IProps) => {
  const [columns, setColumns] = useState<IBoundingBox[]>(calculateColumns(props.boundingBox, props.gridSize).map((b) => b.toObject()));
  const [rows, setRows] = useState<IBoundingBox[]>(calculateRows(props.boundingBox, props.gridSize).map((b) => b.toObject()));

  useEffect(() => {
    setColumns(calculateColumns(props.boundingBox, props.gridSize).map((b) => b.toObject()));
    setRows(calculateRows(props.boundingBox, props.gridSize).map((b) => b.toObject()))
  }, [props.boundingBox, props.gridSize]);


  const columnRef = useRef<any>(calculateColumns(props.boundingBox, props.gridSize).map(() => createRef()));
  const rowsRef = useRef<any>(calculateRows(props.boundingBox, props.gridSize).map(() => createRef()));

  const handleClickPolyline = (k: number) => (e: any) => {
    if (k < 1 || k >= props.gridSize.nX) {
      return null;
    }
    console.log(e)
  };

  return (
    <FeatureGroup>
      {columns && columns.map((c, k) =>
        <Polygon
          color="#000000"
          fill={props.selectedRowsAndColumns ? props.selectedRowsAndColumns.columnKeys.includes(k) : false}
          fillColor="blue"
          key={`columns_${k}`}
          onClick={handleClickPolyline(k)}
          positions={BoundingBox.fromObject(c).getCornersLatLng()}
          ref={columnRef.current[k]}
          weight={1}
        />
      )}
      {rows && rows.map((r, k) =>
        <Polygon
          color="#000000"
          fill={props.selectedRowsAndColumns ? props.selectedRowsAndColumns.rowKeys.includes(k) : false}
          fillColor="blue"
          key={`rows_${k}`}
          onClick={handleClickPolyline(k)}
          positions={BoundingBox.fromObject(r).getCornersLatLng()}
          ref={rowsRef.current[k]}
          weight={1}
        />
      )}

    </FeatureGroup>
  );
};

export default GridRefinement;
