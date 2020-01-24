import {IOptimizationMethod} from './OptimizationMethod.type';
import OptimizationProgress from './OptimizationProgress';
import OptimizationSolutionsCollection from './SolutionsCollection';

class OptimizationMethod {
    get name() {
        return this._props.name;
    }

    set name(value) {
        this._props.name = value ? value : '';
    }

    get solutions() {
        return OptimizationSolutionsCollection.fromObject(this._props.solutions);
    }

    set solutions(value: OptimizationSolutionsCollection) {
        this._props.solutions = value.toObject();
    }

    get progress() {
        return this._props.progress ? OptimizationProgress.fromObject(this._props.progress) : null;
    }

    set progress(value: OptimizationProgress | null) {
        this._props.progress = value ? value.toObject() : null;
    }

    public static fromObject(obj: IOptimizationMethod) {
        return new this(obj);
    }
    private readonly _props: IOptimizationMethod;

    constructor(props: IOptimizationMethod) {
        this._props = props;
    }

    public toObject() {
        return this._props;
    }
}

export default OptimizationMethod;
