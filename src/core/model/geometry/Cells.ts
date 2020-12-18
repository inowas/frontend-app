import * as turf from '@turf/helpers';
import {Array2D} from './Array2D.type';
import {BoundingBox, Geometry, GridSize} from '../modflow/index';
import {Feature, LineString} from 'geojson';
import {ICell, ICells, Point} from './Cells.type';
import {LineBoundary} from '../modflow/boundaries';
import {NearestPointOnLine} from '@turf/nearest-point-on-line';
import {
    booleanContains,
    booleanCrosses,
    booleanOverlap,
    envelope,
    lineDistance,
    lineSlice,
    nearestPointOnLine
} from '@turf/turf';
import {cloneDeep, floor, isEqual, uniqWith} from 'lodash';

const getActiveCellFromCoordinate = (coordinate: Point, boundingBox: BoundingBox, gridSize: GridSize): ICell => {

    const dx = boundingBox.dX / gridSize.nX;
    const dy = boundingBox.dY / gridSize.nY;
    const x = coordinate[0];
    const y = coordinate[1];

    return [
        floor((x - boundingBox.xMin) / dx),
        floor(gridSize.nY - (y - boundingBox.yMin) / dy),
    ];
};

const getGridCells = (boundingBox: BoundingBox, gridSize: GridSize) => {

    const dx = boundingBox.dX / gridSize.nX;
    const dy = boundingBox.dY / gridSize.nY;

    const cells = [];
    for (let y = 0; y < gridSize.nY; y++) {
        for (let x = 0; x < gridSize.nX; x++) {
            const point = Geometry.fromGeoJson(getPointFromCell([x, y, 0], boundingBox, gridSize));
            const coordinates: number[] = point.coordinates as number[];
            const geometry = Geometry.fromGeoJson(envelope(turf.lineString([
                [coordinates[0] - dx / 2, coordinates[1] - dy / 2],
                [coordinates[0] + dx / 2, coordinates[1] + dy / 2],
            ]))).toObject();
            cells.push({
                x, y, geometry
            });
        }
    }

    return cells;
};

export const getPointFromCell = (cell: ICell, boundingBox: BoundingBox, gridSize: GridSize) => {

    const x = cell[0];
    const y = cell[1];

    const dx = boundingBox.dX / gridSize.nX;
    const dy = boundingBox.dY / gridSize.nY;
    return turf.point([boundingBox.xMin + (x + 0.5) * dx, boundingBox.yMax - (y + 0.5) * dy]);
};

const distanceOnLine = (ls: Feature<LineString>, point: NearestPointOnLine) => {
    const start = turf.point(ls.geometry.coordinates[0]);
    const end = point.geometry ? turf.point(point.geometry.coordinates) : start;
    const linestring = turf.lineString(ls.geometry.coordinates);
    const sliced = lineSlice(start, end, linestring);
    return lineDistance(sliced);
};

export default class Cells {

    public static create(cells: ICells = []) {
        return new this(cloneDeep(cells));
    }

    public static fromArray(cells: ICells) {
        return new this(cloneDeep(cells));
    }

    public static fromObject(cells: ICells) {
        return new this(cloneDeep(cells));
    }

    public static fromGeometry(geometry: Geometry, boundingBox: BoundingBox, gridSize: GridSize) {

        const cells = new Cells([]);

        if (geometry.fromType('point')) {
            cells.addCell(getActiveCellFromCoordinate(geometry.coordinates as Point, boundingBox, gridSize));
        }

        if (geometry.fromType('linestring')) {
            const gridCells = getGridCells(boundingBox, gridSize);
            gridCells.forEach((cell) => {
                if (booleanCrosses(geometry.toObject(), cell.geometry)) {
                    cells.addCell([cell.x, cell.y, 0]);
                }
            });
        }

        if (geometry.fromType('polygon')) {
            const gridCells = getGridCells(boundingBox, gridSize);
            gridCells.forEach((cell) => {
                if (booleanContains(geometry, cell.geometry) || booleanOverlap(geometry, cell.geometry)) {
                    cells.addCell([cell.x, cell.y]);
                }
            });
        }

        return cells;
    }

    public static fromRaster(raster: Array2D<number>) {
        const cells = new Cells([]);
        raster.forEach((row, rIdx) => {
            row.forEach((value, cIdx) => {
                if (value !== 0) {
                    cells.addCell([cIdx, rIdx, value]);
                }
            });
        });
        return cells;
    }

    public toRaster(gridSize: GridSize) {
        const raster = new Array(gridSize.nY).fill(0).map(() => new Array(gridSize.nX).fill(0)) as Array2D<number>;

        this.cells.forEach((c) => {
            raster[c[1]][c[0]] = 1;
        });

        return raster;
    }

