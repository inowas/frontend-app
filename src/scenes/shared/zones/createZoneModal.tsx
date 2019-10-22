import {default as geojson, Polygon} from 'geojson';
import { DrawEvents } from 'leaflet';
import React, {ChangeEvent, useState} from 'react';
import {Button, Form, InputOnChangeData, Modal} from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
import BoundingBox from '../../../core/model/geometry/BoundingBox';
import GridSize from '../../../core/model/geometry/GridSize';
import Zone from '../../../core/model/gis/Zone';
import ZonesCollection from '../../../core/model/gis/ZonesCollection';
import {Geometry} from '../../../core/model/modflow';
import {calculateActiveCells} from '../../../services/geoTools';
import {ZonesMap} from './index';

interface IProps {
    onCancel: () => any;
    onChange: (zone: Zone) => any;
    boundingBox: BoundingBox;
    gridSize: GridSize;
    zones: ZonesCollection;
}

const createZoneModal = (props: IProps) => {
    const [name, setName] = useState<string>('');
    const [geometry, setGeometry] = useState<Polygon | null>(null);

    const handleApply = () => {
        if (name && geometry) {
            const zone = new Zone({
                id: uuidv4(),
                name,
                geometry,
                cells: geometry ? calculateActiveCells(Geometry.fromGeoJson(geometry), props.boundingBox,
                    props.gridSize).toObject() : []
            });

            return props.onChange(zone);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>, input: InputOnChangeData) => {
        if (input.name === 'name') {
            return setName(input.value);
        }
    };

    const handleCreatePath = (e: DrawEvents.Created) => {
        const layer = e.layer;
        if (layer) {
            return setGeometry(layer.toGeoJSON().geometry as Polygon);
        }
    };

    const handleEditPath = (e: DrawEvents.Edited) => {
        const layers = e.layers.toGeoJSON() as geojson.FeatureCollection;

        if (layers.features.length > 0) {
            const layer = layers.features[0];
            return setGeometry(layer.geometry as Polygon);
        }
    };

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
                            value={name}
                            placeholder="name ="
                            onChange={handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Geometry</label>
                        <ZonesMap
                            boundingBox={props.boundingBox}
                            geometry={geometry ? Geometry.fromObject(geometry) : undefined}
                            zones={props.zones}
                            onCreatePath={handleCreatePath}
                            onEditPath={handleEditPath}
                            readOnly={false}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={props.onCancel}>Cancel</Button>
                <Button
                    disabled={!geometry || name === ''}
                    positive={true}
                    onClick={handleApply}
                >
                    Apply
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default createZoneModal;
