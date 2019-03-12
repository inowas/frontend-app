import Uuid from 'uuid';
import {FlopyModflowMf} from 'core/model/flopy/packages/mf';
import {Mt3dms} from 'core/model/flopy/packages/mt';
import FlopyModelCalculation from 'core/model/flopy/packages/FlopyModelCalculation';

test('It can instantiate FlopyModelCalculation', () => {
    const modelId = Uuid.v4();
    const mf = new FlopyModflowMf();
    const mt = Mt3dms.fromDefaults();

    const flopyModelCalculation = new FlopyModelCalculation(modelId, mf, mt);
    expect(flopyModelCalculation).toBeInstanceOf(FlopyModelCalculation);

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
