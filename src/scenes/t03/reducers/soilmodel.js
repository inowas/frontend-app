export const UPDATE_SOILMODEL = 'T03_UPDATE_SOILMODEL';
export const ADD_SOILMODEL_LAYER = 'T03_ADD_SOILMODEL_LAYER';

const soilmodel = (state = null, action) => {
    switch (action.type) {
        case ADD_SOILMODEL_LAYER:
            const layers = state.layers;
            layers.push(action.layer);
            return {
                ...state, layers
            };

        case UPDATE_SOILMODEL:
            return action.soilmodel;

        default:
            return state;
    }
};

export default soilmodel;
