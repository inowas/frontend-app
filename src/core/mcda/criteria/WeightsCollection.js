import Weight from './Weight';
import Criteria from './Criterion';
import AbstractCollection from '../../AbstractCollection';

class WeightsCollection extends AbstractCollection {
    static fromArray(array) {
        const wc = new WeightsCollection();
        wc.items = array.map(w => Weight.fromObject(w));
        return wc;
    }

    get weights() {
        return this._items;
    }

    set weights(value) {
        this._items = value || [];
    }

    toArray() {
        return this._items.map(weight => weight.toObject());
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
}

export default WeightsCollection;