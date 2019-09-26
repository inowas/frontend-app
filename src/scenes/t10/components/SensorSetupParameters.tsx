import React, {useState} from 'react';
import {Button, Form, Icon, Segment, Table} from 'semantic-ui-react';
import Uuid from 'uuid';
import {Rtm} from '../../../core/model/rtm';
import {ParameterCollection} from '../../../core/model/rtm/ParameterCollection';
import {ISensorParameter} from '../../../core/model/rtm/Sensor.type';
import {parameterList} from '../defaults';
import {SensorSetupParameterDetails} from './index';

interface IProps {
    rtm: Rtm;
    parameters: ParameterCollection;
    onChange: (params: ParameterCollection) => void;
}

const sensorSetupParameters = (props: IProps) => {

    const [parameterType, setParameterType] = useState<string>('');
    const [parameterDescription] = useState<string>('');
    const [editParameter, setEditParameter] = useState<string | null>(null);

    const handleChangeType = (e: any, data: any) => {
        const v = data.value;
        setParameterType(v);
    };

    const handleDeleteProperty = (id: string) => () => {
        const properties = ParameterCollection.fromObject(props.parameters.toObject()).removeById(id);
        props.onChange(properties);
    };

    const handleEditProperty = (id: string) => () => {
        setEditParameter(id);
    };

    const handleAdd = () => {
        const params = ParameterCollection.fromObject(props.parameters.toObject());
        params.add({
            id: Uuid.v4(),
            type: parameterType,
            description: parameterDescription,
            dataSources: [],
            filters: [],
            data: []
        });
        props.onChange(params);
    };

    const handleClose = () => setEditParameter(null);

    const handleChangeProperty = (param: ISensorParameter) => {
        const params = ParameterCollection.fromObject(props.parameters.toObject()).update(param, false);
        props.onChange(params);
    };

    return (
        <div>
            {props.parameters.length > 0 &&
            <Table color={'grey'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Parameter</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Data source</Table.HeaderCell>
                        <Table.HeaderCell/>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {props.parameters.all.map((p) => (
                        <Table.Row key={p.id}>
                            <Table.Cell>{parameterList.filter((i) => i.parameter === p.type)[0].text}</Table.Cell>
                            <Table.Cell>{p.description}</Table.Cell>
                            <Table.Cell>{p.dataSources.length}</Table.Cell>
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
                        <Form.Dropdown
                            selection={true}
                            label={'Parameter'}
                            placeholder={'Parameter'}
                            name={'type'}
                            value={parameterType}
                            onChange={handleChangeType}
                            options={parameterList.map((i) => ({
                                key: i.parameter,
                                text: i.text,
                                value: i.parameter
                            }))}
                            style={{zIndex: 10000}}
                        />
                        <Form.Button
                            content={'Add'}
                            onClick={handleAdd}
                            disabled={parameterType === ''}
                        />
                    </Form.Group>
                </Form>
            </Segment>
            }

            {editParameter &&
            <SensorSetupParameterDetails
                rtm={props.rtm}
                parameter={props.parameters.findById(editParameter)}
                onChange={handleChangeProperty}
                onClose={handleClose}
            />
            }
        </div>
    );
};

export default sensorSetupParameters;
