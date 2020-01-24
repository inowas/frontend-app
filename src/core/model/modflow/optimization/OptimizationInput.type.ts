import {IOptimizationConstraint} from './OptimizationConstraint.type';
import {IOptimizationObject} from './OptimizationObject.type';
import {IOptimizationObjective} from './OptimizationObjective.type';
import {IOptimizationParameters} from './OptimizationParameters.type';

export interface IOptimizationInput {
    id: string;
    constraints: IOptimizationConstraint[];
    objectives: IOptimizationObjective[];
    objects: IOptimizationObject[];
    parameters: IOptimizationParameters;
}
