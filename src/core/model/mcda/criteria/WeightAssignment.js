import uuidv4 from 'uuid/v4';
import {CriteriaRelation, Weight, WeightsCollection} from './index';
import AbstractCollection from '../../collection/AbstractCollection';

const methods = {
    spl: 'Simple Weights',
    rnk: 'Ranking',
    rrw: 'Reciprocal Ranking',
    mif: 'Multi-Influence Factor',
    pwc: 'Pairwise Comparison',
    ahp: 'Analytical Hierarchy Process'
};

class WeightAssignment {
    _id = uuidv4();
    _method = 'rnk';
    _name = 'New Weight Assignment';
    _weights = new WeightsCollection();
    _isActive = false;

    static fromMethodAndCriteria(method, criteriaCollection) {
        if (!(criteriaCollection instanceof AbstractCollection)) {
            throw new Error('CriteriaCollection expected to be instance of AbstractCollection');
        }

        const wa = new WeightAssignment();
        wa.method = method;
        wa.name = methods[method];

        let addedRelations = [];

        criteriaCollection.all.forEach((criterion, key) => {
            const weight = new Weight();
            weight.criterion = criterion;
            weight.rank = key + 1;

            addedRelations.push(weight.criterion.id);
            if (method === 'pwc') {
                weight.relations = criteriaCollection.all.filter(c => !addedRelations.includes(c.id)).map(criterion => {
                    const cr = new CriteriaRelation();
                    cr.to = criterion.id;
                    return cr;
                });
            }

            wa.weightsCollection.add(weight);
        });


        wa.calculateWeights();
        return wa;
    }

    static fromObject(obj) {
        const wa = new WeightAssignment();
        wa.id = obj.id;
        wa.isActive = obj.isActive;
        wa.method = obj.method;
        wa.name = obj.name;
        wa.weightsCollection = WeightsCollection.fromArray(obj.weights);
        return wa;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value ? value : uuidv4();
    }

    get isActive() {
        return this._isActive;
    }

    set isActive(value) {
        this._isActive = value;
    }

    get method() {
        return this._method;
    }

    set method(value) {
        if (!methods.hasOwnProperty(value)) {
            throw new Error('Method expected to be one of spl, rnk, rrw, mif, pwc or ahp');
        }
        this._method = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get weightsCollection() {
        return this._weights;
    }

    set weightsCollection(value) {
        this._weights = value;
    }

    toObject() {
        return ({
            id: this.id,
            isActive: this.isActive,
            method: this.method,
            name: this.name,
            weights: this.weightsCollection.toArray()
        });
    }

    calculateWeights() {
        const weights = this.weightsCollection;

        if (!weights) {
            return null;
        }

        if (this.method === 'rnk') {
            const variables = weights.all.map(w => {
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

            weights.all.forEach((weight, key) => {
                weight.value = variables[key].n / nSum;
                this.weightsCollection.update(weight);
            });
        }

        if (this.method === 'mif') {
            let nScore = 0;

            const variables = weights.all.map(w => {
                const score = w.relations.filter(r => r.value === 1).length + 0.5 * w.relations.filter(r => r.value === 0).length;
                nScore += score;

                return {
                    id: w.id,
                    score: score
                }
            });

            weights.all.forEach((weight, key) => {
                weight.value = variables[key].score / nScore;
                this.weightsCollection.update(weight);
            });
        }

        if (this.method === 'pwc') {
            const criteria = this.weightsCollection.allCriteriaIds;
            const relations = this.weightsCollection.allRelations;

            const colSums = new Array(criteria.length).fill(0);

            const rowSums = criteria.map(criterion => {
                return {
                    id: criterion,
                    value: 0
                };
            });

            const matrix = criteria.map(row => {
                return criteria.map((col, key) => {
                    let value = 0;
                    if (row === col) {
                        value = 1;
                    }
                    const reld = relations.filter(relation => relation.from === col && relation.to === row);
                    if (reld.length > 0) {
                        value = reld[0].value >= 0 ? reld[0].value : -1 / reld[0].value;
                    }
                    const reli = relations.filter(relation => relation.from === row && relation.to === col);
                    if (reli.length > 0) {
                        value = reli[0].value > 0 ? 1 / reli[0].value : -1 * reli[0].value;
                    }
                    colSums[key] += value;
                    return value;
                });
            });

            matrix.forEach((row, rkey) => {
                row.forEach((col, ckey) => {
                    rowSums[rkey].value += col / colSums[ckey];
                });
            });

            this.weightsCollection.all.forEach(weight => {
                const row = rowSums.filter(r => r.id === weight.criterion.id);
                if (row.length > 0) {
                    weight.value = row[0].value / criteria.length;
                    this.weightsCollection.update(weight);
                }
            });
        }

        return this;
    }
}

export default WeightAssignment;