import { IReactLeafletHeatMapProps } from './ReactLeafletHeatMapCanvasOverlay.type';
import { createLayerComponent } from '@react-leaflet/core';
import { isEqual } from 'lodash';
import canvasHeatMapOverlay from './leafletCanvasHeatMapOverlay';

const createLayer = (props: IReactLeafletHeatMapProps) => {
  const { data, ...options } = props;
  return canvasHeatMapOverlay(
    props.nX,
    props.nY,
    props.data,
    props.bounds,
    props.rainbow,
    props.rotationAngle,
    props.rotationCenter,
    props.sharpening,
    options
  );
};

const ReactLeafletHeatMapCanvasOverlay = createLayerComponent<any, any>(
  function createElement(props: IReactLeafletHeatMapProps, ctx) {
    const instance = createLayer(props);
    return { instance, context: { ...ctx, overlayContainer: instance } };
  },

  function updateElement(layer: any, props: IReactLeafletHeatMapProps, prevProps: IReactLeafletHeatMapProps) {
    if (!isEqual(props.data, prevProps.data)) {
      layer._update(props);
    }
  }
);

export default ReactLeafletHeatMapCanvasOverlay;
