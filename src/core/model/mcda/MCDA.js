import {CriteriaCollection, WeightAssignmentsCollection} from './criteria';
import {GisMap, Raster} from './gis';
import math from 'mathjs';
import RulesCollection from './criteria/RulesCollection';
import {suitabilityRules} from 'scenes/t05/defaults/gis';

class MCDA {
    _criteria = new CriteriaCollection();
    _weightAssignments = new WeightAssignmentsCollection();
    _constraints = new GisMap();
    _withAhp = false;
    _suitability = new Raster();
    _suitabilityRules = new RulesCollection();

    static fromObject(obj) {
        const mcda = new MCDA();
        mcda.criteriaCollection = CriteriaCollection.fromArray(obj.criteria);
        mcda.weightAssignmentsCollection = WeightAssignmentsCollection.fromArray(obj.weightAssignments);
        mcda.constraints = GisMap.fromObject(obj.constraints);
        mcda.withAhp = obj.withAhp;
        mcda.suitability = obj.suitability ? Raster.fromObject(obj.suitability) : new Raster();
        mcda.suitabilityRules = obj.suitabilityRules ? RulesCollection.fromArray(obj.suitabilityRules) : RulesCollection.fromArray(suitabilityRules);
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

    get suitabilityRules() {
        return this._suitabilityRules;
    }

    set suitabilityRules(value) {
        this._suitabilityRules = value;
    }

    toObject() {
        return ({
            criteria: this.criteriaCollection.toArray(),
            weightAssignments: this.weightAssignmentsCollection.toArray(),
            constraints: this.constraints.toObject(),
            withAhp: this.withAhp,
            suitability: this.suitability.toObject(),
            suitabilityRules: this.suitabilityRules.toArray()
        });
    }

    updateCriteria(criteriaCollection) {
        if (!(criteriaCollection instanceof CriteriaCollection)) {
            throw new Error('CriteriaCollection expected to be of type CriteriaCollection.');
        }

        this.criteriaCollection = criteriaCollection;
    }

    calculate() {
        const criteria = !this.withAhp ? this.criteriaCollection.all : this.criteriaCollection.all.filter(c => c.parentId);
        const weights = this.weightAssignmentsCollection.collectActiveWeights();

        // STEP 1: multiply parent weight with weight and criteria data
        const data = criteria.map(criterion => {
            let parentWeightValue = 1;
            if (this.withAhp) {
                const parentWeight = weights.all.filter(w => w.criterion.id === criterion.parentId);
                if (parentWeight.length === 1) {
                    parentWeightValue = parentWeight[0].value;
                }
            }

            let weight = 1;
            const filteredWeight = weights.all.filter(w => w.criterion.id === criterion.id);
            if (filteredWeight.length === 1) {
                weight = filteredWeight[0].value * parentWeightValue;
            }

            return math.dotMultiply(criterion.suitability.data, weight);
        });

        this.suitability.boundingBox = criteria[0].suitability.boundingBox;
        this.suitability.gridSize = this.constraints.gridSize;
        this.suitability.data = math.add(...data);

        // STEP 2: multiply with constraints
        this.criteriaCollection.all.forEach(c => {
            if (c.constraintRaster && c.constraintRaster.data.length > 0) {
                this.suitability.data = math.dotMultiply(this.suitability.data, c.constraintRaster.data);
            }
        });

        // STEP 3: multiply global constraints
        if (this.constraints.raster && this.constraints.raster.data.length > 0) {
            this.suitability.data = math.dotMultiply(this.suitability.data, this.constraints.raster.data);
        }

        this.suitability.calculateMinMax();

        return this;
    }
}

export default MCDA;