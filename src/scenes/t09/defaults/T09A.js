import uuidv4 from 'uuid';

const defaults = {
    id: uuidv4(),
    name: 'New simple tool',
    description: 'Simple tool description',
    permissions: 'rwx',
    public: false,
    tool: 'T09A',
    data: {
        parameters: [{
            order: 0,
            id: 'h',
            name: 'Freshwater thickness<br/>h [m]',
            min: 0,
            max: 10,
            value: 1,
            stepSize: 0.1,
            decimals: 1
        }, {
            order: 1,
            id: 'df',
            name: 'Density of freshwater<br/>ρ<sub>f</sub> [g/cm³]',
            min: 0.9,
            validMin: x => x >= 0.9,
            max: 1.03,
            validMax: x => x <= 1.05,
            value: 1.000,
            stepSize: 0.001,
            decimals: 3
        }, {
            order: 2,
            id: 'ds',
            name: 'Density of saltwater<br/>ρ<sub>s</sub> [g/cm³]',
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

export const defaultsWithSession = (session) => {
    let defaultsWithSession = defaults;
    if (session && !session.token) {
        defaultsWithSession.permissions = 'r--';
    }

    return defaultsWithSession;
};
