import {Array2D} from '../geometry/Array2D.type';

export interface IRasterParameter {
    id: string;
    defaultValue: number;
    isActive: boolean;
    name: string;
    unit: string;
    value: number | Array2D<number>;
    title: string;
}
