import {floor, isEqual} from 'lodash';
import {BoundingBox, Geometry, GridSize, LineBoundary} from '../modflow/index';
import {
    booleanContains,
    booleanCrosses,
    booleanOverlap,
    envelope,
    lineDistance,
    lineSlice,
    nearestPointOnLine
} from '@turf/turf';
import {lineString} from '@turf/helpers';
import * as turf from '@turf/helpers';

const getActiveCellFromCoordinate = (coordinate, boundingBox, gridSize) => {

    if (!boundingBox instanceof BoundingBox) {
        throw new Error('Geometry needs to be instance of BoundingBox');
    }

    if (!gridSize instanceof GridSize) {
        throw new Error('GridSize needs to be instance of GridSize');
    }

    const dx = boundingBox.dX / gridSize.nX;
    const dy = boundingBox.dY / gridSize.nY;
    const x = coordinate[0];
    const y = coordinate[1];

    return [
        floor((x - boundingBox.xMin) / dx),
        floor(gridSize.nY - (y - boundingBox.yMin) / dy),
    ];
};

const getGridCells = (boundingBox, gridSize) => {

    if (!boundingBox instanceof BoundingBox) {
        throw new Error('Geometry needs to be instance of BoundingBox');
    }

    if (!gridSize instanceof GridSize) {
        throw new Error('GridSize needs to be instance of GridSize');
    }

    const dx = boundingBox.dX / gridSize.nX;
    const dy = boundingBox.dY / gridSize.nY;

    const cells = [];
    for (let y = 0; y < gridSize.nY; y++) {
        for (let x = 0; x < gridSize.nX; x++) {
            const point = getPointFromCell([x, y, 0], boundingBox, gridSize);
            const coordinates = point.geometry.coordinates;
            const geometry = envelope(lineString([
                [coordinates[0] - dx / 2, coordinates[1] - dy / 2],
                [coordinates[0] + dx / 2, coordinates[1] + dy / 2],
            ]));

            cells.push({
                x, y, geometry
            });
        }
    }

    return cells;
};

export const getPointFromCell = (cell, boundingBox, gridSize) => {

    if (!boundingBox instanceof BoundingBox) {
        throw new Error('Geometry needs to be instance of BoundingBox');
    }

    if (!gridSize instanceof GridSize) {
        throw new Error('GridSize needs to be instance of GridSize');
    }

    const x = cell[0];
    const y = cell[1];

    const dx = boundingBox.dX / gridSize.nX;
    const dy = boundingBox.dY / gridSize.nY;
    return turf.point([boundingBox.xMin + (x + 0.5) * dx, boundingBox.yMax - (y + 0.5) * dy]);
};

const distanceOnLine = (lineString, point) => {
    const start = turf.point(lineString.geometry.coordinates[0]);
    const end = turf.point(point.geometry.coordinates);
    const linestring = turf.lineString(lineString.geometry.coordinates);
    const sliced = lineSlice(start, end, linestring);
    return lineDistance(sliced);
};


class Cells {

    _cells = [];

    static create(cells = []) {
        return new this(cells);
    }

    static fromArray(cells) {
        return new this(cells);
    }

    static fromGeometry(geometry, boundingBox, gridSize) {
        if (!geometry instanceof Geometry) {
            throw new Error('Geometry needs to be instance of Geometry');
        }

        if (!boundingBox instanceof BoundingBox) {
            throw new Error('Geometry needs to be instance of BoundingBox');
        }

        if (!gridSize instanceof GridSize) {
            throw new Error('GridSize needs to be instance of GridSize');
        }

        const activeCells = new this();

        if (geometry.fromType('point')) {
            const coordinate = geometry.coordinates;
            activeCells.addCell(getActiveCellFromCoordinate(coordinate, boundingBox, gridSize));
        }

        if (geometry.fromType('linestring')) {
            const gridCells = getGridCells(boundingBox, gridSize);
            gridCells.forEach(cell => {
                if (booleanCrosses(geometry, cell.geometry)) {
                    activeCells.addCell([cell.x, cell.y, 0]);
                }
            });
        }

        if (geometry.fromType('polygon')) {
            const gridCells = getGridCells(boundingBox, gridSize);
            gridCells.forEach(cell => {
                if (booleanContains(geometry, cell.geometry) || booleanOverlap(geometry, cell.geometry)) {
                    activeCells.addCell([cell.x, cell.y]);
                }
            });
        }

        return activeCells;
    }

