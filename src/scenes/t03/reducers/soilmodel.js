import {LayersCollection, SoilmodelLayer} from 'core/model/modflow/soilmodel';

export const UPDATE_SOILMODEL = 'T03_UPDATE_SOILMODEL';
export const ADD_SOILMODEL_LAYER = 'T03_ADD_SOILMODEL_LAYER';
export const UPDATE_SOILMODEL_LAYER = 'T03_UPDATE_SOILMODEL_LAYER';
export const REMOVE_SOILMODEL_LAYER = 'T03_REMOVE_SOILMODEL_LAYER';

const soilmodel = (state = null, action) => {
    switch (action.type) {
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

        default:
            return state;
    }
};

export default soilmodel;
