import uuidv4 from 'uuid/v4';
import OptimizationObject from './Object';

class OptimizationSolution {
    _id = uuidv4();
    _fitness = [];
    _variables = [];
    _objects = [];

    static fromObject(obj) {
        const solution = new OptimizationSolution();
        solution.id = obj.id;
        solution.fitness = obj.fitness;
        solution.variables = obj.variables;

        obj.objects.forEach((object) => {
            solution.addObject(OptimizationObject.fromObject(object));
        });

        return solution;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value ? value : uuidv4();
    }

    get variables() {
        return this._variables;
    }

    set variables(value) {
        this._variables = value;
    }

    get fitness() {
        return this._fitness;
    }

    set fitness(value) {
        this._fitness = value;
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
            'variables': this.variables,
            'fitness': this.fitness,
            'objects': this.objects.map(o => o.toObject())
        };
    }

    addObject(object) {
        if (!(object instanceof OptimizationObject)) {
            throw new Error('The object is not of type OptimizationObject.');
        }
        this._objects.push(object);
    }
}

export default OptimizationSolution;