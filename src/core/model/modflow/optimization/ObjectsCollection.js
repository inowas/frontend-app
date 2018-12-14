import OptimizationObject from './Object';
import AbstractCollection from '../../AbstractCollection';

class OptimizationObjectsCollection extends AbstractCollection {
    static fromArray(array) {
        const objectsCollection = new OptimizationObjectsCollection();
        objectsCollection.items = array.map(object => OptimizationObject.fromObject(object));
        return objectsCollection;
    }

    get objects() {
        return this._items;
    }

    set objects(value) {
        this._items = value || [];
    }

    toArray() {
        return (this.all.map(object => object.toObject()));
    }

    checkInput (object) {
        if (!(object instanceof OptimizationObject)) {
            throw new Error('The object is not of type OptimizationObject.');
        }
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