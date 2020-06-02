import {cloneDeep} from 'lodash';
import React, {MouseEvent, SyntheticEvent, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useLocation, useParams} from 'react-router-dom';
import {
    Button,
    Dimmer,
    Divider,
    Dropdown,
    DropdownProps,
    Grid,
    Header,
    Menu,
    MenuItemProps,
    Message,
    Progress,
    Segment
} from 'semantic-ui-react';
import Uuid from 'uuid';
import {EMessageState, IMessage} from '../../../../../core/model/messages/Message.type';
import MessagesCollection from '../../../../../core/model/messages/MessagesCollection';
import {ModflowModel} from '../../../../../core/model/modflow';
import BoundaryCollection from '../../../../../core/model/modflow/boundaries/BoundaryCollection';
import {Soilmodel, SoilmodelLayer, Zone, ZonesCollection} from '../../../../../core/model/modflow/soilmodel';
import LayerParameterZonesCollection from '../../../../../core/model/modflow/soilmodel/LayerParameterZonesCollection';
import {ISoilmodelLayer} from '../../../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import {saveLayer} from '../../../../../core/model/modflow/soilmodel/updater/services';
import {IZone} from '../../../../../core/model/modflow/soilmodel/Zone.type';
import {IRootReducer} from '../../../../../reducers';
import {sendCommand} from '../../../../../services/api';
import {sendCommands} from '../../../../../services/api/commandHelper';
import NoContent from '../../../../shared/complexTools/noContent';
import ContentToolBar from '../../../../shared/ContentToolbar2';
import {usePrevious} from '../../../../shared/simpleTools/helpers/customHooks';
import {
    addLayer,
    addMessage,
    addZone,
    removeLayer, removeMessage,
    removeZone,
    updateLayer,
    updateMessage,
    updateZone
} from '../../../actions/actions';
import Command from '../../../commands/modflowModelCommand';
import {messageDirty, messageError, messageSaving} from '../../../defaults/messages';
import {
    basParameters,
    defaultSoilmodelLayer,
    modpathParameters,
    soilmodelParameters
} from '../../../defaults/soilmodel';
import LayerDetails from './layerDetails';
import LayersList from './layersList';
import {CreateZoneModal, ZoneDetails} from './zones';
import CreateZone from './zones/createZone';
import ZonesList from './zonesList';

const baseUrl = '/tools/T03';

enum nav {
    LAYERS = 'layers',
    NEW_ZONE = 'zone',
    ZONES = 'zones'
}