    constructor(cells = []) {
        this._cells = cells;
    }

    calculateValues = (boundary, boundingBox, gridSize) => {
        if (!boundary instanceof LineBoundary) {
            throw new Error('Boundary needs to be instance of LineBoundary');
        }

        if (!boundingBox instanceof BoundingBox) {
            throw new Error('Geometry needs to be instance of BoundingBox');
        }

        if (!gridSize instanceof GridSize) {
            throw new Error('GridSize needs to be instance of GridSize');
        }

        let {observationPoints} = boundary;

        if (observationPoints.length <= 1) {
            this._cells = this._cells.map(c => c[2] = 0);
            return;
        }

        const lineString = turf.lineString(boundary.geometry.coordinates);

        // order observationPoints
        observationPoints = observationPoints.map(op => {
            const point = turf.point(op.geometry.coordinates);
            const snapped = nearestPointOnLine(lineString, point);
            op.geometry = snapped.geometry;
            op.distance = distanceOnLine(lineString, op);
            return op;
        });

        // order the observationPoints on the line
        observationPoints.sort((op1, op2) => {
            return op1.distance - op2.distance;
        });

        const cells = this._cells.map(cell => {
            const nearestPointOL = nearestPointOnLine(lineString, getPointFromCell(cell, boundingBox, gridSize));
            return {
                x: cell[0],
                y: cell[1],
                distance: distanceOnLine(lineString, nearestPointOL),
                value: cell[2]
            }
        });

        cells.sort((c1, c2) => c1.distance - c2.distance);

        cells.map(cell => {
            for (let opIdx = 0; opIdx < observationPoints.length; opIdx++) {
                if (opIdx === 0 && cell.distance <= observationPoints[opIdx].distance) {
                    cell.value = 0;
                }

                const prevOp = observationPoints[opIdx];
                const nextOp = observationPoints[opIdx + 1]; // undefined if not existing

                if (cell.distance >= prevOp.distance && nextOp && cell.distance < nextOp.distance) {
                    cell.value = opIdx+((cell.distance - prevOp.distance) / (nextOp.distance - prevOp.distance))
                }

                if (!nextOp && cell.distance >= prevOp.distance) {
                    cell.value = opIdx;
                }
            }

            return cell;
        });

        this._cells = cells.map(li => ([li.x, li.y, li.value]))
    };

    toggle = ([x, y], boundingBox, gridSize) => {
        if (!(boundingBox instanceof BoundingBox)) {
            throw new Error('BoundingBox needs to be instance of BoundingBox');
        }

        if (!(gridSize instanceof GridSize)) {
            throw new Error('GridSize needs to be instance of GridSize');
        }

        const dx = boundingBox.dX / gridSize.nX;
        const dy = boundingBox.dY / gridSize.nY;

        const clickedCell = [
            floor((x - boundingBox.xMin) / dx),
            floor(gridSize.nY - (y - boundingBox.yMin) / dy)
        ];

        const cells = [];
        let removed = false;
        this._cells.forEach(ac => {
            if ((ac[0] === clickedCell[0] && ac[1] === clickedCell[1])) {
                removed = true;
                return;
            }
            cells.push(ac);
        });
        if (!removed) {
            cells.push(clickedCell);
        }

        this._cells = cells;
        return this;
    };

    addCell = (cell) => {
        this._cells.push(cell);
    };

    get cells() {
        return this._cells;
    }

    toArray() {
        return this._cells;
    }

    sameAs = (obj) => {
        return isEqual(obj.cells, this.cells);
    }
}

export default Cells;
