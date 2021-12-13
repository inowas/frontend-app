import { BoundingBox } from '../../../core/model/modflow';
import { GridSize } from '../../../core/model/geometry';
import {
  getActiveCellFromCoordinate,
  getCenterFromCell,
  getGridCells,
  getGridCellsFromVariableGrid,
} from '../../../services/geoTools';

test('GeoTools getActiveCellFromCoordinate PT1', () => {
  const xMin = 0;
  const xMax = 10;
  const yMin = 100;
  const yMax = 110;
  const boundingBox = new BoundingBox([
    [xMin, yMin],
    [xMax, yMax],
  ]);
  expect(boundingBox).toBeInstanceOf(BoundingBox);

  const gridSize = new GridSize({ n_x: 10, n_y: 10 });
  expect(gridSize).toBeInstanceOf(GridSize);

  const x = 1.55;
  const y = 101.5;
  const coordinate = [x, y];
  expect(getActiveCellFromCoordinate(coordinate, boundingBox, gridSize)).toEqual([1, 8]);

  expect(getActiveCellFromCoordinate(coordinate, boundingBox, gridSize)).toEqual([1, 8]);

  gridSize.nX = 100;
  expect(getActiveCellFromCoordinate(coordinate, boundingBox, gridSize)).toEqual([15, 8]);

  gridSize.nY = 100;
  expect(getActiveCellFromCoordinate(coordinate, boundingBox, gridSize)).toEqual([15, 85]);
});

test('GeoTools getActiveCellFromCoordinate PT2', () => {
  const xMin = 0;
  const xMax = 10;
  const yMin = 100;
  const yMax = 110;
  const boundingBox = new BoundingBox([
    [xMin, yMin],
    [xMax, yMax],
  ]);
  expect(boundingBox).toBeInstanceOf(BoundingBox);

  const gridSize = new GridSize({ n_x: 10, n_y: 10 });
  expect(gridSize).toBeInstanceOf(GridSize);

  const x = 1.55;
  const y = 101.5;
  const coordinate = [x, y];
  expect(getActiveCellFromCoordinate(coordinate, boundingBox, gridSize)).toEqual([1, 8]);

  expect(getActiveCellFromCoordinate(coordinate, boundingBox, gridSize)).toEqual([1, 8]);

  gridSize.nX = 100;
  expect(getActiveCellFromCoordinate(coordinate, boundingBox, gridSize)).toEqual([15, 8]);

  gridSize.nY = 100;
  expect(getActiveCellFromCoordinate(coordinate, boundingBox, gridSize)).toEqual([15, 85]);
});

test('GetGridCells', () => {
  const xMin = 0;
  const xMax = 10;
  const yMin = 20;
  const yMax = 30;
  const boundingBox = new BoundingBox([
    [xMin, yMin],
    [xMax, yMax],
  ]);
  expect(boundingBox).toBeInstanceOf(BoundingBox);

  const gridSize = new GridSize({ n_x: 10, n_y: 10 });
  expect(gridSize).toBeInstanceOf(GridSize);
  expect(getGridCells(boundingBox, gridSize).length).toEqual(
    getGridCellsFromVariableGrid(boundingBox, gridSize).length
  );
  expect(getGridCells(boundingBox, gridSize)[0]).toEqual(getGridCellsFromVariableGrid(boundingBox, gridSize)[0]);
  expect(getGridCells(boundingBox, gridSize)).toEqual(getGridCellsFromVariableGrid(boundingBox, gridSize));
});

test('GetCenterFromCell', () => {
  const xMin = 0;
  const xMax = 11;
  const yMin = 0;
  const yMax = 11;
  const boundingBox = new BoundingBox([
    [xMin, yMin],
    [xMax, yMax],
  ]);
  expect(boundingBox).toBeInstanceOf(BoundingBox);
  const gridSize = new GridSize({ n_x: 11, n_y: 11 });
  expect(gridSize).toBeInstanceOf(GridSize);
  expect(getCenterFromCell([5, 5], boundingBox, gridSize)).toEqual([5.5, 5.5]);
});
