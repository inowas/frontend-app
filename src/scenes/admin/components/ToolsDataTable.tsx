import * as Formatter from '../../../services/formatter';
import {Button, Checkbox, Form, Icon, Label, Segment, Table, TableBody, TableHeader} from 'semantic-ui-react';
import {IToolInstance} from '../../types';
import {Link} from 'react-router-dom';
import React, {useEffect, useState} from 'react';

interface IProps {
    tools: IToolInstance[];
    onChangeMetadata: (tool: string, id: string, name: string, description: string, isPublic: boolean) => void
    onDelete: (tool: string, id: string) => void
}

const ToolsDataTable = (props: IProps) => {

    const [selectedTools, setSelectedTools] = useState<IToolInstance[]>([]);

    useEffect(() => {
        setSelectedTools(
            props.tools
                .sort((a, b) => ('' + b.updated_at).localeCompare(a.updated_at))
                .sort((a, b) => ('' + a.tool).localeCompare(b.tool))
        );
    }, [props.tools]);

    const handleSearchChange = (e: any, {value}: { value: string }) => {
        setSelectedTools(props.tools.filter((t) => JSON.stringify(t).includes(value)));
    };

    return (
        <Segment color={'grey'}>
            <Label as='a' color='blue' ribbon>Tools</Label>
            <Form>
                <Form.Input focus placeholder='Search...' size={'big'} onChange={handleSearchChange}/>
                <Table selectable={true}>
                    <TableHeader>
                        <Table.Row>
                            <Table.HeaderCell>Tool</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Created</Table.HeaderCell>
                            <Table.HeaderCell>Updated</Table.HeaderCell>
                            <Table.HeaderCell>Public</Table.HeaderCell>
                            <Table.HeaderCell/>
                        </Table.Row>
                    </TableHeader>
                    <TableBody>
                        {selectedTools.map((t) => (
                            <Table.Row key={t.id}>
                                <Table.Cell>
                                    <Link to={'/tools/' + t.tool + '/' + t.id}>{t.tool}</Link>
                                </Table.Cell>
                                <Table.Cell>
                                    <Form.Input
                                        readOnly={true}
                                        type={'text'}
                                        value={t.name}
                                    />
                                </Table.Cell>
                                <Table.Cell>{Formatter.dateToDatetime(new Date(t.created_at))}</Table.Cell>
                                <Table.Cell>{Formatter.dateToDatetime(new Date(t.updated_at))}</Table.Cell>
                                <Table.Cell>
                                    <Checkbox
                                        toggle={true}
                                        checked={t.public}
                                        onClick={() => props.onChangeMetadata(t.tool, t.id, t.name, t.description, t.public)}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Button
                                        icon={true}
                                        onClick={() => props.onDelete(t.tool, t.id)}
                                        negative={true}
                                    >
                                        <Icon name={'trash'}/>
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </TableBody>
                </Table>
            </Form>
        </Segment>
    );
};

export default ToolsDataTable;
