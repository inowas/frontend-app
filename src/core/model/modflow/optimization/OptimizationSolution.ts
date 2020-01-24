import uuidv4 from 'uuid/v4';
import OptimizationObjectsCollection from './ObjectsCollection';
import {IOptimizationObject} from './OptimizationObject.type';
import {IOptimizationSolution} from './OptimizationSolution.type';

class OptimizationSolution {

    get id() {
        return this._props.id;
    }

    set id(value) {
        this._props.id = value ? value : uuidv4();
    }

    get variables() {
        return this._props.variables;
    }

    set variables(value) {
        this._props.variables = value;
    }

    get fitness() {
        return this._props.fitness;
    }

    set fitness(value) {
        this._props.fitness = value;
    }

    get objects() {
        return OptimizationObjectsCollection.fromObject(this._props.objects);
    }

    set objects(value: OptimizationObjectsCollection) {
        this._props.objects = value.toObject();
    }

    public static fromObject(obj: IOptimizationSolution) {
        return new this(obj);
    }
    private readonly _props: IOptimizationSolution;

    constructor(props: IOptimizationSolution) {
        this._props = props;
    }

    public toObject() {
        return this._props;
    }

    public addObject(object: IOptimizationObject) {
        this._props.objects.push(object);
    }
}

export default OptimizationSolution;
