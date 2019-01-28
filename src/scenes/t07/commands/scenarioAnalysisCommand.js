import AbstractCommand from 'core/model/command/AbstractCommand';

import cloneScenarioAnalysisPayloadSchema from './cloneScenarioAnalysisPayloadSchema';
import createScenarioAnalysisPayloadSchema from './createScenarioAnalysisPayloadSchema';
import createScenarioPayloadSchema from './createScenarioPayloadSchema';
import deleteScenarioAnalysisPayloadSchema from './deleteScenarioAnalysisPayloadSchema';
import deleteScenarioPayloadSchema from './deleteScenarioPayloadSchema';
import updateScenarioAnalysisPayloadSchema from './updateScenarioAnalysisPayloadSchema';

class ScenarioAnalysisCommand extends AbstractCommand {

    static cloneScenarioAnalysis(scenarioanalysisId, newId) {
        return new ScenarioAnalysisCommand(
            'cloneScenarioAnalysis', {
                id: scenarioanalysisId,
                new_id: newId
            },
            cloneScenarioAnalysisPayloadSchema
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
            createScenarioAnalysisPayloadSchema
        );
    }

    static createScenario(scenarioanalysisId, modelToCloneId, newId) {
        return new ScenarioAnalysisCommand(
            'createScenario', {
                id: scenarioanalysisId,
                basemodel_id: modelToCloneId,
                scenario_id: newId
            },
            createScenarioPayloadSchema
        );
    }

    static deleteScenarioAnalysis(scenarioanalysisId) {
        return new ScenarioAnalysisCommand(
            'deleteScenarioAnalysis', {
                id: scenarioanalysisId
            },
            deleteScenarioAnalysisPayloadSchema
        );
    }

    static deleteScenario(scenarioanalysisId, scenarioId) {
        return new ScenarioAnalysisCommand(
            'deleteScenarioAnalysis', {
                id: scenarioanalysisId,
                scenario_id: scenarioId
            },
            deleteScenarioPayloadSchema
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
            updateScenarioAnalysisPayloadSchema
        );
    }
}

export default ScenarioAnalysisCommand;
