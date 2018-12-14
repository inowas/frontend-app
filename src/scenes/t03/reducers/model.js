import {ModflowModel, Stressperiods} from 'core/model/modflow';
import {Mt3dms} from 'core/model/modflow/mt3d';

export const UPDATE_MODEL = 'T03_UPDATE_MODEL';
export const UPDATE_MT3DMS = 'T03_UPDATE_MT3DMS';
export const UPDATE_STRESSPERIODS = 'T03_UPDATE_STRESSPERIODS';

const model = (state = null, action) => {
    switch (action.type) {
        case UPDATE_MODEL:
            return {
                ...state, ...action.model
            };

        case UPDATE_MT3DMS:
            const model1 = ModflowModel.fromObject(state);
            const mt3dms = Mt3dms.fromObject(action.payload);
            model1.mt3dms = mt3dms;
            return {
                ...state, ...model1.toObject()
            };

        case UPDATE_STRESSPERIODS:
            const model2 = ModflowModel.fromObject(state);
            const stressperiods = Stressperiods.fromObject(action.payload);
            model2.stressperiods = stressperiods;
            return {
                ...state, ...model2.toObject()
            };


        default:
            return state;
    }
};

export default model;
