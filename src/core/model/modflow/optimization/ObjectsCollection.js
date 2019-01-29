import OptimizationObject from './Object';
import AbstractCollection from '../../collection/AbstractCollection';

class OptimizationObjectsCollection extends AbstractCollection {
    static fromArray(array) {
        const oc = new OptimizationObjectsCollection();
        oc.items = array.map(object => OptimizationObject.fromObject(object));
        return oc;
    }

    validateInput(object) {
        if (!(object instanceof OptimizationObject)) {
            throw new Error('The object is not of type OptimizationObject.');
        }
        return object;
    }
}

export default OptimizationObjectsCollection;