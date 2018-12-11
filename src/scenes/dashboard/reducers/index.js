

const dashboard = (state = {activeTool: 'T02'}, action) => {
    switch (action.type) {
        case 'DASHBOARD_SET_ACTIVE_TOOL':
            return {
                ...state,
                activeTool: action.payload
            };

        default: {
            return state;
        }
    }
};

export default dashboard;