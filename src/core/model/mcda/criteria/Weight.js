import uuidv4 from 'uuid/v4';
import Criteria from './Criterion';
import CriteriaRelation from './CriteriaRelation';

class Weight {
    _id = uuidv4();
    _criterion = null;
    _initialValue = 0;
    _relations = [];
    _value = 0;

    static fromObject(obj) {
        const weight = new Weight();
        weight.id = obj.id;
        weight.criterion = Criteria.fromObject(obj.criterion);
        weight.initialValue = obj.initialValue;
        weight.relations = obj.relations.map(r => CriteriaRelation.fromObject(r));
        weight.value = obj.value;
        return weight;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value ? value : uuidv4();
    }

    get initialValue() {
        return this._initialValue;
    }

    set initialValue(value) {
        this._initialValue = !isNaN(value) ? parseFloat(value) : 0;
    }

    get criterion() {
        return this._criterion;
    }

    set criterion(value) {
        this._criterion = value;
    }

    get relations() {
        return this._relations;
    }

    set relations(value) {
        this._relations = value || [];
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value ? parseFloat(value) : 0;
    }

    toObject() {
        return ({
            id: this.id,
            initialValue: this.initialValue,
            criterion: this.criterion.toObject(),
            relations: this.relations.map(r => r.toObject()),
            value: this.value
        });
    }

    addRelation(relation) {
        if (!(relation instanceof CriteriaRelation)) {
            throw new Error('Relation expected to be of type CriteriaRelation.');
        }

        this._relations.push(relation);
    }
}

export default Weight;