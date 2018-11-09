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
