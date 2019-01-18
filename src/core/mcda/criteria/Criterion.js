import uuidv4 from 'uuid/v4';
import Raster from '../gis/Raster';
import RulesCollection from './RulesCollection';

const validTypes = ['discrete', 'continuous'];

class Criterion {
    _id = uuidv4();
    _name = 'New Criterion';
    _type = 'discrete';
    _raster = new Raster();
    _rules = new RulesCollection();

    static fromObject(obj) {
        const criterion = new Criterion();
        criterion.id = obj.id;
        criterion.name = obj.name;
        criterion.type = obj.type;
        criterion.raster = Raster.fromObject(obj.raster);
        criterion.rulesCollection = obj.rules ? RulesCollection.fromArray(obj.rules) : new RulesCollection();
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

    toObject() {
        return ({
            id: this.id,
            name: this.name,
            type: this.type,
            raster: this.raster.toObject(),
            rules: this.rulesCollection.toArray()
        });
    }
}

export default Criterion;