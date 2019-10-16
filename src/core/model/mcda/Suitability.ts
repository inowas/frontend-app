import {CriteriaType} from './criteria/Criterion.type';
import RulesCollection from './criteria/RulesCollection';
import {RasterLayer} from './gis';
import {ISuitability} from './Suitability.type';

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
            rules: []
        });
    }

    public static fromObject(obj: ISuitability) {
        return new Suitability(obj);
    }

    protected _props: ISuitability;

    constructor(obj: ISuitability) {
        this._props = obj;
    }

    public toObject() {
        return this._props;
    }

    public generateLegend(mode = 'reclassified') {
        return this.raster.generateLegend(this.rulesCollection, CriteriaType.CONTINUOUS, mode);
    }
}

export default Suitability;
