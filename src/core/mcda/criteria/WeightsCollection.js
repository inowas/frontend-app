import Weight from './Weight';
import Criteria from './Criteria';
import CriteriaCollection from './CriteriaCollection';

class WeightsCollection {
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

    allRelations(method) {
        let relations = [];

        this.all.filter(weight => weight.method === method).forEach(weight => {
            if (weight.relations.length > 0) {
                relations = relations.concat(
                    weight.relations.map(relation => {
                        return {
                            id: relation.id,
                            from: weight.criteria.id,
                            to: relation.to,
                            value: relation.value
                        }
                    })
                )
            }
        });

        return relations;
    }

    findById(id) {
        const weights = this._weights.filter(w => w.id === id);
        if (weights.length > 0) {
            return weights[0];
        }
        return false;
    }

    findByMethod(method) {
        const weights = this._weights.filter(w => w.method === method);
        if (weights.length > 0) {
            return weights;
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

    calculateWeights(method) {
        const weights = this.findByMethod(method);

        if (!weights) {
            return null;
        }

        if (method === 'ranking') {
            const variables = weights.map(w => {
                return {
                    rank: w.rank,
                    n: weights.length - w.rank + 1,
                    r: 1 / w.rank
                }
            });

            const nSum = variables.reduce((prev, cur) => {
                return prev + cur.n;
            }, 0);
            /*const rSum = variables.reduce((prev, cur) => {
                return prev + cur.r;
            }, 0);*/

            weights.forEach((weight, key) => {
                weight.value = variables[key].n / nSum;
                this.update(weight);
            });
        }

        if (method === 'mif') {
            let nScore = 0;

            const variables = weights.map(w => {
                const score = w.relations.filter(r => r.value === 1).length + 0.5 * w.relations.filter(r => r.value === 0).length;
                nScore += score;

                return {
                    id: w.id,
                    score: score
                }
            });

            weights.forEach((weight, key) => {
                weight.value = variables[key].score / nScore;
                this.update(weight);
            });
        }

        return this;
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

    removeByCriteria(criteria) {
        const id = criteria instanceof Criteria ? criteria.id : criteria;
        this._weights = this._weights.filter(w => w.criteria.id !== id);

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

    updateCriteria(criteriaCollection) {
        if (!(criteriaCollection instanceof CriteriaCollection)) {
            throw new Error('CriteriaCollection expected to be of type CriteriaCollection.');
        }

        this._weights = this._weights.filter(w => criteriaCollection.findById(w.criteria.id) !== false).map(weight => {
            weight.criteria = criteriaCollection.findById(weight.criteria.id);
            return weight;
        });

        return this;
    }
}

export default WeightsCollection;