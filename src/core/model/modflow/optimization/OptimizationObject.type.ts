import {IObjectPosition} from './ObjectPosition.type';

export interface IMinMaxResult {
    min: number;
    max: number;
    result: null | number;
}

export enum EObjectType {
    WEL = 'wel'
}

export interface IFluxObject {
    [index: string]: IMinMaxResult;
}

export interface IOptimizationObject {
    id: string;
    type: EObjectType;
    position: IObjectPosition;
    flux: IFluxObject;
    meta: {
        name: string;
        numberOfStressPeriods: number;
        substances: any[] // TODO
    };
}
