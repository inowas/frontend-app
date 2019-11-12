import uuidv4 from 'uuid/v4';
import {ModflowModel} from '../../../core/model/modflow';
import {Zone} from '../../../core/model/modflow/soilmodel';
import {ILayerParameterZone} from '../../../core/model/modflow/soilmodel/LayerParameterZone.type';
import {IRasterParameter} from '../../../core/model/modflow/soilmodel/RasterParameter.type';
import Soilmodel from '../../../core/model/modflow/soilmodel/Soilmodel';
import {
    ISoilmodel,
    ISoilmodel1v0,
    ISoilmodel2v0, ISoilmodelExport
} from '../../../core/model/modflow/soilmodel/Soilmodel.type';
import {
    ISoilmodelLayer,
    ISoilmodelLayer1v0
} from '../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import {IZone, IZoneLegacy} from '../../../core/model/modflow/soilmodel/Zone.type';
import {defaultSoilmodelLayerParameters, defaultSoilmodelParameters} from '../defaults/soilmodel';

export const updater = (
    soilmodel: ISoilmodelExport | ISoilmodel | ISoilmodel1v0 | ISoilmodel2v0,
    model: ModflowModel
): ISoilmodel => {
    if (
        !soilmodel.properties || !soilmodel.properties.version || (
            soilmodel.properties && soilmodel.properties.version && soilmodel.properties.version === 1
        )
    ) {
        console.log('%c Updating soilmodel from 1v0 to 2v1', 'background: #222; color: #bada55');
        return update1v0to2v1(soilmodel as ISoilmodel1v0, model);
    }
    if (soilmodel.properties.version === 2) {
        console.log('%c Updating soilmodel from 2v0 to 2v1', 'background: #222; color: #bada55');
        return update2v0to2v1(soilmodel as ISoilmodel2v0, model);
    }
    return soilmodel as ISoilmodel;
};

const update2v0to2v1 = (soilmodel: ISoilmodel2v0, model: ModflowModel) => {
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

    const nSoilmodel = Soilmodel.fromObject({
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

    return nSoilmodel.toObject();
};

const update1v0to2v1 = (soilmodel: ISoilmodel1v0, model: ModflowModel) => {
    type parameterProp = 'top' | 'botm' | 'vka' | 'hk' | 'hani' | 'ss' | 'sy';
    let defaultZoneExists = false;
    const paramsLegacy = ['top', 'botm', 'vka', 'hk', 'hani', 'ss', 'sy'];
    const parameters: IRasterParameter[] = defaultSoilmodelParameters;
    const zones: IZone[] = [];
    const layers: ISoilmodelLayer[] = [];

    const defaultZone = new Zone({
        id: 'default',
        isDefault: true,
        name: 'Default Zone',
        geometry: model.geometry.toObject(),
        cells: model.cells.toObject()
    });

    soilmodel.layers.forEach((layer: ISoilmodelLayer1v0, key: number) => {
        const relations: ILayerParameterZone[] = [];
        if (!layer.id) {
            layer.id = uuidv4();
        }

        if (!layer.number) {
            layer.number = key;
        }

        if (layer._meta && layer._meta.zones) {
            layer._meta.zones.forEach((zone: IZoneLegacy) => {
                if ((zone.priority === 0 && !defaultZoneExists) || zone.priority !== 0) {
                    const newZone: IZone = {
                        id: zone.id,
                        isDefault: false,
                        name: zone.name,
                        geometry: zone.geometry,
                        cells: zone.cells
                    };
                    if (zone.priority === 0) {
                        newZone.isDefault = true;
                        defaultZoneExists = true;
                    }
                    zones.push(newZone);
                }

                Object.keys(zone).filter((k) => paramsLegacy.includes(k)).forEach((key) => {
                    if (zone[key as parameterProp].isActive &&
                        (key !== 'top' || (key === 'top') && layer.number === 0)) {
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
        } else {
            defaultSoilmodelParameters.forEach((p) => {
                const newRelation = {
                    data: {
                        file: null
                    },
                    id: uuidv4(),
                    layerId: layer.id,
                    zoneId: 'default',
                    parameter: p.id,
                    value: layer[p.id as parameterProp],
                    priority: 0
                };
                relations.push(newRelation);
            });
        }

        const paramKeys = Object.keys(layer).filter((k) => paramsLegacy.includes(k));

        const newLayer: ISoilmodelLayer = {
            id: layer.id,
            name: layer.name,
            description: layer.description,
            number: layer.number,
            layavg: layer.layavg,
            laytyp: layer.laytyp,
            laywet: layer.laywet,
            parameters: paramKeys.length > 0 ? Object.keys(layer).filter((k) => paramsLegacy.includes(k)).map((key) => {
                return {
                    data: {
                        file: null
                    },
                    id: key,
                    value: layer[key as parameterProp]
                };
            }) : defaultSoilmodelLayerParameters,
            relations
        };
        layers.push(newLayer);
    });

    if (!defaultZoneExists) {
        zones.push(defaultZone.toObject());
    }

    const nSoilmodel = new Soilmodel({
        layers,
        properties: {
            parameters,
            version: '2.1',
            zones
        }
    });

    return nSoilmodel.toObject();
};
