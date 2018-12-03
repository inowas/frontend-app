import {UPDATE_BOUNDARIES} from '../reducers/boundaries';
import {UPDATE_MODEL} from '../reducers/model';
import {UPDATE_SOILMODEL} from '../reducers/soilmodel';

import {ModflowModel} from 'core/model/modflow';
import {BoundaryCollection} from 'core/model/modflow/boundaries';
import {Soilmodel} from 'core/model/modflow/soilmodel';

export function updateModel(modflowModel) {
    if (!modflowModel instanceof ModflowModel) {
        throw new Error('ModflowModel is expected to be instance of ModflowModel');
    }

    return {
        type: UPDATE_MODEL,
        model: modflowModel.toObject()
    };
}

export function updateBoundaries(boundaryCollection) {
    if (!boundaryCollection instanceof BoundaryCollection) {
        throw new Error('BoundaryCollection is expected to be instance of BoundaryCollection');
    }

    return {
        type: UPDATE_BOUNDARIES,
        boundaries: boundaryCollection.toObject()
    };
}

export function updateSoilmodel(soilmodel) {
    if (!soilmodel instanceof Soilmodel) {
        throw new Error('soilmodel is expected to be instance of Soilmodel');
    }

    return {
        type: UPDATE_SOILMODEL,
        soilmodel: soilmodel.toObject
    };
}
