import { BoundingBox, Geometry, GridSize } from '../../../core/model/modflow';
import { IIdwOptions, IPoint3D, distanceWeighting } from '../../../services/geoTools/interpolation';

test('DistanceWeighting', () => {
  const area = Geometry.fromGeoJson({
    type: 'Polygon',
    coordinates: [
      [10.842175, 47.512406],
      [10.842175, 47.502086],
      [10.856509, 47.501912],
      [10.856767, 47.512464],
      [10.842175, 47.512406],
    ],
  });
  const boundingBox = BoundingBox.fromObject([
    [10.842175, 47.501912],
    [10.856767, 47.512464],
  ]);
  const gridSize = GridSize.fromObject({ n_x: 10, n_y: 10 });
  const points: IPoint3D[] = [
    { x: 10.84269, y: 47.512053, z: 100 }, // 0/0
    { x: 10.856338, y: 47.512285, z: 150 }, // 0/9
    { x: 10.8496, y: 47.507125, z: 250 }, // 5/5
    { x: 10.842562, y: 47.502457, z: 300 }, // 9/0
    { x: 10.856123, y: 47.502196, z: 500 }, // 9/9
  ];
  const rotation = 0;
  const options: IIdwOptions = {
    mode: 'number',
    numberOfPoints: 3,
    range: 3,
  };

  const result = distanceWeighting(area, boundingBox, gridSize, points, rotation, options);

  expect(result.length).toEqual(gridSize.nX);
  expect(result[0].length).toEqual(gridSize.nY);
  expect(result[0][0]).toBeLessThan(result[9][9]);
  expect(result[0][0]).toBeLessThan(150);
  expect(result[9][9]).toBeGreaterThan(450);
});
