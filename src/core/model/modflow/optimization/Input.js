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
        input.objectivesCollection = OptimizationObjectivesCollection.fromArray(obj.objectives);
        input.constraintsCollection = OptimizationConstraintsCollection.fromArray(obj.constraints);
        input.objectsCollection = OptimizationObjectsCollection.fromArray(obj.objects);
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

    get constraintsCollection() {
        return this._constraints;
    }

    set constraintsCollection(value) {
        this._constraints = value;
    }

    get objectivesCollection() {
        return this._objectives;
    }

    set objectivesCollection(value) {
        this._objectives = value;
    }

    get objectsCollection() {
        return this._objects;
    }

    set objectsCollection(value) {
        if (!(value instanceof OptimizationObjectsCollection)) {
            throw new Error('Objects expected to be instance of OptimizationObjectsCollection');
        }
        this._objects = value;
    }

    toObject() {
        return {
            'id': this.id,
            'parameters': this.parameters.toObject(),
            'constraints': this.constraintsCollection.toArray(),
            'objectives': this.objectivesCollection.toArray(),
            'objects': this.objectsCollection.toArray()
        };
    }
}

export default OptimizationInput;