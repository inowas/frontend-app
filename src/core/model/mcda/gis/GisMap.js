import GisAreasCollection from './GisAreasCollection';
import {ActiveCells, BoundingBox, GridSize} from '../../geometry';
import {booleanContains, booleanOverlap} from '@turf/turf';
import {getGridCells} from 'services/geoTools';

class GisMap {
    _activeCells = ActiveCells.create();
    _boundingBox = null;
    _areas = new GisAreasCollection();
    _gridSize = new GridSize(10, 10);

    static fromObject(obj) {
        const cm = new GisMap();
        if (obj && obj.activeCells) {
            cm.activeCells = ActiveCells.fromArray(obj.activeCells);
        }
        cm.boundingBox = obj.boundingBox ? BoundingBox.fromArray(obj.boundingBox) : null;
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

    get boundingBox() {
        return this._boundingBox;
    }

    set boundingBox(value) {
        this._boundingBox = value;
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
            boundingBox: this.boundingBox ? this.boundingBox.toArray() : null,
            areas: this.areasCollection.toArray(),
            gridSize: this.gridSize.toObject()
        }
    }

    calculateActiveCells() {
        const activeCells = new ActiveCells([]);
        const gridCells = getGridCells(this.boundingBox, this.gridSize);

        const suitableArea = this.areasCollection.findBy('type', 'area', true);
        const nonSuitableAreas = this.areasCollection.findBy('type', 'hole', false);

        if (!suitableArea) {
            return null;
        }

        gridCells.forEach(cell => {
            let cellIsSuitable = true;
            if (booleanContains(suitableArea.geometry, cell.geometry) || booleanOverlap(suitableArea.geometry, cell.geometry)) {
                nonSuitableAreas.forEach(area => {
                    if (booleanContains(area.geometry, cell.geometry) || booleanOverlap(area.geometry, cell.geometry)) {
                        cellIsSuitable = false;
                        return cellIsSuitable;
                    }
                });
                if (cellIsSuitable) {
                    activeCells.addCell([cell.x, cell.y]);
                }
            }
        });

        this.activeCells = activeCells;
    }
}

export default GisMap;
