import uuidv4 from 'uuid';

const defaults = {
    id: uuidv4(),
    name: 'New simple tool',
    description: 'Simple tool description',
    permissions: 'rwx',
    public: false,
    tool: 'T09D',
    data: {
        parameters: [{
            order: 0,
            id: 'k',
            name: 'Hydraulic conductivity<br/>K [m/d]',
            min: 1,
            validMin: x => x > 0,
            max: 100,
            value: 50,
            stepSize: 1,
            decimals: 0
        }, {
            order: 1,
            id: 'b',
            name: 'Aquifer thickness below sea level<br/>b [m]',
            min: 10,
            validMin: x => x > 0,
            max: 100,
            value: 20,
            stepSize: 1,
            decimals: 0
        }, {
            order: 2,
            id: 'q',
            name: 'Offshore discharge rate<br/>q [m³/d]',
            min: 0.1,
            validMin: x => x > 0,
            max: 10,
            value: 1,
            stepSize: 0.1,
            decimals: 1
        }, {
            order: 3,
            id: 'Q',
            name: 'Well pumping rate<br/>Q [m³/d]',
            min: 0,
            validMin: x => x >= 0,
            max: 10000,
            value: 5000,
            stepSize: 1,
            decimals: 0
        }, {
            order: 4,
            id: 'xw',
            name: 'Distance from well to shoreline<br/>x<sub>w</sub> [m]',
            min: 1000,
            validMin: x => x > 0,
            max: 5000,
            value: 2000,
            stepSize: 1,
            decimals: 0
        }, {
            order: 5,
            id: 'rhof',
            name: 'Density of freshwater<br/>ρ<sub>f</sub> [g/cm³]',
            min: 0.9,
            validMin: x => x >= 0.9,
            max: 1.03,
            validMax: x => x <= 1.05,
            value: 1,
            stepSize: 0.001,
            decimals: 3
        }, {
            order: 6,
            id: 'rhos',
            name: 'Density of saltwater<br/>ρ<sub>s</sub> [g/cm³]',
            min: 0.9,
            validMin: x => x >= 0.9,
            max: 1.03,
            validMax: x => x <= 1.05,
            value: 1.025,
            stepSize: 0.001,
            decimals: 3
        }],
        settings: {
            AqType: 'unconfined'
        }
    }
};

export const defaultsWithSession = (session) => {
    let defaultsWithSession = defaults;
    if (session && !session.token) {
        defaultsWithSession.permissions = 'r--';
    }

    return defaultsWithSession;
};
