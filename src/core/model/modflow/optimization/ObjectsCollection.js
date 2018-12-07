import OptimizationObject from './Object';
import Collection from './Collections';

class OptimizationObjectsCollection extends Collection {
    static fromObject(obj) {
        const objectsCollection = new OptimizationObjectsCollection();
        objectsCollection.items = obj.objects.map(object => OptimizationObject.fromObject(object));
        return objectsCollection;
    }

    get objects() {
        return this._items;
    }

    set objects(value) {
        this._items = value || [];
    }

    get toObject() {
        return ({
            'objects': this.objects.map(object => object.toObject)
        });
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