import {Raster} from './gis';
import RulesCollection from './criteria/RulesCollection';
import {suitabilityRules} from 'scenes/t05/defaults/gis';

class Suitability {
    _raster = new Raster();
    _rules = RulesCollection.fromArray(suitabilityRules);

    static fromObject(obj) {
        const suitability = new Suitability();
        suitability.raster = obj.raster ? Raster.fromObject(obj.raster) : new Raster();
        suitability.rulesCollection = obj.rules ? RulesCollection.fromArray(obj.rules) : RulesCollection.fromArray(suitabilityRules);
        return suitability;
    }

    set raster(value) {
        this._raster = value;
    }

    get raster() {
        return this._raster;
    }

    set rulesCollection(value) {
        this._rules = value;
    }

    get rulesCollection() {
        return this._rules;
    }

    toObject() {
        return ({
            raster: this.raster.toObject(),
            rules: this.rulesCollection.toArray()
        });
    }

    toPayload() {
        return ({
            raster: this.raster.toPayload(),
            rules: this.rulesCollection.toArray()
        });
    }

    generateLegend(mode = 'reclassified') {
        return this.raster.generateLegend(this.rulesCollection, 'continuous', mode);
    }
}

export default Suitability;