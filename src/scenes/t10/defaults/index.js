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
