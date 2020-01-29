import {IPropertyValueObject} from '../../types';
import {IOptimizationLocation} from './OptimizationLocation.type';

export interface IMinMaxResult extends IPropertyValueObject {
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

export interface IOptimizationObject extends IPropertyValueObject {
    id: string;
    type: EObjectType;
    position: IOptimizationLocation;
    flux: IFluxObject;
    meta: {
        name: string;
        numberOfStressPeriods: number;
        substances: any[] // TODO
    };
}
