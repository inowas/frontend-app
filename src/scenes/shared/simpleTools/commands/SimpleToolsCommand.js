import AbstractCommand from 'core/model/command/AbstractCommand';

class SimpleToolsCommand extends AbstractCommand {

    static cloneToolInstance({id, newId}) {
        return new SimpleToolsCommand('cloneToolInstance', {base_id: id, id: newId})
    }

    static createToolInstance(payload) {
        return new SimpleToolsCommand('createToolInstance', payload)
    }

    static deleteToolInstance({id}) {
        return new SimpleToolsCommand('deleteToolInstance', {id})
    }

    static updateToolInstance(payload) {
        return new SimpleToolsCommand('updateToolInstance', payload)
    }

}

export default SimpleToolsCommand;
