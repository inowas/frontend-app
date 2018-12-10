export const UPDATE_SOILMODEL = 'T03_UPDATE_SOILMODEL';
export const ADD_SOILMODEL_LAYER = 'T03_ADD_SOILMODEL_LAYER';

const soilmodel = (state = null, action) => {
    switch (action.type) {
        case ADD_SOILMODEL_LAYER:
            return {
                ...state, layers: state.layers.push(action.layer)
            };

        case UPDATE_SOILMODEL:
            return action.soilmodel;

        default:
            return state;
    }
};

export default soilmodel;
