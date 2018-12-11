import SimpleToolCommand from 'scenes/shared/simpleTools/commands/SimpleToolsCommand';
import ModflowModelCommand from 'scenes/t03/commands/modflowModelCommand';

export const createToolInstance = (tool, payload) => {
    switch (tool) {
        case 'T03':
            return (ModflowModelCommand.createModflowModel(payload));
        default:
            return (SimpleToolCommand.createToolInstance(payload));
    }
};

export const cloneToolInstance = (tool, id, newId) => {
    switch (tool) {
        case 'T03':
            return (ModflowModelCommand.cloneModflowModel({id, newId, isTool: true}));
        default:
            return (SimpleToolCommand.cloneToolInstance({id, newId}));
    }
};

export const deleteToolInstance = (tool, id) => {
    switch (tool) {
        case 'T03':
            return (ModflowModelCommand.deleteModflowModel({id}));
        default:
            return (SimpleToolCommand.deleteToolInstance({id}));
    }
};

export const updateToolInstance = (tool, payload) => {
    switch (tool) {
        case 'T03':
            return (ModflowModelCommand.updateModflowModel(payload));
        default:
            return (SimpleToolCommand.updateToolInstance(payload));
    }
};
