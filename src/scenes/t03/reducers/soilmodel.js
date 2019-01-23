import {LayersCollection, SoilmodelLayer} from 'core/model/modflow/soilmodel';
import {CLEAR} from './model';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';

export const UPDATE_SOILMODEL = 'T03_UPDATE_SOILMODEL';
export const ADD_SOILMODEL_LAYER = 'T03_ADD_SOILMODEL_LAYER';
export const UPDATE_SOILMODEL_LAYER = 'T03_UPDATE_SOILMODEL_LAYER';
export const REMOVE_SOILMODEL_LAYER = 'T03_REMOVE_SOILMODEL_LAYER';

const initialState = null;

const soilmodel = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR:
            return null;

        case ADD_SOILMODEL_LAYER:
            return {
                ...state,
                layers: LayersCollection.fromArray(state.layers).add(SoilmodelLayer.fromObject(action.layer)).toArray()
            };

        case REMOVE_SOILMODEL_LAYER:
            return {
                ...state,
                layers: LayersCollection.fromArray(state.layers).remove(action.layer_id).toArray()
            };

        case UPDATE_SOILMODEL:
            return action.soilmodel;

        case UPDATE_SOILMODEL_LAYER:
            return {
                ...state,
                layers: LayersCollection.fromArray(state.layers).update(SoilmodelLayer.fromObject(action.layer)).toArray()
            };

        case UNAUTHORIZED:
        case LOGOUT: {
            return initialState;
        }

        default:
            return state;
    }
};

export default soilmodel;
