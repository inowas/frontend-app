import {Point} from 'geojson';
import {cloneDeep} from 'lodash';
import React, {ChangeEvent, useState} from 'react';
import {Form, Grid, Header, InputOnChangeData, Segment} from 'semantic-ui-react';
import Uuid from 'uuid';
import {Rtm, Sensor} from '../../../core/model/rtm';
import ContentToolBar from '../../shared/ContentToolbar';
import {SensorMap} from './index';

interface IProps {
    rtm: Rtm;
    onAdd: (sensor: Sensor) => void;
    onCancel: () => void;
}

interface IActiveInput {
    name: string;
    value: string;
}

const sensorSetupDetailsCreateNew = (props: IProps) => {
    const [name, setName] = useState<string>('New Sensor');
    const [activeInput, setActiveInput] = useState<IActiveInput | null>(null);
    const [geolocation, setGeolocation] = useState<Point | null>(null);

    const handleChange = (func: any) => (e: any, data: any) => {
        const value = data.value ? data.value : data.checked;
        func(value);
    };

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => setActiveInput({
        name: data.name,
        value: data.value
    });

    const handleChangeGeolocation = () => {
        if (geolocation && activeInput) {
            const n = activeInput.name;
            const value = parseFloat(activeInput.value);

            if (isNaN(value)) {
                setActiveInput(null);
                return;
            }

            const g = cloneDeep(geolocation);
            if (n === 'lat') {
                g.coordinates[1] = value;
            }

            if (n === 'lon') {
                g.coordinates[0] = value;
            }

            setActiveInput(null);
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
                                    value={activeInput && activeInput.name === 'lat' ?
                                        activeInput.value : geolocation.coordinates[1]}
                                    onBlur={handleChangeGeolocation}
                                    onChange={handleLocalChange}
                                />
                                <Form.Input
                                    label={'Long'}
                                    name={'lon'}
                                    value={activeInput && activeInput.name === 'lon' ?
                                        activeInput.value : geolocation.coordinates[0]}
                                    onBlur={handleChangeGeolocation}
                                    onChange={handleLocalChange}
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
                        <SensorMap
                            geometry={geolocation || undefined}
                            rtm={props.rtm}
                            onChangeGeometry={handleChangeGeometry}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

export default sensorSetupDetailsCreateNew;
