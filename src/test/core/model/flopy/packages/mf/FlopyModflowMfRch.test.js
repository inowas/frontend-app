import Uuid from 'uuid';
import {RechargeBoundary} from '../../../../../../core/model/modflow/boundaries';
import {FlopyModflow, FlopyModflowMfrch} from '../../../../../../core/model/flopy/packages/mf';

const createRechargeBoundary = () => {
    const id = Uuid.v4();
    const name = 'NameOfRecharge';
    const geometry = {type: 'Polygon', coordinates: [[[3, 4], [3, 5], [4, 5], [4, 3], [3, 4]]]};
    const layers = [1];
    const cells = [[1, 2], [2, 3]];
    const spValues = [[1], [2], [3]];

    return RechargeBoundary.create(
        id, 'rch', geometry, name, layers, cells, spValues
    );
};

const createRechargeBoundary_2 = () => {
    const id = Uuid.v4();
    const name = 'NameOfRecharge';
    const geometry = {type: 'Polygon', coordinates: [[[3, 4], [3, 5], [4, 5], [4, 3], [3, 4]]]};
    const layers = [1];
    const cells = [[2, 1], [3, 2]];
    const spValues = [[2], [3], [4]];

    return RechargeBoundary.create(
        id, 'rch', geometry, name, layers, cells, spValues
    );
};

test('It can instantiate FlopyModflowMfRch', () => {
    const model = new FlopyModflow();
    const spData = {'0': 1, '1': 2, '2': 3};
    const mfRch = FlopyModflowMfrch.create(model, {rech: spData});
    expect(mfRch).toBeInstanceOf(FlopyModflowMfrch);
    expect(mfRch.rech).toEqual(spData);
    expect(model.getPackage('rch')).toBeInstanceOf(FlopyModflowMfrch);
    expect(model.getPackage('rch').toObject()).toEqual(mfRch.toObject())
});

test('It can calculate spData with multiple recharge boundaries', () => {
    const spData = FlopyModflowMfrch.calculateSpData([createRechargeBoundary(), createRechargeBoundary_2()], 3, 5, 5);
    expect(spData).toEqual({
        'irch': 1,
        'spData': {
            '0': [[0, 0, 0, 0, 0], [0, 0, 2, 0, 0], [0, 1, 0, 2, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0]],
            '1': [[0, 0, 0, 0, 0], [0, 0, 3, 0, 0], [0, 2, 0, 3, 0], [0, 0, 2, 0, 0], [0, 0, 0, 0, 0]],
            '2': [[0, 0, 0, 0, 0], [0, 0, 4, 0, 0], [0, 3, 0, 4, 0], [0, 0, 3, 0, 0], [0, 0, 0, 0, 0]],
        }
    });
});
