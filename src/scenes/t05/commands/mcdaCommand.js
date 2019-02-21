import AbstractCommand from 'core/model/command/AbstractCommand';
import {JSON_SCHEMA_URL} from 'services/api';

class McdaCommand extends AbstractCommand {
    static deleteCriterion({id, criterion_id}) {
        const name = 'mcdaDeleteCriterion';
        return new McdaCommand(name, {id, criterion_id}, JSON_SCHEMA_URL + 'commands/' + name);
    }

    static updateCriterion({id, criterion}) {
        const name = 'mcdaUpdateCriterion';
        return new McdaCommand(name, {id, criterion}, JSON_SCHEMA_URL + 'commands/' + name);
    }

    static updateProject({id, data}) {
        const name = 'mcdaUpdateProject';

        return new McdaCommand(name, {id, data}, JSON_SCHEMA_URL + 'commands/' + name);
    }
}

export default McdaCommand;
