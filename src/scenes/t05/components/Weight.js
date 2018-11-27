import uuidv4 from 'uuid/v4';
import CriteriaRelation from "./CriteriaRelation";

const validTypes = ['ranking', 'multiInfluence', 'pairwise', 'analyticalHierarchy'];

class Weight {
    _id = uuidv4();
    _type = 'ranking';
    _relations = [];
    _rank = 0;
    _value = 0;

    static fromObject(obj) {
        const weight = new Weight();
        weight.id = obj.id;
        weight.type = obj.type;
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

    get type() {
        return this._type;
    }

    set type(value) {
        if (!validTypes.includes(value)) {
            throw new Error(`Invalid type ${value} of Weight`);
        }
        this._type = value;
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
            type: this.type,
            relations: this.relations.map(r => r.toObject),
            rank: this.rank,
            value: this.value
        });
    }
}

export default Weight;