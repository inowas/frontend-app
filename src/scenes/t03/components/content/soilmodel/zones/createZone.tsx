import {default as geojson, Polygon} from 'geojson';
import {DrawEvents} from 'leaflet';
import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useParams, withRouter} from 'react-router-dom';
import {
    Checkbox,
    CheckboxProps, Divider,
    DropdownProps,
    Form,
    Grid,
    Header,
    InputOnChangeData,
    List,
    Segment
} from 'semantic-ui-react';
import uuid from 'uuid';
import {ICells} from '../../../../../../core/model/geometry/Cells.type';
import {default as Geometry} from '../../../../../../core/model/geometry/Geometry';
import {IGeometry} from '../../../../../../core/model/geometry/Geometry.type';
import {ModflowModel, Soilmodel} from '../../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../../core/model/modflow/boundaries';
import {Zone, ZonesCollection} from '../../../../../../core/model/modflow/soilmodel';
import {IZone} from '../../../../../../core/model/modflow/soilmodel/Zone.type';
import {IRootReducer} from '../../../../../../reducers';
import {sendCommand} from '../../../../../../services/api';
import {calculateActiveCells} from '../../../../../../services/geoTools';
import ContentToolBar from '../../../../../shared/ContentToolbar';
import {addZone} from '../../../../actions/actions';
import Command from '../../../../commands/modflowModelCommand';
import {UploadGeoJSONModal} from '../../create';
import {ZonesMap} from './index';

interface IVisibleZone extends IZone {
    isActive: boolean;
}

const createZone = () => {
    const [name, setName] = useState<string>('New Zone');
    const [geometry, setGeometry] = useState<IGeometry | null>(null);
    const [cells, setCells] = useState<ICells | null>(null);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [visibleZones, setVisibleZones] = useState<IVisibleZone[]>();

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
    const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;

    const {id, property} = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const baseUrl = '/tools/T03';

    useEffect(() => {
        console.log('SOILMODEL CHANGED');
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
    }, [soilmodel]);

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

    const handleCreatePath = (e: DrawEvents.Created) => {
        const layer = e.layer;
        if (layer) {
            const g = layer.toGeoJSON().geometry;
            setIsDirty(true);
            setCells(calculateActiveCells(Geometry.fromGeoJson(g), model.boundingBox,
                model.gridSize).toObject());
            return setGeometry(g as Polygon);
        }
    };

    const handleEditPath = (e: DrawEvents.Edited) => {
        const layers = e.layers.toGeoJSON() as geojson.FeatureCollection;

        if (layers.features.length > 0) {
            const layer = layers.features[0];
            const g = layer.geometry;
            setCells(calculateActiveCells(Geometry.fromGeoJson(g), model.boundingBox,
                model.gridSize).toObject());
            setIsDirty(true);
            return setGeometry(g as Polygon);
        }
    };

    const handleApplyJson = (cGeometry: Geometry) => {
        const cCells = calculateActiveCells(cGeometry, model.boundingBox, model.gridSize);
        return handleSave(cGeometry.toObject(), cCells.toObject());
    };

    const handleClickBack = () => {
        if (soilmodel.zonesCollection.all.filter((z) => !z.isDefault).length > 0) {
            return history.push(`${baseUrl}/${id}/${property}/zones`);
        }
        return history.push(`${baseUrl}/${id}/${property}/layers/${soilmodel.layersCollection.first.id}`);
    };

    const handleChangeCheckbox = (e: React.FormEvent<HTMLInputElement>, cData: CheckboxProps) => {
        console.log('HANDLE CHANGE')
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
        <Segment color={'grey'}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Header as={'h2'}>Create Zone</Header>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <ContentToolBar
                            backButton={true}
                            onBack={handleClickBack}
                            onSave={() => handleSave(geometry, cells)}
                            isValid={!!geometry}
                            isDirty={isDirty && !!geometry && !!cells}
                            isError={isError}
                            saveButton={!model.readOnly && !isEditing}
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
                            <Divider />
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
                        <ZonesMap
                            boundingBox={model.boundingBox}
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

export default withRouter(createZone);
