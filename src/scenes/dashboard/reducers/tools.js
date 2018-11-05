import {Modifier as Dashboard} from '../index';
import {Action} from '../actions/index';

const ROLE_USER = 'ROLE_USER';
const ROLE_NM_MF = 'ROLE_NM_MF';

const initialState = [
    {
        slug: 'T01',
        name: 'SAT basin infiltration capacity reduction database',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    },
    {
        slug: 'T02',
        name: 'Groundwater mounding (Hantush)',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    }, {
        slug: 'T03',
        name: 'MODFLOW model setup and editor',
        path: '/tools/',
        subPath: '',
        role: ROLE_NM_MF,
        instances: []
    }, {
        slug: 'T04',
        name: 'Database for GIS-based suitability mapping',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    }, {
        slug: 'T06',
        name: 'MAR method selection',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    }, {
        slug: 'T07',
        name: 'MODFLOW model scenario manager',
        path: '/tools/',
        subPath: '/CrossSection',
        role: ROLE_NM_MF,
        instances: []
    }, {
        slug: 'T08',
        name: '1D transport model (Ogata-Banks)',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    }, {
        slug: 'T09',
        name: 'Simple saltwater intrusion equations',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    }, {
        slug: 'T11',
        name: 'MAR model selection',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    }, {
        slug: 'T13',
        name: 'Travel time through unconfined aquifer',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    }, {
        slug: 'T14',
        name: 'Pumping-induced river drawdown',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    }, /* {
        slug: 'T16',
        name: 'Calculation of hydraulic conductivity',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    }, */
    {
        slug: 'T17',
        name: 'Global MAR portal',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    }, {
        slug: 'T18',
        name: 'SAT basin design',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    }];

const tools = (state = initialState, action) => {
    switch (action.type) {
        case Action.SET_INSTANCES:
            return state.map(t => {
                if (t.slug === action.tool) {
                    return {
                        ...t,
                        instances: action.payload
                    };
                }

                return t;
            });

        case Dashboard.Event.TOOL_INSTANCE_DELETED:
            return state.map(t => {
                if (t.slug === action.tool) {
                    return {
                        ...t,
                        instances: [
                            ...t.instances.slice(0, t.instances.findIndex(b => (b.id === action.payload))),
                            ...t.instances.slice(t.instances.findIndex(b => (b.id === action.payload)) + 1, t.instances.length)
                        ]
                    };
                }

                return t;
            });

        default:
            return state;
    }
};

export default tools;
