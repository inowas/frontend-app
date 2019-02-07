import uuidv4 from 'uuid';

export const SETTINGS_SELECTED_NOTHING = 1;
export const SETTINGS_SELECTED_H0 = 2;
export const SETTINGS_SELECTED_HL = 3;

export const defaults = () => {
    return {
        id: uuidv4(),
        name: 'New simple tool',
        description: 'Simple tool description',
        permissions: 'rwx',
        public: false,
        tool: 'T13B',
        data: {
            settings: {
                selected: SETTINGS_SELECTED_NOTHING
            },
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
            }, {
                order: 5,
                id: 'ne',
                name: 'Effective porosity, n [-]',
                min: 0,
                max: 0.5,
                value: 0.35,
                stepSize: 0.01,
                decimals: 2,
                disable: false
            }, {
                order: 6,
                id: 'xi',
                name: 'Initial position, x<sub>i</sub> [m]',
                min: 0,
                max: 1000,
                value: 50,
                stepSize: 10,
                decimals: 0,
                disable: false
            }, {
                order: 7,
                id: 'xe',
                name: 'Arrival location, x<sub>e</sub> [m]',
                min: 1,
                max: 1000,
                value: 200,
                stepSize: 1,
                decimals: 0,
                disable: false
            }]
        }
    };
};
