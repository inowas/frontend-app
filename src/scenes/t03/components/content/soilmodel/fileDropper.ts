import {IModflowModel} from '../../../../../core/model/modflow/ModflowModel.type';
import Soilmodel from '../../../../../core/model/modflow/soilmodel/Soilmodel';
import {ISoilmodel} from '../../../../../core/model/modflow/soilmodel/Soilmodel.type';
import {ISoilmodelLayer} from '../../../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import {sendCommand} from '../../../../../services/api';
import {dropData} from '../../../../../services/dataDropper';
import ModflowModelCommand from '../../../commands/modflowModelCommand';

const addCommand = (commands: ModflowModelCommand[], model: IModflowModel, layer: ISoilmodelLayer) => {
    commands.push(
        ModflowModelCommand.updateLayer({
            id: model.id,
            layer: {
                ...layer,
                parameters: layer.parameters.map((p) => {
                    p.data = {
                        file: p.data.file
                    };
                    p.value = Array.isArray(p.value) ? undefined : p.value;
                    return p;
                }),
                relations: layer.relations.map((r) => {
                    r.data = {
                        file: r.data.file
                    };
                    r.value = Array.isArray(r.value) ? undefined : r.value;
                    return r;
                })
            }
        })
    );
    return commands;
};

export const saveLayer = (
    layer: ISoilmodelLayer,
    model: IModflowModel,
    isFinished: boolean,
    task: number = 0,
    onEachTask: ({message, task}: { message: string, task: number }) => any,
    onFinished: (layer: ISoilmodelLayer) => any
) => {
    const parameters = layer.parameters.filter((p) => Array.isArray(p.value));
    if (parameters.length > 0) {
        task = ++task;
        if (!!onEachTask) {
            onEachTask({
                message: `Saving data for parameter ${parameters[0].id}.`,
                task
            });
        }

        dropData(parameters[0].value).then((file) => {
            layer.parameters = layer.parameters.map((p) => {
                if (p.id === parameters[0].id) {
                    p.data.file = file;
                    p.value = undefined;
                }
                return p;
            });

            return saveLayer(layer, model, false, task, onEachTask, onFinished);
        });
        return;
    }

    const relations = layer.relations.filter((r) => Array.isArray(r.value));
    if (relations.length > 0) {
        task = ++task;
        if (!!onEachTask) {
            onEachTask({
                message: `Saving data for relation ${relations[0].id}.`,
                task
            });
        }

        dropData(relations[0].value).then((file) => {
            layer.relations = layer.relations.map((r) => {
                if (r.id === relations[0].id) {
                    r.data.file = file;
                    r.value = undefined;
                }
                return r;
            });

            return saveLayer(layer, model, false, task, onEachTask, onFinished);
        });
        return;
    }

    if (!isFinished) {
        sendCommand(
            ModflowModelCommand.updateLayer({
                id: model.id,
                layer: {
                    ...layer,
                    parameters: layer.parameters.map((p) => {
                        p.data = {
                            file: p.data.file
                        };
                        p.value = Array.isArray(p.value) ? undefined : p.value;
                        return p;
                    }),
                    relations: layer.relations.map((r) => {
                        r.data = {
                            file: r.data.file
                        };
                        r.value = Array.isArray(r.value) ? undefined : r.value;
                        return r;
                    })
                }
            }), () => {
                saveLayer(layer, model, true, task, onEachTask, onFinished);
            }
        );
        return;
    }
    if (!!onFinished) {
        return onFinished(layer);
    }
    return;
};

export const saveSoilmodel = (
    commands: ModflowModelCommand[],
    model: IModflowModel,
    soilmodel: ISoilmodel,
    onEachTask?: ({message, task}: { message: string, task: number }) => any,
    task?: number
): ISoilmodel => {
    const cSoilmodel = Soilmodel.fromObject(soilmodel);

    const layers = soilmodel.layers.filter((layer) =>
        layer.parameters.filter((p) => Array.isArray(p.value)) ||
        layer.relations.filter((r) => Array.isArray(r.value))
    );

    if (layers.length > 0) {
        const cLayer = layers[0];
        const parameters = cLayer.parameters.filter((p) => Array.isArray(p.value));
        if (parameters.length > 0) {
            if (!!onEachTask && task) {
                onEachTask({
                    message: `Saving data for parameter ${parameters[0].id}.`,
                    task: task++
                });
            }

            dropData(parameters[0].value).then((file) => {
                cLayer.parameters = cLayer.parameters.map((p) => {
                    if (p.id === parameters[0].id) {
                        p.data.file = file;
                        p.value = undefined;
                    }
                    return p;
                });
                cSoilmodel.updateLayer(cLayer);

                return saveSoilmodel(
                    addCommand(commands, model, cLayer), model, cSoilmodel.toObject(), onEachTask, task
                );
            });
        }

        const relations = cLayer.relations.filter((r) => Array.isArray(r.value));
        if (relations.length > 0) {
            if (!!onEachTask && task) {
                onEachTask({
                    message: `Saving data for relation ${relations[0].id}.`,
                    task: task++
                });
            }

            dropData(relations[0].value).then((file) => {
                cLayer.relations = cLayer.relations.map((r) => {
                    if (r.id === relations[0].id) {
                        r.data.file = file;
                        r.value = undefined;
                    }
                    return r;
                });
                cSoilmodel.updateLayer(cLayer);

                return saveSoilmodel(
                    addCommand(commands, model, cLayer), model, cSoilmodel.toObject(), onEachTask, task
                );
            });
        }
    }

    const command = commands.shift();
    if (command) {
        sendCommand(command);
        return saveSoilmodel(commands, model, cSoilmodel.toObject(), onEachTask, task);
    }

    return cSoilmodel.toObject();
};
