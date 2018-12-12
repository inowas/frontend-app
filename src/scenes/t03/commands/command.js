import Ajv from 'ajv';
import uuid from 'uuid';

import ajv0 from 'ajv/lib/refs/json-schema-draft-04.json';

import addLayerPayloadSchema from './addLayerPayloadSchema';
import calculateOptimizationPayloadSchema from './calculateOptimizationPayloadSchema';
import cancelOptimizationCalculationPayloadSchema from './cancelOptimizationCalculationPayloadSchema';
import createModflowModelPayloadSchema from './createModflowModelPayloadSchema';
import updateModflowModelPayloadSchema from './updateModflowModelPayloadSchema';
import updateOptimizationInputPayloadSchema from './updateOptimizationInputPayloadSchema';
import updateStressperiodsPayloadSchema from './updateStressperiodsPayloadSchema';
import removeLayerPayloadSchema from './removeLayerPayloadSchema';

class Command {

    metadata = [];
    uuid = uuid();

    static addSoilmodelLayer(payload) {
        return new Command('addLayer', payload, addLayerPayloadSchema);
    }

    static calculateOptimization(payload) {
        return new Command('calculateOptimization', payload, calculateOptimizationPayloadSchema);
    }

    static cancelOptimizationCalculation(payload) {
        return new Command('cancelOptimizationCalculation', payload, cancelOptimizationCalculationPayloadSchema);
    }

    static createModflowModel(payload) {
        return new Command('createModflowModel', payload, createModflowModelPayloadSchema);
    }

    static removeSoilmodelLayer(payload) {
        return new Command('removeLayer', payload, removeLayerPayloadSchema);
    }

    static updateStressperiods(payload) {
        return new Command('updateStressPeriods', payload, updateStressperiodsPayloadSchema);
    }

    static updateModflowModel(payload) {
        return new Command('updateModflowModel', payload, updateModflowModelPayloadSchema);
    }

    static updateSoilmodelLayer(payload) {
        return new Command('updateLayer', payload, addLayerPayloadSchema);
    }

    static updateOptimizationInput(payload) {
        return new Command('updateOptimizationInput', payload, updateOptimizationInputPayloadSchema)
    }

    constructor(name, payload, schema) {
        this.message_name = name;
        this.payload = payload;
        this.schema = schema;

        const [isValid, errors] = this.validate();
        if (!isValid) {
            console.warn(
                'Invalid payload sending ' + this.message_name,
                JSON.stringify(errors)
            );
        }
    }

    validate() {
        const ajv = new Ajv({schemaId: 'auto'});
        ajv.addMetaSchema(ajv0);
        const val = ajv.compile(this.schema);
        return [val(this.payload), val.errors];
    }

    toObject = () => ({
        uuid: this.uuid,
        message_name: this.message_name,
        metadata: this.metadata,
        payload: this.payload
    })
}

export default Command;
