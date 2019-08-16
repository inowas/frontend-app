import {MapComponentProps} from 'react-leaflet';
import {IBoundingBox} from '../../../core/model/geometry/BoundingBox.type';

interface IData {
    x: number;
    y: number;
    value: number;
}

export interface IReactLeafletHeatMapCanvasOverlay extends MapComponentProps {
    nX: number;
    nY: number;
    dataArray: IData[];
    bounds: IBoundingBox;
    opacity: number;
    rainbow: any;
    sharpening: number;
    zIndex: number;
}
