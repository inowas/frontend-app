import { BoundaryCollection, Stressperiod } from '../../../../../../core/model/modflow';
import { BoundingBox, Cells, Geometry, GridSize } from '../../../../../../core/model/geometry';
import { FlopyModflowMfriv } from '../../../../../../core/model/flopy/packages/mf';
import { LineString } from 'geojson';
import { RiverBoundary } from '../../../../../../core/model/modflow/boundaries';
import Stressperiods from '../../../../../../core/model/modflow/Stressperiods';
import Uuid from 'uuid';
import moment from 'moment';

const createBoundaries = () => {
  const id = Uuid.v4();
  const name = 'NameOfRRiver';
  const geometry = Geometry.fromGeoJson({
    type: 'LineString',
    coordinates: [[0, -4], [3, -4], [11, 0], [11, 4], [15, 2], [19, 2], [19, -2]],
  });
  const layers = [0];
  const spValues = [[30, 40, 50], [33, 44, 55]];

  const boundingBox = new BoundingBox([[0, -5], [20, 5]]);
  const gridSize = GridSize.fromArray([10, 5]);

  const cells = Cells.fromGeometry(geometry, boundingBox, gridSize);
  const riverBoundary = RiverBoundary.create(
    id, geometry.toObject() as LineString, name, layers, cells.toObject(), spValues,
  );

  const op1 = riverBoundary.observationPoints[0];
  riverBoundary.updateObservationPoint(op1.id, 'OP1', {
    type: 'Point',
    coordinates: [3, -4],
  }, [[10, 20, 30], [11, 22, 33]]);
  riverBoundary.createObservationPoint(
    Uuid.v4(),
    'OP3',
    { type: 'Point', coordinates: [19, 2] },
    [[30, 40, 50], [33, 44, 55]],
  );
  riverBoundary.createObservationPoint(
    Uuid.v4(),
    'OP2', { type: 'Point', coordinates: [11, 0] }, [[20, 30, 40], [22, 33, 44]],
  );

  cells.calculateValues(riverBoundary, boundingBox, gridSize);
  riverBoundary.cells = cells;

  return new BoundaryCollection([riverBoundary]);
};

const createStressPeriods = () => {
  const stressperiods = Stressperiods.fromDefaults();
  stressperiods.addStressPeriod(new Stressperiod({
    start_date_time: moment('2001-01-01T00:00:00.000Z').toISOString(),
    nstp: 2,
    tsmult: 1,
    steady: false,
  }));
  return stressperiods;
};

test('It can instantiate FlopyModflowMfRiv', () => {
  const spData = { 0: [1, 2, 4, 4, 5, 5], 1: [1, 2, 4, 4, 5, 5], 2: [1, 2, 4, 4, 5, 5] };
  const mfRiv = FlopyModflowMfriv.fromObject({ stress_period_data: spData });
  expect(mfRiv).toBeInstanceOf(FlopyModflowMfriv);
  expect(mfRiv.stress_period_data).toEqual(spData);
});

test('It can calculate spData river boundaries', () => {
  const mfRiv = FlopyModflowMfriv.create(createBoundaries(), createStressPeriods()) as FlopyModflowMfriv;
  expect(mfRiv).toBeInstanceOf(FlopyModflowMfriv);

  expect(mfRiv.stress_period_data).toEqual({
      '0': [
        [0, 4, 0, 10, 20, 30],
        [0, 4, 1, 13.971, 23.971, 33.971],
        [0, 3, 2, 14.986, 24.986, 34.986],
        [0, 3, 3, 16.987, 26.987, 36.987],
        [0, 2, 4, 18.003, 28.003, 38.003],
        [0, 0, 5, 18.038, 28.038, 38.038],
        [0, 1, 5, 19.022, 29.022, 39.022],
        [0, 2, 5, 20, 30, 40],
        [0, 1, 6, 20, 30, 40],
        [0, 0, 6, 20, 30, 40],
        [0, 3, 4, 21.602, 31.602, 41.602],
        [0, 4, 2, 23.209, 33.209, 43.209],
        [0, 3, 9, 30, 40, 50],
        [0, 2, 9, 30, 40, 50],
        [0, 1, 7, 30, 40, 50],
        [0, 1, 8, 30, 40, 50],
        [0, 1, 9, 30, 40, 50],
      ],
      '1': [
        [0, 4, 0, 11, 22, 33],
        [0, 4, 1, 15.368, 26.368, 37.368],
        [0, 3, 2, 16.485, 27.485, 38.485],
        [0, 3, 3, 18.686, 29.686, 40.686],
        [0, 2, 4, 19.803, 30.803, 41.803],
        [0, 0, 5, 19.842, 30.842, 41.842],
        [0, 1, 5, 20.924, 31.924, 42.924],
        [0, 2, 5, 22, 33, 44],
        [0, 1, 6, 22, 33, 44],
        [0, 0, 6, 22, 33, 44],
        [0, 3, 4, 23.762, 34.762, 45.762],
        [0, 4, 2, 25.53, 36.53, 47.53],
        [0, 3, 9, 33, 44, 55],
        [0, 2, 9, 33, 44, 55],
        [0, 1, 7, 33, 44, 55],
        [0, 1, 8, 33, 44, 55],
        [0, 1, 9, 33, 44, 55],
      ],
    },
  );
});
