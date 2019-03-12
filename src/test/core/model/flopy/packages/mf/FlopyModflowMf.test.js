import {
    FlopyModflowMf,
    FlopyModflowMfbas,
    FlopyModflowMfdis,
    FlopyModflowMfriv,
    FlopyModflowMfwel
} from 'core/model/flopy/packages/mf';

test('It can instantiate FlopyModflowMf', () => {
    const model = new FlopyModflowMf();
    expect(model).toBeInstanceOf(FlopyModflowMf);
    expect(model.exe_name).toEqual('mf2005');
    expect(model.modelname).toEqual('modflowtest');
    const modelname = 'newModelName' + Math.random();
    model.modelname = modelname;
    expect(model.modelname).toEqual(modelname);
});

test('It generates a hash', () => {
    const model = new FlopyModflowMf();
    FlopyModflowMfbas.create(model);
    expect(model.hash(model.packages)).toEqual('47fbf6e70805ca5df921b29ee62f9a7c');
    model.modelname = 'modflowtest2';
    expect(model.hash(model.packages)).toEqual('89c20f1b89d6ba6ea8912467a7fff493');
    model.modelname = 'modflowtest';
    expect(model.hash(model.packages)).toEqual('47fbf6e70805ca5df921b29ee62f9a7c');

    const stressPeriodData = {0: [[1, 2, 3, 1000], [1, 2, 4, 1000], [1, 2, 5, 1000]]};
    const welPackage = FlopyModflowMfwel.create(model, {
        stress_period_data: stressPeriodData
    });
    expect(welPackage).toBeInstanceOf(FlopyModflowMfwel);
    expect(welPackage.stress_period_data).toEqual(stressPeriodData);

});

test('It generates the same hash, adding packages in different order', () => {
    const model1 = new FlopyModflowMf();
    FlopyModflowMfbas.create(model1);

    const welSpData = {0: [[1, 2, 3, 1000], [1, 2, 4, 1000], [1, 2, 5, 1000]]};
    const rivSpData = {0: [[1, 2, 3, 1, 2, 3], [1, 2, 4, 2, 3, 4], [1, 2, 5, 5, 6, 7]]};

    FlopyModflowMfwel.create(model1, {stress_period_data: welSpData});
    FlopyModflowMfriv.create(model1, {stress_period_data: rivSpData});

    const model2 = new FlopyModflowMf();
    FlopyModflowMfbas.create(model2);

    FlopyModflowMfriv.create(model2, {stress_period_data: rivSpData});
    FlopyModflowMfwel.create(model2, {stress_period_data: welSpData});

    expect(model1.hash(model1.packages)).toEqual(model2.hash(model2.packages));
});

test('It has a toFlopyCalculation-method', () => {
    const model1 = new FlopyModflowMf();
    FlopyModflowMfbas.create(model1);
    FlopyModflowMfdis.create(model1);

    const welSpData = {0: [[1, 2, 3, 1000], [1, 2, 4, 1000], [1, 2, 5, 1000]]};
    const rivSpData = {0: [[1, 2, 3, 1, 2, 3], [1, 2, 4, 2, 3, 4], [1, 2, 5, 5, 6, 7]]};

    FlopyModflowMfwel.create(model1, {stress_period_data: welSpData});
    FlopyModflowMfriv.create(model1, {stress_period_data: rivSpData});


    expect(model1.toFlopyCalculation()).toEqual({
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
                'ipakcb': null,
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