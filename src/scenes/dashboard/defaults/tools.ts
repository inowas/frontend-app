export const ROLE_USER = 'ROLE_USER';

export interface IToolMenuItem {
    slug: string;
    name: string;
    path: string;
    subPath: string;
    role: string;
    instances: any[];
}

export const myTools: IToolMenuItem[] = [
    {
        slug: 'myTools',
        name: 'My tools',
        path: '/my/tools',
        subPath: '',
        role: ROLE_USER,
        instances: []
    }
];

const availableTools: IToolMenuItem[] = [
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
        name: 'Numerical groundwater modelling and optimization',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    }, {
        slug: 'T04',
        name: 'Database for GIS-based suitability mapping',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    }, {
        slug: 'T05',
        name: 'GIS multi-criteria decision analysis',
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
        subPath: '',
        role: ROLE_USER,
        instances: []
    }, {
        slug: 'T08',
        name: '1D transport equation (Ogata-Banks)',
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
        slug: 'T10',
        name: 'Real time monitoring',
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
    },
    /*{
        slug: 'T12',
        name: 'Clogging estimation by MfiData-Index',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    },*/
    {
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
    }, {
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
    }, {
        slug: 'T19',
        name: 'Heat transport',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    }, {
        slug: 'T20',
        name: 'Real time modelling',
        path: '/tools/',
        subPath: '',
        role: ROLE_USER,
        instances: []
    }
];

export default availableTools;
