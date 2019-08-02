import {LatLngExpression} from 'leaflet';
import {Cell} from '../geometry/types';
import {IRasterParameter} from './RasterParameter.type';

export interface IZone {
    id: string;
    name: string;
    geometry: LatLngExpression[] | LatLngExpression[][] | null;
    cells: Cell[];
    priority: number;
    parameters: IRasterParameter[];
}
