import uuidv4 from 'uuid/v4';
import WeightsCollection from './WeightsCollection';

class WeightAssignment {
    _id = uuidv4();
    _method = 'ranking';
    _name = 'New Weight Assignment';
    _weights = new WeightsCollection();

    static fromObject(obj) {
        const wa = new WeightAssignment();
        wa.id = obj.id;
        wa.method = obj.method;
        wa.name = obj.name;
        wa.weights = WeightsCollection.fromArray(obj.weights);
        return wa;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value ? value : uuidv4();
    }

    get method() {
        return this._method;
    }

    set method(value) {
        this._method = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get weights() {
        return this._weights;
    }

    set weights(value) {
        this._weights = value;
    }

    toObject() {
        return ({
            id: this.id,
            method: this.method,
            name: this.name,
            weights: this.weights.toArray()
        });
    }
}

export default WeightAssignment;