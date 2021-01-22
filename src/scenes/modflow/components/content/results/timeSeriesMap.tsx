import {Array2D} from '../../../../../core/model/geometry/Array2D.type';
import {BasicTileLayer} from '../../../../../services/geoTools/tileLayers';
import {BoundaryCollection, ModflowModel} from '../../../../../core/model/modflow';
import {FullscreenControl} from '../../../../shared/complexTools';
import {LayersControl, Map, Rectangle} from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet';
import { misc } from '../../../defaults/colorScales';
import {
  renderAreaLayer,
  renderBoundaryOverlays,
  renderBoundingBoxLayer
} from '../../../../t03/components/maps/mapLayers';
import React from 'react';

const style = {
  map: {
    height: '400px',
    width: '100%',
    cursor: 'pointer'
  }
};

interface IProps {
  boundaries: BoundaryCollection;
  model: ModflowModel;
  onClick: (latlng: [number, number]) => void;
  selectedCells: Array<[number, number, Array2D<number>]>;
}

const TimeSeriesMap = (props: IProps) => {
  const handleClickCell = (e: LeafletMouseEvent) => {
    props.onClick([e.latlng.lng, e.latlng.lat]);
  };

  const renderCell = (c: [number, number, Array2D<number>], key: number) => {

    const xMin = props.model.boundingBox.xMin + (c[0] * props.model.boundingBox.dX / props.model.gridSize.nX);
    const xMax = props.model.boundingBox.xMin + ((c[0] + 1) * props.model.boundingBox.dX / props.model.gridSize.nX);
    const yMin = props.model.boundingBox.yMax - (c[1] * props.model.boundingBox.dY / props.model.gridSize.nY);
    const yMax = props.model.boundingBox.yMax - ((c[1] + 1) * props.model.boundingBox.dY / props.model.gridSize.nY);

    return (
      <Rectangle
        bounds={[[yMin, xMin], [yMax, xMax]]}
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
      boundsOptions={{padding: [20, 20]}}
    >
      <BasicTileLayer/>
      <FullscreenControl position="topright"/>
      <LayersControl position="topright">
        <LayersControl.Overlay name="Model area" checked={true}>
          {renderAreaLayer(props.model.geometry)}
        </LayersControl.Overlay>
        {renderBoundingBoxLayer(props.model.boundingBox, props.model.rotation, props.model.geometry)}
        {renderBoundaryOverlays(props.boundaries)}
        {props.selectedCells.map((c, key) => renderCell(c, key))}
      </LayersControl>
    </Map>
  );
};

export default TimeSeriesMap;
