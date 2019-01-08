import uuid from 'uuid';

class Command {

    metadata = [];
    uuid = uuid();

    static createToolInstance = (payload) => {
        return new Command('createToolInstance', payload);
    };

    static updateToolInstance = (payload) => {
        return new Command('updateToolInstance', payload);
    };

    constructor(name, payload) {
        this.message_name = name;
        this.payload = payload;
    }

    toObject = () => ({
        uuid: this.uuid,
        message_name: this.message_name,
        metadata: this.metadata,
        payload: this.payload
    })
}

export default Command;
