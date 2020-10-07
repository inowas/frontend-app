import {Polygon} from 'geojson';
import moment from 'moment';
import Uuid from 'uuid';
import {FlopyModflowMfrch} from '../../../../../../core/model/flopy/packages/mf';
import {Cells, Geometry, GridSize, Stressperiod} from '../../../../../../core/model/modflow';
import {RechargeBoundary} from '../../../../../../core/model/modflow/boundaries';
import BoundaryCollection from '../../../../../../core/model/modflow/boundaries/BoundaryCollection';
import Stressperiods from '../../../../../../core/model/modflow/Stressperiods';

const createRechargeBoundary = () => {
    const id = Uuid.v4();
    const name = 'NameOfRecharge';
    const geometry = Geometry.fromGeoJson({type: 'Polygon', coordinates: [[[3, 4], [3, 5], [4, 5], [4, 3], [3, 4]]]});
    const layers = [1];
    const cells = Cells.fromObject([[1, 2], [2, 3]]);
    const spValues = [[1], [2], [3]];

    return RechargeBoundary.create(
        id, geometry.toObject() as Polygon, name, layers, cells.toObject(), spValues, 1
    );
};

const createRechargeBoundary2 = () => {
    const id = Uuid.v4();
    const name = 'NameOfRecharge';
    const geometry = Geometry.fromGeoJson({type: 'Polygon', coordinates: [[[3, 4], [3, 5], [4, 5], [4, 3], [3, 4]]]});
    const layers = [1];
    const cells = Cells.fromObject([[2, 1], [3, 2]]);
    const spValues = [[2], [3], [4]];

    return RechargeBoundary.create(id, geometry.toObject() as Polygon, name, layers, cells.toObject(), spValues, 1);
};

const createBoundaries = () => (
    new BoundaryCollection([createRechargeBoundary(), createRechargeBoundary2()])
);

const createStressPeriods = () => {
    const stressperiods = Stressperiods.fromDefaults();
    stressperiods.addStressPeriod(new Stressperiod({
        start_date_time: moment('2001-01-02T00:00:00.000Z').toISOString(),
        nstp: 2,
        tsmult: 1,
        steady: false
    }));
    stressperiods.addStressPeriod(new Stressperiod({
        start_date_time: moment('2001-01-03T00:00:00.000Z').toISOString(),
        nstp: 2,
        tsmult: 1,
        steady: false
    }));
    return stressperiods;
};

test('It can instantiate FlopyModflowMfRch', () => {
    const spData = {0: 1, 1: 2, 2: 3};
    const mfRch = FlopyModflowMfrch.fromObject({rech: spData});
    expect(mfRch).toBeInstanceOf(FlopyModflowMfrch);
    expect(mfRch.rech).toEqual(spData);
});

test('It can calculate spData with multiple recharge boundaries', () => {
    const mfRch = FlopyModflowMfrch.create(
        createBoundaries(), createStressPeriods(), GridSize.fromArray([5, 4])
    ) as FlopyModflowMfrch;

    expect(mfRch.stress_period_data).toEqual({
            0: [[0, 0, 0, 0, 0], [0, 0, 2, 0, 0], [0, 1, 0, 2, 0], [0, 0, 1, 0, 0]],
            1: [[0, 0, 0, 0, 0], [0, 0, 3, 0, 0], [0, 2, 0, 3, 0], [0, 0, 2, 0, 0]],
            2: [[0, 0, 0, 0, 0], [0, 0, 4, 0, 0], [0, 3, 0, 4, 0], [0, 0, 3, 0, 0]]
        }
    );
});
