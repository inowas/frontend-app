import {cloneDeep} from 'lodash';
import math from 'mathjs';
import uuidv4 from 'uuid/v4';
import {BoundingBox, GridSize} from '../geometry';
import {Array2D} from '../geometry/Array2D.type';
import {multiplyElementWise} from './calculations';
import {CriteriaCollection, WeightAssignmentsCollection} from './criteria';
import Criterion from './criteria/Criterion';
import {Gis, RasterLayer} from './gis';
import {IMCDA} from './MCDA.type';
import Suitability from './Suitability';

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
        return Gis.fromObject(this._props.constraints);
    }

    set constraints(value) {
        this._props.constraints = value.toObject();
    }

    get gridSize() {
        return GridSize.fromObject(this._props.gridSize);
    }

    set gridSize(value) {
        this._props.gridSize = value.toObject();
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
        return new MCDA(cloneDeep(obj));
    }

    public static fromDefaults() {
        return new MCDA({
            constraints: {
                activeCells: [],
                boundingBox: [[0, 0], [0, 0]],
                gridSize: {
                    n_x: 10,
                    n_y: 10
                },
                rasterLayer: (RasterLayer.fromDefaults()).toObject(),
                vectorLayers: []
            },
            criteria: [],
            gridSize: {
                n_x: 10,
                n_y: 10
            },
            suitability: {
                raster: (RasterLayer.fromDefaults()).toObject(),
                rules: []
            },
            weightAssignments: [],
            withAhp: false
        });
    }

    protected _props: IMCDA;

    constructor(obj: IMCDA) {
        this._props = obj;
    }
    public addCriterion(criterion: Criterion) {
        this.criteriaCollection = this.criteriaCollection.add(criterion.toObject());
        return this;
    }

    public updateCriterion(criterion: Criterion) {
        this.criteriaCollection = this.criteriaCollection.update(criterion.toObject());
        return this;
    }

    public toObject() {
        return cloneDeep(this._props);
    }

    public toPayload() {
        return ({
            constraints: this.constraints ? this.constraints.toPayload() : undefined,
            criteria: this.criteriaCollection.toPayload(),
            grid_size: this.gridSize,
            suitability: this.suitability.toPayload(),
            weight_assignments: this.weightAssignmentsCollection.toObject(),
            with_ahp: this.withAhp
        });
    }

    public calculate() {
        let rasterData = new RasterLayer({
            boundingBox: [],
            gridSize: this.gridSize.toObject(),
            data: [],
            id: uuidv4(),
            isFetching: false,
            min: 0,
            max: 0,
            url: ''
        });

        if (this.suitability.raster) {
            rasterData = cloneDeep(this.suitability.raster);
        }

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

            return math.dotMultiply(criterion.suitability.raster.data, weight);
        });

        rasterData.boundingBox = BoundingBox.fromObject(criteria[0].suitability.raster.boundingBox);
        rasterData.gridSize = this.gridSize;
        // TODO: rasterData.data = math.add(...data);

        // STEP 2: multiply with constraints
        this.criteriaCollection.all.forEach((c) => {
            if (c.constraintRaster && c.constraintRaster.data.length > 0) {
                // todo: constraints should have value NULL and not 0
                rasterData.data = multiplyElementWise(rasterData.data, c.constraintRaster.data) as Array2D<number>;
            }
        });

        // STEP 3: multiply global constraints
        if (this.constraints && this.constraints.rasterLayer && this.constraints.rasterLayer.data.length > 0) {
            rasterData.data = multiplyElementWise(rasterData.data, this.constraints.rasterLayer.data);
        }

        this.suitability.raster = rasterData.calculateMinMax();

        return this;
    }
}

export default MCDA;
