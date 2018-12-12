import AbstractCommand from 'core/model/command/AbstractCommand';

import calculateOptimizationPayloadSchema from './calculateOptimizationPayloadSchema';
import cancelOptimizationCalculationPayloadSchema from './cancelOptimizationCalculationPayloadSchema';
import cloneModflowModelPayloadSchema from './cloneModflowModelPayloadSchema';
import createModflowModelPayloadSchema from './createModflowModelPayloadSchema';
import deleteModflowModelPayloadSchema from './deleteModflowModelPayloadSchema';
import updateModflowModelPayloadSchema from './updateModflowModelPayloadSchema';
import updateOptimizationInputPayloadSchema from './updateOptimizationInputPayloadSchema';
import updateStressperiodsPayloadSchema from './updateStressperiodsPayloadSchema';

class ModflowModelCommand extends AbstractCommand {


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

    static updateModflowModel(payload) {
        return new ModflowModelCommand('updateModflowModel', payload, updateModflowModelPayloadSchema);
    }


    static updateOptimizationInput(payload) {
        return new ModflowModelCommand('updateOptimizationInput', payload, updateOptimizationInputPayloadSchema)
    }

    static updateStressperiods(payload) {
        return new ModflowModelCommand('updateStressPeriods', payload, updateStressperiodsPayloadSchema);
    }
}


export default ModflowModelCommand;
