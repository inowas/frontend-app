import {ILayerParameterZone} from '../LayerParameterZone.type';
import {IRasterParameter} from '../RasterParameter.type';
import {ISoilmodel1v0} from '../Soilmodel.type';
import {ISoilmodelLayer, ISoilmodelLayer1v0} from '../SoilmodelLayer.type';
import {IZone, IZoneLegacy} from '../Zone.type';
import {ModflowModel} from '../..';
import {
    defaultSoilmodelLayerParameters,
    defaultSoilmodelParameters
} from '../../../../../scenes/t03/defaults/soilmodel';
import uuidv4 from 'uuid/v4';

const update1v0to2v1 = (soilmodel: ISoilmodel1v0, model: ModflowModel) => {
    type parameterProp = 'top' | 'botm' | 'vka' | 'hk' | 'hani' | 'ss' | 'sy';
    let defaultZoneExists = false;
    const paramsLegacy = ['top', 'botm', 'vka', 'hk', 'hani', 'ss', 'sy'];
    const parameters: IRasterParameter[] = defaultSoilmodelParameters;
    const zones: IZone[] = [];
    const layers: ISoilmodelLayer[] = [];

    const defaultZone: IZone = {
        id: 'default',
        isDefault: true,
        name: 'Default Zone',
        geometry: model.geometry.toObject(),
        cells: model.cells.toObject()
    };

    soilmodel.layers.forEach((layer: ISoilmodelLayer1v0, lKey: number) => {
        const relations: ILayerParameterZone[] = [];
        if (!layer.id) {
            layer.id = uuidv4();
        }

        if (!layer.number) {
            layer.number = lKey;
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
                        newZone.id = 'default';
                        newZone.isDefault = true;
                        defaultZoneExists = true;
                    }
                    zones.push(newZone);
                }

                Object.keys(zone).filter((k) => paramsLegacy.includes(k)).forEach((key) => {
                    if (zone[key as parameterProp].isActive &&
                        (key !== 'top' || (key === 'top' && layer.number === 0))) {
                        const newRelation = {
                            data: {
                                file: null
                            },
                            id: uuidv4(),
                            zoneId: zone.priority === 0 ? 'default' : zone.id,
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
        zones.push(defaultZone);
    }

    return {
        layers,
        properties: {
            parameters,
            version: '2.1',
            zones
        }
    };
};

export default update1v0to2v1;
