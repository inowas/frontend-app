import uuidv4 from 'uuid';

export const defaults = () => {
    return {
        id: uuidv4(),
        name: 'New simple tool',
        description: 'Simple tool description',
        permissions: 'rwx',
        public: false,
        type: 'T08',
        data: {
            settings: {
                variable: 'x'
            },
            parameters: [{
                order: 0,
                id: 'w',
                name: 'Percolation rate, w (m/d)',
                min: 0,
                validMin: (x) => x >= 0,
                max: 10,
                value: 0.045,
                stepSize: 0.001,
                type: 'float',
                decimals: 3
            }, {
                order: 1,
                id: 'L',
                name: 'Basin length, L (m)',
                min: 0,
                validMin: (x) => x > 0,
                max: 1000,
                value: 40,
                stepSize: 1,
                type: 'float',
                decimals: 0
            }, {
                order: 2,
                id: 'W',
                name: 'Basin width, W (m)',
                min: 0,
                validMin: (x) => x > 0,
                max: 100,
                value: 20,
                stepSize: 1,
                type: 'float',
                decimals: 0
            }, {
                order: 3,
                id: 'hi',
                name: 'Initial groundwater Level, hi (m)',
                min: 0,
                validMin: (x) => x >= 0,
                max: 100,
                value: 35,
                stepSize: 1,
                type: 'float',
                decimals: 0
            }, {
                order: 4,
                id: 'Sy',
                name: 'Specific yield, Sy (-)',
                min: 0.000,
                validMin: (x) => x > 0,
                max: 0.5,
                validMax: (x) => x <= 0.5,
                value: 0.085,
                stepSize: 0.001,
                type: 'float',
                decimals: 3
            }, {
                order: 5,
                id: 'K',
                name: 'Hydraulic conductivity, K (m/d)',
                min: 0.1,
                validMin: (x) => x > 0,
                max: 10,
                validMax: x => x <= 100000,
                value: 1.83,
                stepSize: 0.01,
                type: 'float',
                decimals: 2
            }, {
                order: 6,
                id: 't',
                name: 'Infiltration time, t (d)',
                min: 0,
                validMin: x => x > 0,
                max: 100,
                value: 1.5,
                stepSize: 0.1,
                type: 'float',
                decimals: 1
            }]
        }
    };
};
