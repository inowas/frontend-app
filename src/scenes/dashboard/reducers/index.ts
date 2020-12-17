import {IToolMenuItem, ROLE_USER} from '../defaults/tools';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';
import {SET_ACTIVE_TOOL, SET_PUBLIC} from '../actions';

const initialState: IDashboardReducer = {
    activeTool: {
        slug: 'T03',
        name: 'Numerical groundwater modelling and optimization',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    },
    showPublicInstances: false
};

export interface IDashboardReducer {
    activeTool: IToolMenuItem;
    showPublicInstances: boolean;
}

const dashboard = (state: IDashboardReducer = initialState, action: any) => {
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
