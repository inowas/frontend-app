import {BoundingBox, GridSize} from '../../../../../core/model/geometry';
import {FeatureGroup, Polyline, Rectangle} from 'react-leaflet';
import {IRowsAndColumns, calculateColumns, calculateRows} from '../../../../../services/geoTools';
import {LeafletMouseEvent} from 'leaflet';
import {createRef, useEffect, useRef, useState} from 'react';
import GridRefinementModal from './gridRefinementModal';

interface IProps {
  boundingBox: BoundingBox;
  gridSize: GridSize;
  onChange: (g?: GridSize) => void;
  selectedRowsAndColumns: IRowsAndColumns | null;
}

const GridRefinement = (props: IProps) => {
  const [columns, setColumns] = useState<Array<[[number, number], [number, number]]>>(calculateColumns(props.boundingBox, props.gridSize));
  const [rows, setRows] = useState<Array<[[number, number], [number, number]]>>(calculateRows(props.boundingBox, props.gridSize));

  useEffect(() => {
    setColumns(calculateColumns(props.boundingBox, props.gridSize));
    setRows(calculateRows(props.boundingBox, props.gridSize))
  }, [props.boundingBox, props.gridSize]);

  const columnRef = useRef<any>(calculateColumns(props.boundingBox, props.gridSize).map(() => createRef()));
  const rowsRef = useRef<any>(calculateRows(props.boundingBox, props.gridSize).map(() => createRef()));

  const handleCancelModal = () => props.onChange();

  const handleChangeModal = (g: GridSize) => props.onChange(g);

  const handleClickCell = (e: LeafletMouseEvent) => {
    console.log(e);
  };

  const handleClickPolyline = (k: number) => (e: any) => {
    if (k < 1 || k >= props.gridSize.nX) {
      return null;
    }
    console.log(e)
  };

  const handleHoverColumn = (k: number, weight: number, color: string) => () => {
    if (k < 1 || k >= props.gridSize.nX) {
      return null;
    }
    columnRef.current[k].current.leafletElement.setStyle({color, weight});
  };

  const handleHoverRow = (k: number, weight: number, color: string) => () => {
    if (k < 1 || k >= props.gridSize.nY) {
      return null;
    }
    rowsRef.current[k].current.leafletElement.setStyle({color, weight});
  };

  return (
    <FeatureGroup>
      <Rectangle
        bounds={props.boundingBox.getBoundsLatLng()}
        interactive={true}
        onclick={handleClickCell}
        fillOpacity={0}
        stroke={false}
      />
      {columns && columns.map((c, k) =>
        <Polyline
          color="#000000"
          interactive={true}
          key={`columns_${k}`}
          onClick={handleClickPolyline(k)}
          onmouseover={handleHoverColumn(k, 3, 'red')}
          onmouseout={handleHoverColumn(k, 2, 'black')}
          positions={c}
          ref={columnRef.current[k]}
          weight={2}
        />
      )}
      {rows && rows.map((r, k) =>
        <Polyline
          color="#000000"
          interactive={true}
          key={`rows_${k}`}
          onClick={handleClickPolyline(k)}
          onmouseover={handleHoverRow(k, 3, 'red')}
          onmouseout={handleHoverRow(k, 2, 'black')}
          positions={r}
          ref={rowsRef.current[k]}
          weight={2}
        />
      )}
      {(props.selectedRowsAndColumns && (props.selectedRowsAndColumns.rows.length > 0 ||
        props.selectedRowsAndColumns.columns.length > 0)) &&
      <GridRefinementModal
        gridSize={props.gridSize}
        onCancel={handleCancelModal}
        onChange={handleChangeModal}
        selectedColumns={props.selectedRowsAndColumns.columnKeys}
        selectedRows={props.selectedRowsAndColumns.rowKeys}
      />}
    </FeatureGroup>
  );
};

export default GridRefinement;
