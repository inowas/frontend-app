import uuidv4 from 'uuid/v4';
import Raster from '../gis/Raster';
import RulesCollection from './RulesCollection';
import {cloneDeep as _cloneDeep} from 'lodash';

const validTypes = ['discrete', 'continuous'];

class Criterion {
    _id = uuidv4();
    _name = 'New Criterion';
    _type = 'discrete';
    _raster = new Raster();
    _rules = new RulesCollection();
    _suitability = new Raster();

    static fromObject(obj) {
        const criterion = new Criterion();
        criterion.id = obj.id;
        criterion.name = obj.name;
        criterion.type = obj.type;
        criterion.raster = Raster.fromObject(obj.raster);
        criterion.rulesCollection = obj.rules ? RulesCollection.fromArray(obj.rules) : new RulesCollection();
        criterion.suitability = obj.suitability ? Raster.fromObject(obj.suitability) : Raster.fromObject(obj.raster);
        return criterion;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value ? value : uuidv4();
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        if (!validTypes.includes(value)) {
            throw new Error(`Invalid type ${value} of Criteria`);
        }
        this._type = value;
    }

    get raster() {
        return this._raster;
    }

    set raster(value) {
        this._raster = value ? value : null;
    }

    get rulesCollection() {
        return this._rules;
    }

    set rulesCollection(value) {
        this._rules = value;
    }

    get suitability() {
        return this._suitability;
    }

    set suitability(value) {
        this._suitability = value ? value : null;
    }

    toObject() {
        return ({
            id: this.id,
            name: this.name,
            type: this.type,
            raster: this.raster.toObject(),
            rules: this.rulesCollection.toArray(),
            suitability: this.suitability.toObject()
        });
    }

    calculateSuitability() {
        if (!this.raster || !this.raster.data || this.raster.data.length === 0) {
            throw new Error(`There is now raster uploaded for criterion ${this.name}.`);
        }
        if (!this.rulesCollection || this.rulesCollection.length === 0) {
            throw new Error(`There are no rules defined for criterion ${this.name}.`);
        }
        this.suitability = _cloneDeep(this.raster);
        this.suitability.data = _cloneDeep(this.raster.data).map(row => {
            return row.map(cell => {
                const rules = this.rulesCollection.findByValue(cell);
                if (rules.length === 0) {
                    return 0;
                }
                if (rules.length === 1) {
                    const rule = rules[0];
                    if (rule.type === 'fixed') {
                        return parseFloat(rule.value);
                    }
                    if (rule.type === 'calc') {
                        return -2;
                    }
                }
                return -1;
            });
        });
    }
}

export default Criterion;