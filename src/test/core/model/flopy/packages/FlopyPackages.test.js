import Uuid from 'uuid';
import {FlopyModflow, FlopyModflowMf} from 'core/model/flopy/packages/mf';
import {Mt3dms} from 'core/model/flopy/packages/mt';
import FlopyPackages from 'core/model/flopy/packages/FlopyPackages';

test('It can instantiate FlopyPackages', () => {
    const modelId = Uuid.v4();
    const mf = new FlopyModflow();
    FlopyModflowMf.create(mf);

    const mt = Mt3dms.fromDefaults();

    const flopyModelCalculation = new FlopyPackages(modelId, mf, mt);
    expect(flopyModelCalculation).toBeInstanceOf(FlopyPackages);

    expect(flopyModelCalculation.model_id).toEqual(modelId);
    expect(flopyModelCalculation.mf.toObject()).toEqual(mf.toObject());

    expect(flopyModelCalculation.toFlopyCalculation().data).toEqual({
        'mf': {
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
            }, 'packages': ['mf']
        }
    });
});
