import AbstractCollection from '../../AbstractCollection';
import WeightAssignment from './WeightAssignment';
import CriteriaCollection from './CriteriaCollection';

class WeightAssignmentCollection extends AbstractCollection {

    static fromArray(array) {
        const wa = new WeightAssignmentCollection();
        wa.items = array.map(item => WeightAssignment.fromObject(item));
        return wa;
    }

    toArray() {
        return this.all.map(wa => wa.toObject());
    }

    updateCriteria(criteriaCollection) {
        if (!(criteriaCollection instanceof CriteriaCollection)) {
            throw new Error('CriteriaCollection expected to be of type CriteriaCollection.');
        }

        // TODO

        return this;
    }
}

export default WeightAssignmentCollection;