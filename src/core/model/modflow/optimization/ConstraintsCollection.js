import AbstractCollection from '../../AbstractCollection';
import OptimizationConstraint from './Constraint';

class OptimizationConstraintsCollection extends AbstractCollection {
    static fromArray(array) {
        const constraintsCollection = new OptimizationConstraintsCollection();
        constraintsCollection.items = array.map(constraint => OptimizationConstraint.fromObject(constraint));
        return constraintsCollection;
    }

    get constraints() {
        return this._items;
    }

    set constraints(value) {
        this._items = value || [];
    }

    toArray() {
        return this.all.map(constraint => constraint.toObject());
    }

    checkInput (object) {
        if (!(object instanceof OptimizationConstraint)) {
            throw new Error('Objective expected to be of type OptimizationObjective');
        }
    }
}

export default OptimizationConstraintsCollection;