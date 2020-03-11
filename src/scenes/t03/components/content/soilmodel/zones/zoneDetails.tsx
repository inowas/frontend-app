import geojson from 'geojson';
import {DrawEvents} from 'leaflet';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {
    Button,
    Checkbox,
    CheckboxProps,
    Divider,
    Form,
    Grid,
    Header,
    InputOnChangeData,
    Label,
    List,
    Modal,
    Segment
} from 'semantic-ui-react';
import {Geometry} from '../../../../../../core/model/geometry';
import {ModflowModel} from '../../../../../../core/model/modflow';
import BoundaryCollection from '../../../../../../core/model/modflow/boundaries/BoundaryCollection';
import {Zone, ZonesCollection} from '../../../../../../core/model/modflow/soilmodel';
import LayersCollection from '../../../../../../core/model/modflow/soilmodel/LayersCollection';
import {IZone} from '../../../../../../core/model/modflow/soilmodel/Zone.type';
import {calculateActiveCells} from '../../../../../../services/geoTools';
import {UploadGeoJSONModal} from '../../create';
import {ZonesMap} from './index';

interface IProps {
    boundaries: BoundaryCollection;
    onChange: (zone: Zone) => any;
    layers: LayersCollection;
    model: ModflowModel;
    zone: Zone;
    zones: ZonesCollection;
}

interface IVisibleZone extends IZone {
    isActive: boolean;
}

const zoneDetails = (props: IProps) => {
    const [relationWarning, setRelationWarning] = useState<boolean>(false);
    const [editedZone, setEditedZone] = useState<IZone | null>(null);
    const [zone, setZone] = useState<IZone>(props.zone.toObject());
    const [visibleZones, setVisibleZones] = useState<IVisibleZone[]>(
        props.zones.all.filter((z) =>
            z.id !== zone.id && !zone.isDefault
        ).map((z) => {
            return {
                ...z,
                isActive: false
            };
        })
    );

    const affectedLayers = props.layers.getAffectedByZone(zone.id);

    useEffect(() => {
        setZone(props.zone.toObject());
    }, [props.zone]);

    useEffect(() => {
        setVisibleZones(
            props.zones.all.filter((z) =>
                z.id !== zone.id && !z.isDefault
            ).map((z) => {
                return {
                    ...z,
                    isActive: false
                };
            })
        );
    }, [props.zones, zone]);

    const handleChange = () => props.onChange(Zone.fromObject(zone));

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, input: InputOnChangeData) => setZone({
        ...zone,
        [input.name]: input.value
    });

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

    const handleApplyJson = (cGeometry: Geometry) => {
        const cZone: IZone = {
            ...zone,
            cells: calculateActiveCells(cGeometry, props.model.boundingBox, props.model.gridSize).toObject(),
            geometry: cGeometry.toObject()
        };

        if (affectedLayers.length > 0) {
            setEditedZone(cZone);
            return setRelationWarning(true);
        }
        return props.onChange(Zone.fromObject(cZone));
    };

    const handleCreatePath = (e: DrawEvents.Created) => {
        const layer = e.layer;
        if (layer) {
            const geometry = Geometry.fromGeoJson(layer.toGeoJSON().geometry);
            const cZone: IZone = {
                ...zone,
                cells: calculateActiveCells(geometry, props.model.boundingBox, props.model.gridSize).toObject(),
                geometry: geometry.toObject()
            };
            return props.onChange(Zone.fromObject(cZone));
        }
    };

    const handleEditPath = (e: DrawEvents.Edited) => {
        const layers = e.layers.toGeoJSON() as geojson.FeatureCollection;

        if (layers.features.length > 0) {
            const layer = layers.features[0];
            const geometry = Geometry.fromGeoJson(layer.geometry);

            return handleApplyJson(geometry);
        }
    };

    const handleAcceptWarning = () => {
        setRelationWarning(false);
        if (editedZone) {
            return props.onChange(Zone.fromObject(editedZone));
        }
        return setEditedZone(null);
    };

    const handleRejectWarning = () => {
        setEditedZone(null);
        setRelationWarning(false);
    };

    const readOnly = props.model.readOnly;

    return (
        <div>
            <Form>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column width={12}>
                            <Form.Input
                                name="name"
                                value={zone.name}
                                label={'Zone name'}
                                onBlur={handleChange}
                                onChange={handleLocalChange}
                                placeholder="name ="
                                readOnly={readOnly}
                                type="text"
                            />
                            <Form.Field>
                                <label>Geometry</label>
                                <ZonesMap
                                    boundingBox={props.model.boundingBox}
                                    boundaries={props.boundaries}
                                    zone={Zone.fromObject(zone)}
                                    zones={ZonesCollection.fromObject(visibleZones.filter((z) => z.isActive))}
                                    onCreatePath={handleCreatePath}
                                    onEditPath={handleEditPath}
                                    readOnly={readOnly}
                                />
                            </Form.Field>
                            <Segment className={'selectZones'}>
                                <Header as={'h5'}>Affected Layers:</Header>
                                {affectedLayers.map((l, key) =>
                                    <Label key={key}>
                                        {l.name}
                                    </Label>
                                )}
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={4}>
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
                            <Divider/>
                            <UploadGeoJSONModal
                                onChange={handleApplyJson}
                                geometry={'polygon'}
                                size={'medium'}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Form.Field>
                                <label>Affected layers:</label>
                                {affectedLayers.map((l, key) => <Label key={key}>{l.name}</Label>)}
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
>>>>>>>>> Temporary merge branch 2
            </Form>
            {relationWarning &&
            <Modal size="small" open={relationWarning}>
                <Modal.Header>This change causes conflicts</Modal.Header>
                <Modal.Content>
                    <p>There are {affectedLayers.length} layers depending on this zone.</p>
                    <List>
                        {affectedLayers.map((l, key) =>
                            <List.Item key={key}>{l.name}</List.Item>
                        )}
                    </List>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        negative={true}
                        onClick={handleRejectWarning}
                    >
                        No
                    </Button>
                    <Button
                        positive={true}
                        onClick={handleAcceptWarning}
                        icon="checkmark"
                        labelPosition="right"
                        content="Yes"
                    />
                </Modal.Actions>
            </Modal>
            }
        </div>
    );
};

export default zoneDetails;
