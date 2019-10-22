import uuidv4 from 'uuid/v4';
import {ILayerParameterZone} from '../../../core/model/gis/LayerParameterZone.type';
import {IRasterParameter} from '../../../core/model/gis/RasterParameter.type';
import {IZone, IZoneLegacy} from '../../../core/model/gis/Zone.type';
import {ModflowModel} from '../../../core/model/modflow';
import Soilmodel from '../../../core/model/modflow/soilmodel/Soilmodel';
import {ISoilmodel, ISoilmodelLegacy} from '../../../core/model/modflow/soilmodel/Soilmodel.type';
import {ISoilmodelLayer, ISoilmodelLayerLegacy} from '../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import {sendCommands} from '../../../services/api/commandHelper';
import ModflowModelCommand from '../commands/modflowModelCommand';
import {defaultSoilmodelParameters} from '../defaults/soilmodel';
import {versions} from './versions';

export const updater = (soilmodel: ISoilmodel | ISoilmodelLegacy, model: ModflowModel) => {
    if (
        !soilmodel.properties || !soilmodel.properties.version || (
            soilmodel.properties && soilmodel.properties.version && soilmodel.properties.version !== versions.soilmodel
        )
    ) {
        return updateV1toV2(soilmodel as ISoilmodelLegacy, model);
    }
    return soilmodel;
};

const updateV1toV2 = (soilmodel: ISoilmodelLegacy, model: ModflowModel) => {
    const commands: ModflowModelCommand[] = [];

    type parameterProp = 'top' | 'botm' | 'vka' | 'hk' | 'hani' | 'ss' | 'sy';
    let defaultZoneExists = false;
    const paramsLegacy = ['top', 'botm', 'vka', 'hk', 'hani', 'ss', 'sy'];
    const relations: ILayerParameterZone[] = [];
    const parameters: IRasterParameter[] = defaultSoilmodelParameters;
    const zones: IZone[] = [];
    const layers: ISoilmodelLayer[] = [];

    soilmodel.layers.forEach((layer: ISoilmodelLayerLegacy) => {
        layer._meta.zones.forEach((zone: IZoneLegacy) => {
            if ((zone.priority === 0 && !defaultZoneExists) || zone.priority !== 0) {
                if (zone.priority === 0) {
                    defaultZoneExists = true;
                }

                const newZone: IZone = {
                    id: zone.id,
                    name: zone.name,
                    geometry: zone.geometry,
                    cells: zone.cells
                };
                zones.push(newZone);
            }

            Object.keys(zone).filter((k) => paramsLegacy.includes(k)).forEach((key) => {
                if (zone[key as parameterProp].isActive) {
                    const newRelation = {
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
                    id: key,
                    value: layer[key as parameterProp]
                };
            })
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
            relations,
            parameters,
            version: 2,
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
