import Weight from './Weight';
import Criteria from './Criteria';

class WeightsCollection{
    _weights = [];

    static fromObject(obj) {
        const wc = new WeightsCollection();
        wc.weights = obj.weights.map(w => Weight.fromObject(w));
        return wc;
    }

    get weights() {
        return this._weights;
    }

    set weights(value) {
        this._weights = value || [];
    }

    get toObject() {
        return ({
            weights: this.weights.map(w => w.toObject)
        });
    }

    get all() {
        return this._weights;
    }

    findById(id) {
        const weights = this._weights.filter(w => w.id === id);
        if (weights.length > 0) {
            return weights[0];
        }
        return false;
    }

    findByCriteriaAndMethod(criteria, method) {
        const id = criteria instanceof Criteria ? criteria.id : criteria;
        const weights = this._weights.filter(w => w.method === method && w.criteria.id === id);
        if (weights.length > 0) {
            return weights[0];
        }
        return false;
    }

    add(weight) {
        if (!(weight instanceof Weight)) {
            throw new Error('Weight expected to be of type Weight.');
        }
        this._weights.push(weight);

        return this;
    }

    remove(weight) {
        const id = weight instanceof Weight ? weight.id : weight;
        this._weights = this._weights.filter(w => w.id !== id);

        return this;
    }

    update(weight) {
        if (!(weight instanceof Weight)) {
            throw new Error('Weight expected to be of type Weight.');
        }

        let exists = false;
        this._weights = this._weights.map(c => {
            if (weight.id === c.id) {
                exists = true;
                return weight;
            }
            return c;
        });

        if (!exists) {
            this.add(weight);
        }

        return this;
    }

    updateCriteria(criteria) {
        if (!(criteria instanceof Criteria)) {
            throw new Error('Criteria expected to be of type Criteria.');
        }

        const weight = this._weights.filter(w => w.criteria.id === criteria.id)[0];

        if (!weight) {
            return;
        }

        weight.criteria = criteria;
        this.update(weight);

        return this;
    }
}

export default WeightsCollection;