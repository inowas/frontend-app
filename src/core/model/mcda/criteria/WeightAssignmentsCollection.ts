import {Collection} from '../../collection/Collection';
import {IWeight} from './Weight.type';
import {IWeightAssignment} from './WeightAssignment.type';
import WeightsCollection from './WeightsCollection';

class WeightAssignmentsCollection extends Collection<IWeightAssignment> {

    public static fromObject(obj: IWeightAssignment[]) {
        return new WeightAssignmentsCollection(obj);
    }

    public isFinished() {
        return this.length >= 1;
    }

    public activeWeights() {
        const activeWeightsCollection = new WeightsCollection();
        const activeWeightAssignments = this.all.filter((wa) => wa.isActive);
        if (activeWeightAssignments.length > 0) {
            activeWeightsCollection.items = ([] as IWeight[]).concat(...activeWeightAssignments.map(
                (wa) => wa.weights
            ));
        }
        return activeWeightsCollection;
    }

    public toObject() {
        return this.all;
    }
}

export default WeightAssignmentsCollection;
