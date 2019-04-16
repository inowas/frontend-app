import uuidv4 from 'uuid/v4';
import {CriteriaRelation, Weight, WeightsCollection} from './index';
import AbstractCollection from '../../collection/AbstractCollection';
import {calculatePwcWeights} from '../calculations';

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
    _meta = {};
    _method = 'rnk';
    _subMethod = '';
    _subParam = 0;
    _name = 'New Weight Assignment';
    _weights = new WeightsCollection();
    _isActive = false;
    _parent = null;

    static fromMethodAndCriteria(method, criteriaCollection) {
        if (!(criteriaCollection instanceof AbstractCollection)) {
            throw new Error('CriteriaCollection expected to be instance of AbstractCollection');
        }

        const wa = new WeightAssignment();
        wa.method = method;
        wa.name = methods[method];

        if (method === 'rnk') {
            wa.subMethod = 'sum';
        }

        let addedRelations = [];

        criteriaCollection.all.forEach((criterion, key) => {
            const weight = new Weight();
            weight.criterion = {
                id: criterion.id,
                name: criterion.name
            };
            weight.initialValue = key + 1;

            addedRelations.push(weight.criterion.id);
            if (method === 'pwc') {
                weight.relations = criteriaCollection.all.filter(c => !addedRelations.includes(c.id)).map(criterion => {
                    const cr = new CriteriaRelation();
                    cr.to = criterion.id;
                    cr.value = 1;
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
        wa.meta = obj.meta || {};
        wa.method = obj.method;
        wa.subMethod = obj.subMethod;
        wa.subParam = obj.subParam;
        wa.name = obj.name;
        wa.parent = obj.parent;
        wa.weightsCollection = WeightsCollection.fromArray(obj.weights);
        return wa;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value ? value : uuidv4();
    }

    get meta() {
        return this._meta;
    }

    set meta(value) {
        this._meta = value;
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

    get subMethod() {
        return this._subMethod;
    }

    set subMethod(value) {
        this._subMethod = value;
    }

    get subParam() {
        return this._subParam;
    }

    set subParam(value) {
        this._subParam = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get parent() {
        return this._parent;
    }

    set parent(value) {
        this._parent = value;
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
            meta: this.meta,
            isActive: this.isActive,
            method: this.method,
            subMethod: this.subMethod,
            subParam: this.subParam,
            name: this.name,
            parent: this.parent,
            weights: this.weightsCollection.toArray()
        });
    }

    calculateWeights() {
        const weights = this.weightsCollection;

        if (!weights) {
            return null;
        }

        if (this.method === 'spl') {
            const sum = weights.sumBy('initialValue');
            weights.all.forEach(weight => {
                if (sum > 0) {
                    weight.value = (parseFloat(weight.initialValue) / sum).toFixed(3);
                }
                this.weightsCollection.update(weight);
            });
        }

        if (this.method === 'rnk') {
            const variables = weights.all.map(w => {
                return {
                    rank: w.initialValue,
                    n: weights.length - w.initialValue + 1,
                    r: 1 / w.initialValue
                }
            });

            const sum = variables.reduce((prev, cur) => {
                if (this.subMethod === 'rec') {
                    return prev + cur.r;
                }
                if (this.subMethod === 'exp') {
                    return prev + Math.pow(cur.n, this.subParam);
                }
                return prev + cur.n;
            }, 0);

            weights.all.forEach((weight, key) => {
                if (this.subMethod === 'sum') {
                    weight.value = variables[key].n / sum;
                }
                if (this.subMethod === 'rec') {
                    weight.value = variables[key].r / sum;
                }
                if (this.subMethod === 'exp') {
                    weight.value = Math.pow(variables[key].n, this.subParam) / sum;
                }
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

            const results = calculatePwcWeights(criteria, relations);

            weights.all.forEach(weight => {
                weight.value = results[weight.criterion.id].w;
                this.meta.consistency = results.cr;
                this.weightsCollection.update(weight);
            });
        }

        return this;
    }
}

export default WeightAssignment;