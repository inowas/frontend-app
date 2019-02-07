import uuidv4 from 'uuid';

export const defaults = () => {
    return {
        id: uuidv4(),
        name: 'New simple tool',
        description: 'Simple tool description',
        permissions: 'rwx',
        public: false,
        tool: 'T13D',
        data: {
            parameters: [{
                order: 0,
                id: 'W',
                name: 'Average infiltration rate, W [m/d]',
                min: 0.001,
                max: 0.01,
                value: 0.00112,
                stepSize: 0.0001,
                decimals: 5,
                disable: false
            }, {
                order: 1,
                id: 'K',
                name: 'Hydraulic conductivity, K [m/d]',
                min: 0.1,
                max: 1000,
                value: 30.2,
                stepSize: 0.1,
                decimals: 1,
                disable: false
            }, {
                order: 2,
                id: 'L',
                name: 'Aquifer length, L [m]',
                min: 0,
                max: 1000,
                value: 1000,
                stepSize: 10,
                decimals: 0,
                disable: false
            }, {
                order: 3,
                id: 'hL',
                name: 'Downstream head, h<sub>L</sub> [m]',
                min: 0,
                max: 10,
                value: 2,
                stepSize: 0.1,
                decimals: 1,
                disable: false
            }, {
                order: 4,
                id: 'h0',
                name: 'Upstream head, h<sub>e</sub> [m]',
                min: 0,
                max: 10,
                value: 5,
                stepSize: 0.1,
                decimals: 1,
                disable: false
            }]
        }
    };
};
