import {IOptimizationObject} from './OptimizationObject.type';

export interface IOptimizationSolution {
    id: string;
    fitness: number[];
    variables: number[];
    objects: IOptimizationObject[];
}
