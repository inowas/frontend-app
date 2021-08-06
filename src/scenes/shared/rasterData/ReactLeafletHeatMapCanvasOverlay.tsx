import {IReactLeafletHeatMapProps} from './ReactLeafletHeatMapCanvasOverlay.type';
import {useEffect} from 'react';
import {useMap} from 'react-leaflet';
import canvasHeatMapOverlay from './leafletCanvasHeatMapOverlay';

const ReactLeafletHeatMapCanvasOverlay = (props: IReactLeafletHeatMapProps) => {
  const map = useMap();

  useEffect(() => {
    const {data, ...options} = props;

    const layer = canvasHeatMapOverlay(props.nX, props.nY, props.data, props.bounds, props.rainbow, props.rotationAngle,
      props.rotationCenter, props.sharpening, options);
    map.addLayer(layer);
    return () => {
      map.removeLayer(layer);
    };
  }, [map, props]);

  return null;
}

export default ReactLeafletHeatMapCanvasOverlay;
