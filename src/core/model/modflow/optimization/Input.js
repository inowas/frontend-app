import uuidv4 from 'uuid/v4';

import OptimizationParameters from './Parameters';
import OptimizationObjective from './Objective';
import OptimizationConstraint from './Constraint';
import OptimizationObjectsCollection from './ObjectsCollection';

class OptimizationInput {
    _id = uuidv4();
    _constraints = [];
    _objectives = [];
    _objects = new OptimizationObjectsCollection();
    _parameters;

    static fromDefaults() {
        const input = new OptimizationInput();
        input.id = uuidv4();
        input.parameters = OptimizationParameters.fromDefaults();
        input.constraints = [];
        input.objectives = [];
        input.objects = new OptimizationObjectsCollection();
        return input;
    }

    static fromObject(obj) {
        if (!obj) {
            return OptimizationInput.fromDefaults();
        }
        const input = new OptimizationInput();
        input.id = obj.id;
        input.parameters = OptimizationParameters.fromObject(obj.parameters);

        obj.constraints.forEach((constraint) => {
            input.addConstraint(OptimizationConstraint.fromObject(constraint));
        });

        obj.objectives.forEach((objective) => {
            input.addObjective(OptimizationObjective.fromObject(objective));
        });

        obj.objects = OptimizationObjectsCollection.fromObject(obj.objects);

        return input;
    }

    constructor(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value ? value : uuidv4();
    }

    get parameters() {
        return this._parameters;
    }

    set parameters(value) {
        this._parameters = value;
    }

    get constraints() {
        return this._constraints;
    }

    set constraints(value) {
        this._constraints = value;
    }

    get objectives() {
        return this._objectives;
    }

    set objectives(value) {
        this._objectives = value;
    }

    get objects() {
        return this._objects;
    }

    set objects(value) {
        this._objects = value;
    }

    get toObject() {
        return {
            'id': this.id,
            'parameters': this.parameters.toObject,
            'constraints': this.constraints.map(c => c.toObject),
            'objectives': this.objectives.map(c => c.toObject),
            'objects': this.objects.toObject
        };
    }

    addConstraint(constraint) {
        if (!(constraint instanceof OptimizationConstraint)) {
            throw new Error('The parameter constraint is not of type OptimizationConstraint.');
        }
        this._constraints.push(constraint);
    }

    addObjective(objective) {
        if (!(objective instanceof OptimizationObjective)) {
            throw new Error('The parameter objective is not of type OptimizationObjective.');
        }
        this._objectives.push(objective);
    }
}

export default OptimizationInput;