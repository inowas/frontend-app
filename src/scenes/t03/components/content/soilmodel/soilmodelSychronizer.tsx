import {cloneDeep} from 'lodash';
import React, {useEffect, useState} from 'react';
import {Progress} from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
import {ILayerParameterZone} from '../../../../../core/model/gis/LayerParameterZone.type';
import {IRasterParameter} from '../../../../../core/model/gis/RasterParameter.type';
import {IZone, IZoneLegacy} from '../../../../../core/model/gis/Zone.type';
import {ModflowModel} from '../../../../../core/model/modflow';
import Soilmodel from '../../../../../core/model/modflow/soilmodel/Soilmodel';
import {ISoilmodel, ISoilmodelLegacy} from '../../../../../core/model/modflow/soilmodel/Soilmodel.type';
import {ISoilmodelLayer, ISoilmodelLayerLegacy} from '../../../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import SoilmodelLegacy from '../../../../../core/model/modflow/soilmodel/SoilmodelLegacy';
import {sendCommands} from '../../../../../services/api/commandHelper';
import Command from '../../../commands/modflowModelCommand';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import {defaultSoilmodelParameters} from '../../../defaults/soilmodel';

interface IProps {
    soilmodel: SoilmodelLegacy;
    model: ModflowModel;
    onChange: (soilmodel?: Soilmodel) => void;
}

const soilmodelSynchronizer = (props: IProps) => {
    const [newSoilmodel, setNewSoilmodel] = useState<ISoilmodel | null>(null);

    const calculateCommands = (model: ModflowModel, soilmodel: ISoilmodelLegacy) => {
        const cCommands: ModflowModelCommand[] = [];

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

            cCommands.push(
                Command.updateLayer({
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
                zones
            }
        });

        setNewSoilmodel(nSoilmodel.toObject());

        cCommands.push(
            Command.updateSoilmodelProperties({
                id: model.id,
                properties: {
                    relations,
                    parameters,
                    zones
                }
            })
        );

        return cCommands;
    };

    const [commands, setCommands] = useState<ModflowModelCommand[]>([]);
    const [commandsSuccessfullySent, setCommandsSuccessfullySent] = useState<number>(0);
    const [commandsErrorSent, setCommandsErrorSent] = useState<number>(0);

    useEffect(() => {
        setCommands(calculateCommands(props.model, props.soilmodel.toObject()));
    }, []);

    useEffect(() => {
        if (!props.model.readOnly) {
            synchronize();
        }

        if (props.model.readOnly && newSoilmodel) {
            return props.onChange(Soilmodel.fromObject(newSoilmodel));
        }
    }, [commands]);

    const onSendCommand = () => {
        setCommandsSuccessfullySent((s) => s + 1);
    };

    const onSendCommandError = () => {
        setCommandsErrorSent((s) => s + 1);
    };

    const onSendCommandSuccess = () => {
        setCommandsSuccessfullySent(commands.length);
    };

    const synchronize = () => {
        setCommandsSuccessfullySent(0);
        setCommandsErrorSent(0);
        sendCommands(cloneDeep(commands), onSendCommandSuccess, onSendCommandError, onSendCommand);
    };

    if (commandsSuccessfullySent === commands.length && newSoilmodel) {
        props.onChange();
    }

    if (commandsErrorSent > 0) {
        return (
            <div>ERROR</div>
        );
    }

    const percent = commandsSuccessfullySent / commands.length * 100;
    return (
        <Progress percent={percent} autoSuccess={true}>
            {percent > 99 ? 'The progress was successful' : 'Synchronizing'}
        </Progress>
    );
};

export default soilmodelSynchronizer;
