import uuidv4 from 'uuid';

export const defaults = () => {
    return {
        id: uuidv4(),
        name: 'New simple tool',
        description: 'Simple tool description',
        public: false,
        permissions: 'rwx',
        type: 'T14D',
        data: {
            parameters: [{
                order: 0,
                id: 'Qw',
                name: 'Pumping rate, Q<sub>w</sub> [m<sup>3</sup>/d]',
                min: 1,
                validMin: (x) => (x > 0),
                max: 10000,
                value: 150,
                stepSize: 1,
                decimals: 0
            }, {
                order: 1,
                id: 't',
                name: 'Duration of pumping, t [d]',
                min: 10,
                validMin: (x) => (x > 1),
                max: 500,
                value: 400,
                stepSize: 0.1,
                decimals: 1
            }, {
                order: 2,
                id: 'S',
                name: 'Aquifer storage coefficient, S [-]',
                min: 0.1,
                validMin: (x) => (x > 0),
                max: 0.5,
                validMax: (x) => (x <= 1),
                value: 0.2,
                stepSize: 0.01,
                decimals: 2
            }, {
                order: 3,
                id: 'T',
                name: 'Aquifer transmissivity, T [m<sup>2</sup>/d]',
                min: 1000,
                validMin: (x) => (x > 0),
                max: 3000,
                value: 1500,
                stepSize: 1,
                decimals: 0
            }, {
                order: 4,
                id: 'd',
                name: 'Distance from stream to well, d [m]',
                min: 200,
                validMin: (x) => (x > 0),
                max: 1000,
                value: 500,
                stepSize: 1,
                decimals: 0
            }, {
                order: 5,
                id: 'W',
                name: 'Width of stream , W [m]',
                min: 1,
                validMin: (x) => (x > 0),
                max: 10,
                value: 2.5,
                stepSize: 0.1,
                decimals: 1
            }, {
                order: 6,
                id: 'Kdash',
                name: 'Permeability of the aquitard, K\' [m/d]',
                min: 0.1,
                validMin: (x) => (x > 0),
                max: 2,
                value: 0.5,
                stepSize: 0.1,
                decimals: 1
            }, {
                order: 7,
                id: 'Bdashdash',
                name: 'Thickness of the aquitard, B\'\' [m]',
                min: 0.1,
                validMin: (x) => (x > 0),
                max: 20,
                value: 7,
                stepSize: 0.1,
                decimals: 1
            }, {
                order: 8,
                id: 'Sigma',
                name: 'Specific yield of the aquitard, σ [m]',
                min: 0.1,
                validMin: (x) => (x > 0),
                max: 0.5,
                value: 0.1,
                stepSize: 0.01,
                decimals: 2
            }, {
                order: 9,
                id: 'bdash',
                name: 'Distance between bottom of stream and top of aquifer, b\' [m]',
                min: 1,
                validMin: (x) => (x > 0),
                max: 20,
                value: 10,
                stepSize: 0.1,
                decimals: 1
            }]
        }
    }
};
