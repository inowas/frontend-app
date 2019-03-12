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

    expect(flopyModelCalculation.toFlopyCalculation()).toEqual({});
});