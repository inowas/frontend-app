import {CriteriaCollection, CriteriaRelation, Weight, WeightAssignment, WeightAssignmentCollection} from './criteria';

class MCDA {
    _criteria = new CriteriaCollection();
    _weightAssignments = new WeightAssignmentCollection();

    static fromObject(obj) {
        const mcda = new MCDA();
        mcda.criteria = CriteriaCollection.fromArray(obj.criteria);
        mcda.weightAssignments = WeightAssignmentCollection.fromArray(obj.weightAssignments);
        return mcda;
    }

    get criteria() {
        return this._criteria;
    }

    set criteria(value) {
        this._criteria = value;
    }

    get weightAssignments() {
        return this._weightAssignments;
    }

    set weightAssignments(value) {
        this._weightAssignments = value;
    }

    toObject() {
        return ({
            criteria: this.criteria.toArray(),
            weightAssignments: this.weightAssignments.toArray()
        });
    }

    addWeightAssignment(method) {
        const wa = new WeightAssignment();
        wa.method = method;

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

            wa.weights.add(weight);
        });

        this.weightAssignments.add(wa);
    }

    updateCriteria(criteria) {
        if (!(criteria instanceof CriteriaCollection)) {
            throw new Error('Criteria expected to be of type CriteriaCollection.');
        }

        this.criteria = criteria;
        this.weightAssignments.updateCriteria(criteria);
    }
}

export default MCDA;