import Uuid from 'uuid';
import {FlopyModflow} from '../../../core/model/flopy/packages/mf';
import {FlopyMt3d} from '../../../core/model/flopy/packages/mt';
import FlopyPackages from '../../../core/model/flopy/packages/FlopyPackages';

test('It can instantiate FlopyPackages', () => {
    const modelId = Uuid.v4();

    const mf = new FlopyModflow();
    const mt = new FlopyMt3d();

    const flopyPackages = FlopyPackages.create(modelId, mf, mt);
    expect(flopyPackages).toBeInstanceOf(FlopyPackages);

    expect(flopyPackages.model_id).toEqual(modelId);
    expect(flopyPackages.mf.toObject()).toEqual(mf.toObject());

    expect(flopyPackages.toFlopyCalculation().data).toEqual({
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
