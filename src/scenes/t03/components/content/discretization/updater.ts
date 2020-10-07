import * as turf from '@turf/turf';
import {ICells} from '../../../../../core/model/geometry/Cells.type';
import {Cells, ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {Boundary, BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import LayersCollection from '../../../../../core/model/modflow/soilmodel/LayersCollection';
import SoilmodelLayer from '../../../../../core/model/modflow/soilmodel/SoilmodelLayer';
import {saveLayer} from '../../../../../core/model/modflow/soilmodel/updater/services';
import Zone from '../../../../../core/model/modflow/soilmodel/Zone';
import ZonesCollection from '../../../../../core/model/modflow/soilmodel/ZonesCollection';
import {sendCommand} from '../../../../../services/api';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {CALCULATE_CELLS_INPUT} from '../../../worker/t03.worker';
import {ICalculateCellsInputData} from '../../../worker/t03.worker.type';
import {asyncWorker} from '../../../worker/worker';

export const boundaryUpdater = (
    boundaries: BoundaryCollection,
    model: ModflowModel,
    onEachTask: (b: Boundary, l: number) => any,
    onFinished: (bc: BoundaryCollection) => any,
    onError: (e: string) => any,
    result: BoundaryCollection = new BoundaryCollection([])
): any => {
    if (boundaries.length > 0) {
        const boundary = boundaries.first;
        let g = boundary.geometry.toGeoJSON();
        if (model.rotation % 360 !== 0) {
            g = turf.transformRotate(
                boundary.geometry.toGeoJSON(), -1 * model.rotation, {pivot: model.geometry.centerOfMass}
            );
        }
        asyncWorker({
            type: CALCULATE_CELLS_INPUT,
            data: {
                geometry: g,
                boundingBox: model.boundingBox.toObject(),
                gridSize: model.gridSize.toObject(),
                intersection: model.intersection
            } as ICalculateCellsInputData
        }).then((c: ICells) => {
            boundary.cells = Cells.fromObject(Cells.fromObject(c).removeCells(model.inactiveCells));
            onEachTask(boundary, boundaries.length);
            sendCommand(ModflowModelCommand.updateBoundary(model.id, boundary),
                boundaryUpdater(
                    boundaries.removeById(boundary.id),
                    model,
                    onEachTask,
                    onFinished,
                    onError,
                    result.addBoundary(boundary)
                )
            );
        }).catch((e) => {
            onError(e);
        });
        return;
    }
    return onFinished(result);
};

export const layersUpdater = (
    model: ModflowModel,
    layers: LayersCollection,
    zones: ZonesCollection,
    onEachTask: (layer: SoilmodelLayer, l: number) => any,
    onFinished: (lc: LayersCollection) => any,
    onError: (e: string) => any,
    result: LayersCollection = new LayersCollection([])
) => {
    if (layers.length > 0) {
        const layer = SoilmodelLayer.fromObject(layers.first).zonesToParameters(model.gridSize, zones);
        if (layer.relations.length > 1) {
            saveLayer(
                layer.toObject(),
                model.toObject(),
                false,
                0,
                () => onEachTask(layer, layers.length),
                (l) => {
                    layersUpdater(
                        model,
                        layers.removeById(layer.id),
                        zones,
                        onEachTask,
                        onFinished,
                        onError,
                        result.add(l)
                    );
                }
            );
            return;
        }
        return;
    }
    return onFinished(result);
};

export const zonesUpdater = (
    model: ModflowModel,
    soilmodel: Soilmodel,
    zones: ZonesCollection,
    onEachTask: (z: Zone, l: number) => any,
    onFinished: (bc: ZonesCollection) => any,
    onError: (e: string) => any,
    result: ZonesCollection = new ZonesCollection([])
) => {
    if (zones.length > 0) {
        const zone = Zone.fromObject(zones.first);
        if (zone.id === 'default') {
            zonesUpdater(
                model,
                soilmodel,
                zones.removeById(zone.id),
                onEachTask,
                onFinished,
                onError,
                result.add(zone.toObject())
            );
            return;
        }

        let g = zone.geometry.toGeoJSON();
        if (model.rotation % 360 !== 0) {
            g = turf.transformRotate(
                zone.geometry.toGeoJSON(), -1 * model.rotation, {pivot: model.geometry.centerOfMass}
            );
        }
        asyncWorker({
            type: CALCULATE_CELLS_INPUT,
            data: {
                geometry: g,
                boundingBox: model.boundingBox.toObject(),
                gridSize: model.gridSize.toObject(),
                intersection: model.intersection
            } as ICalculateCellsInputData
        }).then((c: ICells) => {
            zone.cells = Cells.fromObject(c);
            onEachTask(zone, zones.length);
            zonesUpdater(
                model,
                soilmodel,
                zones.removeById(zone.id),
                onEachTask,
                onFinished,
                onError,
                result.add(zone.toObject())
            );
        }).catch((e) => {
            onError(e);
        });
        return;
    }
    sendCommand(
        ModflowModelCommand.updateSoilmodelProperties({
            id: model.id,
            properties: {
                ...soilmodel.toObject().properties,
                zones: result.all
            }
        }), () => {
            onFinished(result);
        }
    );
    return;
};
