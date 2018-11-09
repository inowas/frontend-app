import uuidv4 from 'uuid';

export const defaults = () => {
    return {
        id: uuidv4(),
        name: 'New simple tool',
        description: 'Simple tool description',
        permissions: 'rwx',
        public: false,
        type: 'T09E',
        data: {
            parameters: [{
                order: 0,
                id: 'k',
                name: 'Hydraulic conductivity, K [m/d]',
                min: 1,
                max: 100,
                value: 20,
                stepSize: 1,
                decimals: 0
            }, {
                order: 1,
                id: 'z0',
                name: 'Depth to base of aquifer, z₀ [m]',
                min: 0,
                max: 100,
                value: 25,
                stepSize: 1,
                decimals: 0
            }, {
                order: 2,
                id: 'l',
                name: 'Distance to inland boundary, L [m]',
                min: 0,
                max: 10000,
                value: 2000,
                stepSize: 1,
                decimals: 0
            }, {
                order: 3,
                id: 'w',
                name: 'Recharge rate, w [m³/d]',
                min: 0,
                max: 0.001,
                value: 0.0001,
                stepSize: 0.0001,
                decimals: 4
            }, {
                order: 4,
                id: 'dz',
                name: 'Sea level rise, dz₀ [m]',
                min: 0,
                max: 2,
                value: 1,
                stepSize: 0.01,
                decimals: 2
            }, {
                order: 5,
                id: 'hi',
                name: 'Constant head at inland boundary, hᵢ [m]',
                min: 0,
                max: 10,
                value: 2,
                stepSize: 0.1,
                decimals: 1
            }, {
                order: 6,
                id: 'i',
                name: 'Hydraulic gradient, i [-]',
                min: 0,
                max: 0.01,
                value: 0.001,
                stepSize: 0.001,
                decimals: 3
            }, {
                order: 7,
                id: 'df',
                name: 'Density of freshwater [g/cm³]',
                min: 1.000,
                max: 1.005,
                value: 1.000,
                stepSize: 0.001,
                decimals: 3
            }, {
                order: 8,
                id: 'ds',
                name: 'Density of saltwater [g/cm³]',
                min: 1.020,
                max: 1.030,
                value: 1.025,
                stepSize: 0.001,
                decimals: 3
            }],
            settings: {
                method: 'constFlux'
            }
        }
    };
};
