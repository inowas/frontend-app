import {IOptimizationInput} from './OptimizationInput.type';
import {IOptimizationMethod} from './OptimizationMethod.type';

export interface IOptimization {
    input: IOptimizationInput;
    state: number;
    methods: IOptimizationMethod[];
}
