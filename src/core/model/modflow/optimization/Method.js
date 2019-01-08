import OptimizationProgress from './Progress';
import OptimizationSolutionsCollection from './SolutionsCollection';

class OptimizationMethod {
    _name = '';
    _solutions = new OptimizationSolutionsCollection();
    _progress = null;

    static fromObject(obj) {
        const method = new OptimizationMethod();
        method.name = obj.name;
        method.progress = obj.progress ? OptimizationProgress.fromObject(obj.progress) : null;
        method.solutions = obj.solutions ? OptimizationSolutionsCollection.fromArray(obj.solutions) : new OptimizationSolutionsCollection();

        return method;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value ? value : '';
    }

    get solutions() {
        return this._solutions;
    }

    set solutions(value) {
        this._solutions = value;
    }

    get progress() {
        return this._progress;
    }

    set progress(value) {
        this._progress = value ? value : null;
    }

    toObject() {
        return {
            'name': this.name,
            'progress': this.progress ? this.progress.toObject() : null,
            'solutions': this.solutions.toArray()
        };
    }
}

export default OptimizationMethod;