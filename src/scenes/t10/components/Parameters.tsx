import React, {useState} from 'react';
import {Button, Form, Icon, Segment, Table} from 'semantic-ui-react';
import Uuid from 'uuid';
import {Rtm} from '../../../core/model/rtm';
import {ParameterCollection} from '../../../core/model/rtm/ParameterCollection';
import {ISensorProperty} from '../../../core/model/rtm/Sensor.type';
import {ParameterDetails} from './index';

interface IProps {
    rtm: Rtm;
    parameters: ParameterCollection;
    onChange: (properties: ParameterCollection) => void;
}

const parameters = (props: IProps) => {

    const [parameterName, setParameterName] = useState<string>('');
    const [editParameter, setEditParameter] = useState<string | null>(null);

    const handleChange = (e: any, data: any) => {
        const v = data.value;
        setParameterName(v);
    };

    const handleDeleteProperty = (id: string) => () => {
        const properties = ParameterCollection.fromObject(props.parameters.toObject()).removeById(id);
        props.onChange(properties);
    };

    const handleEditProperty = (id: string) => () => {
        setEditParameter(id);
    };

    const handleAdd = () => {
        const properties = ParameterCollection.fromObject(props.parameters.toObject());
        properties.add({
            id: Uuid.v4(),
            name: parameterName,
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

    const handleClose = () => setEditParameter(null);

    const handleChangeProperty = (property: ISensorProperty) => {
        const properties = ParameterCollection.fromObject(props.parameters.toObject()).update(property, false);
        props.onChange(properties);
    };

    return (
        <div>
            {props.parameters.length > 0 &&
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
                    {props.parameters.all.map((p) => (
                        <Table.Row key={p.id}>
                            <Table.Cell>{p.name}</Table.Cell>
                            <Table.Cell>{p.dataSource.type}</Table.Cell>
                            <Table.Cell>{p.filters.length === 0 ? '-' : p.filters.length}</Table.Cell>
                            <Table.Cell textAlign={'right'}>
                                {!props.rtm.readOnly &&
                                <Button.Group>
                                    <Button icon={true} onClick={handleEditProperty(p.id)}>
                                        <Icon name={'pencil alternate'}/>
                                    </Button>
                                    <Button icon={true} onClick={handleDeleteProperty(p.id)}>
                                        <Icon name={'trash'}/>
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
                            label={'Add parameter:'}
                            placeholder={'Parameter'}
                            name={'parameter'}
                            value={parameterName}
                            onChange={handleChange}
                        />
                        <Form.Button
                            content={'Add'}
                            onClick={handleAdd}
                            disabled={parameterName.length < 1}
                        />
                    </Form.Group>
                </Form>
            </Segment>
            }

            {editParameter &&
            <ParameterDetails
                rtm={props.rtm}
                sensorProperty={props.parameters.findById(editParameter)}
                onChange={handleChangeProperty}
                onClose={handleClose}
            />
            }
        </div>
    );
};

export default parameters;
