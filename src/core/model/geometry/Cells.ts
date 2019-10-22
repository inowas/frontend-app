import * as turf from '@turf/helpers';
import {
    booleanContains,
    booleanCrosses,
    booleanOverlap,
    envelope,
    lineDistance,
    lineSlice,
    nearestPointOnLine
} from '@turf/turf';

import {NearestPointOnLine} from '@turf/nearest-point-on-line';
import {Feature, LineString} from 'geojson';
import {floor, isEqual} from 'lodash';
import {LineBoundary} from '../modflow/boundaries';
import {BoundingBox, Geometry, GridSize} from '../modflow/index';
import {ICell, ICells, Point} from './Cells.type';

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
    const end = turf.point(point.geometry!.coordinates);
    const linestring = turf.lineString(ls.geometry.coordinates);
    const sliced = lineSlice(start, end, linestring);
    return lineDistance(sliced);
};

export default class Cells {

    public static create(cells: ICells = []) {
        return new this(cells);
    }

    public static fromArray(cells: ICells) {
        return new this(cells);
    }

    public static fromObject(cells: ICells) {
        return new this(cells);
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

    public toggle = ([x, y]: number[], boundingBox: BoundingBox, gridSize: GridSize) => {

        const dx = boundingBox.dX / gridSize.nX;
        const dy = boundingBox.dY / gridSize.nY;

        const clickedCell = [
            floor((x - boundingBox.xMin) / dx),
            floor(gridSize.nY - (y - boundingBox.yMin) / dy)
        ];

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

    public calculateIBound = (nlay: number, nrow: number, ncol: number) => {
        const iBound2D: number[][] = [];
        for (let row = 0; row < nrow; row++) {
            iBound2D[row] = [];
            for (let col = 0; col < ncol; col++) {
                iBound2D[row][col] = 0;
            }
        }

        this.cells.forEach((cell) => {
            iBound2D[cell[1]][cell[0]] = 1;
        });

        const iBound = [];
        for (let lay = 0; lay < nlay; lay++) {
            iBound[lay] = iBound2D;
        }
        return iBound;
    };

    get cells() {
        return this._cells;
    }

    public toArray() {
        return this._cells;
    }

    public toObject() {
        return this._cells;
    }

    public sameAs = (obj: Cells) => {
        return isEqual(obj.cells, this.cells);
    };
}
