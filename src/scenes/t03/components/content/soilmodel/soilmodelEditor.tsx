import {cloneDeep} from 'lodash';
import React, {MouseEvent, SyntheticEvent, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {
    Button,
    Dimmer,
    Dropdown,
    DropdownProps,
    Grid,
    Header,
    Menu,
    MenuItemProps,
    Progress,
    Segment
} from 'semantic-ui-react';
import Uuid from 'uuid';
import {ModflowModel} from '../../../../../core/model/modflow';
import {Soilmodel, SoilmodelLayer} from '../../../../../core/model/modflow/soilmodel';
import {Zone, ZonesCollection} from '../../../../../core/model/modflow/soilmodel';
import LayerParameterZonesCollection from '../../../../../core/model/modflow/soilmodel/LayerParameterZonesCollection';
import {ISoilmodelLayer} from '../../../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import {IZone} from '../../../../../core/model/modflow/soilmodel/Zone.type';
import {sendCommand} from '../../../../../services/api';
import {sendCommands} from '../../../../../services/api/commandHelper';
import NoContent from '../../../../shared/complexTools/noContent';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {usePrevious} from '../../../../shared/simpleTools/helpers/customHooks';
import {
    addLayer, addZone, removeLayer, removeZone, updateLayer, updateSoilmodel, updateZone
} from '../../../actions/actions';
import Command from '../../../commands/modflowModelCommand';
import {
    basParameters,
    defaultSoilmodelLayer,
    modpathParameters,
    soilmodelParameters
} from '../../../defaults/soilmodel';
import {saveLayer} from './fileDropper';
import LayerDetails from './layerDetails';
import LayersList from './layersList';
import {CreateZoneModal, ZoneDetails} from './zones';
import ZonesList from './zonesList';

const baseUrl = '/tools/T03';

enum nav {
    LAYERS = 'layers',
    ZONES = 'zones'
}

interface IOwnProps {
    history: any;
    location: any;
    match: any;
    readOnly: boolean;
    fetchSoilmodel: (id: string) => any;
}

interface IStateProps {
    model: ModflowModel;
    soilmodel: Soilmodel;
}

interface IDispatchProps {
    addLayer: (layer: SoilmodelLayer) => any;
    removeLayer: (layerId: string) => any;
    updateLayer: (layer: SoilmodelLayer) => any;
    addZone: (zone: Zone) => any;
    removeZone: (zoneId: string) => any;
    updateSoilmodel: (soilmodel: Soilmodel) => any;
    updateZone: (zone: Zone) => any;
}

type IProps = IStateProps & IDispatchProps & IOwnProps;

const soilmodelEditor = (props: IProps) => {
    const [createZoneModal, setCreateZoneModal] = useState<boolean>(false);
    const [selectedLayer, setSelectedLayer] = useState<ISoilmodelLayer | null>(null);
    const [selectedZone, setSelectedZone] = useState<IZone | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [pageNotFound, setPageNotFound] = useState<boolean>(false);

    const [calculationState, setCalculationState] = useState<{
        message: string;
        task: number;
    }>({
        message: 'Start Fetching ...',
        task: 0
    });
    const [numberOfTasks, setNumberOfTasks] = useState<number>(0);

    const {soilmodel} = props;
    const {id, pid, property, type} = props.match.params;

    const prevPid = usePrevious(props.match.params.pid);

    const searchParams = new URLSearchParams(props.location.search);
    const activeParamType = searchParams.get('type') || 'soilmodel';
    const activeParam = searchParams.get('param') || 'properties';

    const fZones = props.soilmodel.zonesCollection.all.filter((z) => !z.isDefault);
    const defaultZone = soilmodel.zonesCollection.findFirstBy('isDefault', true);

    if (!defaultZone) {
        throw new Error('There is no default zone.');
    }

    useEffect(() => {
        if (pid && type === nav.LAYERS && activeParam === 'top' && selectedLayer && selectedLayer.number !== 0) {
            return props.history.push(
                `${baseUrl}/${id}/${property}/layers/${pid}?type=${activeParamType}&param=botm`
            );
        }
    }, [selectedLayer]);

    useEffect(() => {
        const sLayer = props.soilmodel.layersCollection.findById(pid);
        if (selectedLayer) {
            setSelectedLayer(sLayer);
        }

        if (pid && pid !== prevPid) {
            fetch(pid);
        }
        redirect();
    }, [props.match.params, props.soilmodel]);

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
            return props.history.push(`${baseUrl}/${id}/${property}/${type}/${soilmodel.layersCollection.first.id}`);
        }
        if (pid && type === nav.ZONES && !soilmodel.zonesCollection.findFirstBy('id', pid)) {
            if (fZones.length > 0) {
                return props.history.push(`${baseUrl}/${id}/${property}/${type}/${fZones[0].id}`);
            }
            return props.history.push(`${baseUrl}/${id}/${property}/zones`);
        }

        if (pid) {
            return null;
        }

        if (type === nav.ZONES) {
            if (fZones.length > 0) {
                return props.history.push(`${baseUrl}/${id}/${property}/${type}/${fZones[0].id}`);
            }
        }
        return null;
    };

    const fetch = (iId: string) => {
        if (type === nav.LAYERS) {
            const cLayer = props.soilmodel.layersCollection.findById(iId);
            return setSelectedLayer(cLayer);
        }
        if (type === nav.ZONES) {
            return setSelectedZone(soilmodel.zonesCollection.findById(iId));
        }
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
                id: props.model.id,
                layer_id: layerId
            })
        );

        commands.push(
            Command.updateSoilmodelProperties({
                id: props.model.id,
                properties
            })
        );

        sendCommands(commands, () => {
                props.removeLayer(layerId);
                setIsLoading(false);
            }, () => setIsError(true)
        );
    };

    const handleAddLayer = (layer: SoilmodelLayer) => {
        const commands = [];
        setIsLoading(true);

        commands.push(
            Command.addLayer(
                props.model.id,
                layer
            )
        );

        sendCommands(commands, () => {
                props.addLayer(layer);
                setIsLoading(false);
                props.history.push(`${baseUrl}/${id}/${property}/${type || 'layers'}/${layer.id}`);
            },
            () => setIsError(true)
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
            return setCreateZoneModal(true);
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
                id: props.model.id,
                properties: {
                    ...props.soilmodel.toObject().properties,
                    zones: cZones.all
                }
            }), () => {
                props.addZone(zone);
                setIsLoading(false);
                props.history.push(`${baseUrl}/${id}/${property}/zones/${zone.id}`);
            }
        );
    };

    const handleCancelModals = () => {
        setCreateZoneModal(false);
    };

    const handleChangeLayer = (layer: SoilmodelLayer) => {
        setIsDirty(true);
        return setSelectedLayer(layer.toObject());
    };

    const handleChangeTab = (e: MouseEvent<Element>, data: MenuItemProps) => {
        if (data.name) {
            return props.history.push(
                `${baseUrl}/${id}/${property}/layers/${pid}?type=${activeParamType}&param=${data.name}`
            );
        }
        return props.history.push(`${baseUrl}/${id}/${property}/layers/${pid}`);
    };

    const handleChangeZone = (zone: Zone) => {
        setIsDirty(true);
        setSelectedZone(zone.toObject());
    };

    const handleClickItem = (iId: string) => {
        if (type === nav.LAYERS && iId !== pid) {
            props.history.push(
                `${baseUrl}/${id}/${property}/layers/${iId}?type=${activeParamType}&param=${activeParam}`
            );
        }
        if (type === nav.ZONES && iId !== pid) {
            props.history.push(`${baseUrl}/${id}/${property}/zones/${iId}`);
        }
    };

    const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, {value}: MenuItemProps) => {
        if (value === nav.LAYERS && type !== 'layers') {
            return props.history.push(`${baseUrl}/${id}/${property}/layers/${soilmodel.layersCollection.first.id}`);
        }
        if (value === nav.ZONES && type !== 'zones') {
            if (fZones.length > 0) {
                return props.history.push(`${baseUrl}/${id}/${property}/zones/${fZones[0].id}`);
            }
            return props.history.push(`${baseUrl}/${id}/${property}/zones`);
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
                    id: props.model.id,
                    properties: {
                        ...props.soilmodel.toObject().properties,
                        zones: cZones.all
                    }
                }), () => {
                    props.removeZone(rId);
                    setIsLoading(false);
                }
            );
        }
    };

    const handleSave = () => {
        const cZones = soilmodel.zonesCollection;
        if (selectedZone && type === nav.ZONES) {
            cZones.update(selectedZone);
            props.updateZone(Zone.fromObject(selectedZone));

            setIsLoading(true);
            return sendCommand(
                Command.updateSoilmodelProperties({
                    id: props.model.id,
                    properties: {
                        ...props.soilmodel.toObject().properties,
                        zones: cZones.all
                    }
                }), () => {
                    setIsLoading(false);
                    return setIsDirty(false);
                }
            );
        }

        if (selectedLayer && type === nav.LAYERS) {
            setNumberOfTasks(
                selectedLayer.parameters.filter((p) => Array.isArray(p.value)).length +
                selectedLayer.relations.filter((r) => Array.isArray(r.value)).length
            );

            return saveLayer(selectedLayer, props.model.toObject(), false, 0,
                (state) => {
                    setCalculationState(state);
                },
                (layer) => {
                    return sendCommand(
                        Command.updateLayer({
                            id: props.model.id,
                            layer
                        }), () => {
                            setIsDirty(false);
                            return props.fetchSoilmodel(props.model.id);
                        }
                    );
                }
            );
        }
    };

    const handleChangeParameterSet = (e: SyntheticEvent<HTMLElement>, {value}: DropdownProps) => props.history.push(
        `${baseUrl}/${id}/${property}/layers/${pid}?type=${value}`
    );

    const {readOnly} = props.model;

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

    console.log({isDirty});

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
                            isDirty={isDirty}
                            isError={isError}
                            visible={!readOnly}
                            save={true}
                            onSave={handleSave}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Menu secondary={true} fluid={true} widths={2}>
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
                        {false &&
                            <Dropdown
                                placeholder="Select parameter set"
                                fluid={true}
                                selection={true}
                                onChange={handleChangeParameterSet}
                                options={[
                                    {key: 'soilmodel', text: 'Soilmodel', value: 'soilmodel'},
                                    {key: 'bas', text: 'Basic', value: 'bas'},
                                    {key: 'modpath', text: 'Modpath', value: 'modpath'}
                                ]}
                                value={activeParamType}
                            />
                        }
                        <br/>
                        {type === nav.LAYERS &&
                        <LayersList
                            onClick={handleClickItem}
                            onClone={handleCloneItem}
                            onRemove={handleRemoveItem}
                            layers={props.soilmodel.layersCollection}
                            readOnly={readOnly}
                            selected={pid}
                        />
                        }
                        {type === nav.ZONES &&
                        <ZonesList
                            layers={props.soilmodel.layersCollection}
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
                            onChange={handleChangeLayer}
                            onChangeTab={handleChangeTab}
                            parameters={getParameters(activeParamType)}
                            model={props.model}
                            layer={SoilmodelLayer.fromObject(selectedLayer)}
                            readOnly={readOnly}
                            soilmodel={soilmodel}
                        />
                        }
                        {!isLoading && type === nav.ZONES && selectedZone &&
                        <ZoneDetails
                            onChange={handleChangeZone}
                            model={props.model}
                            layers={props.soilmodel.layersCollection}
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
                onCancel={handleCancelModals}
                onChange={handleAddZone}
                boundingBox={props.model.boundingBox}
                gridSize={props.model.gridSize}
                zones={soilmodel.zonesCollection}
            />
            }
        </Segment>
    );
};

const mapStateToProps = (state: any) => {
    return ({
        model: ModflowModel.fromObject(state.T03.model),
        soilmodel: Soilmodel.fromObject(state.T03.soilmodel)
    });
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    addLayer: (layer: SoilmodelLayer) => dispatch(addLayer(layer)),
    removeLayer: (layerId: string) => dispatch(removeLayer(layerId)),
    updateSoilmodel: (soilmodel: Soilmodel) => dispatch(updateSoilmodel(soilmodel)),
    updateLayer: (layer: SoilmodelLayer) => dispatch(updateLayer(layer)),
    addZone: (zone: Zone) => dispatch(addZone(zone)),
    removeZone: (zoneId: string) => dispatch(removeZone(zoneId)),
    updateZone: (zone: Zone) => dispatch(updateZone(zone)),
});

export default withRouter(connect<IStateProps, IDispatchProps, IOwnProps>(
    mapStateToProps,
    mapDispatchToProps)
(soilmodelEditor));
