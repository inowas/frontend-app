import {Collection} from '../../collection/Collection';
import {IOptimizationObjective} from './OptimizationObjective.type';

class OptimizationObjectivesCollection extends Collection<IOptimizationObjective> {
    public static fromObject(obj: IOptimizationObjective[]) {
        return new OptimizationObjectivesCollection(obj);
    }

    public toObject() {
        return this.all;
    }
}

export default OptimizationObjectivesCollection;
