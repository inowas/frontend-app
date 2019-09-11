import {Point} from 'geojson';
import React, {ChangeEvent, useState} from 'react';
import {Form, InputOnChangeData} from 'semantic-ui-react';
import {Rtm, Sensor} from '../../../core/model/rtm';
import {ParameterCollection} from '../../../core/model/rtm/ParameterCollection';
import {Parameters, SensorMap} from './index';

interface IProps {
    rtm: Rtm;
    sensor: Sensor;
    onChange: (sensor: Sensor) => void;
}

interface IActiveInput {
    name: string;
    value: string;
}

const sensorSetupDetails = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<IActiveInput | null>(null);

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => setActiveInput({
        name: data.name,
        value: data.value
    });

    const handleChange = () => {
        if (activeInput) {
            const n = activeInput.name;
            const v = activeInput.value;
            const sensor = Sensor.fromObject(props.sensor.toObject());

            if (n === 'name') {
                sensor.name = v;
            }

            if (n === 'lat') {
                if (!isNaN(parseFloat(v))) {
                    sensor.geolocation.coordinates[1] = parseFloat(v);
                }
            }

            if (n === 'lon') {
                if (!isNaN(parseFloat(v))) {
                    sensor.geolocation.coordinates[0] = parseFloat(v);
                }
            }

            setActiveInput(null);
            props.onChange(sensor);
        }
    };

    const handleChangeGeometry = (geometry: Point) => {
        const sensor = Sensor.fromObject(props.sensor.toObject());
        sensor.geolocation = geometry;
        props.onChange(sensor);
    };

    const handleChangeParameters = (properties: ParameterCollection) => {
        const sensor = Sensor.fromObject(props.sensor.toObject());
        sensor.parameters = properties;
        props.onChange(sensor);
    };

    return (
        <div>
            <Form style={{marginTop: '1rem'}}>
                <Form.Group widths="equal">
                    <Form.Input
                        label={'Name'}
                        name={'name'}
                        value={activeInput && activeInput.name === 'name' ?
                            activeInput.value : props.sensor.name}
                        onBlur={handleChange}
                        onChange={handleLocalChange}
                        disabled={props.rtm.readOnly}
                    />
                    <Form.Input
                        label={'Lat'}
                        name={'lat'}
                        value={activeInput && activeInput.name === 'lat' ?
                            activeInput.value : props.sensor.geolocation.coordinates[1]}
                        onBlur={handleChange}
                        onChange={handleLocalChange}
                        type={'number'}
                        disabled={props.rtm.readOnly}
                    />
                    <Form.Input
                        label={'Lon'}
                        name={'lon'}
                        value={activeInput && activeInput.name === 'lon' ?
                            activeInput.value : props.sensor.geolocation.coordinates[0]}
                        onBlur={handleChange}
                        onChange={handleLocalChange}
                        type={'number'}
                        disabled={props.rtm.readOnly}
                    />
                </Form.Group>
            </Form>
            <SensorMap
                geometry={props.sensor.geolocation}
                onChangeGeometry={handleChangeGeometry}
                rtm={props.rtm}
                sensor={props.sensor}
            />
            <Parameters parameters={props.sensor.parameters} onChange={handleChangeParameters} rtm={props.rtm}/>
        </div>
    );
};

export default sensorSetupDetails;
