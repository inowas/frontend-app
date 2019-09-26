import {Point} from 'geojson';
import React, {useEffect, useState} from 'react';
import {Button, Grid, Label, Segment, Table} from 'semantic-ui-react';
import {Rtm, Sensor} from '../../../core/model/rtm';
import {ISensorParameter} from '../../../core/model/rtm/Sensor.type';
import {parameterList} from '../defaults';
import {SensorMap} from './index';

interface IProps {
    rtm: Rtm;
    sensor: Sensor;
    onChange: (sensor: Sensor) => void;
}

const sensorProcessingDetails = (props: IProps) => {

    const [selectedParameter, setSelectedParameter] = useState<string | null>(null);

    useEffect(() => {
        if (props.sensor.parameters.length > 0) {
            setSelectedParameter(props.sensor.parameters.first.id);
        }
    }, []);

    const handleChangeGeometry = (geometry: Point) => {
        const sensor = Sensor.fromObject(props.sensor.toObject());
        sensor.geolocation = geometry;
        props.onChange(sensor);
    };

    const handleTableClick = (id: string) => () => {
        setSelectedParameter(id);
    };

    let parameter: ISensorParameter | null = null;
    if (selectedParameter) {
        parameter = props.sensor.parameters.findById(selectedParameter);
    }

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={8}>
                    <SensorMap
                        geometry={props.sensor.geolocation}
                        onChangeGeometry={handleChangeGeometry}
                        rtm={props.rtm}
                        sensor={props.sensor}
                        readOnly={true}
                    />
                </Grid.Column>
                <Grid.Column width={8}>
                    <Table color={'grey'} selectable={true}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Parameter</Table.HeaderCell>
                                <Table.HeaderCell>Filters</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {props.sensor.parameters.all.map((p) => (
                                <Table.Row key={p.id} onClick={handleTableClick(p.id)}>
                                    <Table.Cell positive={selectedParameter === p.id}>
                                        {parameterList.filter((i) => i.parameter === p.type)[0].text}
                                    </Table.Cell>
                                    <Table.Cell>{p.filters.length > 0 ? p.filters.length : '-'}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Grid.Column>
            </Grid.Row>

            {parameter &&
            <Grid.Row>
                <Grid.Column>
                    <Segment raised={true}>
                        <Label as={'div'} color={'blue'} ribbon={true}>
                            {parameterList.filter((i) => parameter && i.parameter === parameter.type)[0].text}
                        </Label>
                        <Table color={'grey'} compact={true} celled={true}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Type</Table.HeaderCell>
                                    <Table.HeaderCell>Time range</Table.HeaderCell>
                                    <Table.HeaderCell>Parameters</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {parameter.filters.map((f, key) => (
                                    <Table.Row key={key}>
                                        <Table.Cell/>
                                        <Table.Cell/>
                                        <Table.Cell/>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell colSpan={'3'}>
                                        <Button
                                            floated={'right'}
                                            primary={true}
                                            content={'Add Filter'}
                                        />
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
            }

        </Grid>
    );
};

export default sensorProcessingDetails;
