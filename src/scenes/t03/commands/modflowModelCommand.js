import AbstractCommand from 'core/model/command/AbstractCommand';

import addLayerPayloadSchema from './addLayerPayloadSchema';
import addBoundaryPayloadSchema from './addBoundaryPayloadSchema';
import calculateOptimizationPayloadSchema from './calculateOptimizationPayloadSchema';
import cancelOptimizationCalculationPayloadSchema from './cancelOptimizationCalculationPayloadSchema';
import cloneModflowModelPayloadSchema from './cloneModflowModelPayloadSchema';
import createModflowModelPayloadSchema from './createModflowModelPayloadSchema';
import deleteModflowModelPayloadSchema from './deleteModflowModelPayloadSchema';
import removeLayerPayloadSchema from './removeLayerPayloadSchema';
import removeBoundaryPayloadSchema from './removeBoundaryPayloadSchema';
import updateBoundaryPayloadSchema from './updateBoundaryPayloadSchema';
import updateModflowModelPayloadSchema from './updateModflowModelPayloadSchema';
import updateMt3dmsPayloadSchema from './updateMt3dmsPayloadSchema';
import updateOptimizationInputPayloadSchema from './updateOptimizationInputPayloadSchema';
import updateStressperiodsPayloadSchema from './updateStressperiodsPayloadSchema';

class ModflowModelCommand extends AbstractCommand {

    static addSoilmodelLayer(payload) {
        return new ModflowModelCommand('addLayer', payload, addLayerPayloadSchema);
    }

    static addBoundary(modelId, boundary) {
        return new ModflowModelCommand(
            'addBoundary',
            {id: modelId, boundary: boundary.toObject},
            addBoundaryPayloadSchema
        );
    }

    static calculateOptimization(payload) {
        return new ModflowModelCommand('calculateOptimization', payload, calculateOptimizationPayloadSchema);
    }

    static cancelOptimizationCalculation(payload) {
        return new ModflowModelCommand('cancelOptimizationCalculation', payload,
            cancelOptimizationCalculationPayloadSchema
        );
    }

    static cloneModflowModel({id, newId, isTool}) {
        return new ModflowModelCommand(
            'cloneModflowModel',
            {id, new_id: newId, is_tool: isTool},
            cloneModflowModelPayloadSchema
        );
    }

    static createModflowModel(payload) {
        return new ModflowModelCommand('createModflowModel', payload, createModflowModelPayloadSchema);
    }

    static deleteModflowModel({id}) {
        return new ModflowModelCommand('deleteModflowModel', {id}, deleteModflowModelPayloadSchema);
    }

    static removeSoilmodelLayer(payload) {
        return new ModflowModelCommand('removeLayer', payload, removeLayerPayloadSchema);
    }

    static removeBoundary(modelId, boundaryId) {
        return new ModflowModelCommand(
            'removeBoundary',
            {id: modelId, boundary_id: boundaryId},
            removeBoundaryPayloadSchema
        );
    }

    static updateBoundary(modelId, boundary) {
        return new ModflowModelCommand(
            'updateBoundary',
            {id: modelId, boundary_id: boundary.id, boundary: boundary.toObject},
            updateBoundaryPayloadSchema
        );
    }

    static updateModflowModel(payload) {
        return new ModflowModelCommand('updateModflowModel', payload, updateModflowModelPayloadSchema);
    }

    static updateMt3dms(payload) {
        return new ModflowModelCommand('updateMt3dms', payload, updateMt3dmsPayloadSchema);
    }

    static updateOptimizationInput(payload) {
        return new ModflowModelCommand('updateOptimizationInput', payload, updateOptimizationInputPayloadSchema)
    }

    static updateSoilmodelLayer(payload) {
        return new ModflowModelCommand('updateLayer', payload, addLayerPayloadSchema);
    }

    static updateStressperiods(payload) {
        return new ModflowModelCommand('updateStressPeriods', payload, updateStressperiodsPayloadSchema);
    }
}

export default ModflowModelCommand;
