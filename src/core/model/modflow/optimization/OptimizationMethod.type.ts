import {IOptimizationProgress} from './OptimizationProgress.type';
import {IOptimizationSolution} from './OptimizationSolution.type';

export interface IOptimizationMethod {
    name: string;
    solutions: IOptimizationSolution[];
    progress: IOptimizationProgress | null;
}
