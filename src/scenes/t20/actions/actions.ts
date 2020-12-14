import {BoundaryCollection} from '../../../core/model/modflow/boundaries';
import {CLEAR, UPDATE_RTMODELLING} from '../reducers/rtmodelling';
import {Calculation, ModflowModel, Soilmodel, Transport, VariableDensity} from '../../../core/model/modflow';
import {IToolInstance} from '../../dashboard/defaults/tools';
import {PROCESSING_PACKAGES} from '../reducers/packages';
import {START_CALCULATION, UPDATE_CALCULATION} from '../reducers/calculation';
import {UPDATE_BOUNDARIES} from '../reducers/boundaries';
import {UPDATE_MODEL} from '../reducers/model';
import {UPDATE_PACKAGES, UPDATE_PROCESSED_PACKAGES} from '../reducers/packages';
import {UPDATE_SOILMODEL} from '../reducers/soilmodel';
import {UPDATE_T10_INSTANCES} from '../reducers/t10instances';
import {UPDATE_TRANSPORT} from '../reducers/transport';
import {UPDATE_VARIABLE_DENSITY} from '../reducers/variableDensity';
import FlopyPackages from '../../../core/model/flopy/packages/FlopyPackages';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';

export function clear() {
    return {
        type: CLEAR
    };
}

export function startCalculation() {
    return {
        type: START_CALCULATION
    };
}

export function updateBoundaries(boundaryCollection: BoundaryCollection) {
    return {
        type: UPDATE_BOUNDARIES,
        payload: boundaryCollection.toObject()
    };
}

export function updateCalculation(calculation: Calculation) {
    return {
        type: UPDATE_CALCULATION,
        payload: calculation.toObject()
    }
}

export function updateModel(model: ModflowModel) {
    return {
        type: UPDATE_MODEL,
        payload: model.toObject()
    };
}

export function updatePackages(packages: FlopyPackages) {
    return {
        type: UPDATE_PACKAGES,
        payload: packages.toObject()
    };
}

export function updateProcessedPackages(packages: FlopyPackages) {
    return {
        type: UPDATE_PROCESSED_PACKAGES,
        payload: packages.toObject()
    };
}

export function updateProcessingPackages() {
    return {
        type: PROCESSING_PACKAGES
    };
}

export function updateRTModelling(rtm: RTModelling) {
    return {
        type: UPDATE_RTMODELLING,
        payload: rtm.toObject()
    };
}

export function updateSoilmodel(soilmodel: Soilmodel) {
    return {
        type: UPDATE_SOILMODEL,
        payload: soilmodel.toObject()
    };
}

export function updateT10Instances(instances: IToolInstance[]) {
    return {
        type: UPDATE_T10_INSTANCES,
        payload: instances
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
    }
}