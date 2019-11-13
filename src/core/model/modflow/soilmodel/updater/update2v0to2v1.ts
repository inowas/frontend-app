import {ISoilmodel2v0} from '../Soilmodel.type';
import {ISoilmodelLayer} from '../SoilmodelLayer.type';
import {IZone} from '../Zone.type';

const update2v0to2v1 = (soilmodel: ISoilmodel2v0) => {
    const updateLayers = () => {
        return soilmodel.layers.map((layer) => {
            const nLayer: ISoilmodelLayer = {
                ...layer,
                parameters: layer.parameters.map((p) => {
                    return {
                        ...p,
                        data: {
                            file: null
                        }
                    };
                }),
                relations: soilmodel.properties.relations.filter((r) => r.layerId === layer.id).map((r) => {
                    return {
                        ...r,
                        data: {
                            file: null
                        },
                        layerId: undefined
                    };
                })
            };
            return nLayer;
        });
    };

    return {
        layers: updateLayers(),
        properties: {
            parameters: soilmodel.properties.parameters,
            version: '2.1',
            zones: soilmodel.properties.zones.map((z) => {
                const newZone: IZone = {
                    ...z,
                    isDefault: z.name === 'Default Zone'
                };
                return newZone;
            })
        }
    };
};

export default update2v0to2v1;
