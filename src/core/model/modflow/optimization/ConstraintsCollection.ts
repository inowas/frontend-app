import {Collection} from '../../collection/Collection';
import {IOptimizationConstraint} from './OptimizationConstraint.type';

class OptimizationConstraintsCollection extends Collection<IOptimizationConstraint> {
    public static fromObject(obj: IOptimizationConstraint[]) {
        return new OptimizationConstraintsCollection(obj);
    }

    public toObject() {
        return this.all;
    }
}

export default OptimizationConstraintsCollection;
