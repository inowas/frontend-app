import {IOptimization} from './Optimization.type';
import OptimizationInput from './OptimizationInput';
import OptimizationMethod from './OptimizationMethod';
import {IOptimizationSolution} from './OptimizationSolution.type';

class Optimization {

    get id() {
        return this.input.id;
    }

    get input() {
        return OptimizationInput.fromObject(this._props.input);
    }

    set input(value: OptimizationInput) {
        this._props.input = value.toObject();
    }

    get state() {
        return this._props.state;
    }

    set state(value) {
        this._props.state = value;
    }

    get methods() {
        return this._props.methods;
    }

    set methods(value) {
        this._props.methods = value;
    }

    public static fromDefaults() {
        return new this({
            input: OptimizationInput.fromDefaults().toObject(),
            state: 0,
            methods: []
        });
    }

    public static fromObject(obj: IOptimization) {
       return new this(obj);
    }
    private readonly _props: IOptimization;

    constructor(props: IOptimization) {
        this._props = props;
    }

    public toObject() {
        return this._props;
    }

    public getMethodByName(name: string) {
        const method = this.methods.filter((m) => m.name === name);
        if (method.length >= 1) {
            return method[0];
        }
        return null;
    }

    public getSolutionById(id: string) {
        let solutions: IOptimizationSolution[] = [];
        this.methods.forEach((method) => {
            solutions = solutions.concat(method.solutions);
        });
        return solutions.filter((s) => s.id === id)[0] || null;
    }

    public addMethod(method: OptimizationMethod) {
        this._props.methods.push(method.toObject());
        return this;
    }
}

export default Optimization;
