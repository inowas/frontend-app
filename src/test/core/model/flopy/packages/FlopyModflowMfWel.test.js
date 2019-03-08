import FlopyModflowMf from 'core/model/flopy/packages/mf/FlopyModflowMf'
import FlopyModflowMfwel from 'core/model/flopy/packages/mf/FlopyModflowMfwel'
import Uuid from 'uuid';
import {WellBoundary} from 'core/model/modflow/boundaries';
import {Stressperiod, Stressperiods} from 'core/model/modflow';

test('It can instantiate FlopyModflowMfwel', () => {
    const model = new FlopyModflowMf();
    const mfWel = FlopyModflowMfwel.create(model);
    expect(mfWel).toBeInstanceOf(FlopyModflowMfwel);
    expect(model.packages['wel']).toEqual(mfWel.toObject());
    expect(model.getPackage('wel')).toBeInstanceOf(FlopyModflowMfwel);
    expect(model.getPackage('wel').toObject()).toEqual(mfWel.toObject())
});

test('It can calculate spData with one well', () => {
    const model = new FlopyModflowMf();

    const id = Uuid.v4();
    const name = 'NameOfWell';
    const geometry = {type: 'Point', coordinates: [[3, 4]]};
    const layers = [1];
    const cells = [[1, 2]];
    const spValues = [[5000], [4000], [0]];

    const wellBoundary = WellBoundary.create(
        id, geometry, name, layers, cells, spValues
    );

    const stressperiods = Stressperiods.fromDefaults();
    stressperiods.addStressPeriod(new Stressperiod('2000-02-01', 1, 1, false));
    stressperiods.addStressPeriod(new Stressperiod('2000-03-01', 1, 1, false));

    const mfWel = FlopyModflowMfwel.createWithWellsAndStressperiods(model, [wellBoundary], stressperiods);
    expect(mfWel).toBeInstanceOf(FlopyModflowMfwel);
    expect(model.getPackage('wel')).toBeInstanceOf(FlopyModflowMfwel);
    expect(mfWel.stress_period_data).toEqual({
        '0': [[1, 2, 1, 5000]],
        '1': [[1, 2, 1, 4000]],
        '2': [[1, 2, 1, 0]],
    });

    model.setPackage(mfWel);
});

test('It can calculate spData with two wells at the same cell', () => {
    const model = new FlopyModflowMf();

    let id = Uuid.v4();
    let name = 'NameOfWell';
    let geometry = {type: 'Point', coordinates: [[3, 4]]};
    let layers = [1];
    let cells = [[1, 2]];
    let spValues = [[5000], [4000], [0]];

    const wellBoundary_1 = WellBoundary.create(
        id, geometry, name, layers, cells, spValues
    );

    id = Uuid.v4();
    name = 'NameOfWell';
    geometry = {type: 'Point', coordinates: [[3, 4]]};
    layers = [1];
    cells = [[1, 2]];
    spValues = [[5000], [4000], [0]];

    const wellBoundary_2 = WellBoundary.create(
        id, geometry, name, layers, cells, spValues
    );

    const stressperiods = Stressperiods.fromDefaults();
    stressperiods.addStressPeriod(new Stressperiod('2000-02-01', 1, 1, false));
    stressperiods.addStressPeriod(new Stressperiod('2000-03-01', 1, 1, false));

    const mfWel = FlopyModflowMfwel.createWithWellsAndStressperiods(model, [wellBoundary_1, wellBoundary_2], stressperiods);
    expect(mfWel).toBeInstanceOf(FlopyModflowMfwel);
    expect(model.getPackage('wel')).toBeInstanceOf(FlopyModflowMfwel);
    expect(mfWel.stress_period_data).toEqual({
        '0': [[1, 2, 1, 10000]],
        '1': [[1, 2, 1, 8000]],
        '2': [[1, 2, 1, 0]],
    });

    model.setPackage(mfWel);
});

test('It can calculate spData with two wells at the different cells', () => {
    const model = new FlopyModflowMf();

    let id = Uuid.v4();
    let name = 'NameOfWell';
    let geometry = {type: 'Point', coordinates: [[3, 4]]};
    let layers = [1];
    let cells = [[1, 2]];
    let spValues = [[5000], [4000], [0]];

    const wellBoundary_1 = WellBoundary.create(
        id, geometry, name, layers, cells, spValues
    );

    id = Uuid.v4();
    name = 'NameOfWell';
    geometry = {type: 'Point', coordinates: [[3, 4]]};
    layers = [1];
    cells = [[1, 3]];
    spValues = [[5000], [4000], [0]];

    const wellBoundary_2 = WellBoundary.create(
        id, geometry, name, layers, cells, spValues
    );

    const stressperiods = Stressperiods.fromDefaults();
    stressperiods.addStressPeriod(new Stressperiod('2000-02-01', 1, 1, false));
    stressperiods.addStressPeriod(new Stressperiod('2000-03-01', 1, 1, false));

    const mfWel = FlopyModflowMfwel.createWithWellsAndStressperiods(model, [wellBoundary_1, wellBoundary_2], stressperiods);
    expect(mfWel).toBeInstanceOf(FlopyModflowMfwel);
    expect(model.getPackage('wel')).toBeInstanceOf(FlopyModflowMfwel);
    expect(mfWel.stress_period_data).toEqual({
        '0': [[1, 2, 1, 5000], [1, 3, 1, 5000]],
        '1': [[1, 2, 1, 4000], [1, 3, 1, 4000]],
        '2': [[1, 2, 1, 0], [1, 3, 1, 0]],
    });

    model.setPackage(mfWel);
});

