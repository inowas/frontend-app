import {cloneDeep} from 'lodash';
import {suitabilityRules} from '../../../scenes/t05/defaults/gis';
import {CriteriaType} from './criteria/Criterion.type';
import {IRule} from './criteria/Rule.type';
import RulesCollection from './criteria/RulesCollection';
import {RasterLayer} from './gis';
import {ISuitability, ISuitability1v0} from './Suitability.type';

class Suitability {

    set raster(value) {
        this._props.raster = value.toObject();
    }

    get raster() {
        return RasterLayer.fromObject(this._props.raster);
    }

    set rulesCollection(value) {
        this._props.rules = value.toObject();
    }

    get rulesCollection() {
        return RulesCollection.fromObject(this._props.rules);
    }

    public static fromDefault() {
        return new Suitability({
            raster: RasterLayer.fromDefaults().toObject(),
            rules: RulesCollection.fromObject(suitabilityRules).toObject()
        });
    }

    public static fromObject(obj: ISuitability) {
        return new Suitability(obj);
    }

    public static update1v0to1v1(suitability: ISuitability1v0): ISuitability {
        return {
            raster: RasterLayer.update1v0to1v1(suitability.raster),
            rules: suitability.rules
        };
    }

    protected _props: ISuitability;

    constructor(obj: ISuitability) {
        this._props = obj;
    }

    public removeRule(id: string) {
        this.rulesCollection = this.rulesCollection.removeById(id);
        return this;
    }

    public updateRule(rule: IRule) {
        this.rulesCollection = this.rulesCollection.update(rule);
        return this;
    }

    public toObject() {
        return cloneDeep(this._props);
    }

    public generateLegend(mode = 'reclassified') {
        return this.raster.generateLegend(this.rulesCollection, CriteriaType.CONTINUOUS, mode);
    }
}

export default Suitability;
