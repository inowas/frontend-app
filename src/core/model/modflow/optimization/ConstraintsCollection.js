import AbstractCollection from '../../collection/AbstractCollection';
import OptimizationConstraint from './Constraint';

class OptimizationConstraintsCollection extends AbstractCollection {
    static fromArray(array) {
        const cc = new OptimizationConstraintsCollection();
        cc.items = array.map(constraint => OptimizationConstraint.fromObject(constraint));
        return cc;
    }

    validateInput (constraint) {
        if (!(constraint instanceof OptimizationConstraint)) {
            throw new Error('Constraint expected to be of type OptimizationConstraint');
        }
        return constraint;
    }
}

export default OptimizationConstraintsCollection;