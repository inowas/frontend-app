import {booleanContains, booleanOverlap} from '@turf/turf';
import {getGridCells} from '../../../../services/geoTools';
import {BoundingBox, Geometry} from '../../geometry';
import {Array2D} from '../../geometry/Array2D.type';
import GridSize from '../../geometry/GridSize';
import {Cells} from '../../modflow';
import GisAreasCollection from './GisAreasCollection';
import {IGisMap} from './GisMap.type';
import Raster from './Raster';

class GisMap {

    get cells(): Cells {
        return Cells.fromObject(this._props.activeCells);
    }

    set cells(value: Cells) {
        this._props.activeCells = value.toObject();
    }

    get boundingBox(): BoundingBox {
        return BoundingBox.fromObject(this._props.boundingBox);
    }

    set boundingBox(value: BoundingBox) {
        this._props.boundingBox = value.toObject();
    }

    get areasCollection(): GisAreasCollection {
        return GisAreasCollection.fromObject(this._props.areas);
    }

    set areasCollection(value: GisAreasCollection) {
        this._props.areas = value.toObject();
    }

    get gridSize(): GridSize {
        return GridSize.fromObject(this._props.gridSize);
    }

    set gridSize(value: GridSize) {
        this._props.gridSize = value.toObject();
    }

    get raster(): Raster {
        return Raster.fromObject(this._props.raster);
    }

    set raster(value: Raster) {
        this._props.raster = value.toObject();
    }

    public static fromObject(obj: IGisMap) {
        return new GisMap(obj);
    }

    protected _props: IGisMap;

    constructor(obj: IGisMap) {
        this._props = obj;
    }

    public toObject() {
        return this._props;
    }

    public toPayload() {
        return {
            cells: this.cells,
            boundingBox: this.boundingBox,
            areas: this.areasCollection,
            gridSize: this.gridSize,
            raster: this.raster
        };
    }

    public calculateActiveCells() {
        const gridCells = getGridCells(this.boundingBox, this.gridSize);
        const raster = Raster.fromDefaults();
        raster.data = Array(this.gridSize.nY).fill(0).map(() => Array(this.gridSize.nX).fill(1)) as Array2D<number>;
        raster.gridSize = this.gridSize;
        raster.boundingBox = this.boundingBox;
        raster.min = 0;
        raster.max = 1;

        const suitableArea = Geometry.fromGeoJson(this.boundingBox.geoJson);
        const nonSuitableAreas = this.areasCollection.findBy('type', 'hole');

        if (!suitableArea) {
            return null;
        }

        gridCells.forEach((cell) => {
            let cellIsSuitable = true;
            if (booleanContains(suitableArea, cell.geometry) || booleanOverlap(suitableArea, cell.geometry)) {
                nonSuitableAreas.forEach((area) => {
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

        // this.cells = cells;
        this.raster = raster;
    }
}

export default GisMap;
