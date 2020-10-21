import {cloneDeep, uniq} from 'lodash';
import ModflowModelCommand from '../../../../../scenes/t03/commands/modflowModelCommand';
import {sendCommand} from '../../../../../services/api';
import {dropData, FileData} from '../../../../../services/dataDropper';
import {Array2D} from '../../../geometry/Array2D.type';
import {IModflowModel} from '../../ModflowModel.type';
import {Soilmodel} from '../index';
import {ISoilmodel} from '../Soilmodel.type';
import {ISoilmodelLayer} from '../SoilmodelLayer.type';

export const saveLayer = (
    layer: ISoilmodelLayer,
    model: IModflowModel,
    isFinished: boolean,
    task = 0,
    onEachTask: ({message, task}: { message: string, task: number }) => any,
    onFinished: (layer: ISoilmodelLayer) => any
): any => {
    const parameters = layer.parameters.filter((p) => Array.isArray(p.value));
    if (parameters.length > 0) {
        task = ++task;
        // eslint-disable-next-line no-extra-boolean-cast
        if (!!onEachTask) {
            onEachTask({
                message: `Saving data for parameter ${parameters[0].id}.`,
                task
            });
        }

        if (Array.isArray(parameters[0].value) && uniq(parameters[0].value).length === 1) {
            layer.parameters = layer.parameters.map((p) => {
                if (p.id === parameters[0].id) {
                    p.data = {file: null};
                    p.value = (parameters[0].value as Array2D<number>)[0][0];
                }
                return p;
            });
            return saveLayer(layer, model, false, task, onEachTask, onFinished);
        }

        return dropData(parameters[0].value).then((file) => {
            layer.parameters = layer.parameters.map((p) => {
                const value = cloneDeep(parameters[0].value);
                if (p.id === parameters[0].id) {
                    p.data.file = file;
                    p.data.data = Array.isArray(value) ? value : undefined;
                    p.value = undefined;
                }
                return p;
            });
            return saveLayer(layer, model, false, task, onEachTask, onFinished);
        });
    }

    const relations = layer.relations.filter((r) => Array.isArray(r.value));
    if (relations.length > 0) {
        task = ++task;
        // eslint-disable-next-line no-extra-boolean-cast
        if (!!onEachTask) {
            onEachTask({
                message: `Saving data for relation ${relations[0].id}.`,
                task
            });
        }

        if (Array.isArray(relations[0].value) && uniq(relations[0].value).length === 1) {
            layer.relations = layer.relations.map((r) => {
                if (r.id === relations[0].id) {
                    r.data = {file: null};
                    r.value = (relations[0].value as Array2D<number>)[0][0];
                }
                return r;
            });
            return saveLayer(layer, model, false, task, onEachTask, onFinished);
        }

        return dropData(relations[0].value).then((file) => {
            layer.relations = layer.relations.map((r) => {
                if (r.id === relations[0].id) {
                    r.data.file = file;
                    r.data.data = Array.isArray(relations[0].value) ? relations[0].value : undefined;
                    r.value = undefined;
                }
                return r;
            });
            return saveLayer(layer, model, false, task, onEachTask, onFinished);
        });
    }

    if (!isFinished) {
        const clonedLayer = cloneDeep(layer);
        sendCommand(
            ModflowModelCommand.updateLayer({
                id: model.id,
                layer: {
                    ...clonedLayer,
                    parameters: clonedLayer.parameters.map((p) => {
                        p.data = {
                            file: p.data.file
                        };
                        p.value = Array.isArray(p.value) ? undefined : p.value;
                        return p;
                    }),
                    relations: clonedLayer.relations.map((r) => {
                        r.data = {
                            file: r.data.file
                        };
                        r.value = Array.isArray(r.value) ? undefined : r.value;
                        return r;
                    })
                }
            }), () => {
                saveLayer(layer, model, true, task, onEachTask, onFinished);
            }, (error) => {
                // tslint:disable-next-line:no-console
                console.error(error);
            }
        );
        return;
    }
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!onFinished) {
        return onFinished(layer);
    }
    return;
};

