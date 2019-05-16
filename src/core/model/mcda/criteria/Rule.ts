import uuidv4 from 'uuid/v4';
import {IRule} from './Rule.type';

class Rule {
    public get id() {
        return this._id;
    }

    public set id(value) {
        this._id = value;
    }

    public get name() {
        return this._name;
    }

    public set name(value) {
        this._name = value;
    }

    public get color() {
        return this._color;
    }

    public set color(value) {
        this._color = value;
    }

    public get expression() {
        return this._expression;
    }

    public set expression(value) {
        this._expression = value;
    }

    public get from() {
        return this._from;
    }

    public set from(value) {
        this._from = value;
    }

    public get fromOperator() {
        return this._fromOperator;
    }

    public set fromOperator(value) {
        this._fromOperator = value;
    }

    public get to() {
        return this._to;
    }

    public set to(value) {
        this._to = value;
    }

    public get toOperator() {
        return this._toOperator;
    }

    public set toOperator(value) {
        this._toOperator = value;
    }

    public get type() {
        return this._type;
    }

    public set type(value) {
        this._type = value;
    }

    public get value() {
        return this._value;
    }

    public set value(value) {
        this._value = value;
    }

    public static fromObject(obj: IRule) {
        const rule = new Rule();
        rule.id = obj.id || uuidv4();
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

    private _id = uuidv4();
    private _color = '#ffffff';
    private _name = 'New Class';
    private _expression = '';
    private _from = 0;
    private _fromOperator = '>=';
    private _to = 0;
    private _toOperator = '<=';
    private _type = 'fixed';
    private _value = 1;

    public toObject() {
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
