import {cloneDeep} from 'lodash';
import React, {MouseEvent, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';
import {Button, Grid, Menu, MenuItemProps, Segment} from 'semantic-ui-react';
import Uuid from 'uuid';
import {Zone, ZonesCollection} from '../../../../../core/model/gis';
import {ILayerParameterZone} from '../../../../../core/model/gis/LayerParameterZone.type';
import LayerParameterZonesCollection from '../../../../../core/model/gis/LayerParameterZonesCollection';
import {IZone} from '../../../../../core/model/gis/Zone.type';
import {ModflowModel} from '../../../../../core/model/modflow';
import {Soilmodel, SoilmodelLayer} from '../../../../../core/model/modflow/soilmodel';
import {ISoilmodelLayer} from '../../../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import {sendCommand} from '../../../../../services/api';
import {sendCommands} from '../../../../../services/api/commandHelper';
import NoContent from '../../../../shared/complexTools/noContent';
import ContentToolBar from '../../../../shared/ContentToolbar';
import {CreateZoneModal, ZoneDetails} from '../../../../shared/zones';
import {
    addLayer, addZone,
    cloneLayer, cloneZone,
    removeLayer,
    removeZone,
    updateLayer,
    updateSoilmodel, updateSoilmodelRelations, updateZone
} from '../../../actions/actions';
import Command from '../../../commands/modflowModelCommand';
import {defaultSoilmodelLayer, modpathParameters, soilmodelParameters} from '../../../defaults/soilmodel';
import LayerDetails from './layerDetails';
import LayersImport from './layersImport';
import LayersList from './layersList';
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
    soilmodel: Soilmodel;
}

interface IStateProps {
    model: ModflowModel;
}

interface IDispatchProps {
    addLayer: (layer: SoilmodelLayer) => any;
    cloneLayer: (layer: SoilmodelLayer) => any;
    removeLayer: (layerId: string) => any;
    updateSoilmodel: (soilmodel: Soilmodel) => any;
    updateSoilmodelRelations: (relations: LayerParameterZonesCollection) => any;
    updateLayer: (layer: SoilmodelLayer) => any;
    addZone: (zone: Zone) => any;
    removeZone: (zoneId: string) => any;
    cloneZone: (zone: Zone) => any;
    updateZone: (zone: Zone) => any;
}

type IProps = IStateProps & IDispatchProps & IOwnProps;

