import AbstractCommand from '../../../core/model/command/AbstractCommand';
import {JSON_SCHEMA_URL} from '../../../services/api';

class ScenarioAnalysisCommand extends AbstractCommand {
    public static cloneScenarioAnalysis({id, newId}: {id: string, newId: string}) {
        return new ScenarioAnalysisCommand(
            'cloneScenarioAnalysis', {
                id,
                new_id: newId
            },
            JSON_SCHEMA_URL + '/commands/cloneScenarioAnalysis'
        );
    }

    public static createScenarioAnalysis(scenarioanalysisId: string, modelToCloneId: string, name: string,
                                         description: string, isPublic: boolean) {
        return new ScenarioAnalysisCommand(
            'createScenarioAnalysis', {
                id: scenarioanalysisId,
                basemodel_id: modelToCloneId,
                name,
                description,
                public: isPublic
            },
            JSON_SCHEMA_URL + '/commands/createScenarioAnalysis'
        );
    }

    public static createScenario(scenarioanalysisId: string, modelToCloneId: string, newId: string) {
        return new ScenarioAnalysisCommand(
            'createScenario', {
                id: scenarioanalysisId,
                basemodel_id: modelToCloneId,
                scenario_id: newId
            },
            JSON_SCHEMA_URL + '/commands/createScenario'
        );
    }

    public static deleteScenario(scenarioanalysisId: string, scenarioId: string) {
        return new ScenarioAnalysisCommand(
            'deleteScenario', {
                id: scenarioanalysisId,
                scenario_id: scenarioId
            },
            JSON_SCHEMA_URL + '/commands/deleteScenario'
        );
    }

    public static deleteScenarioAnalysis(id: string) {
        return new ScenarioAnalysisCommand(
            'deleteScenarioAnalysis', {id},
            JSON_SCHEMA_URL + '/commands/deleteScenarioAnalysis'
        );
    }

    public static updateScenarioAnalysis(scenarioanalysisId: string, name: string, description: string,
                                         isPublic: boolean) {
        return new ScenarioAnalysisCommand(
            'updateToolInstanceMetadata', {
                id: scenarioanalysisId,
                name,
                description,
                public: isPublic
            },
            JSON_SCHEMA_URL + '/commands/updateToolInstanceMetadata'
        );
    }
}

export default ScenarioAnalysisCommand;
