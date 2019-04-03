import AbstractCollection from '../../collection/AbstractCollection';
import WeightAssignment from './WeightAssignment';
import WeightsCollection from './WeightsCollection';

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

    collectActiveWeights() {
        const activeWeightsCollection = new WeightsCollection();
        const activeWeightAssignments = this.all.filter(wa => wa.isActive);
        if (activeWeightAssignments.length > 0) {
            activeWeightsCollection.items = [].concat(...activeWeightAssignments.map(wa => wa.weightsCollection.all));
        }
        return activeWeightsCollection;
    }
}

export default WeightAssignmentsCollection;