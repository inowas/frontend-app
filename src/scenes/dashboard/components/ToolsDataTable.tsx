import * as Formatter from '../../../services/formatter';
import { Button, Icon, Popup, Table } from 'semantic-ui-react';
import { IToolInstance } from '../../types';
import { IToolMenuItem } from '../defaults/tools';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import NoContent from '../../shared/complexTools/noContent';

interface IOwnProps {
  activeTool: IToolMenuItem;
  cloneToolInstance: (slug: string, id: string) => any;
  deleteToolInstance: (slug: string, id: string) => any;
  showPublicInstances: boolean;
  toolInstances: IToolInstance[];
}

type IProps = IOwnProps & RouteComponentProps;

const toolsDataTable = (props: IProps) => {
  const { activeTool, cloneToolInstance, deleteToolInstance, history, showPublicInstances, toolInstances } = props;
  const { push } = history;
  const { path, subPath, slug } = activeTool;

  if (toolInstances.length === 0) {
    return <NoContent message={'Create a new entry'} />;
  }

  const rows = toolInstances.map((i, index) => (
    <Table.Row key={index}>
      <Table.Cell>
        <Button basic={true} onClick={() => push(path + i.tool + '/' + i.id + subPath)} size="small">
          {i.name}
        </Button>
      </Table.Cell>
      <Table.Cell>{i.tool}</Table.Cell>
      <Table.Cell>{Formatter.dateToDatetime(new Date(i.created_at))}</Table.Cell>
      <Table.Cell>{i.user_name}</Table.Cell>
      <Table.Cell>
        <div className="tableDeleteButton" style={{ paddingRight: '2px' }}>
          <Button.Group size="tiny">
            <Popup
              trigger={
                <Button onClick={() => cloneToolInstance(slug, i.id)} icon={true}>
                  <Icon name="clone" />
                </Button>
              }
              content="Clone"
            />
            {!showPublicInstances && (
              <Popup
                trigger={
                  <Button onClick={() => deleteToolInstance(slug, i.id)} icon={true}>
                    <Icon name="trash" />
                  </Button>
                }
                content="Delete"
              />
            )}
          </Button.Group>
        </div>
      </Table.Cell>
    </Table.Row>
  ));

  return (
    <div>
      <Table selectable={true}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Tool</Table.HeaderCell>
            <Table.HeaderCell>Date created</Table.HeaderCell>
            <Table.HeaderCell>Created by</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>{rows}</Table.Body>
      </Table>
    </div>
  );
};

export default withRouter(toolsDataTable);
