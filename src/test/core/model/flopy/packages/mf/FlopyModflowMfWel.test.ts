import {Point} from 'geojson';
import Uuid from 'uuid';

import {FlopyModflow, FlopyModflowMfwel} from '../../../../../../core/model/flopy/packages/mf';
import {Cells, Geometry} from '../../../../../../core/model/geometry';
import {Stressperiod, Stressperiods} from '../../../../../../core/model/modflow';
import {WellBoundary} from '../../../../../../core/model/modflow/boundaries';

const createStressperiods = () => {
    const stressperiods = Stressperiods.fromDefaults();
    stressperiods.addStressPeriod(new Stressperiod({
        start_date_time: '2000-02-01T00:00:00.000Z',
        nstp: 1,
        tsmult: 1,
        steady: false
    }));
    stressperiods.addStressPeriod(new Stressperiod({
        start_date_time: '2000-03-01T00:00:00.000Z',
        nstp: 1,
        tsmult: 1,
        steady: false
    }));
    return stressperiods;
};

test('It can instantiate FlopyModflowMfwel', () => {
    const model = new FlopyModflow();
    const spData = {0: [[1, 2, 1, 5000]], 1: [[1, 2, 1, 4000]], 2: [[1, 2, 1, 0]]};
    const mfWel = FlopyModflowMfwel.create(model, {stress_period_data: spData});
    expect(mfWel).toBeInstanceOf(FlopyModflowMfwel);
    expect(mfWel.stress_period_data).toEqual(spData);
    expect(model.getPackage('wel')).toBeInstanceOf(FlopyModflowMfwel);
    expect(model.getPackage('wel').toObject()).toEqual(mfWel.toObject());
});

test('It can calculate spData with one well', () => {
    const id = Uuid.v4();
    const name = 'NameOfWell';
    const geometry = Geometry.fromGeoJson({type: 'Point', coordinates: [[3, 4]]});
    const layers = [1];
    const cells = Cells.fromObject([[1, 2]]);
    const spValues = [[5000], [4000], [0]];

    const wellBoundary = WellBoundary.create(
        id, geometry.toObject() as Point, name, layers, cells.toObject(), spValues
    );

    const spData = FlopyModflowMfwel.calculateSpData([wellBoundary], createStressperiods().count);
    expect(spData).toEqual({
        0: [[1, 2, 1, 5000]],
        1: [[1, 2, 1, 4000]],
        2: [[1, 2, 1, 0]],
    });
});

test('It can calculate spData with two wells at the same cell', () => {
    let id = Uuid.v4();
    let name = 'NameOfWell';
    let geometry = Geometry.fromGeoJson({type: 'Point', coordinates: [[3, 4]]});
    let layers = [1];
    let cells = Cells.fromObject([[1, 2]]);
    let spValues = [[5000], [4000], [0]];

    const wellBoundary1 = WellBoundary.create(
        id, geometry.toObject() as Point, name, layers, cells.toObject(), spValues
    );

    id = Uuid.v4();
    name = 'NameOfWell';
    geometry = Geometry.fromGeoJson({type: 'Point', coordinates: [[3, 4]]});
    layers = [1];
    cells = Cells.fromObject([[1, 2]]);
    spValues = [[5000], [4000], [0]];

    const wellBoundary2 = WellBoundary.create(
        id, geometry.toObject() as Point, name, layers, cells.toObject(), spValues
    );
    const spData = FlopyModflowMfwel.calculateSpData([wellBoundary1, wellBoundary2], createStressperiods().count);
    expect(spData).toEqual({
        0: [[1, 2, 1, 10000]],
        1: [[1, 2, 1, 8000]],
        2: [[1, 2, 1, 0]],
    });
});

test('It can calculate spData with two wells at the different cells', () => {
    let id = Uuid.v4();
    let name = 'NameOfWell';
    let geometry = Geometry.fromGeoJson({type: 'Point', coordinates: [[3, 4]]});
    let layers = [1];
    let cells = Cells.fromObject([[1, 2]]);
    let spValues = [[5000], [4000], [0]];

    const wellBoundary1 = WellBoundary.create(
        id, geometry.toObject() as Point, name, layers, cells.toObject(), spValues
    );

    id = Uuid.v4();
    name = 'NameOfWell';
    geometry = Geometry.fromGeoJson({type: 'Point', coordinates: [[3, 4]]});
    layers = [1];
    cells = Cells.fromObject([[1, 3]]);
    spValues = [[5000], [4000], [0]];

    const wellBoundary2 = WellBoundary.create(
        id, geometry.toObject() as Point, name, layers, cells.toObject(), spValues
    );
    const spData = FlopyModflowMfwel.calculateSpData([wellBoundary1, wellBoundary2], createStressperiods().count);
    expect(spData).toEqual({
        0: [[1, 2, 1, 5000], [1, 3, 1, 5000]],
        1: [[1, 2, 1, 4000], [1, 3, 1, 4000]],
        2: [[1, 2, 1, 0], [1, 3, 1, 0]],
    });
});
