import {CriteriaCollection, CriteriaRelation, Weight, WeightsCollection} from './criteria';

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

    addWeightAssignmentMethod(method) {
        this.criteria.all.forEach((c, cix) => {
            const weight = new Weight();
            weight.method = method;
            weight.criteria = c;
            weight.rank = cix + 1;

            if (method === 'pwc') {
                weight.relations = this.criteria.all.filter(c => c.id !== weight.criteria.id).map(c => {
                    const relation = new CriteriaRelation();
                    relation.to = c.id;
                    return relation;
                });
            }

            if (!this.weights.findByCriteriaAndMethod(c, method)) {
                this.weights.add(weight);
            }
        });
    }

    updateCriteria(criteria) {
        if (!(criteria instanceof CriteriaCollection)) {
            throw new Error('Criteria expected to be of type CriteriaCollection.');
        }

        this.criteria = criteria;
        this.weights.updateCriteria(criteria);
    }
}

export default MCDA;