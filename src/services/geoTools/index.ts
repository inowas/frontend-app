import {BoundingBox, Cells, Geometry, GridSize} from '../../core/model/modflow';
import {ICell} from '../../core/model/geometry/Cells.type';
import {Polygon} from 'geojson';
import {area, booleanContains, booleanCrosses, booleanOverlap, envelope, intersect, lineString} from '@turf/turf';
import {floor} from 'lodash';

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
                                            gridSize: GridSize): ICell => {
    const dx = boundingBox.dX / gridSize.nX;
    const dy = boundingBox.dY / gridSize.nY;
    const x = coordinate[0];
    const y = coordinate[1];

    return [
        floor((x - boundingBox.xMin) / dx),
        floor(gridSize.nY - (y - boundingBox.yMin) / dy),
    ];
};

export const calculateCells = (geometry: Geometry, boundingBox: BoundingBox, gridSize: GridSize) => {
    return new Promise<Cells>((resolve) => {
        const activeCells = calculateActiveCells(geometry, boundingBox, gridSize);
        resolve(activeCells);
    });
};

export const calculateActiveCells = (
    geometry: Geometry,
    boundingBox: BoundingBox,
    gridSize: GridSize,
    intersection = 0
): Cells => {
    const activeCells = new Cells([]);

    if (geometry.fromType('point')) {
        const coordinate = geometry.coordinates;
        activeCells.addCell(getActiveCellFromCoordinate(coordinate as number[], boundingBox, gridSize));
    }

    if (geometry.fromType('linestring')) {
        const gridCells = getGridCells(boundingBox, gridSize);
        gridCells.forEach((cell) => {
            if (booleanContains(cell.geometry, geometry) || booleanCrosses(geometry, cell.geometry)) {
                activeCells.addCell([cell.x, cell.y]);
            }
        });
    }

    if (geometry.fromType('polygon')) {
        const gridCells = getGridCells(boundingBox, gridSize);
        const cellArea = area(gridCells[0].geometry);
        gridCells.forEach((cell) => {
            if (booleanContains(geometry, cell.geometry) || booleanOverlap(geometry, cell.geometry)) {
                if (intersection > 0 && geometry.type === 'Polygon') {
                    const coveredArea = intersect(geometry.toGeoJSON() as Polygon, cell.geometry);
                    if (coveredArea && (area(coveredArea) / cellArea) > intersection) {
                        activeCells.addCell([cell.x, cell.y]);
                    }
                } else {
                    activeCells.addCell([cell.x, cell.y]);
                }
            }
        });
    }

    return activeCells;
};
