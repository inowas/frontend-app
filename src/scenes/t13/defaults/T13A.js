import uuidv4 from 'uuid';

export const defaults = () => {
    return {
        id: uuidv4(),
        name: 'New simple tool',
        description: 'Simple tool description',
        permissions: 'rwx',
        public: false,
        tool: 'T13A',
        data: {
            parameters: [{
                order: 0,
                id: 'W',
                name: 'Average infiltration rate<br/>W [m/d]',
                min: 0.001,
                max: 0.01,
                value: 0.009,
                stepSize: 0.0001,
                decimals: 4
            }, {
                order: 1,
                id: 'K',
                name: 'Hydraulic conductivity<br/>K [m/d]',
                min: 0.1,
                max: 1000,
                value: 10.1,
                stepSize: 0.1,
                decimals: 1
            }, {
                order: 2,
                id: 'ne',
                name: 'Effective porosity<br/>n [-]',
                min: 0,
                max: 0.5,
                value: 0.35,
                stepSize: 0.01,
                decimals: 2
            }, {
                order: 3,
                id: 'L',
                name: 'Aquifer length<br/>L´ [m]',
                min: 0,
                max: 1000,
                value: 500,
                stepSize: 10,
                decimals: 0
            }, {
                order: 4,
                id: 'hL',
                name: 'Downstream fixed head boundary<br/>h<sub>L</sub>´ [m]',
                min: 0,
                max: 10,
                value: 2,
                stepSize: 0.5,
                decimals: 1
            }, {
                order: 5,
                id: 'xi',
                name: 'Initial position<br/>x<sub>i</sub> [m]',
                min: 0,
                max: 1000,
                value: 50,
                stepSize: 10,
                decimals: 0
            }, {
                order: 6,
                id: 'xe',
                name: 'Arrival location<br/>x<sub>e</sub> [m]',
                min: 1,
                max: 1000,
                value: 500,
                stepSize: 1,
                decimals: 0
            }]
        }
    };
};
