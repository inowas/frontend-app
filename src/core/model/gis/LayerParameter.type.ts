import {Array2D} from '../geometry/Array2D.type';

export interface ILayerParameter {
    id: string;
    value: number | Array2D<number>;
}
