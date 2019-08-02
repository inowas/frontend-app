import GisAreasCollection from './GisAreasCollection';
import {Cells, BoundingBox, GridSize} from '../../geometry';
import {booleanContains, booleanOverlap} from '@turf/turf';
import {getGridCells} from '../../../../services/geoTools';
import Raster from './Raster';

class GisMap {
    _activeCells = Cells.create();
    _boundingBox = null;
    _areas = new GisAreasCollection();
    _gridSize = new GridSize(10, 10);
    _raster = null;

    static fromObject(obj) {
        const cm = new GisMap();
        if (obj && obj.cells) {
            cm.cells = Cells.fromObject(obj.cells);
        }
        cm.boundingBox = obj.boundingBox ? BoundingBox.fromObject(obj.boundingBox) : null;
        if (obj && obj.areas) {
            cm.areasCollection = GisAreasCollection.fromArray(obj.areas);
        }
        if (obj && obj.gridSize) {
            cm.gridSize = GridSize.fromObject(obj.gridSize);
        }
        if (obj && obj.raster) {
            cm.raster = Raster.fromObject(obj.raster);
        }
        return cm;
    }

    get cells() {
        return this._activeCells;
    }

    set cells(value) {
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

    get raster() {
        return this._raster;
    }

    set raster(value) {
        this._raster = value;
    }

    toObject() {
        return {
            cells: this.cells.toObject(),
            boundingBox: this.boundingBox ? this.boundingBox.toObject() : null,
            areas: this.areasCollection.toArray(),
            gridSize: this.gridSize.toObject(),
            raster: this.raster ? this.raster.toObject() : null
        }
    }

    toPayload() {
        return {
            cells: this.cells.toObject(),
            boundingBox: this.boundingBox ? this.boundingBox.toObject() : null,
            areas: this.areasCollection.toArray(),
            gridSize: this.gridSize.toObject(),
            raster: this.raster ? this.raster.toPayload() : null
        }
    }

    calculateActiveCells() {
        //const cells = new ActiveCells([]);
        const gridCells = getGridCells(this.boundingBox, this.gridSize);
        const raster = new Raster();
        raster.data = Array(this.gridSize.nY).fill(0).map(() => Array(this.gridSize.nX).fill(1));
        raster.gridSize = this.gridSize;
        raster.boundingBox = this.boundingBox;
        raster.min = 0;
        raster.max = 1;

        const suitableArea = this.boundingBox.geoJson;
        const nonSuitableAreas = this.areasCollection.findBy('type', 'hole');

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
                /*if (cellIsSuitable) {
                    cells.addCell([cell.x, cell.y]);
                }*/
                raster.data[cell.y][cell.x] = cellIsSuitable ? 1 : NaN;
            }
        });

        //this.cells = cells;
        this.raster = raster;
    }
}

export default GisMap;
