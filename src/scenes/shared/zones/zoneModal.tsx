import {DrawEvents} from 'leaflet';
import React, {ChangeEvent, useState} from 'react';
import {Button, Form, InputOnChangeData, Modal, Segment} from 'semantic-ui-react';
import {Geometry} from '../../../core/model/geometry';
import {IBoundingBox} from '../../../core/model/geometry/BoundingBox.type';
import GridSize from '../../../core/model/geometry/GridSize';
import {BoundingBox} from '../../../core/model/modflow';
import Zone from '../../../core/model/zones/Zone';
import ZonesCollection from '../../../core/model/zones/ZonesCollection';
import {calculateActiveCells} from '../../../services/geoTools';
import {ZonesMap} from './index';

interface IProps {
    boundingBox: IBoundingBox;
    gridSize: GridSize;
    onCancel: () => any;
    onRemove: (zone: Zone) => any;
    onSave: (zone: Zone) => any;
    readOnly: boolean;
    zone: Zone;
    zones: ZonesCollection;
}

const zoneModal = (props: IProps) => {
    const [isError, setIsError] = useState(!props.zone.geometry);
    const [zone, setZone] = useState(props.zone.toObject);
    const boundingBox = BoundingBox.fromObject(props.boundingBox);

    const onChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => setZone({
        ...zone,
        [name]: value
    });

    const onCreatePath = (e: DrawEvents.Created) => {
        const polygon = e.layer;
        const cZone = Zone.fromObject(zone);

        cZone.geometry = Geometry.fromGeoJson(polygon.toGeoJSON());
        cZone.cells = calculateActiveCells(cZone.geometry, boundingBox, props.gridSize);

        setIsError(!cZone.geometry);
        return setZone(cZone.toObject());
    };

    const onEditPath = (e: DrawEvents.Edited) => {
        const layers = e.layers;

        layers.eachLayer((layer) => {
            const cZone = Zone.fromObject(zone);

            cZone.geometry = Geometry.fromGeoJson(layer);
            cZone.cells = calculateActiveCells(cZone.geometry, boundingBox, props.gridSize);

            setIsError(!cZone.geometry);
            return setZone(cZone.toObject());
        });
    };

    const handleRemove = () => props.onRemove(Zone.fromObject(zone));
    const handleSave = () => props.onSave(Zone.fromObject(zone));

    return (
        <Modal size={'large'} open={true} onClose={props.onCancel} dimmer={'inverted'}>
            <Modal.Header>Edit Zone</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <label>Name</label>
                        <Form.Input
                            type="text"
                            name="name"
                            value={zone.name}
                            placeholder="name ="
                            onChange={onChange}
                        />
                    </Form.Field>
                </Form>
                <Segment attached="bottom">
                    <ZonesMap
                        boundingBox={props.boundingBox}
                        zone={zone}
                        zones={props.zones.toArray()}
                        onCreatePath={onCreatePath}
                        onEditPath={onEditPath}
                        readOnly={props.readOnly}
                    />
                </Segment>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={props.onCancel}>Cancel</Button>
                <Button
                    disabled={isError}
                    positive={true}
                    onClick={handleSave}
                >
                    Save
                </Button>
                <Button
                    negative={true}
                    onClick={handleRemove}
                >
                    Delete Zone
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default zoneModal;
