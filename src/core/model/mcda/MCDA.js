import {CriteriaCollection, WeightAssignmentsCollection} from './criteria';
import {GisMap} from './gis';
import math from 'mathjs';
import Suitability from './Suitability';

class MCDA {
    _criteria = new CriteriaCollection();
    _weightAssignments = new WeightAssignmentsCollection();
    _constraints = new GisMap();
    _withAhp = false;
    _suitability = new Suitability();

    static fromObject(obj) {
        const mcda = new MCDA();
        mcda.constraints = GisMap.fromObject(obj.constraints);
        mcda.criteriaCollection = CriteriaCollection.fromArray(obj.criteria);
        mcda.suitability = obj.suitability ? Suitability.fromObject(obj.suitability) : new Suitability();
        mcda.weightAssignmentsCollection = WeightAssignmentsCollection.fromArray(obj.weight_assignments);
        mcda.withAhp = obj.with_ahp;
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
            constraints: this.constraints.toObject(),
            criteria: this.criteriaCollection.toArray(),
            suitability: this.suitability.toObject(),
            weight_assignments: this.weightAssignmentsCollection.toArray(),
            with_ahp: this.withAhp
        });
    }

    toProject() {
        return ({
            constraints: this.constraints.toObject(),
            suitability: this.suitability.toObject(),
            weight_assignments: this.weightAssignmentsCollection.toArray(),
            with_ahp: this.withAhp
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

            console.log({suit: criterion.suitability, data: criterion.suitability.data, weight: weight});

            return math.dotMultiply(criterion.suitability.data, weight);
        });

        console.log('DATA 1', data);

        const rasterData = this.suitability.raster;

        rasterData.boundingBox = criteria[0].suitability.boundingBox;
        rasterData.gridSize = this.constraints.gridSize;
        rasterData.data = math.add(...data);

        console.log('DATA 2', rasterData);

        // STEP 2: multiply with constraints
        this.criteriaCollection.all.forEach(c => {
            if (c.constraintRaster && c.constraintRaster.data.length > 0) {
                rasterData.data = math.dotMultiply(rasterData.data, c.constraintRaster.data);
            }
        });

        // STEP 3: multiply global constraints
        if (this.constraints.raster && this.constraints.raster.data.length > 0) {
            rasterData.data = math.dotMultiply(rasterData.data, this.constraints.raster.data);
        }

        this.suitability.raster = rasterData.calculateMinMax();

        return this;
    }
}

export default MCDA;