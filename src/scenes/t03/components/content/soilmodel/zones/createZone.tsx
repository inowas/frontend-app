import * as turf from '@turf/turf';
import {BoundaryCollection} from '../../../../../../core/model/modflow/boundaries';
import {CALCULATE_CELLS_INPUT} from '../../../../../modflow/worker/t03.worker';
import {
    Checkbox,
    CheckboxProps, Dimmer, Divider,
    DropdownProps,
    Form,
    Grid,
    Header,
    InputOnChangeData,
    List, Loader,
    Segment
} from 'semantic-ui-react';
import {default as Geometry} from '../../../../../../core/model/geometry/Geometry';
import {ICalculateCellsInputData} from '../../../../../modflow/worker/t03.worker.type';
import {ICells} from '../../../../../../core/model/geometry/Cells.type';
import {IGeometry} from '../../../../../../core/model/geometry/Geometry.type';
import {IRootReducer} from '../../../../../../reducers';
import {IZone} from '../../../../../../core/model/modflow/soilmodel/Zone.type';
import {ModflowModel, Soilmodel} from '../../../../../../core/model/modflow';
import {UploadGeoJSONModal} from '../../create';
import {Zone, ZonesCollection} from '../../../../../../core/model/modflow/soilmodel';
import {ZonesMap} from './index';
import {addMessage, addZone} from '../../../../actions/actions';
import {asyncWorker} from '../../../../../modflow/worker/worker';
import {default as geojson} from 'geojson';
import {messageError} from '../../../../defaults/messages';
import {sendCommand} from '../../../../../../services/api';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useParams, withRouter} from 'react-router-dom';
import Command from '../../../../commands/modflowModelCommand';
import ContentToolBar from '../../../../../shared/ContentToolbar';
import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import uuid from 'uuid';

interface IVisibleZone extends IZone {
    isActive: boolean;
}

