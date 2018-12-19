import AbstractCollection from '../../AbstractCollection';
import WeightAssignment from './WeightAssignment';

class WeightAssignmentCollection extends AbstractCollection {

    static fromArray(array) {
        const wa = new WeightAssignmentCollection();
        wa.items = array.map(item => WeightAssignment.fromObject(item));
        return wa;
    }

    validateInput (weightAssignment) {
        if (!(weightAssignment instanceof WeightAssignment)) {
            throw new Error('WeightAssignment expected to be instance of WeightAssignment');
        }
        return weightAssignment;
    }
}

export default WeightAssignmentCollection;