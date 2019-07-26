import {Point} from '../geometry/types';

export interface ISensor {
    id: string;
    name: string;
    description: string;
    geolocation: Point | null;
    dataQuery: string | null;
}
