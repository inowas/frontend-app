import uuidv4 from 'uuid/v4';
import {calculatePwcWeights} from '../calculations';
import CriteriaCollection from './CriteriaCollection';
import {ICriteriaRelation} from './CriteriaRelation.type';
import {CriteriaRelation, Weight, WeightsCollection} from './index';
import {IWeightAssignment, WeightAssignmentType} from './WeightAssignment.type';

const methods = {
    spl: 'Simple Weights',
    rnk: 'Ranking',
    rrw: 'Reciprocal Ranking',
    mif: 'Multi-Influence Factor',
    pwc: 'Pairwise Comparison',
    ahp: 'Analytical Hierarchy Process'
};

class WeightAssignment {

    get id() {
        return this._props.id;
    }

    set id(value) {
        this._props.id = value ? value : uuidv4();
    }

    get meta() {
        return this._props.meta;
    }

    set meta(value) {
        this._props.meta = value;
    }

    get isActive() {
        return this._props.isActive;
    }

    set isActive(value) {
        this._props.isActive = value;
    }

    get method() {
        return this._props.method;
    }

    set method(value) {
        this._props.method = value;
    }

    get subMethod() {
        return this._props.subMethod;
    }

    set subMethod(value) {
        this._props.subMethod = value;
    }

    get subParam() {
        return this._props.subParam;
    }

    set subParam(value) {
        this._props.subParam = value;
    }

    get name() {
        return this._props.name;
    }

    set name(value) {
        this._props.name = value;
    }

    get parent() {
        return this._props.parent;
    }

    set parent(value) {
        this._props.parent = value;
    }

    get weightsCollection(): WeightsCollection {
        return WeightsCollection.fromObject(this._props.weights);
    }

    set weightsCollection(value: WeightsCollection) {
        this._props.weights = value.toObject();
    }

    public static fromDefaults() {
        return new WeightAssignment({
            id: uuidv4(),
            meta: {},
            method: WeightAssignmentType.RNK,
            subMethod: '',
            subParam: 0,
            name: 'New Weight Assignment',
            weights: [],
            isActive: false,
            parent: null
        });
    }

    public static fromMethodAndCriteria(method: WeightAssignmentType, criteriaCollection: CriteriaCollection) {
        const wa = WeightAssignment.fromDefaults();
        wa.method = method;
        wa.name = methods[method];

        if (method === 'rnk') {
            wa.subMethod = 'sum';
        }

        const addedRelations: string[] = [];

        criteriaCollection.all.forEach((criterion, key) => {
            const weight = Weight.fromDefaults();
            weight.criterion = {
                id: criterion.id,
                name: criterion.name
            };
            weight.initialValue = key + 1;

            addedRelations.push(weight.criterion.id);
            if (method === 'pwc') {
                weight.relations = criteriaCollection.all.filter((c) => !addedRelations.includes(c.id)).map(
                    (cc) => {
                        const cr = CriteriaRelation.fromDefaults();
                        cr.to = cc.id;
                        cr.value = 1;
                        return cr;
                    }
                );
            }

            wa.weightsCollection.add(weight);
        });

        wa.calculateWeights();
        return wa;
    }

    public static fromObject(obj: IWeightAssignment) {
        return new WeightAssignment(obj);
    }

    protected _props: IWeightAssignment;

    constructor(obj: IWeightAssignment) {
        this._props = obj;
    }

    public toObject() {
        return this._props;
    }

    public calculateWeights() {
        const weights = this.weightsCollection;

        if (!weights) {
            return null;
        }

        if (this.method === 'spl') {
            const sum = weights.sumBy('initialValue');
            weights.all.forEach((weight) => {
                if (sum > 0) {
                    weight.value = weight.initialValue / sum;
                }
                this.weightsCollection.update(weight);
            });
        }

        if (this.method === 'rnk') {
            const variables = weights.all.map((w) => {
                return {
                    rank: w.initialValue,
                    n: weights.length - w.initialValue + 1,
                    r: 1 / w.initialValue
                };
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

            const variables = weights.all.map((w) => {
                const score = w.relations.filter(
                    (r: ICriteriaRelation) => r.value === 1
                ).length + 0.5 * w.relations.filter(
                    (r: ICriteriaRelation) => r.value === 0
                ).length;
                nScore += score;

                return {
                    id: w.id,
                    score
                };
            });

            weights.all.forEach((weight, key) => {
                weight.value = variables[key].score / nScore;
                this.weightsCollection.update(weight);
            });
        }

        if (this.method === 'pwc') {
            const criteria = this.weightsCollection.allCriteriaIds;
            const relations = this.weightsCollection.allRelations;

            if (criteria) {
                const results = calculatePwcWeights(criteria as string[], relations);

                weights.all.forEach((weight) => {
                    if (weight.criterion) {
                        weight.value = results[weight.criterion.id].w;
                        this.meta.consistency = results.cr;
                        this.weightsCollection.update(weight);
                    }
                });
            }
        }

        return this;
    }
}

export default WeightAssignment;
