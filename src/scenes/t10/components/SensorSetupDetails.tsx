import {Point} from 'geojson';
import React from 'react';
import {Form} from 'semantic-ui-react';
import {Rtm, Sensor} from '../../../core/model/rtm';
import {ParameterCollection} from '../../../core/model/rtm/ParameterCollection';
import {Parameters, SensorMap} from './index';

interface IProps {
    rtm: Rtm;
    sensor: Sensor;
    onChange: (sensor: Sensor) => void;
}

const sensorSetupDetails = (props: IProps) => {

    const handleChange = (e: any, data: any) => {
        const n = data.name;
        const v = data.value;
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

        props.onChange(sensor);
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
                        value={props.sensor.name}
                        onChange={handleChange}
                        disabled={props.rtm.readOnly}
                    />
                    <Form.Input
                        label={'Lat'}
                        name={'lat'}
                        value={props.sensor.geolocation.coordinates[1]}
                        onChange={handleChange}
                        type={'number'}
                        disabled={props.rtm.readOnly}
                    />
                    <Form.Input
                        label={'Lon'}
                        name={'lon'}
                        value={props.sensor.geolocation.coordinates[0]}
                        onChange={handleChange}
                        type={'number'}
                        disabled={props.rtm.readOnly}
                    />
                </Form.Group>
            </Form>
            <SensorMap
                geometry={props.sensor.geolocation}
                onChangeGeometry={handleChangeGeometry}
                rtm={props.rtm}
            />
            <Parameters parameters={props.sensor.parameters} onChange={handleChangeParameters} rtm={props.rtm}/>
        </div>
    );
};

export default sensorSetupDetails;
