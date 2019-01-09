import GisAreasCollection from './GisAreasCollection';
import {ActiveCells, GridSize} from '../../geometry';

class GisMap {
    _activeCells = ActiveCells.create();
    _areas = new GisAreasCollection();
    _gridSize = new GridSize(10, 10);

    static fromObject(obj) {
        const cm = new GisMap();
        if (obj && obj.activeCells) {
            cm.activeCells = ActiveCells.fromArray(obj.activeCells);
        }
        if (obj && obj.areas) {
            cm.areasCollection = GisAreasCollection.fromArray(obj.areas);
        }
        if (obj && obj.gridSize) {
            cm.gridSize = GridSize.fromObject(obj.gridSize);
        }
        return cm;
    }

    get activeCells() {
        return this._activeCells;
    }

    set activeCells(value) {
        this._activeCells = value;
    }

    get areasCollection() {
        return this._areas;
    }

    set areasCollection(value) {
        this._areas = value;
    }

    get gridSize() {
        return this._gridSize;
    }

    set gridSize(value) {
        this._gridSize = value;
    }

    toObject() {
        return {
            activeCells: this.activeCells.toArray(),
            areas: this.areasCollection.toArray(),
            gridSize: this.gridSize.toObject()
        }
    }
}

export default GisMap;
