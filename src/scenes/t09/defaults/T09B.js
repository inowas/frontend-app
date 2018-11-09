import uuidv4 from 'uuid';

export const defaults = () => {
    return {
        id: uuidv4(),
        name: 'New simple tool',
        description: 'Simple tool description',
        permissions: 'rwx',
        public: false,
        type: 'T09B',
        data: {
            parameters: [{
                order: 0,
                id: 'b',
                name: 'Aquifer thickness, b [m]',
                min: 1,
                validMin: x => x > 0,
                max: 100,
                value: 50,
                stepSize: 0.1,
                decimals: 1
            }, {
                order: 1,
                id: 'i',
                name: 'Hydraulic gradient, i [-]',
                min: 0.000,
                validMin: x => x >= 0,
                max: 0.010,
                validMax: x => x <= 1,
                value: 0.001,
                stepSize: 0.001,
                decimals: 3
            }, {
                order: 2,
                id: 'df',
                name: 'Density of freshwater [g/cm³]',
                min: 0.9,
                validMin: x => x >= 0.9,
                max: 1.03,
                validMax: x => x <= 1.05,
                value: 1.000,
                stepSize: 0.001,
                decimals: 3
            }, {
                order: 3,
                id: 'ds',
                name: 'Density of saltwater [g/cm³]',
                min: 0.9,
                validMin: x => x >= 0.9,
                max: 1.03,
                validMax: x => x <= 1.05,
                value: 1.025,
                stepSize: 0.001,
                decimals: 3
            }]
        }
    };
};
