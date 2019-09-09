import {Point} from 'geojson';
import {cloneDeep} from 'lodash';
import React, {useState} from 'react';
import {Form, Grid, Header, Segment} from 'semantic-ui-react';
import Uuid from 'uuid';
import {Rtm, Sensor} from '../../../core/model/rtm';
import ContentToolBar from '../../shared/ContentToolbar';
import {SensorMap} from './index';

interface IProps {
    rtm: Rtm;
    onAdd: (sensor: Sensor) => void;
    onCancel: () => void;
}

const sensorSetupDetailsCreateNew = (props: IProps) => {

    const [name, setName] = useState<string>('New Sensor');
    const [geolocation, setGeolocation] = useState<Point | null>(null);

    const handleChange = (func: any) => (e: any, data: any) => {
        const value = data.value ? data.value : data.checked;
        func(value);
    };

    const handleChangeGeolocation = (e: any, data: any) => {
        if (geolocation) {
            const n = data.name;
            const value = parseFloat(data.value);

            const g = cloneDeep(geolocation);
            if (n === 'lat') {
                g.coordinates[1] = value;
            }

            if (n === 'lon') {
                g.coordinates[0] = value;
            }

            setGeolocation(g);
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

    const handleChangeGeometry = (geometry: Point) => {
        setGeolocation(geometry);
    };

    return (
        <Segment color={'grey'}>
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
                            {geolocation &&
                            <div>
                                <Form.Input
                                    label={'Lat'}
                                    name={'lat'}
                                    value={geolocation.coordinates[1]}
                                    onChange={handleChangeGeolocation}
                                />
                                <Form.Input
                                    label={'Long'}
                                    name={'lon'}
                                    value={geolocation.coordinates[0]}
                                    onChange={handleChangeGeolocation}
                                />
                            </div>
                            }
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <ContentToolBar
                            onSave={handleSave}
                            isValid={!!geolocation}
                            isDirty={true}
                            isError={false}
                            saveButton={true}
                        />
                        <SensorMap rtm={props.rtm} onChangeGeometry={handleChangeGeometry}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

export default sensorSetupDetailsCreateNew;
