import uuidv4 from 'uuid';

export const SETTINGS_INFILTRATION_TYPE_BASIN = 0.07;
export const SETTINGS_INFILTRATION_TYPE_CYLINDER = 0.02;

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
                AF: 0.07
            },
            parameters: [{
                order: 0,
                id: 'LLRN',
                label: 'Limiting loading rates N (kg/m²/y)',
                min: 0,
                validMin: x => x >= 0,
                max: 500,
                value: 67,
                stepSize: 1,
                decimals: 0
            }, {
                order: 1,
                id: 'LLRO',
                label: 'Limiting loading rates BOD (kg/m²/y)',
                min: 0,
                validMin: x => x >= 0,
                max: 1000,
                value: 667,
                stepSize: 1,
                decimals: 0
            }, {
                order: 2,
                id: 'Q',
                label: 'Flow rate, Q (million m³/y)',
                min: 0,
                validMin: x => x >= 0,
                max: 30,
                value: 3.65,
                stepSize: 0.01,
                decimals: 2
            }, {
                order: 3,
                id: 'IR',
                label: 'Infiltration rate, I' + 'R'.sub() + '(m/y)',
                min: 0,
                validMin: x => x >= 0,
                max: 1000,
                value: 438,
                stepSize: 1,
                decimals: 0
            }, {
                order: 4,
                id: 'OD',
                label: 'No. operation days per year, OD (d)',
                min: 0,
                validMin: x => x >= 0,
                max: 365,
                validMax: x => x <= 365,
                value: 365,
                stepSize: 1,
                decimals: 0
            }, {
                order: 5,
                id: 'Cn',
                label: 'Nitrogen concentration, C' + 'N'.sub() + '(mg/l)',
                min: 0,
                validMin: x => x >= 0,
                max: 100,
                value: 40,
                stepSize: 1,
                decimals: 0
            }, {
                order: 6,
                id: 'Co',
                label: 'Organic concentration, C' + 'O'.sub() + '(BOD in mg/l)',
                min: 0,
                validMin: x => x >= 0,
                max: 100,
                value: 100,
                stepSize: 1,
                decimals: 0
            }]
        }
    };
};
