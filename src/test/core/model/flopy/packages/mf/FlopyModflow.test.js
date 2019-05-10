import {
    FlopyModflow,
    FlopyModflowMfbas,
    FlopyModflowMfdis,
    FlopyModflowMfriv,
    FlopyModflowMfwel
} from '../../../core/model/flopy/packages/mf';

test('It can instantiate FlopyModflow', () => {
    const model = new FlopyModflow();
    expect(model).toBeInstanceOf(FlopyModflow);
});

test('It has a toFlopyCalculation-method', () => {
    const model = new FlopyModflow();
    FlopyModflowMfbas.create(model);
    FlopyModflowMfdis.create(model);

    const welSpData = {0: [[1, 2, 3, 1000], [1, 2, 4, 1000], [1, 2, 5, 1000]]};
    const rivSpData = {0: [[1, 2, 3, 1, 2, 3], [1, 2, 4, 2, 3, 4], [1, 2, 5, 5, 6, 7]]};

    FlopyModflowMfwel.create(model, {stress_period_data: welSpData});
    FlopyModflowMfriv.create(model, {stress_period_data: rivSpData});


    expect(model.toFlopyCalculation()).toEqual({
            'bas': {
                'extension': 'bas',
                'filenames': null,
                'hnoflo': -999.99,
                'ibound': 1,
                'ichflg': false,
                'ifrefm': true,
                'ixsec': false,
                'stoper': null,
                'strt': 1,
                'unitnumber': null
            },
            'dis': {
                'botm': 0,
                'delc': 1,
                'delr': 1,
                'extension': 'dis',
                'filenames': null,
                'itmuni': 4,
                'laycbd': 0,
                'lenuni': 2,
                'ncol': 2,
                'nlay': 1,
                'nper': 1,
                'nrow': 2,
                'nstp': 1,
                'perlen': 1,
                'proj4_str': null,
                'rotation': 0,
                'start_datetime': null,
                'steady': true,
                'top': 1,
                'tsmult': 1,
                'unitnumber': null,
                'xul': null,
                'yul': null
            },
            'mf': {
                'exe_name': 'mf2005',
                'external_path': null,
                'listunit': 2,
                'model_ws': '.',
                'modelname': 'modflowtest',
                'namefile_ext': 'nam',
                'structured': true,
                'verbose': false,
                'version': 'mf2005'
            },
            'packages': ['mf', 'bas', 'dis', 'wel', 'riv'],
            'riv': {
                'dtype': null,
                'extension': 'riv',
                'filenames': null,
                'ipakcb': 0,
                'options': null,
                'stress_period_data': {'0': [[1, 2, 3, 1, 2, 3], [1, 2, 4, 2, 3, 4], [1, 2, 5, 5, 6, 7]]},
                'unitnumber': null
            },
            'wel': {
                'binary': false,
                'dtype': null,
                'extension': 'wel',
                'filenames': null,
                'ipakcb': null,
                'options': null,
                'stress_period_data': {'0': [[1, 2, 3, 1000], [1, 2, 4, 1000], [1, 2, 5, 1000]]},
                'unitnumber': null
            }
        }
    );
});