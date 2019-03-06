import {FlopyModflowMf, FlopyModflowMfbas} from 'core/model/flopy/packages/mf';

test('It can instantiate FlopyModflowMf', () => {
    const modflowMf = new FlopyModflowMf({});
    expect(modflowMf).toBeInstanceOf(FlopyModflowMf);
    expect(modflowMf.exe_name).toEqual('mf2005');
    expect(modflowMf.modelname).toEqual('modflowtest');
    const modelname = 'newModelName' + Math.random();
    modflowMf.modelname = modelname;
    expect(modflowMf.modelname).toEqual(modelname);
});

test('It generates a hash', () => {
    const model = new FlopyModflowMf();
    FlopyModflowMfbas.createWithModel(model);
    expect(model.hash()).toEqual('47fbf6e70805ca5df921b29ee62f9a7c');
    model.modelname = 'modflowtest2';
    expect(model.hash()).toEqual('89c20f1b89d6ba6ea8912467a7fff493');
    model.modelname = 'modflowtest';
    expect(model.hash()).toEqual('47fbf6e70805ca5df921b29ee62f9a7c');
});
