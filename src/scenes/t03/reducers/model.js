import {ModflowModel, Stressperiods} from 'core/model/modflow';

export const UPDATE_MODEL = 'T03_UPDATE_MODEL';
export const UPDATE_STRESSPERIODS = 'T03_UPDATE_STRESSPERIODS';

const model = (state = null, action) => {
    switch (action.type) {
        case UPDATE_MODEL:
            return {
                ...state, ...action.model
            };

        case UPDATE_STRESSPERIODS:
            const model = ModflowModel.fromObject(state);
            const stressperiods = Stressperiods.fromObject(action.payload);
            model.stressperiods = stressperiods;
            return {
                ...state, ...model.toObject()
            };


        default:
            return state;
    }
};

export default model;
