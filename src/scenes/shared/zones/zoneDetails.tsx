import geojson from 'geojson';
import {DrawEvents} from 'leaflet';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {
    Button,
    Checkbox,
    CheckboxProps,
    Form,
    Grid,
    InputOnChangeData,
    List,
    Menu,
    Modal,
    Tab
} from 'semantic-ui-react';
import LayerParameterZonesCollection from '../../../core/model/gis/LayerParameterZonesCollection';
import Zone from '../../../core/model/gis/Zone';
import {IZone} from '../../../core/model/gis/Zone.type';
import ZonesCollection from '../../../core/model/gis/ZonesCollection';
import {Geometry, ModflowModel} from '../../../core/model/modflow';
import {calculateActiveCells} from '../../../services/geoTools';
import {ZonesMap} from './index';

interface IProps {
    onChange: (zone: Zone) => any;
    model: ModflowModel;
    relations: LayerParameterZonesCollection;
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
            z.id !== zone.id &&
            props.relations.all.filter((r) => r.zoneId === z.id && r.priority === 0).length === 0
        ).map((z) => {
            return {
                ...z,
                isActive: false
            };
        })
    );

    const relations = props.relations.all.filter((r) => r.zoneId === zone.id);

    useEffect(() => {
        setZone(props.zone.toObject());
    }, [props.zone]);

    useEffect(() => {
        setVisibleZones(
            props.zones.all.filter((z) =>
                z.id !== zone.id &&
                props.relations.all.filter((r) => r.zoneId === z.id && r.priority === 0).length === 0
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

            const cZone: IZone = {
                ...zone,
                cells: calculateActiveCells(geometry, props.model.boundingBox, props.model.gridSize).toObject(),
                geometry: geometry.toObject()
            };

            if (relations.length > 0) {
                setEditedZone(cZone);
                return setRelationWarning(true);
            }
            return props.onChange(Zone.fromObject(cZone));
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
                <Tab
                    menu={{secondary: true, pointing: true}}
                    activeIndex={0}
                    panes={[{
                        menuItem: (<Menu.Item key={0}>Properties</Menu.Item>),
                        render: () => <Tab.Pane>
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
                                                zone={Zone.fromObject(zone)}
                                                zones={ZonesCollection.fromObject(
                                                    visibleZones.filter((z) => z.isActive))
                                                }
                                                onCreatePath={handleCreatePath}
                                                onEditPath={handleEditPath}
                                                readOnly={readOnly}
                                            />
                                        </Form.Field>
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
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Tab.Pane>
                    }]}
                />
            </Form>
            {relationWarning &&
            <Modal size="small" open={relationWarning}>
                <Modal.Header>This change causes conflicts</Modal.Header>
                <Modal.Content>
                    <p>There are {relations.length} layer - parameter relations depending on this zone. </p>
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
