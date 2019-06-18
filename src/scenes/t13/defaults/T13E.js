import uuidv4 from 'uuid';

const defaults = {
    id: uuidv4(),
    name: 'New simple tool',
    description: 'Simple tool description',
    permissions: 'rwx',
    public: false,
    tool: 'T13E',
    data: {
        parameters: [{
            order: 0,
            id: 'Qw',
            name: 'Constant pumped modflow rate<br/>Q<sub>w [m3/d]',
            min: 0,
            max: 10000,
            value: 1300,
            stepSize: 100,
            decimals: 1
        }, {
            order: 1,
            id: 'ne',
            name: 'Effective porosity<br/>n [-]',
            min: 0,
            max: 0.5,
            value: 0.35,
            stepSize: 0.01,
            decimals: 2
        }, {
            order: 2,
            id: 'hL',
            name: 'Downstream head<br/>h<sub>L</sub> [m]',
            min: 0,
            max: 20,
            value: 6,
            stepSize: 0.5,
            decimals: 1
        }, {
            order: 3,
            id: 'h0',
            name: 'Upstream head<br/>h<sub>0</sub> [m]',
            min: 0,
            max: 20,
            value: 10,
            stepSize: 0.5,
            decimals: 1
        }, {
            order: 4,
            id: 'xi',
            name: 'Initial position<br/>x<sub>i</sub> [m]',
            min: 0,
            max: 1000,
            value: 303,
            stepSize: 10,
            decimals: 0
        }, {
            order: 5,
            id: 'x',
            name: 'Location of the well<br/>x [m]',
            min: 0,
            max: 1000,
            value: 0.1,
            stepSize: 10,
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
