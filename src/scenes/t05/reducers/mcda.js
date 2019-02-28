import MCDA from 'core/model/mcda/MCDA';
import uuidv4 from 'uuid';

export const UPDATE_TOOL = 'T05_UPDATE';
export const CLEAR_TOOL = 'T05_CLEAR';

const initialState = {
    id: uuidv4(),
    name: 'New Multi-criteria decision analysis',
    description: 'Description of multi-criteria decision analysis.',
    permissions: 'rwx',
    public: false,
    tool: 'T05',
    type: 'T05',
    data: (new MCDA()).toObject()
};

const model = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_TOOL:
            return initialState;

        case UPDATE_TOOL:
            return {
                ...state, ...action.tool
            };

        default:
            return state;
    }
};

export default model;
