import {CLEAR} from './model';
import {LOGOUT, UNAUTHORIZED} from '../../user/actions/actions';
import LayersCollection from "../../../core/model/gis/LayersCollection";
import SoilmodelLayer from "../../../core/model/modflow/soilmodel/SoilmodelLayer";
import ZonesCollection from "../../../core/model/gis/ZonesCollection";
import {Zone} from "../../../core/model/gis";
import LayerParameterZonesCollection from "../../../core/model/gis/LayerParameterZonesCollection";

export const UPDATE_SOILMODEL_RELATIONS = 'T03_UPDATE_SOILMODEL_RELATIONS';
export const UPDATE_SOILMODEL = 'T03_UPDATE_SOILMODEL';
export const ADD_SOILMODEL_LAYER = 'T03_ADD_SOILMODEL_LAYER';
export const CLONE_SOILMODEL_LAYER = 'T03_CLONE_SOILMODEL_LAYER';
export const UPDATE_SOILMODEL_LAYER = 'T03_UPDATE_SOILMODEL_LAYER';
export const REMOVE_SOILMODEL_LAYER = 'T03_REMOVE_SOILMODEL_LAYER';
export const ADD_ZONE = 'T03_ADD_ZONE';
export const CLONE_ZONE = 'T03_CLONE_ZONE';
export const UPDATE_ZONE = 'T03_UPDATE_ZONE';
export const REMOVE_ZONE = 'T03_REMOVE_ZONE';

const initialState = null;

const soilmodel = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR:
            return initialState;

        case ADD_SOILMODEL_LAYER:
            return {
                ...state,
                layers: LayersCollection.fromObject(state.layers).add(action.layer).all
            };

        case CLONE_SOILMODEL_LAYER:
            const layers = LayersCollection.fromObject(state.layers);
            const layer = layers.findById(action.layer_id);
            const clonedLayer = SoilmodelLayer.fromObject(layer).clone(action.new_layer_id);
            layers.add(clonedLayer.toObject());

            return {
                ...state,
                layers: layers.toObject()
            };

        case REMOVE_SOILMODEL_LAYER:
            return {
                ...state,
                layers: LayersCollection.fromObject(state.layers).removeById(action.layer_id).all
            };

        case ADD_ZONE:
            return {
                ...state,
                properties: {
                    ...state.properties,
                    zones: ZonesCollection.fromObject(state.properties.zones).add(action.zone).all
                }
            };

        case CLONE_ZONE:
            const zones = ZonesCollection.fromObject(state.zones);
            const zone = zones.findById(action.zone_id);
            const clonedZone = Zone.fromObject(zone).clone(action.new_zone_id);
            zones.add(clonedZone.toObject());

            return {
                ...state,
                properties: {
                    ...state.properties,
                    zones: zones.toObject()
                }
            };

        case REMOVE_ZONE:
            return {
                ...state,
                properties: {
                    ...state.properties,
                    zones: ZonesCollection.fromObject(state.properties.zones).removeById(action.zone_id).all
                }
            };

        case UPDATE_SOILMODEL_RELATIONS:
            return {
                ...state,
                properties: {
                    ...state.properties,
                    relations: LayerParameterZonesCollection.fromObject(action.relations).all
                }
            };

        case UPDATE_SOILMODEL:
            return action.soilmodel;

        case UPDATE_SOILMODEL_LAYER:
            return {
                ...state,
                layers: LayersCollection.fromObject(state.layers).update(action.layer).all
            };

        case UPDATE_ZONE:
            return {
                ...state,
                properties: {
                    ...state.properties,
                    zones: ZonesCollection.fromObject(state.properties.zones).update(action.zone).all
                }
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
