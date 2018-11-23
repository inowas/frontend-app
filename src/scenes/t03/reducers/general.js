export const UPDATE_GENERAL = 'UPDATE_GENERAL';

const initialState = {
    id: null,
    name: 'New groundwater model',
    description: 'The description comes here.',
    bounding_box: null,
    geometry: null,
    permissions: 'rwx',
    public: true
};

const general = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_GENERAL:
            return {
                ...state, ...action.payload
            };

        default:
            return state;
    }
};

export default general;
