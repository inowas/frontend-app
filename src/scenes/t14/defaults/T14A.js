import uuidv4 from 'uuid';

export const defaults = () => {
    return {
        id: uuidv4(),
        name: 'New simple tool',
        description: 'Simple tool description',
        public: false,
        permissions: 'rwx',
        type: 'T14A',
        data: {
            parameters: [{
                order: 0,
                id: 'Qw',
                name: 'Pumping rate, Q' + 'w'.sub() + ' [m' + '3'.sup() + '/d]',
                min: 1,
                validMin: x => x > 0,
                max: 1000,
                value: 150,
                stepSize: 1,
                decimals: 0
            }, {
                order: 1,
                id: 't',
                name: 'Duration of pumping, t [d]',
                min: 1,
                validMin: x => x > 1,
                max: 500,
                value: 365,
                stepSize: 0.1,
                decimals: 1
            }, {
                order: 2,
                id: 'S',
                name: 'Aquifer storage coefficient, S [-]',
                min: 0.1,
                validMin: x => x > 0,
                max: 0.5,
                validMax: x => x <= 1,
                value: 0.2,
                stepSize: 0.001,
                decimals: 3
            }, {
                order: 3,
                id: 'T',
                name: 'Aquifer transmissivity, T [m' + '2'.sup() + '/d]',
                min: 1000,
                validMin: x => x > 0,
                max: 3000,
                value: 1500,
                stepSize: 10,
                decimals: 0
            }, {
                order: 4,
                id: 'd',
                name: 'Distance from stream to well, d [m]',
                min: 200,
                validMin: x => x > 0,
                max: 1000,
                value: 500,
                stepSize: 1,
                decimals: 0
            }]
        }
    };
};
