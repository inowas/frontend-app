import { LatLngExpression } from 'leaflet';
import { RainbowOrLegend } from '../../../services/rainbowvis/types';

export interface IData {
  x: number;
  y: number;
  value: number;
}

export type IReactLeafletHeatMapProps = IOwnProps;

interface IOwnProps {
  nX: number;
  nY: number;
  data: IData[];
  bounds: LatLngExpression[];
  rainbow: RainbowOrLegend;
  rotationAngle?: number;
  rotationCenter?: number[];
  sharpening?: number;
}

export interface IReactLeafletHeatMapClass {
  setNX: (v: number) => any;
  setNY: (v: number) => any;
  setDataArray: (v: IData[]) => any;
  setBounds: (v: LatLngExpression[]) => any;
  setRainbow: (v: RainbowOrLegend) => any;
  setOpacity: (v: number) => any;
  setZIndex: (v: number) => any;
  setSharpening: (v: number) => any;
  setRotationAngle: (v: number) => any;
  setRotationCenter: (v: number[]) => any;
}