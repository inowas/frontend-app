import AbstractCollection from '../../collection/AbstractCollection';
import OptimizationObjective from './Objective';

class OptimizationObjectivesCollection extends AbstractCollection {
    static fromArray(array) {
        const oc = new OptimizationObjectivesCollection();
        oc.items = array.map(objective => OptimizationObjective.fromObject(objective));
        return oc;
    }

    validateInput (objective) {
        if (!(objective instanceof OptimizationObjective)) {
            throw new Error('Objective expected to be of type OptimizationObjective');
        }
        return objective;
    }
}

export default OptimizationObjectivesCollection;