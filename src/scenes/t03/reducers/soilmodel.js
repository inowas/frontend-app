export const UPDATE_SOILMODEL = 'T03_UPDATE_SOILMODEL';

const soilmodel = (state = null, action) => {
    switch (action.type) {
        case UPDATE_SOILMODEL:
            return action.soilmodel;

        default:
            return state;
    }
};

export default soilmodel;
