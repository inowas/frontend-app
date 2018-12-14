import Location from './Location';
import uuidv4 from 'uuid/v4';

class OptimizationObjective {

    _id = uuidv4();
    _name = 'New Optimization Objective';
    _type = '';
    _concFileName = 'MT3D001.UCN';
    _summaryMethod = 'mean';
    _weight = -1;
    _penaltyValue = 999;
    _target = null;
    _location = new Location();
    _location1 = new Location();
    _location2 = new Location();

    static fromObject(obj) {
        const objective = new OptimizationObjective();
        objective.id = obj.id;
        objective.name = obj.name;
        objective.type = obj.type;
        objective.concFileName = obj.conc_file_name;
        objective.summaryMethod = obj.summary_method;
        objective.weight = obj.weight;
        objective.penaltyValue = obj.penalty_value;
        objective.target = obj.target;
        objective.location = obj.location;
        objective.location1 = obj.location_1;
        objective.location2 = obj.location_2;
        return objective;
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
        this._name = value !== '' ? value : 'New Optimization Objective';
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

    get weight() {
        return this._weight;
    }

    set weight(value) {
        this._weight = value !== '' ? parseFloat(value) : -1;
    }

    get penaltyValue() {
        return this._penaltyValue;
    }

    set penaltyValue(value) {
        this._penaltyValue = value !== '' ? parseFloat(value) : 999;
    }

    get target() {
        return this._target;
    }

    set target(value) {
        this._target = value && value !== '' ? parseFloat(value) : null;
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

    get toObject() {
        return ({
            'id': this.id,
            'name': this.name,
            'type': this.type,
            'conc_file_name': this.concFileName,
            'summary_method': this.summaryMethod,
            'weight': this.weight,
            'penalty_value': this.penaltyValue,
            'target': this.target,
            'location': this.location.toObject(),
            'location_1': this.location1 ? this.location1.toObject() : {},
            'location_2': this.location2 ? this.location2.toObject() : {}
        });
    }
}

export default OptimizationObjective;