const CreateZone = () => {
    const [name, setName] = useState<string>('New Zone');
    const [geometry, setGeometry] = useState<IGeometry | null>(null);
    const [cells, setCells] = useState<ICells | null>(null);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [visibleZones, setVisibleZones] = useState<IVisibleZone[]>();

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
    const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;

    const {id, property} = useParams<{id: string, property: string}>();
    const history = useHistory();
    const dispatch = useDispatch();
    const baseUrl = '/tools/T03';

    useEffect(() => {
        if (soilmodel && !visibleZones) {
            setVisibleZones(
                soilmodel.zonesCollection.all.filter((z) => !z.isDefault).map((z) => {
                    return {
                        ...z,
                        isActive: false
                    };
                })
            );
        }
    }, [soilmodel, visibleZones]);

    if (!boundaries || !model || !soilmodel || !visibleZones) {
        return (
            <Segment color={'grey'} loading={true}/>
        );
    }

    const handleChange = (e: SyntheticEvent<HTMLElement, Event> | ChangeEvent<HTMLInputElement>,
                          data: DropdownProps | InputOnChangeData) => {
        if (data.name === 'name' && typeof data.value === 'string') {
            setIsDirty(true);
            return setName(data.value);
        }
    };

    const handleCalculateCells = (cGeometry: Geometry) => {
        setIsFetching(true);
        let g = cGeometry.toGeoJSON();
        if (model.rotation % 360 !== 0) {
            g = turf.transformRotate(
                cGeometry.toGeoJSON(), -1 * model.rotation, {pivot: model.geometry.centerOfMass}
            );
        }
        asyncWorker({
            type: CALCULATE_CELLS_INPUT,
            data: {
                geometry: g,
                boundingBox: model.boundingBox.toObject(),
                gridSize: model.gridSize.toObject(),
                intersection: model.intersection
            } as ICalculateCellsInputData
        }).then((c: ICells) => {
            setCells(c);
            setGeometry(cGeometry.toObject());
            setIsFetching(false);
            return setIsDirty(true);
        }).catch(() => {
            dispatch(addMessage(messageError('createZone', 'Calculating cells failed.')));
        });
    };

    const handleCreatePath = (e: any) => {
        const layer = e.layer;
        if (layer) {
            const g = layer.toGeoJSON().geometry;
            handleCalculateCells(Geometry.fromGeoJson(g));
        }
    };

    const handleEditPath = (e: any) => {
        const layers = e.layers.toGeoJSON() as geojson.FeatureCollection;

        if (layers.features.length > 0) {
            const layer = layers.features[0];
            const g = layer.geometry;
            handleCalculateCells(Geometry.fromGeoJson(g));
        }
    };

    const handleApplyJson = (g: Geometry) => handleCalculateCells(g);

    const handleClickBack = () => {
        if (soilmodel.zonesCollection.all.filter((z) => !z.isDefault).length > 0) {
            return history.push(`${baseUrl}/${id}/${property}/zones`);
        }
        return history.push(`${baseUrl}/${id}/${property}/layers/${soilmodel.layersCollection.first.id}`);
    };

    const handleChangeCheckbox = (e: React.FormEvent<HTMLInputElement>, cData: CheckboxProps) => {
        if (!visibleZones) {
            return null;
        }

        if (cData.name === '_all') {
            const setToTrue = visibleZones.filter((z) => !z.isActive).length > 0;
            return setVisibleZones(visibleZones.map((z) => {
                z.isActive = setToTrue;
                return z;
            }));
        }

        return setVisibleZones(visibleZones.map((z) => {
            if (z.id === cData.value) {
                z.isActive = !z.isActive;
            }

            return z;
        }));
    };

    const handleSave = (sGeometry = geometry, sCells = cells) => {
        if (!boundaries || !model || !sGeometry || !sCells) {
            return null;
        }

        const zone = Zone.fromObject({
            id: uuid.v4(),
            geometry: sGeometry,
            cells: sCells,
            name,
            isDefault: false
        });
        dispatch(addZone(zone));

        const sm = soilmodel.toObject();
        sm.properties.zones.push(zone.toObject());

        sendCommand(Command.updateSoilmodelProperties({
                id: model.id,
                properties: {
                    ...sm.properties,
                    zones: sm.properties.zones
                }
            }), () =>
                history.push(`${baseUrl}/${id}/${property}/zones/${zone.id}`)
            , () => setIsError(true));

    };

    return (
        <Segment color={'grey'} loading={isFetching}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Header as={'h2'}>Create Zone</Header>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <ContentToolBar
                            buttonBack={true}
                            onBack={handleClickBack}
                            onSave={() => handleSave(geometry, cells)}
                            isValid={!!geometry}
                            isDirty={isDirty && !!geometry && !!cells}
                            isError={isError}
                            buttonSave={!model.readOnly}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Form>
                            <Form.Input
                                label={'Name'}
                                name={'name'}
                                value={name}
                                onChange={handleChange}
                            />
                            <UploadGeoJSONModal
                                onChange={handleApplyJson}
                                geometry={'polygon'}
                                size={'medium'}
                            />
                            <Divider/>
                            <Form.Field>
                                <label>Other Zones</label>
                                <List>
                                    {visibleZones.map((z) => (
                                        <List.Item key={z.id}>
                                            <Checkbox
                                                checked={z.isActive}
                                                label={z.name}
                                                onChange={handleChangeCheckbox}
                                                value={z.id}
                                            />
                                        </List.Item>
                                    ))}
                                    <List.Item className="ui divider"/>
                                    <List.Item>
                                        <Checkbox
                                            checked={visibleZones.filter((z) => !z.isActive).length === 0}
                                            label="Show All"
                                            onChange={handleChangeCheckbox}
                                            name="_all"
                                        />
                                    </List.Item>
                                </List>
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        {isFetching &&
                        <Dimmer active={true} inverted={true}>
                            <Loader>Calculating cells</Loader>
                        </Dimmer>
                        }
                        <ZonesMap
                            model={model}
                            boundaries={boundaries}
                            geometry={geometry ? Geometry.fromObject(geometry) : undefined}
                            zones={ZonesCollection.fromObject(visibleZones.filter((z) => z.isActive))}
                            onCreatePath={handleCreatePath}
                            onEditPath={handleEditPath}
                            readOnly={false}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

export default withRouter(CreateZone);
