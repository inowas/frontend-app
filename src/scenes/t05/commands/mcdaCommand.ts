import AbstractCommand from '../../../core/model/command/AbstractCommand';
import {ICriterion} from '../../../core/model/mcda/criteria/Criterion.type';
import {IMCDA} from '../../../core/model/mcda/MCDA.type';
import {JSON_SCHEMA_URL} from '../../../services/api';

class McdaCommand extends AbstractCommand {
    public static deleteCriterion({id, criterion_id}: {id: string, criterion_id: string}) {
        const name = 'mcdaDeleteCriterion';
        return new McdaCommand(name, {id, criterion_id}, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static updateCriterion({id, criterion}: {id: string, criterion: ICriterion}) {
        const name = 'mcdaUpdateCriterion';
        return new McdaCommand(name, {id, criterion}, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static updateProject({id, data}: {id: string, data: IMCDA}) {
        const name = 'mcdaUpdateProject';

        return new McdaCommand(name, {id, data}, JSON_SCHEMA_URL + '/commands/' + name);
    }
}

export default McdaCommand;
