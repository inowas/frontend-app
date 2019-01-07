import AbstractCollection from '../../../AbstractCollection';
import OptimizationSolution from './Solution';

class OptimizationSolutionsCollection extends AbstractCollection {
    static fromArray(array) {
        const solutionsCollection = new OptimizationSolutionsCollection();
        solutionsCollection.items = array.map(solution => OptimizationSolution.fromObject(solution));
        return solutionsCollection;
    }

    get solutions() {
        return this._items;
    }

    set solutions(value) {
        this._items = value || [];
    }

    toArray() {
        return (this.all.map(solution => solution.toObject()));
    }

    checkInput (object) {
        if (!(object instanceof OptimizationSolution)) {
            throw new Error('Solution expected to be of type OptimizationSolution');
        }
    }
}

export default OptimizationSolutionsCollection;