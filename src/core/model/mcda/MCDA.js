import {CriteriaCollection, WeightAssignmentsCollection} from './criteria';
import GisMap from './gis/GisMap';

class MCDA {
    _criteria = new CriteriaCollection();
    _weightAssignments = new WeightAssignmentsCollection();
    _constraints = new GisMap();
    _withAhp = false;

    static fromObject(obj) {
        const mcda = new MCDA();
        mcda.criteriaCollection = CriteriaCollection.fromArray(obj.criteria);
        mcda.weightAssignmentsCollection = WeightAssignmentsCollection.fromArray(obj.weightAssignments);
        mcda.constraints = GisMap.fromObject(obj.constraints);
        mcda.withAhp = obj.withAhp;
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

    get constraints() {
        return this._constraints;
    }

    set constraints(value) {
        this._constraints = value;
    }

    get withAhp() {
        return this._withAhp;
    }

    set withAhp(value) {
        this._withAhp = value;
    }

    toObject() {
        return ({
            criteria: this.criteriaCollection.toArray(),
            weightAssignments: this.weightAssignmentsCollection.toArray(),
            constraints: this.constraints.toObject(),
            withAhp: this.withAhp
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