import AbstractCollection from '../../AbstractCollection';
import OptimizationObjective from './Objective';

class OptimizationObjectivesCollection extends AbstractCollection {
    static fromArray(array) {
        const objectivesCollection = new OptimizationObjectivesCollection();
        objectivesCollection.items = array.map(objective => OptimizationObjective.fromObject(objective));
        return objectivesCollection;
    }

    get constraints() {
        return this._items;
    }

    set constraints(value) {
        this._items = value || [];
    }

    toArray() {
        return (this.all.map(objective => objective.toObject()));
    }

    checkInput (object) {
        if (!(object instanceof OptimizationObjective)) {
            throw new Error('Objective expected to be of type OptimizationObjective');
        }
    }
}

export default OptimizationObjectivesCollection;