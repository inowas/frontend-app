import uuidv4 from 'uuid';

export const defaultsWithSession = (session) => {
    let defaultsWithSession = defaults;
    if (session && !session.token) {
        defaultsWithSession.permissions = 'r--';
    }

    return defaultsWithSession;
};

const defaults = {
    id: uuidv4(),
    name: 'New real time monitoring tool',
    description: '',
    permissions: 'rwx',
    public: true,
    tool: 'T10',
    data: {
        sensors: [],
        model: null
    }
};

export const parameterList = [
    {parameter: 'do', text: 'Dissolved oxygen'},
    {parameter: 'ec', text: 'Electrical conductivity'},
    {parameter: 'h', text: 'Water level'},
    {parameter: 'ph', text: 'pH'},
    {parameter: 'prH', text: 'Pressure head'},
    {parameter: 'rp', text: 'Redox potential'},
    {parameter: 't', text: 'Temperature'},
    {parameter: 'wc', text: 'Water content'},
    {parameter: 'other', text: 'Other'}
];

export const dataSourceList = ['file', 'online'];

export const colors = ['red', 'green', 'brown', 'blue'];
