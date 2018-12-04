import uuidv4 from 'uuid/v4';
import CriteriaRelation from "./CriteriaRelation";

class Weight {
    _id = uuidv4();
    _method = 'ranking';
    _relations = [];
    _rank = 0;
    _value = 0;

    static fromMethod(method) {
        const weight = new Weight();
        weight.method = method;
        return weight;
    }

    static fromObject(obj) {
        const weight = new Weight();
        weight.id = obj.id;
        weight.method = obj.method;
        weight.relations = obj.relations.map(r => CriteriaRelation.fromObject(r));
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

    get method() {
        return this._method;
    }

    set method(value) {
        this._method = value;
    }

    get relations() {
        return this._relations;
    }

    set relations(value) {
        this._relations = value ? value : [];
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
            method: this.method,
            relations: this.relations.map(r => r.toObject),
            rank: this.rank,
            value: this.value
        });
    }
}

export default Weight;