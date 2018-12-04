class CriteriaRelation {
    _to = '';
    _value = 0;

    static fromObject(obj) {
        const relation = new CriteriaRelation();
        relation.to = obj.to;
        relation.value = obj.value;
        return relation;
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

    get toObject() {
        return ({
            to: this.to,
            value: this.value
        });
    }
}

export default CriteriaRelation;