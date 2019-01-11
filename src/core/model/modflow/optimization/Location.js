import AbstractPosition from './AbstractPosition';
import OptimizationObjectsCollection from './ObjectsCollection';

class OptimizationLocation extends AbstractPosition {
    _type = 'bbox';
    _ts = {
        min: 0,
        max: 0
    };
    _objects = new OptimizationObjectsCollection();

    static fromObject(obj) {
        const location = new OptimizationLocation();
        location.type = obj.type;
        location.ts = obj.ts;
        location.lay = obj.lay;
        location.row = obj.row;
        location.col = obj.col;
        location.objectsCollection = obj.objects ? OptimizationObjectsCollection.fromArray(obj.objects) : new OptimizationObjectsCollection();
        return location;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value ? value : 'bbox';
    }

    get ts() {
        return this._ts;
    }

    set ts(value) {
        this._ts = value ? value : {min: 0, max: 0, result: null};
    }

    get objectsCollection() {
        return this._objects;
    }

    set objectsCollection(value) {
        if(!(value instanceof OptimizationObjectsCollection)) {
            throw new Error('Value expected to be instance of OptimizationObjectsCollection');
        }
        this._objects = value;
    }

    toObject() {
        return ({
            'type': this.type,
            'ts': this.ts,
            'lay': this.lay,
            'row': this.row,
            'col': this.col,
            'objects': this.objectsCollection.toArray()
        });
    }
}

export default OptimizationLocation;