import {SET_ACTIVE_TOOL, SET_PUBLIC} from '../actions';

const initialState = {
    activeTool: 'T02',
    showPublicInstances: false
};

const dashboard = (state = initialState, action) => {
    switch (action.type) {
        case SET_ACTIVE_TOOL:
            return {
                ...state,
                activeTool: action.payload
            };

        case SET_PUBLIC:
            return {
                ...state,
                showPublicInstances: action.payload
            };

        default: {
            return state;
        }
    }
};

export default dashboard;