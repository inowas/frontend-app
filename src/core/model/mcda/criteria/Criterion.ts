import {cloneDeep} from 'lodash';
import * as math from 'mathjs';
import uuidv4 from 'uuid/v4';
import {Array2D} from '../../geometry/Array2D.type';
import RasterLayer from '../gis/RasterLayer';
import Suitability from '../Suitability';
import {CriteriaType, ICriterion} from './Criterion.type';
import RulesCollection from './RulesCollection';

class Criterion {

    get id() {
        return this._props.id;
    }

    set id(value) {
        this._props.id = value ? value : uuidv4();
    }

    get parentId() {
        return this._props.parent;
    }

    set parentId(value) {
        this._props.parent = value || null;
    }

    get name() {
        return this._props.name;
    }

    set name(value) {
        this._props.name = value;
    }

    get type() {
        return this._props.type;
    }

    set type(value) {
        this._props.type = value;
    }

    get unit() {
        return this._props.unit;
    }

    set unit(value) {
        this._props.unit = value;
    }

    get raster(): RasterLayer {
        return RasterLayer.fromObject(this._props.raster);
    }

    set raster(value: RasterLayer) {
        this._props.raster = value.toObject();
    }

    get rulesCollection(): RulesCollection {
        return RulesCollection.fromObject(this._props.rules);
    }

    set rulesCollection(value: RulesCollection) {
        this._props.rules = value.toObject();
    }

    get suitability(): Suitability {
        return Suitability.fromObject(this._props.suitability);
    }

    set suitability(value: Suitability) {
        this._props.suitability = value.toObject();
    }

    get constraintRaster(): RasterLayer {
        return RasterLayer.fromObject(this._props.constraintRaster);
    }

    set constraintRaster(value: RasterLayer) {
        this._props.constraintRaster = value.toObject();
    }

    get constraintRules(): RulesCollection {
        return RulesCollection.fromObject(this._props.constraintRules);
    }

    set constraintRules(value: RulesCollection) {
        this._props.constraintRules = value.toObject();
    }

    get step() {
        return this._props.step;
    }

    set step(value) {
        this._props.step = value;
    }

    public static fromDefaults() {
        return new Criterion({
            id: uuidv4(),
            parent: null,
            name: 'New Criterion',
            type: CriteriaType.CONTINUOUS,
            unit: '-',
            raster: RasterLayer.fromDefaults().toObject(),
            rules: [],
            suitability: Suitability.fromDefault().toObject(),
            constraintRaster: RasterLayer.fromDefaults().toObject(),
            constraintRules: [],
            step: 0
        });
    }

    public static fromObject(obj: ICriterion) {
        return new Criterion(obj);
    }

    protected _props: ICriterion;

    constructor(obj: ICriterion) {
        this._props = obj;
    }

    public toObject() {
        return this._props;
    }

    public toPayload() {
        return ({
            id: this.id,
            parentId: this.parentId,
            name: this.name,
            type: this.type,
            unit: this.unit,
            raster: this.raster.toPayload(),
            rules: this.rulesCollection.toObject(),
            suitability: this.suitability.toPayload(),
            constraintRaster: this.constraintRaster.toPayload(),
            constraintRules: this.constraintRules.toObject(),
            step: this.step
        });
    }

    public calculateRaster(raster: RasterLayer, rulesCollection: RulesCollection, factor: RasterLayer | null = null) {
        const newRaster = cloneDeep(raster);
        newRaster.boundingBox = raster.boundingBox;
        newRaster.gridSize = raster.gridSize;
        newRaster.data = cloneDeep(raster.data).map((row) => {
            return row.map((cell) => {
                const rules = rulesCollection.findByValue(cell);
                if (rules.length === 1) {
                    const rule = rules[0];
                    if (rule.type === 'fixed') {
                        return rule.value || NaN;
                    }
                    if (rule.type === 'calc') {
                        return math.eval(rule.expression, {min: raster.min, max: raster.max, x: cell});
                    }
                }
                return 1;
            });
        }) as Array2D<number>;

        if (factor && factor.data && factor.data.length > 0) {
            newRaster.data = newRaster.data.map((x, xKey) => {
                return x.map((y, yKey) => {
                    if (factor.data[xKey][yKey]) {
                        return y * factor.data[xKey][yKey];
                    }
                    return 0;
                });
            }) as Array2D<number>;
        }
        newRaster.calculateMinMax();
        return newRaster;
    }

    public calculateConstraints() {
        this.constraintRaster = this.calculateRaster(this.raster, this.constraintRules);
        this.suitability.raster = this.calculateRaster(this.raster, this.rulesCollection, this.constraintRaster);
    }

    public calculateSuitability() {
        this.suitability.raster = this.calculateRaster(this.raster, this.rulesCollection, this.constraintRaster);
    }

    public generateLegend(mode = 'unclassified') {
        return this.raster.generateLegend(this.rulesCollection, this.type, mode);
    }
}

export default Criterion;
