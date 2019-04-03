import AbstractCommand from 'core/model/command/AbstractCommand';
import {JSON_SCHEMA_URL} from 'services/api';
import FlopyPackages from 'core/model/flopy/packages/FlopyPackages';

class ModflowModelCommand extends AbstractCommand {

    static addBoundary(modelId, boundary) {
        const name = 'addBoundary';
        return new ModflowModelCommand(
            name,
            {id: modelId, boundary: boundary.toObject()},
            JSON_SCHEMA_URL + '/commands/' + name
        );
    }

    static addLayer(modelId, layer) {
        const name = 'addLayer';
        return new ModflowModelCommand(
            name,
            {id: modelId, layer: layer.toObject()},
            JSON_SCHEMA_URL + '/commands/' + name
        );
    }

    static calculateModflowModel(id) {
        const name = 'calculateModflowModel';
        return new ModflowModelCommand(name, {id}, JSON_SCHEMA_URL + '/commands/' + name);
    }

    static calculateOptimization(payload) {
        const name = 'calculateOptimization';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    static cancelOptimizationCalculation(payload) {
        const name = 'cancelOptimizationCalculation';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    static cloneModflowModel({id, newId, isTool}) {
        const name = 'cloneModflowModel';
        return new ModflowModelCommand(name, {
            id,
            new_id: newId,
            is_tool: isTool
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }

    static createModflowModel(payload) {
        const name = 'createModflowModel';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    static deleteModflowModel({id}) {
        const name = 'deleteModflowModel';
        return new ModflowModelCommand(name, {id}, JSON_SCHEMA_URL + '/commands/' + name);
    }

    static importModflowModel(payload) {
        const name = 'importModflowModel';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    static removeLayer(payload) {
        const name = 'removeLayer';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    static removeBoundary(modelId, boundaryId) {
        const name = 'removeBoundary';
        return new ModflowModelCommand(
            name, {id: modelId, boundary_id: boundaryId}, JSON_SCHEMA_URL + '/commands/' + name
        );
    }

    static updateBoundary(modelId, boundary) {
        const name = 'updateBoundary';
        return new ModflowModelCommand(
            name,
            {id: modelId, boundary_id: boundary.id, boundary: boundary.toObject()},
            JSON_SCHEMA_URL + '/commands/' + name
        );
    }

    static updateModflowModelMetadata(id, name, description, isPublic) {
        const commandName = 'updateModflowModelMetadata';
        return new ModflowModelCommand(
            commandName,
            {id, name, description, public: isPublic},
            JSON_SCHEMA_URL + '/commands/' + commandName);
    }

    static updateModflowModelCalculationId(id, calculationId) {
        const commandName = 'updateModflowModelCalculationId';
        return new ModflowModelCommand(
            commandName,
            {id, calculation_id: calculationId},
            JSON_SCHEMA_URL + '/commands/' + commandName);
    }

    static updateModflowModelDiscretization(id, geometry, boundingBox, gridSize, cells, stressperiods, lengthUnit, timeUnit) {
        const commandName = 'updateModflowModelDiscretization';
        const payload = {
            id, geometry, bounding_box: boundingBox,
            grid_size: gridSize, cells, stressperiods,
            length_unit: lengthUnit, time_unit: timeUnit
        };

        return new ModflowModelCommand(commandName, payload, JSON_SCHEMA_URL + '/commands/' + commandName);
    }

    static updateFlopyPackages(id, packages) {
        if (!(packages instanceof FlopyPackages)) {
            throw new Error('Expecting instance of FlopyPackages');
        }
        const name = 'updateFlopyPackages';
        const payload = {id, packages: packages.toObject()};
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    static updateOptimizationInput(payload) {
        const name = 'updateOptimizationInput';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    static updateLayer(payload) {
        const name = 'updateLayer';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    static updateStressperiods(payload) {
        const name = 'updateStressperiods';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }
}

export default ModflowModelCommand;
