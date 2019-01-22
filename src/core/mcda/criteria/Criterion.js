import uuidv4 from 'uuid/v4';
import Raster from '../gis/Raster';
import RulesCollection from './RulesCollection';
import {cloneDeep as _cloneDeep} from 'lodash';
import TilesCollection from '../gis/TilesCollection';

const validTypes = ['discrete', 'continuous'];

class Criterion {
    _id = uuidv4();
    _name = 'New Criterion';
    _type = 'discrete';
    _tiles = new TilesCollection();
    _rules = new RulesCollection();
    _suitability = new Raster();

    static fromObject(obj) {
        const criterion = new Criterion();
        criterion.id = obj.id;
        criterion.name = obj.name;
        criterion.type = obj.type;
        criterion.tilesCollection = obj.tiles ? TilesCollection.fromArray(obj.tiles) : new TilesCollection();
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

    get tilesCollection() {
        return this._tiles;
    }

    set tilesCollection(value) {
        this._tiles = value;
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
            tiles: this.tilesCollection.toArray(),
            rules: this.rulesCollection.toArray(),
            suitability: this.suitability.toObject()
        });
    }

    calculateSuitability() {
        if (!this.tilesCollection || this.tilesCollection.length === 0) {
            throw new Error(`There is now raster uploaded for criterion ${this.name}.`);
        }
        if (!this.rulesCollection || this.rulesCollection.length === 0) {
            throw new Error(`There are no rules defined for criterion ${this.name}.`);
        }

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

        this.suitability = _cloneDeep(this.tilesCollection.first);
        const data = this.tilesCollection.first.data;

        this.suitability.data = _cloneDeep(data).map(row => {
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