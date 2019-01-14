import uuidv4 from 'uuid/v4';

class SoilmodelParameter {
    _defaultValue = 0;
    _id = uuidv4();
    _isActive = false;
    _label = 'param';
    _name = 'Soilmodel Parameter';
    _unit = '-';
    _value = 0;

    static fromObject(obj, parseParameters = true) {
        const parameter = new SoilmodelParameter();
        parameter.defaultValue = obj.defaultValue;
        parameter.id = obj.id;
        parameter.isActive = obj.isActive;
        parameter.label = obj.label;
        parameter.name = obj.name;
        parameter.unit = obj.unit;
        parameter.value = parseParameters ? SoilmodelParameter.parseValue(obj.value) : obj.value;
        return parameter;
    }

    get defaultValue() {
        return this._defaultValue;
    }

    set defaultValue(value) {
        this._defaultValue = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get isActive() {
        return this._isActive;
    }

    set isActive(value) {
        this._isActive = value;
    }

    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get unit() {
        return this._unit;
    }

    set unit(value) {
        this._unit = value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    toObject() {
        return {
            'defaultValue': this.defaultValue,
            'id': this.id,
            'isActive': this.isActive,
            'label': this.label,
            'name': this.name,
            'unit': this.unit,
            'value': this.value,
        };
    }

    isArray() {
        return Array.isArray(this._value);
    }

    static parseValue(value) {
        if (Array.isArray(value)) {
            return value;
        }
        return isNaN(value) ? 0 : parseFloat(value);
    }
}

export default SoilmodelParameter;


