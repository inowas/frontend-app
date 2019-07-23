import {booleanContains, booleanCrosses, booleanOverlap, envelope, lineString} from '@turf/turf';
import {floor} from 'lodash';
import {Cell} from '../../core/model/geometry/types';
import {BoundingBox, Cells, Geometry, GridSize} from '../../core/model/modflow';

/* Calculate GridCells
Structure:
const cells = [
{x:1, y:2, geometry: geometry},
{x:1, y:3, geometry: geometry},
{x:1, y:4, geometry: geometry},
{x:1, y:5, geometry: geometry},
]
*/
export const getGridCells = (boundingBox: BoundingBox, gridSize: GridSize) => {
    const dx = boundingBox.dX / gridSize.nX;
    const dy = boundingBox.dY / gridSize.nY;

    const cells = [];
    for (let y = 0; y < gridSize.nY; y++) {
        for (let x = 0; x < gridSize.nX; x++) {
            cells.push({
                x,
                y: gridSize.nY - y - 1,
                geometry: envelope(lineString([
                    [boundingBox.xMin + x * dx, boundingBox.yMax - (gridSize.nY - y) * dy],
                    [boundingBox.xMin + (x + 1) * dx, boundingBox.yMax - (gridSize.nY - y - 1) * dy]
                ]))
            });
        }
    }

    return cells;
};

export const getActiveCellFromCoordinate = (coordinate: number[], boundingBox: BoundingBox,
                                            gridSize: GridSize): Cell => {
    const dx = boundingBox.dX / gridSize.nX;
    const dy = boundingBox.dY / gridSize.nY;
    const x = coordinate[0];
    const y = coordinate[1];

    return [
        floor((x - boundingBox.xMin) / dx),
        floor(gridSize.nY - (y - boundingBox.yMin) / dy),
    ];
};

export const calculateActiveCells = (geometry: Geometry, boundingBox: BoundingBox, gridSize: GridSize) => {
    const activeCells = new Cells([]);

    if (geometry.fromType('point')) {
        const coordinate = geometry.coordinates;
        activeCells.addCell(getActiveCellFromCoordinate(coordinate as number[], boundingBox, gridSize));
    }

    if (geometry.fromType('linestring')) {
        const gridCells = getGridCells(boundingBox, gridSize);
        gridCells.forEach((cell) => {
            if (booleanCrosses(geometry, cell.geometry)) {
                activeCells.addCell([cell.x, cell.y]);
            }
        });
    }

    if (geometry.fromType('polygon')) {
        const gridCells = getGridCells(boundingBox, gridSize);
        gridCells.forEach((cell) => {
            if (booleanContains(geometry, cell.geometry) || booleanOverlap(geometry, cell.geometry)) {
                activeCells.addCell([cell.x, cell.y]);
            }
        });
    }

    return activeCells;
};
