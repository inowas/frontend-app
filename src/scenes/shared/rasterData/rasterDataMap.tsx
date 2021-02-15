import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {BasicTileLayer} from '../../../services/geoTools/tileLayers';
import {Children, GeoJSON, LayersControl} from 'react-leaflet';
import {ILegendItem} from '../../../services/rainbowvis/types';
import {LeafletMouseEvent} from 'leaflet';
import {ModflowModel} from '../../../core/model/modflow';
import {max, min} from './helpers';
import {rainbowFactory} from '../../../services/rainbowvis/helpers';
import {renderBoundaryOverlays, renderBoundingBoxLayer, renderContourLayer} from '../../t03/components/maps/mapLayers';
import BoundaryCollection from '../../../core/model/modflow/boundaries/BoundaryCollection';
import ColorLegend from './ColorLegend';
import CustomMap from './CustomMap';
import Rainbow from '../../../services/rainbowvis/Rainbowvis';
import React from 'react';
import {GeoJson} from "../../../core/model/geometry/Geometry.type";

const styles = {
  map: {
    minHeight: 400,
    zIndex: 1
  }
};

const renderLegend = (rainbow: Rainbow, unit = '') => {
  const gradients = rainbow.gradients.slice().reverse();
  const lastGradient = gradients[gradients.length - 1];
  const legend: ILegendItem[] = gradients.map((gradient) => ({
    color: '#' + gradient.endColor,
    value: Number(gradient.maxNum).toExponential(2)
  }));

  legend.push({
    color: '#' + lastGradient.startColor,
    value: Number(lastGradient.minNum).toExponential(2)
  });

  return <ColorLegend legend={legend} unit={unit}/>;
};

interface IProps {
  boundaries?: BoundaryCollection;
  children?: Children;
  data: number | Array2D<number>;
  model: ModflowModel;
  onClickCell?: (latlng: [number, number]) => void;
  unit: string;
  zones?: Array<{
    color: string;
    geometry: GeoJson;
    name: string;
  }>
}

const RasterDataMap = (props: IProps) => {
  const {children, model, data, unit} = props;
  const rainbowVis = rainbowFactory({min: min(data), max: max(data)});

  const handleClickCell = (e: LeafletMouseEvent) => {
    if (props.onClickCell) {
      props.onClickCell([e.latlng.lng, e.latlng.lat]);
    }
  };

  return (
    <CustomMap
      style={styles.map}
      zoomControl={false}
      bounds={model.boundingBox.getBoundsLatLng()}
      onclick={props.onClickCell ? handleClickCell : undefined}
    >
      <BasicTileLayer/>
      {renderBoundingBoxLayer(model.boundingBox, model.rotation, model.geometry)}
      {props.boundaries && props.boundaries.length > 0 &&
      <LayersControl position="topright">
        {renderBoundaryOverlays(props.boundaries)}

      </LayersControl>
      }
      {props.zones &&
      <LayersControl position="topright">
        {props.zones.map((r, k) => (
          <LayersControl.Overlay name={r.name} checked={true}>
            <GeoJSON
              key={k}
              data={r.geometry}
              style={{
                color: r.color,
                fill: false,
                stroke: true
              }}
              priority={90}
            />
          </LayersControl.Overlay>
        ))}
      </LayersControl>
      }

      {renderContourLayer({model, data, rainbow: rainbowVis, steps: 0})}

      {children}
      {renderLegend(rainbowVis, unit)}
    </CustomMap>
  );
};

export default RasterDataMap;
