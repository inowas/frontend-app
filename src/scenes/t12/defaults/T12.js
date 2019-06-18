import uuidv4 from 'uuid';

const defaults = {
    id: uuidv4(),
    name: 'New simple tool',
    description: 'Simple tool description',
    permissions: 'rwx',
    public: false,
    tool: 'T12',
    data: {
        mfi: [{
            t: 10,
            V: 0.25,
        }, {
            t: 21,
            V: 0.5,
        }, {
            t: 35,
            V: 0.75,
        }, {
            t: 48,
            V: 1.0,
        }],
        corrections: [{
            id: 'V',
            name: 'Volume',
            value: 1000,
            stepSize: 0.1,
            unit: 'ml'
        }, {
            id: 'P',
            name: 'Pressure',
            value: 210,
            stepSize: 1,
            unit: 'KPa'
        }, {
            id: 'Af',
            name: 'Filter area',
            stepSize: 0.0001,
            value: 0.00138,
            unit: 'mm²'
        }, {
            id: 'T',
            name: 'Temperature',
            value: 12,
            stepSize: 0.1,
            unit: '°C'
        }, {
            id: 'D',
            name: 'Filter pore diameter',
            value: 0.45,
            stepSize: 0.1,
            unit: 'µm'
        }],
        parameters: [{
            order: 0,
            id: 'ueq',
            name: 'Infiltration duration, u<sub>eq</sub> [h]',
            min: 1,
            validMin: x => x > 0,
            max: 10000,
            value: 5000,
            stepSize: 1,
            decimals: 0
        }, {
            order: 1,
            id: 'IR',
            name: 'Infiltration rate, V<sub>b</sub> [m<sup>3</sup>/d]',
            min: 1,
            validMin: x => x > 0,
            max: 1000,
            value: 100,
            stepSize: 1,
            decimals: 0
        }, {
            order: 2,
            id: 'K',
            name: 'Hydraulic conductivity, K [m/d]',
            min: 1,
            validMin: x => x > 0,
            max: 100,
            value: 20,
            stepSize: 1,
            decimals: 0
        }]
    }
};

export const defaultsWithSession = (session) => {
    let defaultsWithSession = defaults;
    if (session && !session.token) {
        defaultsWithSession.permissions = 'r--';
    }

    return defaultsWithSession;
};
