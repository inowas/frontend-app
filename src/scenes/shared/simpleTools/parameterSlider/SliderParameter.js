import uuidv4 from 'uuid/v4';
import {inputType} from "./inputType";

class SliderParameter {
    _decimals = 0;
    _id = uuidv4();
    _inputType = inputType.SLIDER;
    _label = '';
    _max = 10;
    _min = 10;
    _name = '';
    _order = 0;
    _stepSize = 0.001;
    _type = 'string';
    _validMax;
    _validMin;
    _value = 0;

    static fromObject(obj) {
        const parameter = new SliderParameter();
        parameter.decimals = obj.decimals;
        parameter.id = obj.id;
        parameter.inputType = obj.inputType;
        parameter.label = obj.label;
        parameter.max = obj.max;
        parameter.min = obj.min;
        parameter.name = obj.name;
        parameter.order = obj.order;
        parameter.stepSize = obj.stepSize;
        parameter.type = obj.type;
        parameter.validMax = obj.validMax;
        parameter.validMin = obj.validMin;
        parameter.value = obj.value;

        return parameter;
    }

    get decimals() {
        return this._decimals;
    }

    set decimals(value) {
        this._decimals = value ? parseInt(value, 10) : 0;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value ? value : uuidv4();
    }

    get inputType() {
        return this._inputType;
    }

    set inputType(value) {
        this._inputType = value;
    }

    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value ? value : '';
    }

    get max() {
        return this._max;
    }

    set max(value) {
        this._max = value ? this.parse(value) : 0;
    }

    get min() {
        return this._min;
    }

    set min(value) {
        this._min = value ? this.parse(value) : 0;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value ? value : '';
    }

    get order() {
        return this._order;
    }

    set order(value) {
        this._order = value ? value : 0;
    }

    get stepSize() {
        return this._stepSize;
    }

    set stepSize(value) {
        this._stepSize = value ? this.parse(value) : 1;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value ? value : 'string';
    }

    get validMax() {
        return this._validMax;
    }

    set validMax(value) {
        this._validMax = value ? value : null;
    }

    get validMin() {
        return this._validMin;
    }

    set validMin(value) {
        this._validMin = value ? value : null;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value ? this.parse(value) : this.parse(0);
    }

    get toObject() {
        return ({
            decimals: this.decimals,
            id: this.id,
            inputType: this.inputType,
            label: this.label,
            max: this.max,
            min: this.min,
            name: this.name,
            order: this.order,
            stepSize: this.stepSize,
            type: this.type,
            validMax: this.validMax,
            validMin: this.validMin,
            value: this.value
        });
    }

    parse(value) {
        if (this.type === 'integer') {
            return parseInt(value, 10);
        }
        if (this.type === 'float') {
            return parseFloat(value);
        }

        return value;
    }
}

export default SliderParameter;
