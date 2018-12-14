import uuidv4 from 'uuid/v4';
import Location from './Location';

class OptimizationConstraint {

    _id = uuidv4();
    _name = 'New Optimization Constraint';
    _type = '';
    _concFileName = 'MT3D001.UCN';
    _summaryMethod = 'mean';
    _value = 0;
    _operator = 'more';
    _location = new Location();
    _location1 = new Location();
    _location2 = new Location();

    static fromObject(obj) {
        const constraint = new OptimizationConstraint();
        constraint.id = obj.id;
        constraint.name = obj.name;
        constraint.type = obj.type;
        constraint.concFileName = obj.conc_file_name;
        constraint.summaryMethod = obj.summary_method;
        constraint.value = obj.value;
        constraint.operator = obj.operator;
        constraint.location = obj.location;
        constraint.location1 = obj.location_1;
        constraint.location2 = obj.location_2;
        return constraint;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value ? value : uuidv4();
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value ? value : 'New Optimization Constraint';
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value ? value : '';

        if (value === 'flux' || value === 'inputConc') {
            this.location = {
                ...this.location,
                type: 'object'
            }
        }
    }

    get concFileName() {
        return this._concFileName;
    }

    set concFileName(value) {
        this._concFileName = value;
    }

    get summaryMethod() {
        return this._summaryMethod;
    }

    set summaryMethod(value) {
        this._summaryMethod = value ? value : 'mean';
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value !== '' ? parseFloat(value) : 0;
    }

    get operator() {
        return this._operator;
    }

    set operator(value) {
        this._operator = value;
    }

    get location() {
        return this._location;
    }

    set location(value) {
        this._location = value ? Location.fromObject(value) : new Location();
    }

    get location1() {
        return this._location1;
    }

    set location1(value) {
        this._location1 = value ? Location.fromObject(value) : null;
    }

    get location2() {
        return this._location2;
    }

    set location2(value) {
        this._location2 = value ? Location.fromObject(value) : null;
    }

    toObject() {
        return ({
            'id': this.id,
            'name': this.name,
            'type': this.type,
            'conc_file_name': this.concFileName,
            'summary_method': this.summaryMethod,
            'value': this.value,
            'operator': this.operator,
            'location': this.location.toObject(),
            'location_1': this.location1 ? this.location1.toObject() : {},
            'location_2': this.location2 ? this.location2.toObject() : {}
        });
    }
}

export default OptimizationConstraint;