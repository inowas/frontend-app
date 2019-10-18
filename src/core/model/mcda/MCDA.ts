import {cloneDeep} from 'lodash';
import math from 'mathjs';
import uuidv4 from 'uuid/v4';
import {LATEST_VERSION} from '../../../scenes/t05/defaults/defaults';
import {BoundingBox, GridSize} from '../geometry';
import {Array2D} from '../geometry/Array2D.type';
import {multiplyElementWise, sumRasters} from './calculations';
import {CriteriaCollection, WeightAssignmentsCollection} from './criteria';
import Criterion from './criteria/Criterion';
import WeightAssignment from './criteria/WeightAssignment';
import {Gis, RasterLayer} from './gis';
import {IMCDA, IMCDAPayload} from './MCDA.type';
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

    get version() {
        return this._props.version;
    }

    set version(value) {
        this._props.version = value;
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

    public static fromDefaults() {
        return new MCDA({
            constraints: {
                activeCells: [],
                boundingBox: [[0, 0], [0, 0]],
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
            version: LATEST_VERSION,
            weightAssignments: [],
            withAhp: false
        });
    }

    public static fromPayload(obj: IMCDAPayload) {
        return new MCDA({
            constraints: obj.constraints,
            criteria: obj.criteria,
            gridSize: obj.grid_size,
            suitability: obj.suitability,
            version: obj.version,
            weightAssignments: obj.weight_assignments,
            withAhp: obj.with_ahp
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

    public addSubCriterion(id: string) {
        const criterion = Criterion.fromDefaults();
        criterion.parent = id;
        this.addCriterion(criterion);
        return this;
    }

    public removeCriterion(id: string) {
        const criteriaCollection = this.criteriaCollection;
        criteriaCollection.removeById(id);
        criteriaCollection.getSubCriteria(id).forEach((c) => {
            criteriaCollection.removeById(c.id);
        });
        this.criteriaCollection = criteriaCollection;
        return this;
    }

    public updateCriterion(criterion: Criterion) {
        this.criteriaCollection = this.criteriaCollection.update(criterion.toObject());
        return this;
    }

    public toggleAhp() {
        this.withAhp = !this.withAhp;
        return this;
    }

    public addWeightAssignment(wa: WeightAssignment) {
        this.weightAssignmentsCollection = this.weightAssignmentsCollection.add(wa.toObject());
        return this;
    }

    public updateWeightAssignment(wa: WeightAssignment) {
        this.weightAssignmentsCollection = this.weightAssignmentsCollection.update(wa.toObject());
        return this;
    }

    public removeWeightAssignment(id: string) {
        this.weightAssignmentsCollection = this.weightAssignmentsCollection.removeById(id);
        return this;
    }

    public toObject() {
        return cloneDeep(this._props);
    }

    public toPayload() {
        return {
            constraints: this.constraints.toObject(),
            criteria: this.criteriaCollection.toObject(),
            grid_size: this.gridSize.toObject(),
            suitability: this.suitability.toObject(),
            version: this.version,
            weight_assignments: this.weightAssignmentsCollection.toObject(),
            with_ahp: this.withAhp
        };
    }

    public calculate() {
        let rasterData = new RasterLayer({
            boundingBox: [],
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
        const weights = this.weightAssignmentsCollection.activeWeights();

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
        rasterData.data = sumRasters(data as Array<Array2D<number>>);

        // STEP 2: multiply with constraints
        this.criteriaCollection.all.forEach((c) => {
            if (c.constraintRaster && c.constraintRaster.data.length > 0) {
                // todo: constraints should have value NULL and not 0
                rasterData.data = multiplyElementWise(rasterData.data, c.constraintRaster.data) as Array2D<number>;
            }
        });

        /*// STEP 3: multiply global constraints
        if (this.constraints && this.constraints.rasterLayer && this.constraints.rasterLayer.data.length > 0) {
            rasterData.data = multiplyElementWise(rasterData.data, this.constraints.rasterLayer.data);
        }*/

        this.suitability.raster = rasterData.calculateMinMax();

        return this;
    }
}

export default MCDA;
