import RulesCollection from './criteria/RulesCollection';
import {Raster} from './gis';
import {ISuitability} from './Suitability.type';

class Suitability {

    set raster(value) {
        this._props.raster = value.toObject();
    }

    get raster() {
        return Raster.fromObject(this._props.raster);
    }

    set rulesCollection(value) {
        this._props.rules = value.toObject();
    }

    get rulesCollection() {
        return RulesCollection.fromObject(this._props.rules);
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

    public toPayload() {
        return ({
            raster: this.raster.toPayload(),
            rules: this.rulesCollection.toObject()
        });
    }

    public generateLegend(mode = 'reclassified') {
        return this.raster.generateLegend(this.rulesCollection, 'continuous', mode);
    }
}

export default Suitability;
