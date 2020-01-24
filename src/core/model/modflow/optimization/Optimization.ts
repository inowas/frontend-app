import Ajv from 'ajv';
import ajv0 from 'ajv/lib/refs/json-schema-draft-04.json';
import optimizationSchema from './optimization.schema';

import OptimizationInput from './Input';
import OptimizationMethod from './Method';

class Optimization {
    _input = OptimizationInput.fromDefaults();
    _state = 0;
    _methods = [];

    static fromDefaults() {
        return new Optimization();
    }

    static fromObject(obj) {
        const optimization = new Optimization();
        optimization.input = obj.input ? OptimizationInput.fromObject(obj.input) : OptimizationInput.fromDefaults();
        optimization.state = obj.state;

        obj.methods && obj.methods.forEach((method) => {
            optimization.addMethod(OptimizationMethod.fromObject(method));
        });

        return optimization;
    }

    static fromQuery(query) {
        if (!query) {
            return Optimization.fromDefaults();
        }

        return this.fromObject(query);
    }

    get id() {
        return this.input.id;
    }

    get input() {
        return this._input;
    }

    set input(value) {
        this._input = value ? value : {};
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value ? value : 0;
    }

    get methods() {
        return this._methods;
    }

    set methods(value) {
        this._methods = value ? value : [];
    }

    toObject() {
        return {
            'id': this.id,
            'input': this.input.toObject(),
            'state': this.state,
            'methods': this.methods.map(m => m.toObject())
        };
    }

    getMethodByName(name) {
        const method = this.methods.filter(m => m.name === name);
        if (method.length >= 1) {
            return method[0];
        }
        return null;
    }

    getSolutionById(id) {
        let solutions = [];
        this.methods.forEach(method => {
            solutions = solutions.concat(method.solutions);
        });
        return solutions.filter(s => s.id === id)[0] || null;
    }

    addMethod(method) {
        if (!(method instanceof OptimizationMethod)) {
            throw new Error('The method is not of type OptimizationMethod.');
        }
        this._methods.push(method);
        return this;
    }

    validate() {
        const ajv = new Ajv({schemaId: 'auto'});
        ajv.addMetaSchema(ajv0);
        const val = ajv.compile(optimizationSchema);
        return [val(this.toObject()), val.errors];
    }
}

export default Optimization;