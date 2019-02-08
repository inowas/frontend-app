import {CriteriaCollection, WeightAssignmentsCollection} from './criteria';
import {GisMap, Raster} from './gis';
import math from 'mathjs';

class MCDA {
    _criteria = new CriteriaCollection();
    _weightAssignments = new WeightAssignmentsCollection();
    _constraints = new GisMap();
    _withAhp = false;
    _suitability = new Raster();

    static fromObject(obj) {
        const mcda = new MCDA();
        mcda.criteriaCollection = CriteriaCollection.fromArray(obj.criteria);
        mcda.weightAssignmentsCollection = WeightAssignmentsCollection.fromArray(obj.weightAssignments);
        mcda.constraints = GisMap.fromObject(obj.constraints);
        mcda.withAhp = obj.withAhp;
        mcda.suitability = obj.suitability ? Raster.fromObject(obj.suitability) : new Raster();
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

    get suitability() {
        return this._suitability;
    }

    set suitability(value) {
        this._suitability = value;
    }

    toObject() {
        return ({
            criteria: this.criteriaCollection.toArray(),
            weightAssignments: this.weightAssignmentsCollection.toArray(),
            constraints: this.constraints.toObject(),
            withAhp: this.withAhp,
            suitability: this.suitability.toObject()
        });
    }

    updateCriteria(criteriaCollection) {
        if (!(criteriaCollection instanceof CriteriaCollection)) {
            throw new Error('CriteriaCollection expected to be of type CriteriaCollection.');
        }

        this.criteriaCollection = criteriaCollection;
    }

    calculate() {
        let boundingBox;
        const wa = this.weightAssignmentsCollection.findBy('isActive', true, {first: true});
        if (!wa) {
            throw new Error('There is no active weight assignment method.');
        }

        // STEP 1: multiply criteria data with weights
        const data = this.criteriaCollection.all.map(criterion => {
            if (!criterion.suitability || criterion.suitability.data.length === 0) {
                throw new Error(`There is no suitability array for criterion ${criterion.name}.`);
            }
            const weight = wa.weightsCollection.findByCriteriaId(criterion.id);
            if (!weight) {
                throw new Error(`There is no weight for criterion ${criterion.name}.`);
            }
            boundingBox = criterion.suitability.boundingBox;
            return math.dotMultiply(criterion.suitability.data, weight.value);
        });

        this.suitability.boundingBox = boundingBox;
        this.suitability.gridSize = this.constraints.gridSize;
        this.suitability.data = math.add(...data);

        // STEP 2: multiply with constraints
        this.criteriaCollection.all.forEach(c => {
            if (c.constraintRaster && c.constraintRaster.data.length > 0) {
                this.suitability.data = math.dotMultiply(this.suitability.data, c.constraintRaster.data);
            }
        });


        this.suitability.calculateMinMax();

        return this;
    }
}

export default MCDA;