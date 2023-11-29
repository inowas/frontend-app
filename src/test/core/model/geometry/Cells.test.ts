import { BoundingBox, Geometry, GridSize } from '../../../../core/model/geometry';
import { booleanCrosses } from '@turf/turf';
import Cells from '../../../../core/model/geometry/Cells';

export default {};

test('cells works', () => {
  const cells = Cells.create([[1, 2, 3], [4, 5, 6]]);
  expect(cells.toArray()).toEqual([[1, 2, 3], [4, 5, 6]]);
});

test('turf boolean crosses', () => {
  const linestring = Geometry.fromGeoJson({
    type: 'LineString',
    coordinates: [[0, 0], [10, 10]],
  });

  const polygon = Geometry.fromGeoJson({
    type: 'Polygon',
    coordinates: [[[2, 8], [8, 8], [8, 2], [2, 2], [2, 8]]],
  });

  expect(booleanCrosses(linestring.toObject(), polygon.toObject())).toBeTruthy();
});

test('Create cells from geometry', () => {
  const geometry = Geometry.fromGeoJson({
    type: 'LineString',
    coordinates: [[0, 0], [5, 9]],
  });

  const boundingBox = new BoundingBox([[0, 0], [10, 10]]);
  const gridSize = GridSize.fromArray([10, 10]);

  const cells = Cells.fromGeometry(geometry, boundingBox, gridSize);

  // tslint:disable-next-line:max-line-length
  expect(cells.cells).toEqual([
      [0, 9], [0, 8],
      [1, 8], [1, 7],
      [1, 6], [2, 6],
      [2, 5], [2, 4],
      [3, 4], [3, 3],
      [3, 2], [4, 2],
      [4, 1], [5, 1],
      [4, 0], [5, 0],
    ],
  );
  expect(cells.cells.length).toBe(16);
});

test('Invert cells', () => {
  const geometry = Geometry.fromGeoJson({
    type: 'Polygon',
    coordinates: [[[1, 1], [1, 9], [9, 1], [9, 9], [1, 1]]],
  });

  const boundingBox = new BoundingBox([[0, 0], [10, 10]]);
  const gridSize = GridSize.fromArray([10, 10]);

  const cells = Cells.fromGeometry(geometry, boundingBox, gridSize);
  expect(cells.cells.length).toBe(76);

  const invertedCells = cells.invert(gridSize);
  expect(invertedCells).toBeInstanceOf(Cells);
  expect(invertedCells.cells.length).toBe(24);
});
