import AbstractCommand from '../../../core/model/command/AbstractCommand';
import FlopyPackages from '../../../core/model/flopy/packages/FlopyPackages';
import {IBoundingBox} from '../../../core/model/geometry/BoundingBox.type';
import {ICells} from '../../../core/model/geometry/Cells.type';
import {IGeometry} from '../../../core/model/geometry/Geometry.type';
import {IGridSize} from '../../../core/model/geometry/GridSize.type';
import {ModflowModel} from '../../../core/model/modflow';
import {Boundary} from '../../../core/model/modflow/boundaries';
import SoilmodelLayer from '../../../core/model/modflow/soilmodel/SoilmodelLayer';
import {IStressPeriods} from '../../../core/model/modflow/Stressperiods.type';
import {JSON_SCHEMA_URL} from '../../../services/api';

class ModflowModelCommand extends AbstractCommand {

    public static addBoundary(modelId: string, boundary: Boundary) {
        const name = 'addBoundary';
        return new ModflowModelCommand(
            name,
            {id: modelId, boundary: boundary.toObject()},
            JSON_SCHEMA_URL + '/commands/' + name
        );
    }

    public static addLayer(modelId: string, layer: SoilmodelLayer) {
        const name = 'addLayer';
        return new ModflowModelCommand(
            name,
            {id: modelId, layer: layer.toObject()},
            JSON_SCHEMA_URL + '/commands/' + name
        );
    }

    public static calculateModflowModel(id: string) {
        const name = 'calculateModflowModel';
        return new ModflowModelCommand(name, {id}, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static calculateOptimization(payload: any) {
        const name = 'calculateOptimization';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static cancelOptimizationCalculation(payload: any) {
        const name = 'cancelOptimizationCalculation';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static cloneModflowModel({id, newId, isTool}: { id: string, newId: string, isTool: boolean }) {
        const name = 'cloneModflowModel';
        return new ModflowModelCommand(name, {
            id,
            new_id: newId,
            is_tool: isTool
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static createModflowModel(model: ModflowModel) {
        const name = 'createModflowModel';
        return new ModflowModelCommand(name, model.toCreatePayload(), JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static deleteModflowModel({id}: { id: string }) {
        const name = 'deleteModflowModel';
        return new ModflowModelCommand(name, {id}, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static importModflowModel(payload: any) {
        const name = 'importModflowModel';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static removeLayer(payload: any) {
        const name = 'removeLayer';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static removeBoundary(modelId: string, boundaryId: string) {
        const name = 'removeBoundary';
        return new ModflowModelCommand(
            name, {id: modelId, boundary_id: boundaryId}, JSON_SCHEMA_URL + '/commands/' + name
        );
    }

    public static updateBoundary(modelId: string, boundary: Boundary) {
        const name = 'updateBoundary';
        return new ModflowModelCommand(
            name,
            {id: modelId, boundary_id: boundary.id, boundary: boundary.toObject()},
            JSON_SCHEMA_URL + '/commands/' + name
        );
    }

    public static updateModflowModelMetadata(id: string, name: string, description: string, isPublic: boolean) {
        const commandName = 'updateModflowModelMetadata';
        return new ModflowModelCommand(
            commandName,
            {id, name, description, public: isPublic},
            JSON_SCHEMA_URL + '/commands/' + commandName);
    }

    public static updateModflowModelCalculationId(id: string, calculationId: string) {
        const commandName = 'updateModflowModelCalculationId';
        return new ModflowModelCommand(
            commandName,
            {id, calculation_id: calculationId},
            JSON_SCHEMA_URL + '/commands/' + commandName);
    }

    public static updateModflowModelDiscretization(
        id: string,
        geometry: IGeometry,
        boundingBox: IBoundingBox,
        gridSize: IGridSize,
        cells: ICells,
        stressperiods: IStressPeriods,
        lengthUnit: number,
        timeUnit: number,
        rotation: number,
        intersection: number
    ) {
        const commandName = 'updateModflowModelDiscretization';
        const payload = {
            id, geometry, bounding_box: boundingBox,
            grid_size: gridSize, cells, stressperiods,
            length_unit: lengthUnit, time_unit: timeUnit,
            rotation, intersection
        };

        return new ModflowModelCommand(commandName, payload, JSON_SCHEMA_URL + '/commands/' + commandName);
    }

    public static updateFlopyPackages(id: string, packages: FlopyPackages) {
        const name = 'updateFlopyPackages';
        const payload = {id, packages: packages.toObject()};
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static updateOptimizationInput(payload: any) {
        const name = 'updateOptimizationInput';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static updateLayer(payload: any) {
        const name = 'updateLayer';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static updateTransport(payload: any) {
        const name = 'updateTransport';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static updateSoilmodelProperties(payload: any) {
        const name = 'updateSoilmodelProperties';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static updateStressperiods(payload: any) {
        const name = 'updateStressperiods';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static updateVariableDensity(payload: any) {
        const name = 'updateVariableDensity';
        return new ModflowModelCommand(name, payload, JSON_SCHEMA_URL + '/commands/' + name);
    }
}

export default ModflowModelCommand;
