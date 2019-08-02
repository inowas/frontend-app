import {Point} from '../geometry/Cells.type';

export interface ISensor {
    id: string;
    name: string;
    description: string;
    geolocation: Point | null;
    dataQuery: string | null;
}
