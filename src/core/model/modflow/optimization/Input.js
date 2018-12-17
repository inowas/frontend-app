import uuidv4 from 'uuid/v4';

import OptimizationParameters from './Parameters';
import OptimizationObjectsCollection from './ObjectsCollection';
import OptimizationConstraintsCollection from './ConstraintsCollection';
import OptimizationObjectivesCollection from './ObjectivesCollection';

class OptimizationInput {
    _id = uuidv4();
    _constraints = new OptimizationConstraintsCollection();
    _objectives = new OptimizationObjectivesCollection();
    _objects = new OptimizationObjectsCollection();
    _parameters = OptimizationParameters.fromDefaults();

    static fromDefaults() {
        return new OptimizationInput();
    }

    static fromObject(obj) {
        if (!obj) {
            return OptimizationInput.fromDefaults();
        }

        const input = new OptimizationInput();
        input.id = obj.id;
        input.parameters = OptimizationParameters.fromObject(obj.parameters);
        input.objectives = OptimizationObjectivesCollection.fromArray(obj.objectives);
        input.constraints = OptimizationConstraintsCollection.fromArray(obj.constraints);
        input.objects = OptimizationObjectsCollection.fromArray(obj.objects);
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

    toObject() {
        return {
            'id': this.id,
            'parameters': this.parameters.toObject(),
            'constraints': this.constraints.toArray(),
            'objectives': this.objectives.toArray(),
            'objects': this.objects.toArray()
        };
    }
}

export default OptimizationInput;