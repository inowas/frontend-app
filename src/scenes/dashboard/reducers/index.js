import {SET_ACTIVE_TOOL, SET_PUBLIC} from '../actions';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

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

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState;
        }

        default: {
            return state;
        }
    }
};

export default dashboard;