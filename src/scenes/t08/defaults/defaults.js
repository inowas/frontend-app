import uuidv4 from 'uuid';

export const SETTINGS_CASE_FIXED_TIME = 1;
export const SETTINGS_CASE_VARIABLE_TIME = 2;
export const SETTINGS_INFILTRATION_ONE_TIME = 1;
export const SETTINGS_INFILTRATION_CONTINUOUS = 2;

export const defaults = () => {
    return {
        id: uuidv4(),
        name: 'New simple tool',
        description: 'Simple tool description',
        permissions: 'rwx',
        public: false,
        tool: 'T08',
        data: {
            parameters: [{
                order: 0,
                id: 'C0',
                name: 'Initial solute concentration<br/><em>C</em><sub>0</sub> [mg/l]',
                min: 0.0,
                max: 1000.0,
                value: 100,
                stepSize: 0.01,
                decimals: 3
            }, {
                order: 1,
                id: 'x',
                name: 'Distance from injection point<br/><em>x</em> [m]',
                min: 0,
                max: 100,
                value: 10,
                stepSize: 1,
                decimals: 2
            }, {
                order: 2,
                id: 't',
                name: 'Time since injection<br/><em>t</em> [d]',
                min: 0,
                max: 500,
                value: 365,
                stepSize: 1,
                decimals: 0
            }, {
                order: 3,
                id: 'K',
                name: 'Hydraulic conductivity<br/><em>K</em> [m/d]',
                min: 1e-2,
                max: 1e+2,
                value: 2.592,
                stepSize: 0.001,
                decimals: 3
            }, {
                order: 4,
                id: 'I',
                name: 'Hydraulic gradient<br/><em>I</em> [-]',
                min: 0,
                max: 0.01,
                value: 0.002,
                stepSize: 0.001,
                decimals: 3
            }, {
                order: 5,
                id: 'ne',
                name: 'Effective porosity<br/><em>n</em> [-]',
                min: 0,
                max: 0.5,
                value: 0.23,
                stepSize: 0.01,
                decimals: 2
            }, {
                order: 6,
                id: 'rhoS',
                name: 'Particle density<br/><em>ρ</em> [g/cc]',
                min: 0,
                max: 3.00,
                value: 2.65,
                stepSize: 0.01,
                decimals: 2
            }, {
                order: 7,
                id: 'alphaL',
                name: 'Longitudinal dispersivity<br/><em>α</em> [m]',
                min: 0.1,
                max: 10,
                value: 0.923,
                stepSize: 0.001,
                decimals: 3
            }, {
                order: 8,
                id: 'Kd',
                name: 'Sorption partition coefficient<br/><em>K</em><sub>d</sub> [l/g]',
                min: 0.0,
                max: 0.1,
                value: 0.0,
                stepSize: 0.001,
                decimals: 3
            }, {
                order: 9,
                id: 'tau',
                name: 'Duration of infiltration<br/><em>τ</em> [d]',
                min: 0,
                max: 500,
                value: 100,
                stepSize: 1,
                decimals: 0
            }, {
                order: 10,
                id: 'Corg',
                name: 'Soil organic carbon content<br/><em>C</em><sub>org</sub> [-]',
                min: 0,
                max: 0.1,
                value: 0.001,
                stepSize: 0.001,
                decimals: 3
            }, {
                order: 11,
                id: 'Kow',
                name: 'Octanol/water partition coefficient, log <em>K</em><sub>ow</sub> [-]',
                min: 0,
                max: 10,
                value: 2.25,
                stepSize: 0.001,
                decimals: 3
            }],
            settings: {
                retardation: true,
                case: SETTINGS_CASE_FIXED_TIME,
                infiltration: SETTINGS_INFILTRATION_CONTINUOUS
            }
        }
    };
};
