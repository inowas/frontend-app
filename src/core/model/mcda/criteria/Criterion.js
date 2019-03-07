import uuidv4 from 'uuid/v4';
import Raster from '../gis/Raster';
import RulesCollection from './RulesCollection';
import {cloneDeep as _cloneDeep} from 'lodash';
import * as math from 'mathjs';

const validTypes = ['discrete', 'continuous'];

class Criterion {
    _id = uuidv4();
    _parent = null;
    _name = 'New Criterion';
    _type = 'discrete';
    _unit = '-';
    _raster = new Raster();
    _rules = new RulesCollection();
    _suitability = new Raster();
    _constraintRaster = new Raster();
    _constraintRules = new RulesCollection();

    static fromObject(obj) {
        const criterion = new Criterion();
        criterion.id = obj.id;
        criterion.parentId = obj.parentId;
        criterion.name = obj.name;
        criterion.type = obj.type;
        criterion.unit = obj.unit;
        criterion.raster = obj.raster ? Raster.fromObject(obj.raster) : new Raster();
        criterion.rulesCollection = obj.rules ? RulesCollection.fromArray(obj.rules) : new RulesCollection();
        criterion.suitability = obj.suitability ? Raster.fromObject(obj.suitability) : Raster.fromObject(obj.raster);
        criterion.constraintRaster = obj.constraintRaster ? Raster.fromObject(obj.constraintRaster) : new Raster();
        criterion.constraintRules = obj.constraintRules ? RulesCollection.fromArray(obj.constraintRules) : new RulesCollection();
        return criterion;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value ? value : uuidv4();
    }

    get parentId() {
        return this._parent;
    }

    set parentId(value) {
        this._parent = value || null;
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

    get unit() {
        return this._unit;
    }

    set unit(value) {
        this._unit = value;
    }

    get raster() {
        return this._raster;
    }

    set raster(value) {
        this._raster = value;
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

    get constraintRaster() {
        return this._constraintRaster;
    }

    set constraintRaster(value) {
        this._constraintRaster = value;
    }

    get constraintRules() {
        return this._constraintRules;
    }

    set constraintRules(value) {
        this._constraintRules = value;
    }

    toObject() {
        return ({
            id: this.id,
            parentId: this.parentId,
            name: this.name,
            type: this.type,
            unit: this.unit,
            raster: this.raster.toObject(),
            rules: this.rulesCollection.toArray(),
            suitability: this.suitability.toObject(),
            constraintRaster: this.constraintRaster.toObject(),
            constraintRules: this.constraintRules.toArray()
        });
    }

    toPayload() {
        return ({
            id: this.id,
            parentId: this.parentId,
            name: this.name,
            type: this.type,
            unit: this.unit,
            raster: this.raster.toPayload(),
            rules: this.rulesCollection.toArray(),
            suitability: this.suitability.toPayload(),
            constraintRaster: this.constraintRaster.toPayload(),
            constraintRules: this.constraintRules.toArray()
        });
    }

    calculateRaster(raster, rulesCollection, factor = null) {
        if (!(raster instanceof Raster)) {
            throw new Error('Raster is expected to be instance of Raster.');
        }
        if (!(rulesCollection instanceof RulesCollection)) {
            throw new Error('RulesCollection is expected to be instance of RulesCollection.');
        }

        const newRaster = new Raster();
        newRaster.boundingBox = raster.boundingBox;
        newRaster.gridSize = raster.gridSize;
        newRaster.data = _cloneDeep(raster.data).map(row => {
            return row.map(cell => {
                const rules = rulesCollection.findByValue(cell);
                if (rules.length === 0) {
                    return 1;
                }
                if (rules.length === 1) {
                    const rule = rules[0];
                    if (rule.type === 'fixed') {
                        return parseFloat(rule.value);
                    }
                    if (rule.type === 'calc') {
                        return math.eval(rule.expression, {min: raster.min, max: raster.max, x: cell});
                    }
                }
                return -1;
            });
        });

        if (factor && factor.data && factor.data.length > 0) {
            newRaster.data = newRaster.data.map((x, xKey) => {
                return x.map((y, yKey) => {
                    if (factor.data[xKey][yKey]) {
                        return y * factor.data[xKey][yKey];
                    }
                    return 0;
                });
            });
        }

        newRaster.calculateMinMax();
        return newRaster;
    }

    calculateConstraints() {
        if (!this.raster || this.raster.data.length === 0) {
            throw new Error(`There is now raster uploaded for criterion ${this.name}.`);
        }

        this.constraintRaster = this.calculateRaster(this.raster, this.constraintRules);
        this.suitability = this.calculateRaster(this.raster, this.rulesCollection, this.constraintRaster);
    }

    calculateSuitability() {
        if (!this.raster || this.raster.data.length === 0) {
            throw new Error(`There is now raster uploaded for criterion ${this.name}.`);
        }

        this.suitability = this.calculateRaster(this.raster, this.rulesCollection, this.constraintRaster);
    }

    generateLegend(mode = 'unclassified') {
        return this.raster.generateLegend(this.rulesCollection, this.type, mode);
    }
}

export default Criterion;


/*const boundingBox = this.tilesCollection.boundingBox;
        const gridSize = new GridSize(10, 20); //this.suitability.gridSize || new GridSize(10, 10);
        const raster = new Raster();
        const array = new Array(gridSize.nY).fill(0).map(() => new Array(gridSize.nX).fill(0)).slice(0);

        const dX = boundingBox.xMax - boundingBox.xMin;
        const dY = boundingBox.yMax - boundingBox.yMin;
        const dXCell = dX / gridSize.nX;
        const dYCell = dY / gridSize.nY;

        raster.data = array.map((row, y) => {
            return row.map((cell, x) => {
                const xmin = boundingBox.xMin + x * dXCell;
                const xmax = boundingBox.xMin + (x + 1) * dXCell;
                const ymin = boundingBox.yMin + y * dYCell;
                const ymax = boundingBox.yMin + (y + 1) * dYCell;
                const CellBoundingBox = BoundingBox.fromArray([[xmin, ymin],[xmax, ymax]]);
                // Find all cells from tiles intersecting the grid cell and calculate the mean value
                console.log(CellBoundingBox);
                const tiles = this.tilesCollection.findByBoundingBox(CellBoundingBox);
                if (tiles.length > 1) {
                    // USE A REDUCER?!
                    console.log('tiles', tiles);
                }
                return 0;
            });
        });*/