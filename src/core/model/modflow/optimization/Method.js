import OptimizationSolution from './Solution';
import OptimizationProgress from './Progress';

class OptimizationMethod {
    _name = '';
    _solutions = [];
    _progress = null;

    static fromObject(obj) {
        const method = new OptimizationMethod();
        method.name = obj.name;
        method.progress = obj.progress ? OptimizationProgress.fromObject(obj.progress) : null;

        obj.solutions && obj.solutions.forEach((solution) => {
            method.addSolution(OptimizationSolution.fromObject(solution));
        });

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
        this._solutions = value ? value : [];
    }

    get progress() {
        return this._progress;
    }

    set progress(value) {
        this._progress = value ? value : null;
    }

    get toObject() {
        return {
            'name': this.name,
            'progress': this.progress ? this.progress.toObject : null,
            'solutions': this.solutions.map(s => s.toObject)
        };
    }

    addSolution(solution) {
        if (!(solution instanceof OptimizationSolution)) {
            throw new Error('The solution object is not of type OptimizationSolution.');
        }
        this._solutions.push(solution);
        return this;
    }
}

export default OptimizationMethod;