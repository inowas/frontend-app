import { AllGeoJSON } from '@turf/helpers';
import { BoundingBox, Cells, Geometry, GridSize } from '../../core/model/modflow';
import { ICell } from '../../core/model/geometry/Cells.type';
import { Polygon } from 'geojson';
import { area, booleanContains, booleanCrosses, booleanOverlap, envelope, intersect, lineString } from '@turf/turf';

/* Calculate GridCells
Structure:
const cells = [
{x:1, y:2, geometry: geometry},
{x:1, y:3, geometry: geometry},
{x:1, y:4, geometry: geometry},
{x:1, y:5, geometry: geometry},
]
// @deprecated
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
          [
            boundingBox.xMin + x * dx,
            boundingBox.yMax - (gridSize.nY - y) * dy
          ],
          [
            boundingBox.xMin + (x + 1) * dx,
            boundingBox.yMax - (gridSize.nY - y - 1) * dy
          ]
        ]))
      });
    }
  }

  return cells;
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
export const getGridCellsFromVariableGrid = (boundingBox: BoundingBox, gridSize: GridSize) => {
  const dx = boundingBox.dX;
  const dy = boundingBox.dY;

  const cells = [];
  for (let y = 0; y < gridSize.nY; y++) {
    for (let x = 0; x < gridSize.nX; x++) {
      cells.push({
        x,
        y: gridSize.nY - y - 1,
        geometry: envelope(lineString([
          [
            boundingBox.xMin + gridSize.getDistanceXStart(x) * dx,
            boundingBox.yMax - gridSize.getDistanceYStart((gridSize.nY - y - 1)) * dy
          ],
          [
            boundingBox.xMin + gridSize.getDistancesXEnd()[x] * dx,
            boundingBox.yMax - gridSize.getDistancesYEnd()[(gridSize.nY - y - 1)] * dy
          ]
        ]))
      });
    }
  }

  return cells;
};

export const getActiveCellFromCoordinate = (coordinate: number[], boundingBox: BoundingBox,
                                            gridSize: GridSize): ICell => {

  const [x, y] = coordinate;
  if (x < boundingBox.xMin || x > boundingBox.xMax) {
    throw Error('Outside BoundingBox.');
  }
  if (y < boundingBox.yMin || y > boundingBox.yMax) {
    throw Error('Outside BoundingBox.');
  }

  const distXRel = (x - boundingBox.xMin) / boundingBox.dX;
  const distYRel = (y - boundingBox.yMin) / boundingBox.dY;

  return [
    gridSize.getCellFromDistX(distXRel),
    gridSize.getCellFromDistY(distYRel)
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
    const gridCells = getGridCellsFromVariableGrid(boundingBox, gridSize);
    gridCells.forEach((cell) => {
      if (booleanContains(cell.geometry, geometry) || booleanCrosses(geometry, cell.geometry)) {
        activeCells.addCell([cell.x, cell.y]);
      }
    });
  }

  if (geometry.fromType('polygon')) {
    const gridCells = getGridCellsFromVariableGrid(boundingBox, gridSize);
    const cellArea = area(gridCells[0].geometry);
    gridCells.forEach((cell) => {
      if (booleanContains(cell.geometry, geometry)) {
        activeCells.addCell([cell.x, cell.y]);
      } else if (booleanContains(geometry, cell.geometry) || booleanOverlap(geometry, cell.geometry)) {
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

export const getCenterFromCell = (cell: ICell, boundingBox: BoundingBox, gridSize: GridSize) => {
  const [x, y] = cell;
  if (x < 0 || x >= gridSize.nX) {
    throw Error('Out of bounds');
  }

  if (y < 0 || y >= gridSize.nY) {
    throw Error('Out of bounds');
  }

  return [
    parseFloat((gridSize.getCenterX(x) * boundingBox.dX).toPrecision(5)),
    parseFloat((gridSize.getCenterY(y) * boundingBox.dY).toPrecision(5))
  ];
};

export interface IRowsAndColumns {
  columns: number[];
  columnKeys: number[];
  rows: number[];
  rowKeys: number[];
}

export const getRowsAndColumnsFromGeoJson = (geoJson: AllGeoJSON, boundingBox: BoundingBox, gridSize: GridSize): IRowsAndColumns => {
  const bbox = BoundingBox.fromGeoJson(geoJson);

  let xMin: {value: number, key: number} = {value: -Infinity, key: -1};
  let xMax: {value: number, key: number} = {value: Infinity, key: -1};
  let yMin: {value: number, key: number} = {value: -Infinity, key: -1};
  let yMax: {value: number, key: number} = {value: -Infinity, key: -1};

  gridSize.distX.forEach((d, i) => {
    const x = boundingBox.xMin + d * boundingBox.dX;
    if (x < bbox.xMin && x > xMin.value) {
      xMin = {value: x, key: i};
    }
    if (x > bbox.xMax && x < xMax.value) {
      xMax = {value: x, key: i};
    }
  });

  gridSize.distY.forEach((d, i) => {
    const y = boundingBox.yMin + d * boundingBox.dY;
    if (y < bbox.yMin && y > yMin.value) {
      yMin = {value: y, key: i};
    }
    if (y > bbox.yMax && y < yMax.value) {
      yMax = {value: y, key: i};
    }
  });

  const columnKeys: number[] = [];
  const columns = gridSize.distX.filter((d, i) => {
    const x = boundingBox.xMin + d * boundingBox.dX;
    if (x >= bbox.xMin && x <= bbox.xMax) {
      columnKeys.push(i);
      return true;
    }
    return false;
  });

  const rowKeys: number[] = [];
  const rows = gridSize.distY.filter((d, i) => {
    const y = boundingBox.yMin + d * boundingBox.dY;
    if (y >= bbox.yMin && y <= bbox.yMax) {
      rowKeys.push(i);
      return true;
    }
    return false;
  });

  return {
    columns,
    columnKeys,
    rows,
    rowKeys
  };
};

export const calculateColumns = (boundingBox: BoundingBox, gridSize: GridSize) => {
  const columns = [];
  for (let x = 0; x < gridSize.nX; x++) {
    columns.push(
      new BoundingBox([
        [boundingBox.xMin + (gridSize.getDistanceXStart(x) * boundingBox.dX), boundingBox.yMin],
        [boundingBox.xMin + (gridSize.getDistanceXEnd(x) * boundingBox.dX), boundingBox.yMax]
      ])
    );
  }

  return columns;
};

export const calculateRows = (boundingBox: BoundingBox, gridSize: GridSize) => {
  const rows = [];
  for (let y = 0; y < gridSize.nY; y++) {
    rows.push(
      new BoundingBox([
        [boundingBox.xMin, boundingBox.yMax - gridSize.getDistanceYStart((gridSize.nY - y - 1)) * boundingBox.dY],
        [boundingBox.xMax, boundingBox.yMax - gridSize.getDistanceYEnd((gridSize.nY - y - 1)) * boundingBox.dY]
      ])
    );
  }

  return rows;
};
