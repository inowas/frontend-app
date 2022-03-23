import { JSON_SCHEMA_URL } from '../../../services/api';
import AbstractCommand from '../../../core/model/command/AbstractCommand';

class MarProCommand extends AbstractCommand {
  public static createScenario(scenarioanalysisId: string, modelToCloneId: string, newId: string) {
    return new MarProCommand(
      'createScenario',
      {
        id: scenarioanalysisId,
        basemodel_id: modelToCloneId,
        scenario_id: newId,
      },
      JSON_SCHEMA_URL + '/commands/createScenario'
    );
  }
}
