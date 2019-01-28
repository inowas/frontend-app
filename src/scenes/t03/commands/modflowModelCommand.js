import AbstractCommand from 'core/model/command/AbstractCommand';

class ModflowModelCommand extends AbstractCommand {

    static addSoilmodelLayer(modelId, layer) {
        const name = 'addLayer';
        return new ModflowModelCommand(
            'addLayer',
            {id: modelId, layer: layer.toObject()},
            'https://schema.inowas.com/commands/' + name
        );
    }

    static addBoundary(modelId, boundary) {
        const name = 'addBoundary';
        return new ModflowModelCommand(
            'addBoundary',
            {id: modelId, boundary: boundary.toObject},
            'https://schema.inowas.com/commands/' + name
        );
    }

    static calculateOptimization(payload) {
        const name = 'calculateOptimization';
        return new ModflowModelCommand(name, payload, 'https://schema.inowas.com/commands/' + name);
    }

    static cancelOptimizationCalculation(payload) {
        const name = 'cancelOptimizationCalculation';
        return new ModflowModelCommand(name, payload, 'https://schema.inowas.com/commands/' + name);
    }

    static calculateModflowModel(id) {
        const name = 'calculateModflowModel';
        return new ModflowModelCommand(name, {id}, 'https://schema.inowas.com/commands/' + name);
    }

    static cloneModflowModel({id, newId, isTool}) {
        const name = 'cloneModflowModel';
        return new ModflowModelCommand(name, {
            id,
            new_id: newId,
            is_tool: isTool
        }, 'https://schema.inowas.com/commands/' + name);
    }

    static createModflowModel(payload) {
        const name = 'createModflowModel';
        return new ModflowModelCommand(name, payload, 'https://schema.inowas.com/commands/' + name);
    }

    static deleteModflowModel({id}) {
        const name = 'deleteModflowModel';
        return new ModflowModelCommand(name, {id}, 'https://schema.inowas.com/commands/' + name);
    }

    static removeSoilmodelLayer(payload) {
        const name = 'removeLayer';
        return new ModflowModelCommand(name, payload, 'https://schema.inowas.com/commands/' + name);
    }

    static removeBoundary(modelId, boundaryId) {
        const name = 'removeBoundary';
        return new ModflowModelCommand(
            name, {id: modelId, boundary_id: boundaryId}, 'https://schema.inowas.com/commands/' + name
        );
    }

    static updateBoundary(modelId, boundary) {
        const name = 'updateBoundary';
        return new ModflowModelCommand(
            name,
            {id: modelId, boundary_id: boundary.id, boundary: boundary.toObject},
            'https://schema.inowas.com/commands/' + name
        );
    }

    static updateModflowModel(payload) {
        const name = 'updateModflowModel';
        return new ModflowModelCommand(name, payload, 'https://schema.inowas.com/commands/' + name);
    }

    static updateMt3dms(payload) {
        const name = 'updateMt3dms';
        return new ModflowModelCommand(name, payload, 'https://schema.inowas.com/commands/' + name);
    }

    static updateOptimizationInput(payload) {
        const name = 'updateOptimizationInput';
        return new ModflowModelCommand(name, payload, 'https://schema.inowas.com/commands/' + name);
    }

    static updateSoilmodelLayer(payload) {
        const name = 'updateLayer';
        return new ModflowModelCommand(name, payload, 'https://schema.inowas.com/commands/' + name);
    }

    static updateStressperiods(payload) {
        const name = 'updateStressPeriods';
        return new ModflowModelCommand(name, payload, 'https://schema.inowas.com/commands/' + name);
    }
}

export default ModflowModelCommand;
