import AbstractCollection from '../../collection/AbstractCollection';
import WeightAssignment from './WeightAssignment';

class WeightAssignmentsCollection extends AbstractCollection {

    static fromArray(array) {
        const wa = new WeightAssignmentsCollection();
        wa.items = array.map(item => WeightAssignment.fromObject(item));
        return wa;
    }

    validateInput (weightAssignment) {
        if (!(weightAssignment instanceof WeightAssignment)) {
            throw new Error(`WeightAssignment expected to be instance of WeightAssignment but is instance of ${typeof weightAssignment}`);
        }
        return weightAssignment;
    }

    isFinished() {
        return this.length >= 1;
    }
}

export default WeightAssignmentsCollection;