import uuidv4 from 'uuid/v4';
import {ModflowModel} from '../../../core/model/modflow';
import {ILayerParameterZone} from '../../../core/model/modflow/soilmodel/LayerParameterZone.type';
import {IRasterParameter} from '../../../core/model/modflow/soilmodel/RasterParameter.type';
import Soilmodel from '../../../core/model/modflow/soilmodel/Soilmodel';
import {
    ISoilmodel,
    ISoilmodel1v0,
    ISoilmodel2v0
} from '../../../core/model/modflow/soilmodel/Soilmodel.type';
import {
    ISoilmodelLayer,
    ISoilmodelLayer1v0
} from '../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import {IZone, IZoneLegacy} from '../../../core/model/modflow/soilmodel/Zone.type';
import {sendCommands} from '../../../services/api/commandHelper';
import ModflowModelCommand from '../commands/modflowModelCommand';
import {defaultSoilmodelParameters} from '../defaults/soilmodel';

export const updater = (
    soilmodel: ISoilmodel | ISoilmodel1v0 | ISoilmodel2v0,
    model: ModflowModel
) => {
    if (
        !soilmodel.properties || !soilmodel.properties.version || (
            soilmodel.properties && soilmodel.properties.version && soilmodel.properties.version === 1
        )
    ) {
        return update1v0to2v0(soilmodel as ISoilmodel1v0, model);
    }
    if (soilmodel.properties.version === 2) {
        return update2v0to2v1(soilmodel as ISoilmodel2v0, model);
    }
    return soilmodel;
};

const update2v0to2v1 = (soilmodel: ISoilmodel2v0, model: ModflowModel) => {
    const commands: ModflowModelCommand[] = [];

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
                relations: []
            };
            /*nLayer.relations = soilmodel.properties.relations.filter((r) => r.layerId === layer.id).map(
                async (r: ILayerParameterZone) => {
                    if (Array.isArray(r.value)) {
                        const fd = await FileData.fromData(r.value, !model.readOnly);
                        r.value = fd.toObject();
                    }
                    return r;
                }
            );
            nLayer.parameters = nLayer.parameters.map(async (p) => {
                if (Array.isArray(p.value)) {
                    const fd = await FileData.fromData(p.value, !model.readOnly);
                    p.value = fd.toObject();
                }
                return p;
            });*/
            return nLayer;
        });
    };

    const newSoilmodel = Soilmodel.fromObject({
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
    });

    commands.push(
        ModflowModelCommand.updateSoilmodelProperties({
            id: model.id,
            properties: newSoilmodel.toObject().properties
        })
    );

    newSoilmodel.layersCollection.all.forEach((layer) => {
        commands.push(
            ModflowModelCommand.addLayer({
                id: model.id,
                layer
            })
        );
    });

    if (!model.readOnly) {
        sendCommands(commands,
            () => null,
            () => null,
            () => null
        );
    }

    return newSoilmodel;
};

const update1v0to2v0 = (soilmodel: ISoilmodel1v0, model: ModflowModel) => {
    const commands: ModflowModelCommand[] = [];

    type parameterProp = 'top' | 'botm' | 'vka' | 'hk' | 'hani' | 'ss' | 'sy';
    let defaultZoneExists = false;
    const paramsLegacy = ['top', 'botm', 'vka', 'hk', 'hani', 'ss', 'sy'];
    const relations: ILayerParameterZone[] = [];
    const parameters: IRasterParameter[] = defaultSoilmodelParameters;
    const zones: IZone[] = [];
    const layers: ISoilmodelLayer[] = [];

    soilmodel.layers.forEach((layer: ISoilmodelLayer1v0) => {
        layer._meta.zones.forEach((zone: IZoneLegacy) => {
            if ((zone.priority === 0 && !defaultZoneExists) || zone.priority !== 0) {
                if (zone.priority === 0) {
                    defaultZoneExists = true;
                }

                const newZone: IZone = {
                    id: zone.id,
                    isDefault: false,
                    name: zone.name,
                    geometry: zone.geometry,
                    cells: zone.cells
                };
                zones.push(newZone);
            }

            Object.keys(zone).filter((k) => paramsLegacy.includes(k)).forEach((key) => {
                if (zone[key as parameterProp].isActive) {
                    const newRelation = {
                        data: {
                            file: null
                        },
                        id: uuidv4(),
                        layerId: layer.id,
                        zoneId: zone.id,
                        parameter: key,
                        value: zone[key as parameterProp].value,
                        priority: zone.priority
                    };
                    relations.push(newRelation);
                }
            });

        });
        const newLayer: ISoilmodelLayer = {
            id: layer.id,
            name: layer.name,
            description: layer.description,
            number: layer.number,
            layavg: layer.layavg,
            laytyp: layer.laytyp,
            laywet: layer.laywet,
            parameters: Object.keys(layer).filter((k) => paramsLegacy.includes(k)).map((key) => {
                return {
                    data: {
                        file: null
                    },
                    id: key,
                    value: layer[key as parameterProp]
                };
            }),
            relations: []
        };
        layers.push(newLayer);

        commands.push(
            ModflowModelCommand.updateLayer({
                id: model.id,
                layer_id: layer.id,
                layer: newLayer
            })
        );
    });

    const nSoilmodel = new Soilmodel({
        layers,
        properties: {
            parameters,
            version: '2.1',
            zones
        }
    });

    const newSoilmodel = nSoilmodel.toObject();

    commands.push(
        ModflowModelCommand.updateSoilmodelProperties({
            id: model.id,
            properties: nSoilmodel.toObject().properties
        })
    );

    if (!model.readOnly) {
        sendCommands(commands,
            () => null,
            () => null,
            () => null
        );
    }

    return newSoilmodel;
};
