import { BoundingBox, Cells, Geometry, GridSize } from '../../../../../../core/model/geometry';
import { ConstantHeadBoundary } from '../../../../../../core/model/modflow/boundaries';
import { FlopyModflowMfchd } from '../../../../../../core/model/flopy/packages/mf';
import { LineString } from 'geojson';
import { Stressperiod } from '../../../../../../core/model/modflow';
import BoundaryCollection from '../../../../../../core/model/modflow/boundaries/BoundaryCollection';
import Stressperiods from '../../../../../../core/model/modflow/Stressperiods';
import Uuid from 'uuid';
import moment from 'moment';

const createBoundaries = () => {
  const id = Uuid.v4();
  const name = 'NameOfBoundary';
  const geometry = Geometry.fromGeoJson({
    type: 'LineString',
    coordinates: [[0, -4], [3, -4], [11, 0], [11, 4], [15, 2], [19, 2], [19, -2]],
  });
  const layers = [0, 2];
  const spValues = [[30, 40], [33, 44]];

  const boundingBox = new BoundingBox([[0, -5], [20, 5]]);
  const gridSize = GridSize.fromArray([10, 5]);

  const cells = Cells.fromGeometry(geometry, boundingBox, gridSize);
  const boundary = ConstantHeadBoundary.create(
    id, geometry.toObject() as LineString, name, layers, cells.toObject(), spValues,
  );

  const op1 = boundary.observationPoints[0];
  boundary.updateObservationPoint(op1.id, 'OP1', { type: 'Point', coordinates: [3, -4] }, [[10, 20], [11, 22]]);
  boundary.createObservationPoint(Uuid.v4(), 'OP3', { type: 'Point', coordinates: [19, 2] }, [[30, 40], [33, 44]]);
  boundary.createObservationPoint(Uuid.v4(), 'OP2', { type: 'Point', coordinates: [11, 0] }, [[20, 30], [22, 33]]);

  cells.calculateValues(boundary, boundingBox, gridSize);
  boundary.cells = cells;

  return new BoundaryCollection([boundary]);
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

test('It can instantiate FlopyModflowMfChd', () => {
  const spData = { 0: [1, 2, 4, 4, 5], 1: [1, 2, 4, 4, 5], 2: [1, 2, 4, 4, 5] };
  const mfChd = FlopyModflowMfchd.fromObject({ stress_period_data: spData });
  expect(mfChd).toBeInstanceOf(FlopyModflowMfchd);
  expect(mfChd.stress_period_data).toEqual(spData);
});

test('It can calculate spData of chd-boundaries', () => {
  const mfChd = FlopyModflowMfchd.create(createBoundaries(), createStressPeriods()) as FlopyModflowMfchd;
  expect(mfChd).toBeInstanceOf(FlopyModflowMfchd);

  expect(mfChd.stress_period_data).toEqual(
    {
      '0': [
        [0, 4, 0, 10, 20],
        [0, 4, 1, 13.971, 23.971],
        [0, 3, 2, 14.986, 24.986],
        [0, 3, 3, 16.987, 26.987],
        [0, 2, 4, 18.003, 28.003],
        [0, 0, 5, 18.038, 28.038],
        [0, 1, 5, 19.022, 29.022],
        [0, 2, 5, 20, 30],
        [0, 1, 6, 20, 30],
        [0, 0, 6, 20, 30],
        [0, 3, 4, 21.602, 31.602],
        [0, 4, 2, 23.209, 33.209],
        [0, 3, 9, 30, 40],
        [0, 2, 9, 30, 40],
        [0, 1, 7, 30, 40],
        [0, 1, 8, 30, 40],
        [0, 1, 9, 30, 40],
        [2, 4, 0, 10, 20],
        [2, 4, 1, 13.971, 23.971],
        [2, 3, 2, 14.986, 24.986],
        [2, 3, 3, 16.987, 26.987],
        [2, 2, 4, 18.003, 28.003],
        [2, 0, 5, 18.038, 28.038],
        [2, 1, 5, 19.022, 29.022],
        [2, 2, 5, 20, 30],
        [2, 1, 6, 20, 30],
        [2, 0, 6, 20, 30],
        [2, 3, 4, 21.602, 31.602],
        [2, 4, 2, 23.209, 33.209],
        [2, 3, 9, 30, 40],
        [2, 2, 9, 30, 40],
        [2, 1, 7, 30, 40],
        [2, 1, 8, 30, 40],
        [2, 1, 9, 30, 40],
      ],
      '1': [
        [0, 4, 0, 11, 22],
        [0, 4, 1, 15.368, 26.368],
        [0, 3, 2, 16.485, 27.485],
        [0, 3, 3, 18.686, 29.686],
        [0, 2, 4, 19.803, 30.803],
        [0, 0, 5, 19.842, 30.842],
        [0, 1, 5, 20.924, 31.924],
        [0, 2, 5, 22, 33],
        [0, 1, 6, 22, 33],
        [0, 0, 6, 22, 33],
        [0, 3, 4, 23.762, 34.762],
        [0, 4, 2, 25.53, 36.53],
        [0, 3, 9, 33, 44],
        [0, 2, 9, 33, 44],
        [0, 1, 7, 33, 44],
        [0, 1, 8, 33, 44],
        [0, 1, 9, 33, 44],
        [2, 4, 0, 11, 22],
        [2, 4, 1, 15.368, 26.368],
        [2, 3, 2, 16.485, 27.485],
        [2, 3, 3, 18.686, 29.686],
        [2, 2, 4, 19.803, 30.803],
        [2, 0, 5, 19.842, 30.842],
        [2, 1, 5, 20.924, 31.924],
        [2, 2, 5, 22, 33],
        [2, 1, 6, 22, 33],
        [2, 0, 6, 22, 33],
        [2, 3, 4, 23.762, 34.762],
        [2, 4, 2, 25.53, 36.53],
        [2, 3, 9, 33, 44],
        [2, 2, 9, 33, 44],
        [2, 1, 7, 33, 44],
        [2, 1, 8, 33, 44],
        [2, 1, 9, 33, 44],
      ],
    },
  );
});
