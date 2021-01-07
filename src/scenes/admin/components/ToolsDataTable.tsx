import * as Formatter from '../../../services/formatter';
import {
  Button,
  Checkbox,
  Form,
  Icon,
  Label,
  Modal,
  Segment,
  Table,
  TableBody,
  TableHeader
} from 'semantic-ui-react';
import { IToolInstance } from '../../types';
import { Link } from 'react-router-dom';
import InputField from './InputField';
import React, { useEffect, useState } from 'react';

interface IProps {
  tools: IToolInstance[];
  onChangeMetadata: (tool: string, id: string, name: string, description: string, isPublic: boolean) => void
  onDelete: (tool: string, id: string) => void,
  showUserName?: boolean;
  readOnly?: boolean;
}

const ToolsDataTable = (props: IProps) => {

  const [selectedTools, setSelectedTools] = useState<IToolInstance[]>([]);
  const [showDeleteModalForTool, setShowDeleteModalForTool] = useState<IToolInstance | null>(null);

  useEffect(() => {
    setSelectedTools(
      props.tools
        .sort((a, b) => ('' + b.updated_at).localeCompare(a.updated_at))
        .sort((a, b) => ('' + a.tool).localeCompare(b.tool))
    );
  }, [props.tools]);

  const handleSearchChange = (e: any, { value }: { value: string }) => {
    setSelectedTools(props.tools.filter((t) => {
      t.created_at = Formatter.dateToDatetime(new Date(t.created_at));
      t.updated_at = Formatter.dateToDatetime(new Date(t.updated_at));
      return JSON.stringify(t).toLowerCase().includes(value.toLowerCase());
    }));
  };

  return (
    <Segment color={'grey'}>
      <Label as="a" color="blue" ribbon>Tools</Label>
      <Form>
        <Form.Input focus placeholder="Search..." size={'big'} onChange={handleSearchChange} />
        <Table selectable={true} fixed={true}>
          <TableHeader>
            <Table.Row>
              <Table.HeaderCell width={2}>Tool</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              {props.showUserName && <Table.HeaderCell>Username</Table.HeaderCell>}
              <Table.HeaderCell>Created</Table.HeaderCell>
              {!props.showUserName && <Table.HeaderCell>Updated</Table.HeaderCell>}
              <Table.HeaderCell width={2}>Public</Table.HeaderCell>
              <Table.HeaderCell width={1} />
            </Table.Row>
          </TableHeader>
          <TableBody>
            {selectedTools.map((t) => (
              <Table.Row key={t.id}>
                <Table.Cell>
                  <Link to={'/tools/' + t.tool + '/' + t.id}>{t.tool}</Link>
                </Table.Cell>
                <Table.Cell>
                  <InputField
                    value={t.name}
                    readOnly={props.readOnly || false}
                    onChange={(value) => props.onChangeMetadata(t.tool, t.id, value, t.description, t.public)}
                    validate={(value) => value.length >= 3}
                  />
                </Table.Cell>
                {props.showUserName && <Table.Cell>{t.user_name}</Table.Cell>}
                <Table.Cell>{Formatter.dateToDatetime(new Date(t.created_at))}</Table.Cell>
                {!props.showUserName &&
                <Table.Cell>{Formatter.dateToDatetime(new Date(t.updated_at))}</Table.Cell>}
                <Table.Cell>
                  <Checkbox
                    toggle={true}
                    checked={t.public}
                    onClick={() => props.onChangeMetadata(t.tool, t.id, t.name, t.description, !t.public)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Button
                    type={'button'}
                    icon={true}
                    onClick={() => setShowDeleteModalForTool(t)}
                    negative={true}
                  >
                    <Icon name={'trash'} />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </TableBody>
        </Table>
      </Form>
      <Modal
        dimmer={'blurring'}
        onClose={() => setShowDeleteModalForTool(null)}
        onOpen={() => setShowDeleteModalForTool(null)}
        open={showDeleteModalForTool !== null}
      >
        <Modal.Header>Delete Tool</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>Do you want to delete this tool?</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setShowDeleteModalForTool(null)}>
            Cancel
          </Button>
          <Button positive={true} onClick={() => {
            if (showDeleteModalForTool) {
              props.onDelete(showDeleteModalForTool.tool, showDeleteModalForTool.id);
            }
            setShowDeleteModalForTool(null);
          }}>
            Yes
          </Button>
        </Modal.Actions>
      </Modal>
    </Segment>
  );
};

export default ToolsDataTable;
