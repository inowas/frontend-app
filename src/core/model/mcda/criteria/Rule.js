import uuidv4 from 'uuid/v4';

class Rule {
    _id = uuidv4();
    _color = '#ffffff';
    _name = 'New Class';
    _expression = '';
    _from = 0;
    _fromOperator = '>=';
    _to = 0;
    _toOperator = '<=';
    _type = 'fixed';
    _value = 1;

    static fromObject(obj) {
        const rule = new Rule();
        rule.id = obj.id;
        rule.color = obj.color;
        rule.name = obj.name;
        rule.expression = obj.expression;
        rule.from = obj.from;
        rule.fromOperator = obj.fromOperator;
        rule.to = obj.to;
        rule.toOperator = obj.toOperator;
        rule.type = obj.type;
        rule.value = obj.value;
        return rule;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
    }

    get expression() {
        return this._expression;
    }

    set expression(value) {
        this._expression = value;
    }

    get from() {
        return this._from;
    }

    set from(value) {
        this._from = value;
    }

    get fromOperator() {
        return this._fromOperator;
    }

    set fromOperator(value) {
        this._fromOperator = value;
    }

    get to() {
        return this._to;
    }

    set to(value) {
        this._to = value;
    }

    get toOperator() {
        return this._toOperator;
    }

    set toOperator(value) {
        this._toOperator = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    toObject() {
        return ({
            id: this.id,
            color: this.color,
            name: this.name,
            expression: this.expression,
            from: this.from,
            fromOperator: this.fromOperator,
            to: this.to,
            toOperator: this.toOperator,
            type: this.type,
            value: this.value
        });
    }
}

export default Rule;