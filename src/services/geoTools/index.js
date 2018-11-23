import {lineString} from '@turf/helpers';
import {booleanCrosses, booleanContains, booleanOverlap, envelope, featureCollection, point} from '@turf/turf';
import {floor, min, max} from 'lodash';

export const getMinMaxFromBoundingBox = boundingBox => {
    const xMin = min([boundingBox[0][0], boundingBox[1][0]]);
    const xMax = max([boundingBox[0][0], boundingBox[1][0]]);
    const yMin = min([boundingBox[0][1], boundingBox[1][1]]);
    const yMax = max([boundingBox[0][1], boundingBox[1][1]]);

    return {
        xMin, xMax, yMin, yMax
    };
};


/* Calculate GridCells
Structure:
const cells = [
{x:1, y:2, geometry: geometry},
{x:1, y:3, geometry: geometry},
{x:1, y:4, geometry: geometry},
{x:1, y:5, geometry: geometry},
]
*/
const getGridCells = (boundingBox, gridSize) => {
    const {xMin, xMax, yMin, yMax} = getMinMaxFromBoundingBox(boundingBox);
    const nX = gridSize.n_x;
    const nY = gridSize.n_y;
    const dx = (xMax - xMin) / nX;
    const dy = (yMax - yMin) / nY;

    const cells = [];
    for (let y = 0; y < nY; y++) {
        for (let x = 0; x < nX; x++) {
            cells.push({
                x: x,
                y: nY - y - 1,
                geometry: envelope(lineString([
                    [xMin + x * dx, yMax - (nY - y) * dy],
                    [xMin + (x + 1) * dx, yMax - (nY - y - 1) * dy]
                ]))
            });
        }
    }

    return cells;
};

const getActiveCellFromCoordinate = (coordinate, boundingBox, gridSize) => {
    const {xMin, xMax, yMin, yMax} = getMinMaxFromBoundingBox(boundingBox);
    const nX = gridSize.n_x;
    const nY = gridSize.n_y;
    const dx = (xMax - xMin) / nX;
    const dy = (yMax - yMin) / nY;
    const x = coordinate[0];
    const y = coordinate[1];

    return [
        floor((x - xMin) / dx),
        floor(nY - (y - yMin) / dy),
    ];
};

export const calculateActiveCells = (geom, boundingBox, gridSize) => {
    let geometry;
    if (geom.geometry) {
        geometry = geom.geometry;
    } else {
        geometry = geom;
    }

    const activeCells = [];

    if (geometry.type.toLowerCase() === 'point') {
        const coordinate = geometry.coordinates;
        activeCells.push(getActiveCellFromCoordinate(coordinate, boundingBox, gridSize));
    }

    if (geometry.type.toLowerCase() === 'linestring') {
        const gridCells = getGridCells(boundingBox, gridSize);
        gridCells.forEach(cell => {
            if (booleanCrosses(geometry, cell.geometry)) {
                activeCells.push([cell.x, cell.y]);
            }
        });
    }

    if (geometry.type.toLowerCase() === 'polygon') {
        const gridCells = getGridCells(boundingBox, gridSize);
        gridCells.forEach(cell => {
            if (booleanContains(geometry, cell.geometry) || booleanOverlap(geometry, cell.geometry)) {
                activeCells.push([cell.x, cell.y]);
            }
        });
    }

    return activeCells;
};

const getBoundingBoxFromCoordinates = coordinates => {

    let [minY, minX] = coordinates[0];
    let [maxY, maxX] = coordinates[0];

    coordinates.forEach(c => {
        if (c[1] < minX) {
            minX = c[1];
        }

        if (c[1] > maxX) {
            maxX = c[1];
        }

        if (c[0] < minY) {
            minY = c[0];
        }

        if (c[0] > maxY) {
            maxY = c[0];
        }
    });

    return [
        [minY, minX],
        [maxY, maxX]
    ];
};

export const getGeoJsonFromBoundingBox = bb => {
    return envelope(featureCollection([
        point(bb[0]),
        point(bb[1]),
    ]));
};

export const getBoundingBox = geoJson => {
    const polygon = envelope(geoJson);
    return getBoundingBoxFromCoordinates(polygon.geometry.coordinates[0])
};
