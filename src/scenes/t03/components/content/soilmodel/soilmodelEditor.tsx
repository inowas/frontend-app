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
import {fetchUrl} from '../../../../../services/api';
import {sendCommand} from '../../../../../services/api';
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
import {defaultSoilmodelLayer} from '../../../defaults/soilmodel';
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
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [createZoneModal, setCreateZoneModal] = useState<boolean>(false);
    const [relations, setRelations] = useState<ILayerParameterZone[]>(props.soilmodel.relationsCollection.toObject());
    const [selectedLayer, setSelectedLayer] = useState<ISoilmodelLayer | null>(null);
    const [selectedZone, setSelectedZone] = useState<IZone | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isError] = useState<boolean>(false);

    const {soilmodel} = props;
    const {id, pid, property, type} = props.match.params;

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

    const fetch = (iId: string) => {
        if (type === nav.LAYERS) {
            setRelations(soilmodel.relationsCollection.all);
            return setSelectedLayer(soilmodel.layersCollection.findById(iId) as ISoilmodelLayer);
        }
        if (type === nav.ZONES) {
            return setSelectedZone(soilmodel.zonesCollection.findById(iId));
        }
    };

    const handleClickAddItem = () => {
        if (type === nav.LAYERS) {
            const lc = soilmodel.layersCollection;

            const layer = new SoilmodelLayer(defaultSoilmodelLayer);
            layer.number = lc.length > 0 ? lc.orderBy('number', 'desc').first.number + 1 : 1;

            setIsLoading(true);

            return sendCommand(
                Command.addLayer(props.model.id, layer), () => {
                    props.addLayer(layer);
                    setIsLoading(false);
                    props.history.push(`${baseUrl}/${id}/${property}/${type || 'layers'}/${layer.id}`);
                }
            );
        }

        if (type === nav.ZONES) {
            return setCreateZoneModal(true);
        }
    };

    const handleCloneItem = (item: SoilmodelLayer | Zone) => {
        setIsLoading(true);

        if (type === nav.LAYERS) {
            fetchUrl(`modflowmodels/${id}/soilmodel/${item.id}`,
                (cLayer: ISoilmodelLayer) => {
                    const newLayer = SoilmodelLayer.fromObject(cLayer);
                    newLayer.id = Uuid.v4();
                    newLayer.name = cLayer.name + ' (clone)';

                    return sendCommand(
                        Command.addLayer(props.model.id, newLayer), () => {
                            props.addLayer(newLayer);
                            setIsLoading(false);
                            props.history.push(`${baseUrl}/${id}/${property}/${type || '!'}/${newLayer.id}`);
                        }
                    );
                }
            );
        }

        if (type === nav.ZONES) {
            return null;
        }
    };

    const handleImport = () => {
        console.log('HANDLE IMPORT');
    };

    const handleRemoveLayer = (layerId: string) => {
        setIsLoading(true);

        return sendCommand(
            Command.removeLayer({
                id,
                layer_id: layerId
            }), () => {
                props.removeLayer(layerId);
                setIsLoading(false);
                props.history.push(`${baseUrl}/${id}/${property}`);
            }
        );
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
        return setActiveIndex(data.activeIndex);
    };

    const handleChangeZone = (zone: Zone) => {
        setIsDirty(true);
        setSelectedZone(zone.toObject());
    };

    const handleClickItem = (iId: string) => {
        if (type === nav.LAYERS) {
            props.history.push(`${baseUrl}/${id}/${property}/layers/${iId}`);
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
            if (soilmodel.zonesCollection.length > 0) {
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
            return sendCommand(
                Command.removeLayer({
                    id,
                    layer_id: rId
                }), () => {
                    props.removeLayer(rId);
                    setIsLoading(false);
                }
            );
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
            if (type === nav.ZONES && soilmodel.zonesCollection.length > 0) {
                lid = firstZone ? firstZone.id : soilmodel.zonesCollection.first.id;
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
            // ... redirect to the first existing zone ...
            if (type === nav.ZONES && !soilmodel.zonesCollection.findFirstBy('id', pid)) {
                // ... if there is one:
                if (soilmodel.zonesCollection.length > 0) {
                    lid = firstZone ? firstZone.id : soilmodel.zonesCollection.first.id;
                    return <Redirect to={`${baseUrl}/${id}/${property}/${type}/${lid}`}/>;
                }
            }
        }
        return null;
    };

    const {readOnly} = props.model;

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
                            onRemove={handleRemoveLayer}
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
                            activeIndex={activeIndex}
                            onChange={handleChangeLayer}
                            onChangeTab={handleChangeTab}
                            onChangeRelations={handleChangeRelations}
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
