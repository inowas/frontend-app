import { BoundingBox } from '../../../core/model/modflow';
import { GridSize } from '../../../core/model/geometry';
import { getActiveCellFromCoordinate } from '../../../services/geoTools';

test('GeoTools getActiveCellFromCoordinate PT1', () => {

  const xMin = 0;
  const xMax = 10;
  const yMin = 100;
  const yMax = 110;
  const boundingBox = new BoundingBox([[xMin, yMin], [xMax, yMax]]);
  expect(boundingBox).toBeInstanceOf(BoundingBox);

  const gridSize = new GridSize({ n_x: 10, n_y: 10 });
  expect(gridSize).toBeInstanceOf(GridSize);

  const x = 1.5;
  const y = 101.5;
  const coordinate = [x, y];
  expect(
    getActiveCellFromCoordinate(coordinate, boundingBox, gridSize)
  ).toEqual([1, 8]);

  expect(
    getActiveCellFromCoordinate(coordinate, boundingBox, gridSize)
  ).toEqual([1, 8]);

  gridSize.nX = 100;
  expect(
    getActiveCellFromCoordinate(coordinate, boundingBox, gridSize)
  ).toEqual([15, 8]);

  gridSize.nY = 100;
  expect(
    getActiveCellFromCoordinate(coordinate, boundingBox, gridSize)
  ).toEqual([15, 85]);

});