const soilmodelEditor = (props: IProps) => {
    const [createZoneModal, setCreateZoneModal] = useState<boolean>(false);
    const [relations, setRelations] = useState<ILayerParameterZone[]>(props.soilmodel.relationsCollection.toObject());
    const [selectedLayer, setSelectedLayer] = useState<ISoilmodelLayer | null>(null);
    const [selectedZone, setSelectedZone] = useState<IZone | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [pageNotFound, setPageNotFound] = useState<boolean>(false);

    const {soilmodel} = props;
    const {id, pid, property, type} = props.match.params;
    const searchParams = new URLSearchParams(props.location.search);
    const activeParamType = searchParams.get('type') || 'soilmodel';
    const activeParam = searchParams.get('param') || 'properties';

    const defaultRelation = props.soilmodel.relationsCollection.findFirstBy('priority', 0);

    if (!defaultRelation) {
        throw new Error('There is no default relation.');
    }

    const fZones = props.soilmodel.zonesCollection.all.filter((z) => z.id !== defaultRelation.zoneId);
    const firstZone = soilmodel.zonesCollection.findFirstBy('id', defaultRelation.zoneId, false);

    useEffect(() => {
        if (pid) {
            fetch(pid);
        }
    }, []);

    useEffect(() => {
        if (pid) {
            fetch(pid);
        }
    }, [props.match.params, props.soilmodel]);

    useEffect(() => {
        const paramType = searchParams.get('type');
        if (paramType && !['soilmodel', 'modpath'].includes(paramType)) {
            return setPageNotFound(true);
        }
        const param = searchParams.get('param');
        if (param && paramType && param !== 'properties' &&
            getParameters(paramType).filter((p) => p.name === param).length === 0) {
            return setPageNotFound(true);
        }
    }, [searchParams]);

    const fetch = (iId: string) => {
        if (type === nav.LAYERS) {
            setRelations(soilmodel.relationsCollection.all);
            return setSelectedLayer(soilmodel.layersCollection.findById(iId) as ISoilmodelLayer);
        }
        if (type === nav.ZONES) {
            return setSelectedZone(soilmodel.zonesCollection.findById(iId));
        }
    };

    const getParameters = (paramType: string) => {
        switch (paramType) {
            case 'modpath':
                return modpathParameters;
            default:
                return soilmodelParameters;
        }
    };

    const handleRemoveLayer = (layerId: string) => {
        const commands = [];

        const cRelations = soilmodel.relationsCollection.findBy('layerId', layerId, false);
        const properties = {
            ...soilmodel.toObject().properties,
            relations: cRelations
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
                props.updateSoilmodelRelations(LayerParameterZonesCollection.fromObject(cRelations));
                setIsLoading(false);
            }, () => setIsError(true)
        );
    };

    const handleAddLayer = (layer: SoilmodelLayer, cRelations: LayerParameterZonesCollection) => {
        const commands = [];

        const properties = {
            ...soilmodel.toObject().properties,
            relations: cRelations.all
        };

        setIsLoading(true);

        commands.push(
            Command.updateSoilmodelProperties({
                id: props.model.id,
                properties
            })
        );

        commands.push(
            Command.addLayer(
                props.model.id,
                layer
            )
        );

        sendCommands(commands, () => {
                props.addLayer(layer);
                props.updateSoilmodelRelations(cRelations);
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

            const cRelations = soilmodel.relationsCollection;
            soilmodel.parametersCollection.findBy('parameter', 'top', false).forEach((p) => {
                cRelations.add({
                    id: Uuid.v4(),
                    layerId: layer.id,
                    parameter: p.id,
                    priority: 0,
                    value: p.defaultValue,
                    zoneId: defaultRelation.zoneId
                } as ILayerParameterZone);
            });

            return handleAddLayer(layer, cRelations);
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

            const newRelations = soilmodel.relationsCollection.all.filter((r) =>
                r.parameter !== 'top' && r.layerId === item.id).map((r) => {
                r.id = Uuid.v4();
                r.layerId = newLayer.id;
                return r;
            });

            const cRelations = soilmodel.relationsCollection;

            newRelations.forEach((r) => {
                cRelations.add(r);
            });

            return handleAddLayer(newLayer, cRelations);
        }

        if (type === nav.ZONES && item instanceof Zone) {
            const newZone = cloneDeep(item);
            newZone.id = Uuid.v4();
            newZone.name = newZone.name + ' (clone)';
            return handleAddZone(newZone);
        }
    };

    const handleImport = () => {
        console.log('HANDLE IMPORT');
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

    const handleChangeRelations = (iRelations: LayerParameterZonesCollection) => {
        setIsDirty(true);
        return setRelations(iRelations.toObject());
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
        if (type === nav.LAYERS) {
            props.history.push(
                `${baseUrl}/${id}/${property}/layers/${iId}?type=${activeParamType}&param=${activeParam}`
            );
        }
        if (type === nav.ZONES) {
            props.history.push(`${baseUrl}/${id}/${property}/zones/${iId}`);
        }
    };

    const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, {value}: MenuItemProps) => {
        let lid = '';
        if (value === nav.LAYERS) {
            lid = soilmodel.layersCollection.first.id;
            return props.history.push(`${baseUrl}/${id}/${property}/layers/${lid}`);
        }
        if (value === nav.ZONES) {
            if (soilmodel.zonesCollection.length > 1) {
                lid = firstZone ? firstZone.id : soilmodel.zonesCollection.first.id;
                return props.history.push(`${baseUrl}/${id}/${property}/zones/${lid}`);
            }
            return props.history.push(`${baseUrl}/${id}/${property}/zones`);
        }
        return props.history.push(`${baseUrl}/${id}/${property}/${value}`);
    };

    const handleRemoveItem = (rId: string) => {
        if (type === nav.LAYERS) {
            setIsLoading(true);
            handleRemoveLayer(rId);
        }
        if (type === nav.ZONES) {
            setIsLoading(true);
            const cRelations = soilmodel.relationsCollection.all.filter((r) => r.zoneId !== rId);
            const cZones = soilmodel.zonesCollection.removeById(rId);
            return sendCommand(
                Command.updateSoilmodelProperties({
                    id: props.model.id,
                    properties: {
                        ...props.soilmodel.toObject().properties,
                        relations: cRelations,
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
        }
        setIsLoading(true);
        return sendCommand(
            Command.updateSoilmodelProperties({
                id: props.model.id,
                properties: {
                    ...props.soilmodel.toObject().properties,
                    relations,
                    zones: cZones.all
                }
            }), () => {
                props.updateSoilmodelRelations(LayerParameterZonesCollection.fromObject(relations));
                if (selectedLayer && type === nav.LAYERS) {
                    const layer = SoilmodelLayer.fromObject(selectedLayer);

                    return sendCommand(
                        Command.updateLayer({
                            id: props.model.id,
                            layer_id: layer.id,
                            layer: layer.toObject()
                        }), () => {
                            props.updateLayer(layer);
                            setIsLoading(false);
                            return setIsDirty(false);
                        }
                    );
                }
                setIsLoading(false);
                return setIsDirty(false);
            }
        );

    };

    const redirect = () => {
        let lid = '';

        if (soilmodel.layersCollection.length === 0) {
            return;
        }

        // If no item is selected, redirect to the first ...
        if (!pid || !type) {
            // ... existing layer:
            if (type === nav.LAYERS || !type || !Object.values(nav).includes(type)) {
                lid = soilmodel.layersCollection.first.id;
                return <Redirect to={`${baseUrl}/${id}/${property}/layers/${lid}`}/>;
            }
            // ... existing zone:
            if (type === nav.ZONES && soilmodel.zonesCollection.length > 0 && firstZone) {
                lid = firstZone.id;
                return <Redirect to={`${baseUrl}/${id}/${property}/zones/${lid}`}/>;
            }
        }
        // If the active layer or zone id doesn't exist ...
        if (pid) {
            // ... redirect to the first existing layer:
            if (type === nav.LAYERS && !soilmodel.layersCollection.findFirstBy('id', pid)) {
                lid = soilmodel.layersCollection.first.id;
                return <Redirect to={`${baseUrl}/${id}/${property}/${type}/${lid}`}/>;
            }

            const nonDefaultZones = ZonesCollection.fromObject(
                soilmodel.zonesCollection.all.filter((z) => z.id !== defaultRelation.zoneId)
            );

            // ... redirect to the first existing zone ...
            if (type === nav.ZONES && !nonDefaultZones.findFirstBy('id', pid)) {
                // ... if there is one:
                if (nonDefaultZones.length > 0) {
                    lid = firstZone ? firstZone.id : soilmodel.zonesCollection.first.id;
                    return <Redirect to={`${baseUrl}/${id}/${property}/${type}/${lid}`}/>;
                }
                return <Redirect to={`${baseUrl}/${id}/${property}/zones`}/>;
            }
        }
        return null;
    };

    const {readOnly} = props.model;

    if (pageNotFound) {
        return (
            <Segment color={'grey'}>
                404 - Page not found
            </Segment>
        );
    }

    return (
        <Segment color={'grey'} loading={isLoading}>
            {redirect()}
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
                            importButton={props.readOnly ||
                            <LayersImport
                                onChange={handleImport}
                            />
                            }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Menu secondary={true} pointing={true}>
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
                            onChangeRelations={handleChangeRelations}
                            parameters={getParameters(activeParamType)}
                            model={props.model}
                            layer={SoilmodelLayer.fromObject(selectedLayer as ISoilmodelLayer)}
                            readOnly={readOnly}
                            relations={LayerParameterZonesCollection.fromObject(relations)}
                            soilmodel={soilmodel}
                        />
                        }
                        {!isLoading && type === nav.ZONES && selectedZone &&
                        <ZoneDetails
                            onChange={handleChangeZone}
                            model={props.model}
                            relations={LayerParameterZonesCollection.fromObject(relations)}
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
        model: ModflowModel.fromObject(state.T03.model)
    });
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    addLayer: (layer: SoilmodelLayer) => dispatch(addLayer(layer)),
    cloneLayer: (layer: SoilmodelLayer) => dispatch(cloneLayer(layer)),
    removeLayer: (layerId: string) => dispatch(removeLayer(layerId)),
    updateSoilmodel: (soilmodel: Soilmodel) => dispatch(updateSoilmodel(soilmodel)),
    updateSoilmodelRelations: (relations: LayerParameterZonesCollection) =>
        dispatch(updateSoilmodelRelations(relations)),
    updateLayer: (layer: SoilmodelLayer) => dispatch(updateLayer(layer)),
    addZone: (zone: Zone) => dispatch(addZone(zone)),
    cloneZone: (zone: Zone) => dispatch(cloneZone(zone)),
    removeZone: (zoneId: string) => dispatch(removeZone(zoneId)),
    updateZone: (zone: Zone) => dispatch(updateZone(zone)),
});

export default withRouter(connect<IStateProps, IDispatchProps, IOwnProps>(
    mapStateToProps,
    mapDispatchToProps)
(soilmodelEditor));
