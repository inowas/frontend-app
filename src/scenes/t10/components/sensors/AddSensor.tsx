import {Button, Form, Grid, Header, InputOnChangeData, Modal} from 'semantic-ui-react';
import {Point} from 'geojson';
import {Rtm, Sensor} from '../../../../core/model/rtm';
import {SensorMap} from '../index';
import React, {ChangeEvent, useState} from 'react';
import Uuid from 'uuid';

interface IProps {
    rtm: Rtm;
    onAdd: (sensor: Sensor) => void;
    onCancel: () => void;
}

const AddSensor = (props: IProps) => {
    const [name, setName] = useState<string>('New Sensor');
    const [geolocation, setGeolocation] = useState<Point | null>(null);
    const [lat, setLat] = useState<string | null>(null);
    const [long, setLong] = useState<string | null>(null);

    const handleChange = (func: any) => (e: any, data: any) => {
        const value = data.value ? data.value : data.checked;
        func(value);
    };

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        if (data.name === 'lat') {
            setLat(data.value);
        }

        if (data.name === 'long') {
            setLong(data.value);
        }
    };

    const handleChangeGeolocation = () => {
        if (latIsValid() && longIsValid()) {
            setGeolocation({
                type: 'Point',
                coordinates: [parseFloat(long as string), parseFloat(lat as string)]
            });
        }
    };

    const handleSave = () => {
        if (geolocation) {
            const sensor = new Sensor({
                id: Uuid.v4(),
                name,
                geolocation,
                parameters: []
            });
            props.onAdd(sensor);
        }
    };

    const latIsValid = (): boolean => {
        if (lat === null) {
            return false;
        }

        return parseFloat(lat) >= -90 && parseFloat(lat) <= 90;
    };

    const longIsValid = () => {
        if (long === null) {
            return false;
        }
        return parseFloat(long) >= -180 && parseFloat(long) <= 180;
    };

    const handleChangeGeometry = (geometry: Point) => {
        setGeolocation(geometry);
        setLong(geometry.coordinates[0].toString(10));
        setLat(geometry.coordinates[1].toString(10));
    };

    return (
        <Modal centered={false} onClose={props.onCancel} open={true} dimmer={'blurring'}>
            <Modal.Header>Add new Sensor</Modal.Header>
            <Modal.Content>
                <Grid padded={true}>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Header as={'h2'}>Add Sensor</Header>
                            <Form>
                                <Form.Input
                                    label={'Name'}
                                    name={'name'}
                                    value={name}
                                    onChange={handleChange(setName)}
                                />
                                <div>
                                    <Form.Input
                                        label={'Lat'}
                                        name={'lat'}
                                        value={lat ? lat : ''}
                                        onBlur={handleChangeGeolocation}
                                        onChange={handleLocalChange}
                                    />
                                    <Form.Input
                                        label={'Long'}
                                        name={'lon'}
                                        value={long ? long : ''}
                                        onBlur={handleChangeGeolocation}
                                        onChange={handleLocalChange}
                                    />
                                </div>
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <SensorMap
                                geometry={geolocation || undefined}
                                rtm={props.rtm}
                                onChangeGeometry={handleChangeGeometry}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button negative={true} onClick={props.onCancel}>Cancel</Button>
                <Button positive={true} onClick={handleSave} disabled={!geolocation}>Create sensor</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default AddSensor;