export const saveSoilmodel = (
    model: IModflowModel,
    soilmodel: ISoilmodel,
    onEachTask: ({message, task}: { message: string, task: number }) => any,
    onSuccess: (soilmodel: ISoilmodel, needToBeFetched: boolean) => any,
    saveLayers: boolean,
    saveProperties: boolean,
    commands: ModflowModelCommand[] = [],
    task = 0,
): ISoilmodel | void => {
    const cSoilmodel = Soilmodel.fromObject(soilmodel);

    if (saveProperties) {
        onEachTask({
            message: `Saving soilmodel properties.`,
            task: task++
        });
        return sendCommand(
            ModflowModelCommand.updateSoilmodelProperties({
                id: model.id,
                properties: cSoilmodel.toObject().properties
            }), () => {
                return saveSoilmodel(
                    model, cSoilmodel.toObject(), onEachTask, onSuccess, true, false, commands, task
                );
            }, (error) => {
                // tslint:disable-next-line:no-console
                console.error(error);
            }
        );
    }

    const layers = soilmodel.layers.filter((layer) =>
        layer.parameters.filter((p) => Array.isArray(p.value)).length > 0 ||
        layer.relations.filter((r) => Array.isArray(r.value)).length > 0
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

            if (Array.isArray(parameters[0].value) && uniq(parameters[0].value).length === 1) {
                cLayer.parameters = cLayer.parameters.map((p) => {
                    if (p.id === parameters[0].id) {
                        p.data = {file: null};
                        p.value = (parameters[0].value as Array2D<number>)[0][0];
                    }
                    return p;
                });
                cSoilmodel.updateLayer(cLayer);
                return saveSoilmodel(
                    model, cSoilmodel.toObject(), onEachTask, onSuccess, true, false,
                    commands, task
                );
            }

            dropData(parameters[0].value).then((file) => {
                cLayer.parameters = cLayer.parameters.map((p) => {
                    if (p.id === parameters[0].id) {
                        p.data.file = file;
                        p.data.data = Array.isArray(parameters[0].value) ? parameters[0].value : undefined;
                        p.value = undefined;
                    }
                    return p;
                });
                cSoilmodel.updateLayer(cLayer);

                return saveSoilmodel(
                    model, cSoilmodel.toObject(), onEachTask, onSuccess, true, false,
                    commands, task
                );
            });
            return;
        }

        const relations = cLayer.relations.filter((r) => Array.isArray(r.value));
        if (relations.length > 0) {
            if (!!onEachTask && task) {
                onEachTask({
                    message: `Saving data for relation ${relations[0].id}.`,
                    task: task++
                });
            }

            if (Array.isArray(relations[0].value) && uniq(relations[0].value).length === 1) {
                cLayer.relations = cLayer.relations.map((r) => {
                    if (r.id === relations[0].id) {
                        r.data = {file: null};
                        r.value = (relations[0].value as Array2D<number>)[0][0];
                    }
                    return r;
                });
                cSoilmodel.updateLayer(cLayer);
                return saveSoilmodel(
                    model, cSoilmodel.toObject(), onEachTask, onSuccess, true, false,
                    commands, task
                );
            }

            dropData(relations[0].value).then((file) => {
                cLayer.relations = cLayer.relations.map((r) => {
                    if (r.id === relations[0].id) {
                        r.data.file = file;
                        r.data.data = Array.isArray(relations[0].value) ? relations[0].value : undefined;
                        r.value = undefined;
                    }
                    return r;
                });
                cSoilmodel.updateLayer(cLayer);

                return saveSoilmodel(
                    model, cSoilmodel.toObject(), onEachTask, onSuccess, true, false,
                    commands, task
                );
            });
            return;
        }
    }

    if (saveLayers) {
        cSoilmodel.layersCollection.all.forEach((uLayer) => {
            const clonedLayer = cloneDeep(uLayer);
            commands.push(
                ModflowModelCommand.updateLayer(
                    {
                        id: model.id,
                        layer: {
                            ...clonedLayer,
                            parameters: clonedLayer.parameters.map((p) => {
                                p.data = {
                                    file: p.data.file
                                };
                                p.value = Array.isArray(p.value) ? undefined : p.value;
                                return p;
                            }),
                            relations: clonedLayer.relations.map((r) => {
                                r.data = {
                                    file: r.data.file
                                };
                                r.value = Array.isArray(r.value) ? undefined : r.value;
                                return r;
                            })
                        }
                    }
                )
            );
        });
    }

    const command = commands.shift();
    if (command) {
        return sendCommand(command, () => {
            return saveSoilmodel(model, cSoilmodel.toObject(), onEachTask, onSuccess, false, false, commands, task);
        }, (error) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            console.error(error);
        });
    }

    return onSuccess(cSoilmodel.toObject(), true);
};

export const fetchSoilmodel = (
    soilmodel: ISoilmodel,
    onEachTask: (result: { message: string, fetching: boolean }) => any,
    onFinished: (soilmodel: ISoilmodel) => any
) => {
    const layers = soilmodel.layers.filter((layer) =>
        layer.parameters.filter(
            (parameter) => parameter.data.file && !Array.isArray(parameter.data.data)).length > 0 ||
        layer.relations.filter((relation) => relation.data.file && !Array.isArray(relation.data.data)).length > 0);

    if (layers.length > 0) {
        const layer = layers[0];
        const parameters = layer.parameters.filter(
            (parameter) => parameter.data.file && !Array.isArray(parameter.data.data)
        );
        if (parameters.length > 0) {
            const parameter = parameters[0];
            onEachTask({
                message: `Fetching parameter ${parameter.id} for layer ${layer.name}`,
                fetching: true
            });

            if (parameter.data.file) {
                FileData.fromFile(parameter.data.file).then((file) => {
                    soilmodel.layers = soilmodel.layers.map((l) => {
                        if (l.id === layer.id) {
                            l.parameters = l.parameters.map((p) => {
                                if (p.id === parameter.id) {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    p.data = file.toObject();
                                }
                                return p;
                            });
                        }
                        return l;
                    });
                    return fetchSoilmodel(soilmodel, onEachTask, onFinished);
                });
            }
            return;
        }
        const relations = layer.relations.filter(
            (relation) => relation.data.file && !Array.isArray(relation.data.data)
        );
        if (relations.length > 0) {
            const relation = relations[0];

            onEachTask({
                message: `Fetching relation ${relation.id} for layer ${layer.name}`,
                fetching: true
            });

            if (relation.data.file) {
                FileData.fromFile(relation.data.file).then((file) => {
                    soilmodel.layers = soilmodel.layers.map((l) => {
                        if (l.id === layer.id) {
                            l.relations = l.relations.map((r) => {
                                if (r.id === relation.id) {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    r.data = file.toObject();
                                }
                                return r;
                            });
                        }
                        return l;
                    });
                    return fetchSoilmodel(soilmodel, onEachTask, onFinished);
                });
            }
            return;
        }
    }

    onEachTask({
        message: `Fetching finished.`,
        fetching: false
    });

    return onFinished(soilmodel);
};
