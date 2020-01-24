import {Collection} from '../../collection/Collection';
import {IOptimizationObject} from './OptimizationObject.type';

class OptimizationObjectsCollection extends Collection<IOptimizationObject> {
    public static fromObject(obj: IOptimizationObject[]) {
        return new OptimizationObjectsCollection(obj);
    }

    public toObject() {
        return this.all;
    }
}

export default OptimizationObjectsCollection;
