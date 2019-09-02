import React, {useState} from 'react';
import {Button, Form, Icon, Segment, Table} from 'semantic-ui-react';
import Uuid from 'uuid';
import {Rtm} from '../../../core/model/rtm';
import {ISensorProperty} from '../../../core/model/rtm/Sensor.type';
import {SensorPropertyCollection} from '../../../core/model/rtm/SensorPropertyCollection';
import {SensorPropertyDetails} from './index';

interface IProps {
    rtm: Rtm;
    properties: SensorPropertyCollection;
    onChange: (properties: SensorPropertyCollection) => void;
}

const sensorProperties = (props: IProps) => {

    const [propertyName, setPropertyName] = useState<string>('');
    const [editProperty, setEditProperty] = useState<string | null>(null);

    const handleChange = (e: any, data: any) => {
        const v = data.value;
        setPropertyName(v);
    };

    const handleDeleteProperty = (id: string) => () => {
        const properties = SensorPropertyCollection.fromObject(props.properties.toObject()).removeById(id);
        props.onChange(properties);
    };

    const handleEditProperty = (id: string) => () => {
        setEditProperty(id);
    };

    const handleAdd = () => {
        const properties = SensorPropertyCollection.fromObject(props.properties.toObject());
        properties.add({
            id: Uuid.v4(),
            name: propertyName,
            dataSource: {
                type: 'noSource',
                server: null,
                query: null
            },
            filters: [],
            data: []
        });
        props.onChange(properties);
    };

    const handleClose = () => setEditProperty(null);

    const handleChangeProperty = (property: ISensorProperty) => {
        const properties = SensorPropertyCollection.fromObject(props.properties.toObject()).update(property, false);
        props.onChange(properties);
    };

    return (
        <div>
            {props.properties.length > 0 &&
            <Table color={'grey'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Property</Table.HeaderCell>
                        <Table.HeaderCell>Data source</Table.HeaderCell>
                        <Table.HeaderCell>Filters</Table.HeaderCell>
                        <Table.HeaderCell/>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {props.properties.all.map((p) => (
                        <Table.Row key={p.id}>
                            <Table.Cell>{p.name}</Table.Cell>
                            <Table.Cell>{p.dataSource.type}</Table.Cell>
                            <Table.Cell>{p.filters.length === 0 ? '-' : p.filters.length}</Table.Cell>
                            <Table.Cell textAlign={'right'}>
                                {!props.rtm.readOnly &&
                                <Button.Group>
                                    <Button icon={true}>
                                        <Icon
                                            name={'pencil alternate'}
                                            onClick={handleEditProperty(p.id)}
                                        />
                                    </Button>
                                    <Button icon={true}>
                                        <Icon
                                            name={'trash'}
                                            onClick={handleDeleteProperty(p.id)}
                                        />
                                    </Button>
                                </Button.Group>
                                }
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            }

            {!props.rtm.readOnly &&
            <Segment color={'grey'}>
                <Form>
                    <Form.Group
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-end'
                        }}
                    >
                        <Form.Input
                            label={'Add new property:'}
                            placeholder={'Property'}
                            name={'property'}
                            value={propertyName}
                            onChange={handleChange}
                        />
                        <Form.Button
                            content={'Add'}
                            onClick={handleAdd}
                            disabled={propertyName.length < 1}
                        />
                    </Form.Group>
                </Form>
            </Segment>
            }

            {editProperty &&
            <SensorPropertyDetails
                rtm={props.rtm}
                sensorProperty={props.properties.findById(editProperty)}
                onChange={handleChangeProperty}
                onClose={handleClose}
            />
            }
        </div>
    );
};

export default sensorProperties;
