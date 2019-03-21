import AbstractCommand from 'core/model/command/AbstractCommand';
import {JSON_SCHEMA_URL} from 'services/api';

class ScenarioAnalysisCommand extends AbstractCommand {

    static cloneScenarioAnalysis(scenarioanalysisId, newId) {
        return new ScenarioAnalysisCommand(
            'cloneScenarioAnalysis', {
                id: scenarioanalysisId,
                new_id: newId
            },
            JSON_SCHEMA_URL + 'commands/cloneScenarioAnalysis'
        );
    }

    static createScenarioAnalysis(scenarioanalysisId, modelToCloneId, name, description, isPublic) {
        return new ScenarioAnalysisCommand(
            'createScenarioAnalysis', {
                id: scenarioanalysisId,
                basemodel_id: modelToCloneId,
                name: name,
                description: description,
                public: isPublic
            },
            JSON_SCHEMA_URL + 'commands/createScenarioAnalysis'
        );
    }

    static createScenario(scenarioanalysisId, modelToCloneId, newId) {
        return new ScenarioAnalysisCommand(
            'createScenario', {
                id: scenarioanalysisId,
                basemodel_id: modelToCloneId,
                scenario_id: newId
            },
            JSON_SCHEMA_URL + 'commands/createScenario'
        );
    }

    static deleteScenario(scenarioanalysisId, scenarioId) {
        return new ScenarioAnalysisCommand(
            'deleteScenario', {
                id: scenarioanalysisId,
                scenario_id: scenarioId
            },
            JSON_SCHEMA_URL + 'commands/deleteScenario'
        );
    }

    static deleteScenarioAnalysis(id) {
        console.log(id);
        return new ScenarioAnalysisCommand(
            'deleteScenarioAnalysis', {id},
            JSON_SCHEMA_URL + 'commands/deleteScenarioAnalysis'
        );
    }

    static updateScenarioAnalysis(scenarioanalysisId, name, description, isPublic) {
        return new ScenarioAnalysisCommand(
            'updateScenarioAnalysis', {
                id: scenarioanalysisId,
                name: name,
                description: description,
                public: isPublic
            },
            JSON_SCHEMA_URL + 'commands/updateScenarioAnalysis'
        );
    }
}

export default ScenarioAnalysisCommand;
