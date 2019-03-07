import {FlopyModflowMf, FlopyModflowMfbas, FlopyModflowMfriv, FlopyModflowMfwel} from 'core/model/flopy/packages/mf';

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
    expect(model.hash()).toEqual('47fbf6e70805ca5df921b29ee62f9a7c');
    model.modelname = 'modflowtest2';
    expect(model.hash()).toEqual('89c20f1b89d6ba6ea8912467a7fff493');
    model.modelname = 'modflowtest';
    expect(model.hash()).toEqual('47fbf6e70805ca5df921b29ee62f9a7c');

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

    expect(model1.hash()).toEqual(model2.hash());
});
