import OptimizationObject from './Object';
import AbstractCollection from '../../AbstractCollection';

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

    // TODO: maybe set stress periods in collection and not in single objects
    setNumberOfStressPeriods = (number) => {
        this._objects = this.all.map(object => {
            return {
                ...object,
                numberOfStressPeriods: number
            }
        })
    }
}

export default OptimizationObjectsCollection;