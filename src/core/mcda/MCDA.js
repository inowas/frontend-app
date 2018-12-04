import CriteriaCollection from './criteria/CriteriaCollection';
import WeightsCollection from './criteria/WeightsCollection';
import Criteria from './criteria/Criteria';

class MCDA {
    _criteria = new CriteriaCollection();
    _weights = new WeightsCollection();

    static fromObject(obj) {
        const mcda = new MCDA();
        mcda.criteria = CriteriaCollection.fromObject(obj.criteria);
        mcda.weights = WeightsCollection.fromObject(obj.weights);
        return mcda;
    }

    get criteria() {
        return this._criteria;
    }

    set criteria(value) {
        this._criteria = value;
    }

    get weights() {
        return this._weights;
    }

    set weights(value) {
        this._weights = value;
    }

    get toObject() {
        return ({
            criteria: this.criteria.toObject,
            weights: this.weights.toObject
        });
    }

    update(criteria) {
        if (!(criteria instanceof Criteria)) {
            throw new Error('Criteria expected to be of type Criteria.');
        }
        this.criteria.update(criteria);
        this.weights.updateCriteria(criteria);
    }
}

export default MCDA;