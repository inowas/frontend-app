import SimpleToolCommand from '../../../scenes/shared/simpleTools/commands/SimpleToolsCommand';
import ModflowModelCommand from '../../../scenes/t03/commands/modflowModelCommand';
import ScenarioAnalysisCommand from '../../t07/commands/scenarioAnalysisCommand';

export const createToolInstance = (tool: string, payload: any) => {
    switch (tool) {
        case 'T03':
            return (ModflowModelCommand.createModflowModel(payload));
        case 'T07':
            return (ScenarioAnalysisCommand.createScenarioAnalysis(payload));
        default:
            return (SimpleToolCommand.createToolInstance(payload));
    }
};

export const cloneToolInstance = (tool: string, id: string, newId: string) => {
    switch (tool) {
        case 'T03':
            return (ModflowModelCommand.cloneModflowModel({id, newId, isTool: true}));
        case 'T07':
            return ScenarioAnalysisCommand.cloneScenarioAnalysis({id, newId});
        default:
            return (SimpleToolCommand.cloneToolInstance({id, newId}));
    }
};

export const deleteToolInstance = (tool: string, id: string) => {
    switch (tool) {
        case 'T03':
            return (ModflowModelCommand.deleteModflowModel({id}));
        case 'T07':
            return (ScenarioAnalysisCommand.deleteScenarioAnalysis(id));
        default:
            return (SimpleToolCommand.deleteToolInstance({id}));
    }
};

export const updateToolInstance = (tool: string, payload: any) => {
    switch (tool) {
        case 'T03':
            return (ModflowModelCommand.updateModflowModelMetadata(
                payload.id, payload.name, payload.description, payload.isPublic
            ));
        case 'T07':
            return (ScenarioAnalysisCommand.updateScenarioAnalysis(payload));
        default:
            return (SimpleToolCommand.updateToolInstance(payload));
    }
};
