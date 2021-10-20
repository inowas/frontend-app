import { Array2D } from '../../../../../core/model/geometry/Array2D.type';
import { BasicTileLayer } from '../../../../../services/geoTools/tileLayers';
import { BoundaryCollection, ModflowModel } from '../../../../../core/model/modflow';
import { EBoundaryType } from '../../../../../core/model/modflow/boundaries/Boundary.type';
import { FullscreenControl } from '../../../../shared/complexTools';
import { LayersControl, Map, Rectangle } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { getCellFromClick } from '../../../../../services/geoTools/getCellFromClick';
import { misc } from '../../../defaults/colorScales';
import {
  renderAreaLayer,
  renderBoundaryOverlay,
  renderBoundaryOverlays,
  renderBoundingBoxLayer,
} from '../../../../t03/components/maps/mapLayers';

const style = {
  map: {
    height: '400px',
    width: '100%',
    cursor: 'pointer',
  },
};

interface IProps {
  headObservationWells: BoundaryCollection;
  boundaries: BoundaryCollection;
  model: ModflowModel;
  onClick: (latlng: [number, number]) => void;
  selectedCells: Array<[number, number, Array2D<number>]>;
}

const TimeSeriesMap = (props: IProps) => {
  const handleClickCell = ({ latlng }: LeafletMouseEvent) => {
    if (
      latlng.lat > props.model.boundingBox.yMax ||
      latlng.lat < props.model.boundingBox.yMin ||
      latlng.lng > props.model.boundingBox.xMax ||
      latlng.lng < props.model.boundingBox.xMin
    ) {
      return null;
    }

    const activeCell = getCellFromClick(
      props.model.boundingBox,
      props.model.gridSize,
      latlng,
      props.model.rotation,
      props.model.geometry.centerOfMass
    );

    if (!props.model.gridSize.isWithIn(activeCell[0], activeCell[1])) {
      return;
    }

    props.onClick(activeCell);
  };

  const renderCell = (c: [number, number, Array2D<number>], key: number) => {
    const { boundingBox, gridSize } = props.model;
    const xMin = boundingBox.xMin + gridSize.getDistanceXStart(c[1]) * boundingBox.dX;
    const xMax = boundingBox.xMin + gridSize.getDistanceXEnd(c[1]) * boundingBox.dX;
    const yMin = boundingBox.yMax - gridSize.getDistanceYStart(c[0]) * boundingBox.dY;
    const yMax = boundingBox.yMax - gridSize.getDistanceYEnd(c[0]) * boundingBox.dY;

    return (
      <Rectangle
        bounds={[
          [yMin, xMin],
          [yMax, xMax],
        ]}
        color={key < misc.length ? misc[key] : misc[misc.length - 1]}
        key={key}
      />
    );
  };

  return (
    <Map
      style={style.map}
      bounds={props.model.geometry.getBoundsLatLng()}
      onclick={handleClickCell}
      boundsOptions={{ padding: [20, 20] }}
    >
      <BasicTileLayer />
      <FullscreenControl position="topright" />
      <LayersControl position="topright">
        <LayersControl.Overlay name="Model area" checked={true}>
          {renderAreaLayer(props.model.geometry)}
        </LayersControl.Overlay>
        {renderBoundingBoxLayer(props.model.boundingBox, props.model.rotation, props.model.geometry)}
        {renderBoundaryOverlays(props.boundaries)}
        {props.headObservationWells.length > 0 &&
          renderBoundaryOverlay(props.headObservationWells, 'Active HOB', EBoundaryType.HOB, true)}
        {props.selectedCells.map((c, key) => renderCell(c, key))}
      </LayersControl>
    </Map>
  );
};

export default TimeSeriesMap;
