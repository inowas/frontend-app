import {CriteriaCollection, WeightAssignmentCollection} from './criteria';

class MCDA {
    _criteria = new CriteriaCollection();
    _weightAssignments = new WeightAssignmentCollection();

    static fromObject(obj) {
        const mcda = new MCDA();
        mcda.criteriaCollection = CriteriaCollection.fromArray(obj.criteria);
        mcda.weightAssignmentsCollection = WeightAssignmentCollection.fromArray(obj.weightAssignments);
        return mcda;
    }

    get criteriaCollection() {
        return this._criteria;
    }

    set criteriaCollection(value) {
        this._criteria = value;
    }

    get weightAssignmentsCollection() {
        return this._weightAssignments;
    }

    set weightAssignmentsCollection(value) {
        this._weightAssignments = value;
    }

    toObject() {
        return ({
            criteria: this.criteriaCollection.toArray(),
            weightAssignments: this.weightAssignmentsCollection.toArray()
        });
    }

    updateCriteria(criteriaCollection) {
        if (!(criteriaCollection instanceof CriteriaCollection)) {
            throw new Error('CriteriaCollection expected to be of type CriteriaCollection.');
        }

        this.criteriaCollection = criteriaCollection;
    }
}

export default MCDA;