    public removeCells(rCells: Cells) {
        const cellsToRemove = rCells.toObject();
        const cCells: ICell[] = [];
        this.cells.forEach((c) => {
            if (cellsToRemove.filter((cc) => cc[0] === c[0] && cc[1] === c[1]).length === 0) {
                cCells.push(c);
            }
        });
        return cCells;
    }

    constructor(private _cells: ICells = []) {
    }

    public calculateValues = (boundary: LineBoundary, boundingBox: BoundingBox, gridSize: GridSize) => {
        this._cells = this._cells.map((c) => {
            c[2] = 0;
            return c;
        });

        const {observationPoints} = boundary;
        if (observationPoints.length <= 1 || !boundary.geometry) {
            return;
        }

        const linestring = turf.lineString(boundary.geometry.coordinates as number[][]);

        // order the observationPoints on the line by distance from root
        observationPoints.sort((op1, op2) => {
            return op1.distance - op2.distance;
        });

        const cellObjs = this._cells.map((cell) => {
            const nearestPointOL = nearestPointOnLine(linestring, getPointFromCell(cell, boundingBox, gridSize));
            return {
                x: cell[0],
                y: cell[1],
                distance: distanceOnLine(linestring, nearestPointOL),
                value: cell[2]
            };
        });

        cellObjs.sort((c1, c2) => c1.distance - c2.distance);

        cellObjs.map((c) => {
            for (let opIdx = 0; opIdx < observationPoints.length; opIdx++) {
                if (opIdx === 0 && c.distance <= observationPoints[opIdx].distance) {
                    c.value = 0;
                }

                const prevOp = observationPoints[opIdx];
                const nextOp = observationPoints[opIdx + 1]; // undefined if not existing

                if (c.distance >= prevOp.distance && nextOp && c.distance < nextOp.distance) {
                    c.value = opIdx + ((c.distance - prevOp.distance) / (nextOp.distance - prevOp.distance));
                }

                if (!nextOp && c.distance >= prevOp.distance) {
                    c.value = opIdx;
                }
            }

            return c;
        });

        this._cells = cellObjs.map((li) => ([li.x, li.y, li.value]) as ICell);
    };

    public toggle = ([x, y]: number[], boundingBox: BoundingBox, gridSize: GridSize, transform = true) => {
        const dx = boundingBox.dX / gridSize.nX;
        const dy = boundingBox.dY / gridSize.nY;

        let clickedCell = [x, y];
        if (transform) {
            clickedCell = [
                floor((x - boundingBox.xMin) / dx),
                floor(gridSize.nY - (y - boundingBox.yMin) / dy)
            ];
        }

        const cells = [];
        let removed = false;
        this._cells.forEach((ac) => {
            if ((ac[0] === clickedCell[0] && ac[1] === clickedCell[1])) {
                removed = true;
                return;
            }
            cells.push(ac);
        });

        if (!removed) {
            cells.push(clickedCell);
        }

        this._cells = cells as ICells;
        return this;
    };

    public addCell = (cell: ICell) => {
        this._cells.push(cell);
    };

    public calculateIBound = (nrow: number, ncol: number) => {
        const iBound2D: Array2D<number> = [];
        for (let row = 0; row < nrow; row++) {
            iBound2D[row] = [0];
            for (let col = 0; col < ncol; col++) {
                iBound2D[row][col] = 0;
            }
        }

        this.cells.forEach((cell) => {
            if (cell[1] <= iBound2D.length && cell[0] <= iBound2D[0].length && iBound2D[cell[1]]) {
                iBound2D[cell[1]][cell[0]] = 1;
            }
        });

        return iBound2D;
    };

    public invert = (gridSize: GridSize) => {
        const cells = new Cells([]);
        const iBound = this.calculateIBound(gridSize.nY, gridSize.nX);

        for (let rIdx = 0; rIdx < gridSize.nY; rIdx++) {
            for (let cIdx = 0; cIdx < gridSize.nX; cIdx++) {
                if (iBound[rIdx][cIdx] === 0) {
                    cells.addCell([cIdx, rIdx, 0]);
                }
            }
        }

        return cells;
    };

    get cells() {
        return cloneDeep(this._cells);
    }

    public toArray() {
        return cloneDeep(this._cells);
    }

    public toObject() {
        return cloneDeep(this._cells);
    }

    public merge = (cells: Cells) => {
        const allCellsWithoutValues = this.cells.concat(cells.cells).map((c) => [c[0], c[1]]) as ICell[];
        return Cells.fromArray(uniqWith(allCellsWithoutValues, isEqual));
    };

    public sameAs = (obj: Cells) => {
        return isEqual(obj.cells, this.cells);
    };

    public count = () => {
        return this._cells.length;
    };
}
