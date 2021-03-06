import uuidv4 from 'uuid';

const defaults = {
    id: uuidv4(),
    name: 'New simple tool',
    description: 'Simple tool description',
    permissions: 'rwx',
    public: false,
    tool: 'T09C',
    data: {
        parameters: [{
            order: 0,
            id: 'q',
            name: 'Pumping rate<br/>Q [m³/d]',
            min: 1,
            validMin: function (x) {
                return x > 0;
            },
            max: 3000,
            value: 2000,
            stepSize: 1,
            decimals: 0
        }, {
            order: 1,
            id: 'k',
            name: 'Hydraulic conductivity<br/>K [m/d]',
            min: 1,
            validMin: function (x) {
                return x > 0;
            },
            max: 100,
            validMax: function (x) {
                return x <= 100000;
            },
            value: 50,
            stepSize: 1,
            decimals: 0
        }, {
            order: 2,
            id: 'd',
            name: 'Pre-pumping distance<br/>d [m]',
            min: 1,
            validMin: function (x) {
                return x > 0;
            },
            max: 50,
            value: 30,
            stepSize: 1,
            decimals: 0
        }, {
            order: 3,
            id: 'df',
            name: 'Density of freshwater<br/>ρ<sub>f</sub> [g/cm³]',
            min: 0.9,
            validMin: function (x) {
                return x >= 0.9;
            },
            max: 1.03,
            validMax: function (x) {
                return x <= 1.05;
            },
            value: 1.000,
            stepSize: 0.001,
            decimals: 3
        }, {
            order: 4,
            id: 'ds',
            name: 'Density of saltwater<br/>ρ<sub>s</sub> [g/cm³]',
            min: 0.9,
            validMin: function (x) {
                return x >= 0.9;
            },
            max: 1.03,
            validMax: function (x) {
                return x <= 1.05;
            },
            value: 1.025,
            stepSize: 0.001,
            decimals: 3
        }],
    }
};

export const defaultsWithSession = (session) => {
    let defaultsWithSession = defaults;
    if (session && !session.token) {
        defaultsWithSession.permissions = 'r--';
    }

    return defaultsWithSession;
};
