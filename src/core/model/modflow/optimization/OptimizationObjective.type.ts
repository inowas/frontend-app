import {EConstraintType} from './OptimizationConstraint.type';
import {IOptimizationLocation} from './OptimizationLocation.type';
import {IPropertyValueObject} from "../../types";

export enum ESummaryMethod {
    MEAN = 'mean'
}

export interface IOptimizationObjective extends IPropertyValueObject {
    id: string;
    name: string;
    type: EConstraintType;
    concFileName: string;
    summaryMethod: ESummaryMethod;
    weight: number;
    penaltyValue: number;
    target: number | null;
    location: IOptimizationLocation;
    location1: IOptimizationLocation;
    location2: IOptimizationLocation;
}
