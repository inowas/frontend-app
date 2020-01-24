import {IOptimizationObject} from './OptimizationObject.type';

interface IMinMaxResult {
    min: number;
    max: number;
    result: null | number;
}

export enum ELocationType {
    BBOX = 'bbox',
    OBJECT = 'object'
}

export interface IOptimizationLocation {
    lay: IMinMaxResult;
    row: IMinMaxResult;
    col: IMinMaxResult;
    type: ELocationType;
    ts: IMinMaxResult;
    objects: IOptimizationObject[];
}
