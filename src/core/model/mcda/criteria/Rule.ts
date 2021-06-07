import {IRule} from './Rule.type';
import {cloneDeep} from 'lodash';
import uuidv4 from 'uuid/v4';

class Rule {
    public get id() {
        return this._props.id;
    }

    public set id(value) {
        this._props.id = value;
    }

    public get name() {
        return this._props.name;
    }

    public set name(value) {
        this._props.name = value;
    }

    public get color() {
        return this._props.color;
    }

    public set color(value) {
        this._props.color = value;
    }

    public get expression() {
        return this._props.expression;
    }

    public set expression(value) {
        this._props.expression = value;
    }

    public get from() {
        return this._props.from;
    }

    public set from(value) {
        this._props.from = value;
    }

    public get fromOperator() {
        return this._props.fromOperator;
    }

    public set fromOperator(value) {
        this._props.fromOperator = value;
    }

    public get to() {
        return this._props.to;
    }

    public set to(value) {
        this._props.to = value;
    }

    public get toOperator() {
        return this._props.toOperator;
    }

    public set toOperator(value) {
        this._props.toOperator = value;
    }

    public get type() {
        return this._props.type;
    }

    public set type(value) {
        this._props.type = value;
    }

    public get value() {
        return this._props.value;
    }

    public set value(value) {
        this._props.value = value;
    }

    public static fromDefaults() {
        return new Rule({
            id: uuidv4(),
            color: '#ffffff',
            name: 'New Class',
            expression: '',
            from: 0,
            fromOperator: '>=',
            to: 0,
            toOperator: '<=',
            type: 'fixed',
            value: 1
        });
    }

    public static fromObject(obj: IRule) {
        return new Rule(obj);
    }

    protected _props: IRule;

    constructor(obj: IRule) {
        this._props = obj;
    }

    public toObject() {
        return cloneDeep(this._props);
    }
}

export default Rule;