const soilmodelEditor = () => {
    const [createZoneModal, setCreateZoneModal] = useState<boolean>(false);
    const [selectedLayer, setSelectedLayer] = useState<ISoilmodelLayer | null>(null);
    const [selectedZone, setSelectedZone] = useState<IZone | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pageNotFound, setPageNotFound] = useState<boolean>(false);

    const [calculationState, setCalculationState] = useState<{
        message: string;
        task: number;
    }>({
        message: 'Start Fetching ...',
        task: 0
    });
    const [numberOfTasks, setNumberOfTasks] = useState<number>(0);

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
    const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
    const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;
    const messages = MessagesCollection.fromObject(T03.messages);

    const layerRef = useRef<ISoilmodelLayer>();
    const zoneRef = useRef<IZone>();
    const editingState = useRef<{ [key: string]: IMessage | null }>({
        dirty: null,
        saving: null
    });

    if (!boundaries || !model || !soilmodel) {
        return (
            <Segment color={'grey'} loading={true}/>
        );
    }

    const {id, pid, property, type} = useParams();

    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const prevPid = usePrevious(pid);

    const searchParams = new URLSearchParams(location.search);
    const activeParamType = searchParams.get('type') || 'soilmodel';
    const activeParam = searchParams.get('param') || 'properties';

    const fZones = soilmodel.zonesCollection.all.filter((z) => !z.isDefault);
    const defaultZone = soilmodel.zonesCollection.findFirstBy('isDefault', true);

    if (!defaultZone) {
        return (
            <Message error={true}>
                The model you requested is not compatible with the current version. Contact an administrator or
                create a new model.
            </Message>
        );
    }

    useEffect(() => {
        return function cleanup() {
            handleSave();
        };
    }, []);

    useEffect(() => {
        editingState.current = messages.getEditingState('soilmodel');
        if (selectedLayer) {
            layerRef.current = selectedLayer;
        }
        if (selectedZone) {
            zoneRef.current = selectedZone;
        }
    }, [messages, selectedLayer, selectedZone]);

    useEffect(() => {
        if (pid && pid !== prevPid) {
            if (type === nav.LAYERS) {
                const cLayer = soilmodel.layersCollection.findById(pid);
                return setSelectedLayer(cLayer);
            }
            if (type === nav.ZONES) {
                return setSelectedZone(soilmodel.zonesCollection.findById(pid));
            }
        }
        redirect();
    }, [pid, soilmodel]);

    useEffect(() => {
        const paramType = searchParams.get('type');
        if (paramType && !['soilmodel', 'bas', 'modpath'].includes(paramType)) {
            return setPageNotFound(true);
        }
        const param = searchParams.get('param');
        if (param && paramType && param !== 'properties' &&
            getParameters(paramType).filter((p) => p.name === param).length === 0) {
            return setPageNotFound(true);
        }
    }, [searchParams]);

    const redirect = () => {
        if (type === nav.LAYERS && (!pid || (pid && !soilmodel.layersCollection.findFirstBy('id', pid)))) {
            return history.push(`${baseUrl}/${id}/${property}/${type}/${soilmodel.layersCollection.first.id}`);
        }
        if (pid && type === nav.ZONES && !soilmodel.zonesCollection.findFirstBy('id', pid)) {
            if (fZones.length > 0) {
                return history.push(`${baseUrl}/${id}/${property}/${type}/${fZones[0].id}`);
            }
            return history.push(`${baseUrl}/${id}/${property}/${nav.ZONES}`);
        }

        if (pid) {
            return null;
        }

        if (type === nav.ZONES) {
            if (fZones.length > 0) {
                return history.push(`${baseUrl}/${id}/${property}/${type}/${fZones[0].id}`);
            }
            if (fZones.length === 0) {
                return history.push(`${baseUrl}/${id}/${property}/${nav.NEW_ZONE}`);
            }
        }
        return null;
    };

    const getParameters = (paramType: string) => {
        switch (paramType) {
            case 'bas':
                return basParameters;
            case 'modpath':
                return modpathParameters;
            default:
                return soilmodelParameters;
        }
    };

    const handleRemoveLayer = (layerId: string) => {
        const commands = [];

        const properties = {
            ...soilmodel.toObject().properties
        };

        commands.push(
            Command.removeLayer({
                id: model.id,
                layer_id: layerId
            })
        );

        commands.push(
            Command.updateSoilmodelProperties({
                id: model.id,
                properties
            })
        );

        sendCommands(commands, () => {
                dispatch(removeLayer(layerId));
                setIsLoading(false);
            }, (e) => dispatch(addMessage(messageError('soilmodel', e)))
        );
    };

    const handleAddLayer = (layer: SoilmodelLayer) => {
        const commands = [];
        setIsLoading(true);

        commands.push(
            Command.addLayer(
                model.id,
                layer
            )
        );

        sendCommands(commands, () => {
                dispatch(addLayer(layer));
                setIsLoading(false);
                history.push(`${baseUrl}/${id}/${property}/${type || 'layers'}/${layer.id}`);
            },
            (e) => dispatch(addMessage(messageError('soilmodel', e)))
        );
    };

    const handleClickAddItem = () => {
        if (type === nav.LAYERS) {
            const lc = soilmodel.layersCollection;

            const layer = new SoilmodelLayer(defaultSoilmodelLayer);
            layer.id = Uuid.v4();
            layer.name = 'New Layer';
            layer.number = lc.length > 0 ? lc.orderBy('number', 'desc').first.number + 1 : 1;

            soilmodel.parametersCollection.findBy('parameter', 'top', false).forEach((p) => {
                layer.addRelation({
                    data: {
                        file: null
                    },
                    id: Uuid.v4(),
                    parameter: p.id,
                    priority: 0,
                    value: p.defaultValue,
                    zoneId: defaultZone.id
                });
            });

            return handleAddLayer(layer);
        }

        if (type === nav.ZONES) {
            return history.push(`${baseUrl}/${id}/${property}/${nav.NEW_ZONE}`);
        }
    };

    const handleCloneItem = (item: SoilmodelLayer | Zone) => {
        setIsLoading(true);

        if (type === nav.LAYERS && item instanceof SoilmodelLayer) {
            const newLayer = cloneDeep(item);
            newLayer.id = Uuid.v4();
            newLayer.name = item.name + ' (clone)';
            newLayer.number = soilmodel.layersCollection.length > 0 ?
                soilmodel.layersCollection.orderBy('number', 'desc').first.number + 1 : 1;
            newLayer.parameters = item.parameters.filter((p) => p.id !== 'top');

            const newRelations = item.relations.all.filter((r) =>
                r.parameter !== 'top').map((r) => {
                r.id = Uuid.v4();
                return r;
            });
            newLayer.relations = LayerParameterZonesCollection.fromObject(newRelations);

            return handleAddLayer(newLayer);
        }

        if (type === nav.ZONES && item instanceof Zone) {
            const newZone = cloneDeep(item);
            newZone.id = Uuid.v4();
            newZone.name = newZone.name + ' (clone)';
            return handleAddZone(newZone);
        }
    };

    const handleAddZone = (zone: Zone) => {
        const cZones = soilmodel.zonesCollection.add(zone.toObject());
        setCreateZoneModal(false);
        setIsLoading(true);
        return sendCommand(
            Command.updateSoilmodelProperties({
                id: model.id,
                properties: {
                    ...soilmodel.toObject().properties,
                    zones: cZones.all
                }
            }), () => {
                dispatch(addZone(zone));
                setIsLoading(false);
                history.push(`${baseUrl}/${id}/${property}/zones/${zone.id}`);
            }
        );
    };

    const handleCancelModals = () => {
        setCreateZoneModal(false);
    };

    const handleChangeLayer = (layer: SoilmodelLayer) => {
        if (!editingState.current.dirty) {
            dispatch(addMessage(messageDirty('soilmodel')));
        }
        return setSelectedLayer(layer.toObject());
    };

    const handleChangeTab = (e: MouseEvent<Element>, data: MenuItemProps) => {
        if (data.name) {
            return history.push(
                `${baseUrl}/${id}/${property}/layers/${pid}?type=${activeParamType}&param=${data.name}`
            );
        }
        return history.push(`${baseUrl}/${id}/${property}/layers/${pid}`);
    };

    const handleChangeZone = (zone: Zone) => {
        if (!editingState.current.dirty) {
            dispatch(addMessage(messageDirty('soilmodel')));
        }
        setSelectedZone(zone.toObject());
    };

    const handleClickItem = (iId: string) => {
        if (type === nav.LAYERS && iId !== pid) {
            handleSave();
            history.push(
                `${baseUrl}/${id}/${property}/layers/${iId}?type=${activeParamType}&param=${activeParam}`
            );
        }
        if (type === nav.ZONES && iId !== pid) {
            handleSave();
            history.push(`${baseUrl}/${id}/${property}/zones/${iId}`);
        }
    };

    const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, {value}: MenuItemProps) => {
        if (value === nav.LAYERS && type !== 'layers') {
            handleSave();
            return history.push(`${baseUrl}/${id}/${property}/layers/${soilmodel.layersCollection.first.id}`);
        }
        if (value === nav.ZONES && type !== 'zones') {
            handleSave();
            if (fZones.length > 0) {
                return history.push(`${baseUrl}/${id}/${property}/zones/${fZones[0].id}`);
            }
            return history.push(`${baseUrl}/${id}/${property}/zone`);
        }
    };

    const handleRemoveItem = (rId: string) => {
        if (type === nav.LAYERS) {
            setIsLoading(true);
            handleRemoveLayer(rId);
        }
        if (type === nav.ZONES) {
            setIsLoading(true);
            const cZones = soilmodel.zonesCollection.removeById(rId);
            return sendCommand(
                Command.updateSoilmodelProperties({
                    id: model.id,
                    properties: {
                        ...soilmodel.toObject().properties,
                        zones: cZones.all
                    }
                }), () => {
                    dispatch(removeZone(rId));
                    setIsLoading(false);
                }
            );
        }
    };

    const handleUndo = () => {
        if (!editingState.current.dirty) {
            return;
        }
        dispatch(removeMessage(editingState.current.dirty));
        if (pid) {
            if (type === nav.LAYERS) {
                const cLayer = soilmodel.layersCollection.findById(pid);
                return setSelectedLayer(cLayer);
            }
            if (type === nav.ZONES) {
                return setSelectedZone(soilmodel.zonesCollection.findById(pid));
            }
        }
    };

    const handleSave = () => {
        if (!editingState.current.dirty) {
            return;
        }
        const message = messageSaving('soilmodel');
        dispatch(addMessage(message));
        const cZones = soilmodel.zonesCollection;
        if (zoneRef.current && type === nav.ZONES) {
            cZones.update(zoneRef.current);
            dispatch(updateZone(Zone.fromObject(zoneRef.current)));

            setIsLoading(true);
            return sendCommand(
                Command.updateSoilmodelProperties({
                    id: model.id,
                    properties: {
                        ...soilmodel.toObject().properties,
                        zones: cZones.all
                    }
                }), () => {
                    setIsLoading(false);
                    if (editingState.current.dirty) {
                        dispatch(removeMessage(editingState.current.dirty));
                    }
                    return dispatch(updateMessage({...message, state: EMessageState.SUCCESS}));
                }
            );
        }

        if (layerRef.current && type === nav.LAYERS) {
            setNumberOfTasks(
                layerRef.current.parameters.filter((p) => Array.isArray(p.value)).length +
                layerRef.current.relations.filter((r) => Array.isArray(r.value)).length
            );

            return saveLayer(layerRef.current, model.toObject(), false, 0,
                (state) => {
                    setCalculationState(state);
                },
                (layer) => {
                    dispatch(updateLayer(SoilmodelLayer.fromObject(layer)));
                    if (editingState.current.dirty) {
                        dispatch(removeMessage(editingState.current.dirty));
                    }
                    return dispatch(updateMessage({...message, state: EMessageState.SUCCESS}));
                }
            );
        }
    };

    const handleChangeParameterSet = (e: SyntheticEvent<HTMLElement>, {value}: DropdownProps) => history.push(
        `${baseUrl}/${id}/${property}/layers/${pid}?type=${value}`
    );

    const {readOnly} = model;

    if (pageNotFound) {
        return (
            <Segment color={'grey'}>
                404 - Page not found
            </Segment>
        );
    }

    if (numberOfTasks > calculationState.task) {
        const progress = numberOfTasks === 0 ? 0 : Math.floor(calculationState.task / numberOfTasks * 100);
        return (
            <Dimmer active={true} page={true}>
                <Header as="h2" icon={true} inverted={true}>
                    {calculationState.message}
                </Header>
                <Progress percent={progress} indicating={true} progress={true}/>
            </Dimmer>
        );
    }

    if (!isLoading && type === nav.NEW_ZONE) {
        return (
            <CreateZone/>
        );
    }

    return (
        <Segment color={'grey'} loading={isLoading}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Button
                            fluid={true}
                            positive={true}
                            icon="plus"
                            labelPosition="left"
                            onClick={handleClickAddItem}
                            content={type === nav.LAYERS ? 'Add Layer' : 'Add Zone'}
                            disabled={readOnly}
                        />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <ContentToolBar
                            buttonSave={true}
                            onSave={handleSave}
                            onUndo={handleUndo}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Menu tabular={true} fluid={true} widths={2}>
                            <Menu.Item
                                name="Layers"
                                value={nav.LAYERS}
                                active={type === nav.LAYERS}
                                onClick={handleNavClick}
                            />
                            <Menu.Item
                                name="Zones"
                                value={nav.ZONES}
                                active={type === nav.ZONES}
                                onClick={handleNavClick}
                            />
                        </Menu>
                        {type === nav.LAYERS &&
                        <div>
                            <Dropdown
                                placeholder="Select parameter set"
                                fluid={true}
                                selection={true}
                                onChange={handleChangeParameterSet}
                                options={[
                                    {key: 'soilmodel', text: 'Layer Parameters', value: 'soilmodel'},
                                    {key: 'bas', text: 'Basic Layer Properties', value: 'bas'},
                                    // {key: 'modpath', text: 'Modpath', value: 'modpath'}
                                ]}
                                value={activeParamType}
                            />
                            <Divider hidden={true}/>
                            <LayersList
                                onClick={handleClickItem}
                                onClone={handleCloneItem}
                                onRemove={handleRemoveItem}
                                layers={soilmodel.layersCollection}
                                readOnly={readOnly}
                                selected={pid}
                            />
                        </div>
                        }
                        {type === nav.ZONES &&
                        <ZonesList
                            layers={soilmodel.layersCollection}
                            onClick={handleClickItem}
                            onClone={handleCloneItem}
                            onRemove={handleRemoveItem}
                            zones={ZonesCollection.fromObject(fZones)}
                            readOnly={readOnly}
                            selected={pid}
                        />
                        }
                    </Grid.Column>
                    <Grid.Column width={12}>
                        {!isLoading && type === nav.LAYERS && selectedLayer &&
                        <LayerDetails
                            activeParam={activeParam}
                            boundaries={boundaries}
                            onChange={handleChangeLayer}
                            onChangeTab={handleChangeTab}
                            parameters={getParameters(activeParamType)}
                            model={model}
                            layer={SoilmodelLayer.fromObject(selectedLayer)}
                            readOnly={readOnly}
                            soilmodel={soilmodel}
                        />
                        }
                        {!isLoading && type === nav.ZONES && selectedZone &&
                        <ZoneDetails
                            boundaries={boundaries}
                            onChange={handleChangeZone}
                            model={model}
                            layers={soilmodel.layersCollection}
                            zone={Zone.fromObject(selectedZone)}
                            zones={soilmodel.zonesCollection}
                        />
                        }
                        {((type === nav.ZONES && !selectedZone) || (type === nav.LAYERS && !selectedLayer)) &&
                        <NoContent message={'No objects.'}/>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {createZoneModal && !readOnly &&
            <CreateZoneModal
                boundaries={boundaries}
                onCancel={handleCancelModals}
                onChange={handleAddZone}
                model={model}
                zones={soilmodel.zonesCollection}
            />
            }
        </Segment>
    );
};

export default soilmodelEditor;
