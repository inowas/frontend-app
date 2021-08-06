import { BasicTileLayer } from '../../../services/geoTools/tileLayers';
import { BoundaryCollection, ModflowModel } from '../../../core/model/modflow';
import { FeatureGroup, LayersControl, MapContainer, Rectangle } from 'react-leaflet';
import { ICell } from '../../../core/model/geometry/Cells.type';
import { LeafletMouseEvent } from 'leaflet';
import { getActiveCellFromCoordinate } from '../../../services/geoTools';
import { renderAreaLayer, renderBoundaryOverlays, renderBoundingBoxLayer } from '../../t03/components/maps/mapLayers';
import { useRef } from 'react';
import CenterControl from '../../shared/leaflet/CenterControl';

interface IProps {
  activeCell: ICell;
  boundaries: BoundaryCollection;
  model: ModflowModel;
  onClick: (colRow: ICell) => any;
}

const TimeSeriesMap = (props: IProps) => {
  const mapRef = useRef<any>(null);

  const style = {
    map: {
      height: '400px',
      width: '100%',
      cursor: 'pointer'
    },
    selectedRow: {
      color: '#000',
      weight: 0.5,
      opacity: 0.5,
      fillColor: '#000',
      fillOpacity: 0.5
    },
    selectedCol: {
      color: '#000',
      weight: 0.5,
      opacity: 0.5,
      fillColor: '#000',
      fillOpacity: 0.5
    }
  };

  const handleClickOnMap = ({ latlng }: LeafletMouseEvent) => {
    const x = latlng.lng;
    const y = latlng.lat;
    const activeCell = getActiveCellFromCoordinate([x, y], props.model.boundingBox, props.model.gridSize);

    if (!props.model.gridSize.isWithIn(activeCell[0], activeCell[1])) {
      return;
    }

    props.onClick(activeCell);
  };

  const renderSelectedRowAndCol = () => {
    const [selectedCol, selectedRow] = props.activeCell;

    const dX = props.model.boundingBox.dX / props.model.gridSize.nX;
    const dY = props.model.boundingBox.dY / props.model.gridSize.nY;

    const selectedRowBoundsLatLng: Array<[number, number]> = [
      [props.model.boundingBox.yMax - selectedRow * dY, props.model.boundingBox.xMin],
      [props.model.boundingBox.yMax - (selectedRow + 1) * dY, props.model.boundingBox.xMax]
    ];

    const selectedColBoundsLatLng: Array<[number, number]> = [
      [props.model.boundingBox.yMin, props.model.boundingBox.xMin + selectedCol * dX],
      [props.model.boundingBox.yMax, props.model.boundingBox.xMin + (selectedCol + 1) * dX]
    ];

    return (
      <FeatureGroup>
        <Rectangle
          bounds={selectedColBoundsLatLng}
          color={style.selectedCol.color}
          weight={style.selectedCol.weight}
          opacity={style.selectedCol.opacity}
          fillColor={style.selectedCol.fillColor}
          fillOpacity={style.selectedCol.fillOpacity}
        />
        <Rectangle
          bounds={selectedRowBoundsLatLng}
          color={style.selectedRow.color}
          weight={style.selectedRow.weight}
          opacity={style.selectedRow.opacity}
          fillColor={style.selectedRow.fillColor}
          fillOpacity={style.selectedRow.fillOpacity}
        />
      </FeatureGroup>
    );
  };

  return (
    <MapContainer
      style={style.map}
      bounds={props.model.boundingBox.getBoundsLatLng()}
      onclick={handleClickOnMap}
      ref={mapRef}
    >
      {mapRef && mapRef.current &&
        <CenterControl
          map={mapRef.current}
          bounds={props.model.boundingBox.getBoundsLatLng()}
        />
      }
      <BasicTileLayer />
      <LayersControl position="topright">
        {renderBoundaryOverlays(props.boundaries)}
      </LayersControl>
      {renderBoundingBoxLayer(props.model.boundingBox, props.model.rotation, props.model.geometry)}
      {renderAreaLayer(props.model.geometry)}
      {renderSelectedRowAndCol()}
    </MapContainer>
  );
};

export default TimeSeriesMap;
