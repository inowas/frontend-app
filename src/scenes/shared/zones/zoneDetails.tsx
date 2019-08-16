import {default as geojson, Polygon} from 'geojson';
import {DrawEvents} from 'leaflet';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {Checkbox, CheckboxProps, Form, Grid, InputOnChangeData, List, Menu, Tab} from 'semantic-ui-react';
import Zone from '../../../core/model/gis/Zone';
import {IZone} from '../../../core/model/gis/Zone.type';
import ZonesCollection from '../../../core/model/gis/ZonesCollection';
import {ModflowModel} from '../../../core/model/modflow';
import {ZonesMap} from './index';

interface IProps {
    onChange: (zone: Zone) => any;
    model: ModflowModel;
    zone: Zone;
    zones: ZonesCollection;
}

interface IVisibleZone extends IZone {
    isActive: boolean;
}

const zoneDetails = (props: IProps) => {
    const [zone, setZone] = useState<IZone>(props.zone.toObject());
    const [visibleZones, setVisibleZones] = useState<IVisibleZone[]>(
        props.zones.findBy('id', props.zone.id, false).map((z) => {
            return {
                ...z,
                isActive: false
            };
        })
    );

    useEffect(() => {
        setZone(props.zone.toObject());
    }, [props.zone]);

    useEffect(() => {
        setVisibleZones(
            props.zones.findBy('id', props.zone.id, false).map((z) => {
                return {
                    ...z,
                    isActive: false
                };
            })
        );
    }, [props.zones]);

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
            const cZone: IZone = {
                ...zone,
                geometry: layer.toGeoJSON().geometry as Polygon
            };
            return props.onChange(Zone.fromObject(cZone));
        }
    };

    const handleEditPath = (e: DrawEvents.Edited) => {
        const layers = e.layers.toGeoJSON() as geojson.FeatureCollection;

        if (layers.features.length > 0) {
            const layer = layers.features[0];
            const cZone: IZone = {
                ...zone,
                geometry: layer.geometry as Polygon
            };
            return props.onChange(Zone.fromObject(cZone));
        }
    };

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
                                <Grid.Row>
                                    <Grid.Column>
                                        <Form.Input
                                            name="name"
                                            value={zone.name}
                                            label={'Zone name'}
                                            onBlur={handleChange}
                                            onChange={handleLocalChange}
                                            placeholder="name ="
                                            type="text"
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={12}>
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
                                                readOnly={false}
                                            />
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Form.Field>
                                            <label>Show other Zones</label>
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
                                                        label="Toggle all"
                                                        onChange={handleChangeCheckbox}
                                                        name="_all"
                                                    />
                                                </List.Item>
                                            </List>
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>Affected layers</label>

                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Tab.Pane>
                    }]}
                />
            </Form>
        </div>
    );
};

export default zoneDetails;
