import uuidv4 from 'uuid/v4';
import Criteria from './Criteria';

class Weight {
    _id = uuidv4();
    _criteria = null;
    _method = 'ranking';
    _rank = 0;
    _value = 0;

    static fromObject(obj) {
        const weight = new Weight();
        weight.id = obj.id;
        weight.criteria = Criteria.fromObject(obj.criteria);
        weight.method = obj.method;
        weight.rank = obj.rank;
        weight.value = obj.value;
        return weight;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value ? value : uuidv4();
    }

    get criteria() {
        return this._criteria;
    }

    set criteria(value) {
        this._criteria = value;
    }

    get method() {
        return this._method;
    }

    set method(value) {
        this._method = value;
    }

    get rank() {
        return this._rank;
    }

    set rank(value) {
        this._rank = value ? value : 0;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value ? parseFloat(value) : 0;
    }

    get toObject() {
        return ({
            id: this.id,
            criteria: this.criteria.toObject,
            method: this.method,
            rank: this.rank,
            value: this.value
        });
    }
}

export default Weight;