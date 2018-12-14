import uuidv4 from 'uuid/v4';

class CriteriaRelation {
    _id = uuidv4();
    _to = '';
    _value = 0;

    static fromObject(obj) {
        const relation = new CriteriaRelation();
        relation.id = obj.id;
        relation.to = obj.to;
        relation.value = obj.value;
        return relation;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get to() {
        return this._to;
    }

    set to(value) {
        this._to = value ? value : null;
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
            to: this.to,
            value: this.value
        });
    }
}

export default CriteriaRelation;