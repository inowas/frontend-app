import {Collection} from '../../collection/Collection';
import {IOptimizationSolution} from './OptimizationSolution.type';

class OptimizationSolutionsCollection extends Collection<IOptimizationSolution> {
    public static fromObject(obj: IOptimizationSolution[]) {
        return new OptimizationSolutionsCollection(obj);
    }

    public toObject() {
        return this.all;
    }
}

export default OptimizationSolutionsCollection;
