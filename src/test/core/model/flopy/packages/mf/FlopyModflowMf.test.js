import {FlopyModflow, FlopyModflowMf} from 'core/model/flopy/packages/mf';

test('It can instantiate FlopyModflowMf', () => {
    const model = new FlopyModflow();
    const modflowMf = FlopyModflowMf.create(model);

    expect(modflowMf).toBeInstanceOf(FlopyModflowMf);
    expect(modflowMf.exe_name).toEqual('mf2005');
    expect(modflowMf.modelname).toEqual('modflowtest');
    const modelname = 'newModelName' + Math.random();
    modflowMf.modelname = modelname;
    expect(modflowMf.modelname).toEqual(modelname);
});
