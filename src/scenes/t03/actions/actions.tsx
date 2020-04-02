import {UPDATE_BOUNDARIES} from '../reducers/boundaries';
import {START_CALCULATION, UPDATE_CALCULATION} from '../reducers/calculation';
import {CLEAR, UPDATE_MODEL, UPDATE_MT3DMS, UPDATE_STRESSPERIODS} from '../reducers/model';
import {UPDATE_OPTIMIZATION} from '../reducers/optimization';
import {
    ADD_SOILMODEL_LAYER, ADD_ZONE, CLONE_SOILMODEL_LAYER, CLONE_ZONE,
    REMOVE_SOILMODEL_LAYER, REMOVE_ZONE, UPDATE_SOILMODEL, UPDATE_SOILMODEL_LAYER,
    UPDATE_SOILMODEL_RELATIONS, UPDATE_ZONE
} from '../reducers/soilmodel';

import FlopyPackages from '../../../core/model/flopy/packages/FlopyPackages';
import {FlopyMt3d} from '../../../core/model/flopy/packages/mt';
import {IMessage} from '../../../core/model/messages/Message.type';
import {Calculation, ModflowModel, Stressperiods, Transport, VariableDensity} from '../../../core/model/modflow';
import {BoundaryCollection} from '../../../core/model/modflow/boundaries';
import {Optimization} from '../../../core/model/modflow/optimization';
import {Soilmodel, SoilmodelLayer} from '../../../core/model/modflow/soilmodel';
import {Zone} from '../../../core/model/modflow/soilmodel';
import LayerParameterZonesCollection from '../../../core/model/modflow/soilmodel/LayerParameterZonesCollection';
import {ADD_MESSAGE, REMOVE_MESSAGE, UPDATE_MESSAGE} from '../reducers/messages';
import {
    PROCESSING_PACKAGES,
    RECALCULATE_PACKAGES,
    UPDATE_PACKAGES,
    UPDATE_PROCESSED_PACKAGES
} from '../reducers/packages';
import {UPDATE_TRANSPORT} from '../reducers/transport';
import {UPDATE_VARIABLE_DENSITY} from '../reducers/variableDensity';

export function clear() {
    return {
        type: CLEAR
    };
}

export function updateModel(modflowModel: ModflowModel) {
    return {
        type: UPDATE_MODEL,
        model: modflowModel.toObject()
    };
}

export function updateStressperiods(stressperiods: Stressperiods) {
    return {
        type: UPDATE_STRESSPERIODS,
        payload: stressperiods.toObject()
    };
}

export function updateBoundaries(boundaryCollection: BoundaryCollection, setIsDirty: boolean = false) {
    return {
        type: UPDATE_BOUNDARIES,
        boundaries: boundaryCollection.toObject(),
        setIsDirty
    };
}

export function updateTransport(transport: Transport) {
    return {
        type: UPDATE_TRANSPORT,
        payload: transport.toObject()
    };
}

export function updateVariableDensity(variableDensity: VariableDensity) {
    return {
        type: UPDATE_VARIABLE_DENSITY,
        payload: variableDensity.toObject()
    };
}

export function updateCalculation(calculation: Calculation) {
    return {
        type: UPDATE_CALCULATION,
        payload: calculation.toObject()
    };
}

export function updatePackages(packages: FlopyPackages) {
    return {
        type: UPDATE_PACKAGES,
        payload: packages.toObject()
    };
}

export function updateProcessingPackages() {
    return {
        type: PROCESSING_PACKAGES
    };
}

export function updateProcessedPackages(packages: FlopyPackages) {
    return {
        type: UPDATE_PROCESSED_PACKAGES,
        payload: packages.toObject()
    };
}

export function recalculatePackages() {
    return {
        type: RECALCULATE_PACKAGES
    };
}

export function updateMt3dms(mt3dms: FlopyMt3d) {
    return {
        type: UPDATE_MT3DMS,
        payload: mt3dms.toObject()
    };
}

export function addLayer(layer: SoilmodelLayer) {
    return {
        type: ADD_SOILMODEL_LAYER,
        layer: layer.toObject()
    };
}

export function cloneLayer(layerId: string, newLayerId: string) {
    return {
        type: CLONE_SOILMODEL_LAYER,
        layer_id: layerId,
        new_layer_id: newLayerId
    };
}

export function removeLayer(layerId: string) {
    return {
        type: REMOVE_SOILMODEL_LAYER,
        layer_id: layerId
    };
}

export function addZone(zone: Zone) {
    return {
        type: ADD_ZONE,
        zone: zone.toObject()
    };
}

export function cloneZone(zoneId: string, newZoneId: string) {
    return {
        type: CLONE_ZONE,
        zone_id: zoneId, new_zone_id: newZoneId
    };
}

export function updateZone(zone: Zone) {
    return {
        type: UPDATE_ZONE,
        zone: zone.toObject()
    };
}

export function removeZone(zoneId: string) {
    return {
        type: REMOVE_ZONE,
        zone_id: zoneId
    };
}

export function updateOptimization(optimization: Optimization) {
    return {
        type: UPDATE_OPTIMIZATION,
        payload: optimization.toObject()
    };
}

export function updateSoilmodel(soilmodel: Soilmodel) {
    return {
        type: UPDATE_SOILMODEL,
        soilmodel: soilmodel.toObject()
    };
}

export function updateSoilmodelRelations(relations: LayerParameterZonesCollection) {
    return {
        type: UPDATE_SOILMODEL_RELATIONS,
        relations: relations.toObject()
    };
}

export function updateLayer(layer: SoilmodelLayer) {
    return {
        type: UPDATE_SOILMODEL_LAYER,
        layer: layer.toObject()
    };
}

export function startCalculation() {
    return {
        type: START_CALCULATION
    };
}

export function addMessage(message: IMessage) {
    return {
        type: ADD_MESSAGE,
        payload: message
    };
}

export function removeMessage(message: IMessage) {
    return {
        type: REMOVE_MESSAGE,
        payload: message
    };
}

export function updateMessage(message: IMessage) {
    return {
        type: UPDATE_MESSAGE,
        payload: message
    };
}
