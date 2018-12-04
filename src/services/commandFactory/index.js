import uuidv4 from 'uuid';

export const createToolInstanceCommand = (payload) => {
    return {
        message_name: 'createToolInstance',
        metadata: [],
        payload: payload
    }
};

export const updateToolInstanceCommand = (payload) => {
    return {
        message_name: 'updateToolInstance',
        metadata: [],
        payload: payload
    }
};

export const deleteToolInstanceCommand = (id) => {
    return {
        message_name: 'deleteToolInstance',
        metadata: [],
        payload: {id}
    }
};

export const createCommand = (commandName, payload) => {
    return {
        uuid: uuidv4(),
        message_name: commandName,
        metadata: [],
        payload
    };
};
