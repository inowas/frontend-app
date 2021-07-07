import { Array2D } from '../../../../core/model/geometry/Array2D.type';
import GridSize from '../../../../core/model/geometry/GridSize';

test('To object', () => {
  const gridSize = GridSize.fromArray([500, 300]);

  expect(gridSize.toObject()).toEqual({
    n_x: 500,
    n_y: 300
  });
});

test('From data (2D Array)', () => {
  const data1: Array2D<number> = [[1, 2, 3], [2, 3, 4], [3, 4, 5]];
  const data2: Array2D<number> = [];

  expect(GridSize.fromData(data1 as Array2D<number>).toObject()).toEqual({
    n_x: 3,
    n_y: 3
  });

  expect(() => GridSize.fromData(data2 as Array2D<number>)).toThrow();
});

test('Set delr and delc', () => {
  const gridSize = GridSize.fromArray([10, 12]);
  gridSize.distX = [0.1, 0.2, 0.3, 0.4, 0.5, 1];
  expect(gridSize.nX).toEqual(6);
  gridSize.distY = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 1];
  expect(gridSize.nY).toEqual(7);
});

test('Get cumulative delr and delc', () => {
  const gridSize = GridSize.fromArray([10, 12]);
  gridSize.distX = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1];
  expect(gridSize.delr).toEqual([0.1, 0.1, 0.1, 0.1, 0.1, 0.5]);
});
