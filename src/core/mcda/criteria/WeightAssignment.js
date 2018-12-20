import uuidv4 from 'uuid/v4';
import {CriteriaCollection, Weight, WeightsCollection} from './index';

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

    static fromMethodAndCriteria(method, criteriaCollection) {
        if(!(criteriaCollection instanceof CriteriaCollection)) {
            throw new Error('CriteriaCollection expected to be instance of CriteriaCollection');
        }

        const wa = new WeightAssignment();
        wa.method = method;
        wa.name = methods[method];
        criteriaCollection.all.forEach((criterion, key) => {
            const weight = new Weight();
            weight.criterion = criterion;
            weight.rank = key + 1;
            wa.weightsCollection.add(weight);
        });
        wa.calculateWeights();
        return wa;
    }

    static fromObject(obj) {
        const wa = new WeightAssignment();
        wa.id = obj.id;
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

    get method() {
        return this._method;
    }

    set method(value) {
        if(!methods.hasOwnProperty(value)) {
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

        return this;
    }
}

export default WeightAssignment;