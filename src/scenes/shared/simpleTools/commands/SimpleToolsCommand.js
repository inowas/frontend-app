import AbstractCommand from 'core/model/command/AbstractCommand';
import {JSON_SCHEMA_URL} from 'services/api';

class SimpleToolsCommand extends AbstractCommand {

    static cloneToolInstance({id, newId}) {
        const commandName = 'cloneToolInstance';
        return new SimpleToolsCommand(
            commandName,
            {base_id: id, id: newId},
            JSON_SCHEMA_URL + 'commands/' + commandName
        )
    }

    static createToolInstance(payload) {
        const commandName = 'createToolInstance';
        return new SimpleToolsCommand(
            commandName,
            payload,
            JSON_SCHEMA_URL + 'commands/' + commandName
        )
    }

    static deleteToolInstance({id}) {
        const commandName = 'deleteToolInstance';
        return new SimpleToolsCommand(
            commandName,
            {id},
            JSON_SCHEMA_URL + 'commands/' + commandName
        )
    }

    static updateToolInstance(payload) {
        const commandName = 'updateToolInstance';
        return new SimpleToolsCommand(
            commandName,
            payload,
            JSON_SCHEMA_URL + 'commands/' + commandName
        )
    }

    static updateToolInstanceMetadata(id, name, description, isPubic) {
        const commandName = 'updateToolInstanceMetadata';
        return new SimpleToolsCommand(
            commandName,
            {id, name, description, public: isPubic},
            JSON_SCHEMA_URL + 'commands/' + commandName
        );
    }

    static updateToolInstanceData(payload) {
        const commandName = 'updateToolInstanceData';
        return new SimpleToolsCommand(
            commandName,
            payload,
            JSON_SCHEMA_URL + 'commands/' + commandName
        );
    }
}

export default SimpleToolsCommand;
