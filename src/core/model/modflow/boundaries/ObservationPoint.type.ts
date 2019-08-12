import {Point} from 'geojson';
import {ISpValues} from './Boundary.type';

export interface IObservationPoint {
    type: 'Feature';
    id: string;
    geometry: Point;
    properties: {
        name: string
        sp_values: ISpValues;
        type: 'op';
        distance: number;
    };
}
