import {cloneDeep as _cloneDeep} from 'lodash';
import math from 'mathjs';
import {multiplyElementWise} from './calculations';
import {CriteriaCollection, WeightAssignmentsCollection} from './criteria';
import {GisMap} from './gis';
import {IMCDA} from './MCDA.type';
import Suitability from './Suitability';
import { BoundingBox } from '../geometry';
import {Array2D} from '../geometry/Array2D.type';

class MCDA {

    get criteriaCollection() {
        return CriteriaCollection.fromObject(this._props.criteria);
    }

    set criteriaCollection(value) {
        this._props.criteria = value.toObject();
    }

    get weightAssignmentsCollection() {
        return WeightAssignmentsCollection.fromObject(this._props.weightAssignments);
    }

    set weightAssignmentsCollection(value) {
        this._props.weightAssignments = value.toObject();
    }

    get constraints() {
        return GisMap.fromObject(this._props.constraints);
    }

    set constraints(value) {
        this._props.constraints = value.toObject();
    }

    get withAhp() {
        return this._props.withAhp;
    }

    set withAhp(value) {
        this._props.withAhp = value;
    }

    get suitability() {
        return Suitability.fromObject(this._props.suitability);
    }

    set suitability(value) {
        this._props.suitability = value.toObject();
    }

    public static fromObject(obj: IMCDA) {
        return new MCDA(obj);
    }

    protected _props: IMCDA;

    constructor(obj: IMCDA) {
        this._props = obj;
    }

    public toObject() {
        return this._props;
    }

    public toPayload() {
        return ({
            constraints: this.constraints.toPayload(),
            criteria: this.criteriaCollection.toPayload(),
            suitability: this.suitability.toPayload(),
            weight_assignments: this.weightAssignmentsCollection.toObject(),
            with_ahp: this.withAhp
        });
    }

    public calculate() {
        const criteria = !this.withAhp ? this.criteriaCollection.all : this.criteriaCollection.all.filter(
            (c) => c.parent
        );
        const weights = this.weightAssignmentsCollection.collectActiveWeights();

        // STEP 1: multiply parent weight with weight and criteria data
        const data = criteria.map((criterion) => {
            let parentWeightValue = 1;
            if (this.withAhp) {
                const parentWeight = weights.all.filter((w) => w.criterion && w.criterion.id === criterion.parent);
                if (parentWeight.length === 1) {
                    parentWeightValue = parentWeight[0].value;
                }
            }

            let weight = 1;
            const filteredWeight = weights.all.filter((w) => w.criterion && w.criterion.id === criterion.id);
            if (filteredWeight.length === 1) {
                weight = filteredWeight[0].value * parentWeightValue;
            }

            return math.dotMultiply(criterion.suitability.data, weight);
        });

        const rasterData = _cloneDeep(this.suitability.raster);

        rasterData.boundingBox = BoundingBox.fromObject(criteria[0].suitability.boundingBox);
        rasterData.gridSize = this.constraints.gridSize;
        // TODO rasterData.data = math.add(...data);

        // STEP 2: multiply with constraints
        this.criteriaCollection.all.forEach((c) => {
            if (c.constraintRaster && c.constraintRaster.data.length > 0) {
                // todo: constraints should have value NULL and not 0
                rasterData.data = multiplyElementWise(rasterData.data, c.constraintRaster.data) as Array2D<number>;
            }
        });

        // STEP 3: multiply global constraints
        if (this.constraints.raster && this.constraints.raster.data.length > 0) {
            rasterData.data = multiplyElementWise(rasterData.data, this.constraints.raster.data) as Array2D<number>;
        }

        this.suitability.raster = rasterData.calculateMinMax();

        return this;
    }
}

export default MCDA;
