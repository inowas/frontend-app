import { Action } from '../actions';

const webData = (state = {}, action) => {
    // TODO ensure uniqueness
    switch (action.type) {
        case Action.AT_RESET_WEB_DATA: {
            return {
                ...state,
                [action.provokingActionType]: undefined
            };
        }

        case Action.AT_CLEAR_WEB_DATA: {
            return {};
        }

        case Action.SET_AJAX_STATUS: {
            return {
                ...state,
                [action.provokingActionType]: action.status
            };
        }

        default: {
            return state;
        }
    }
};

export default webData;
