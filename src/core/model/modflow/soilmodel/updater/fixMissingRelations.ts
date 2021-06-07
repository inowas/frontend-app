import {ISoilmodel} from '../Soilmodel.type';
import {ISoilmodelLayer} from '../SoilmodelLayer.type';
import {IZone} from '../Zone.type';
import {defaultSoilmodelParameters} from '../../../../../scenes/t03/defaults/soilmodel';
import uuidv4 from 'uuid/v4';

const fixMissingRelations = (soilmodel: ISoilmodel) => {
    const defaultZone = soilmodel.properties.zones.filter((z) => z.isDefault);

    if (defaultZone.length > 0) {
        const updateLayers = () => {
            return soilmodel.layers.map((layer) => {
                const nLayer: ISoilmodelLayer = {
                    ...layer,
                    parameters: layer.parameters.map((p) => {
                        if (!p.data) {
                            return {
                                ...p,
                                data: {file: null}
                            };
                        }
                        return p;
                    }),
                    relations: soilmodel.properties.parameters.map((p) => {
                        let value = defaultSoilmodelParameters.filter((dp) => dp.id === p.id).length > 0 ?
                            defaultSoilmodelParameters.filter((dp) => dp.id === p.id)[0].defaultValue : 0;
                        const param = layer.parameters.filter((pa) => pa.id === p.id);

                        if (param.length > 0 && param[0].value && !Array.isArray(param[0].value)) {
                            value = param[0].value;
                        }

                        return {
                            data: {file: null},
                            id: uuidv4(),
                            parameter: p.id,
                            priority: 0,
                            value,
                            zoneId: defaultZone[0].id
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
    }
    return soilmodel;
};

export default fixMissingRelations;
