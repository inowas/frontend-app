import { Button, Header, Icon, Modal, Select, Table } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import { IBoundary } from '../../../../core/model/modflow/boundaries/Boundary.type';
import GameState from '../../../../core/marPro/GameState';
import Scenario from '../../../../core/marPro/Scenario';

interface IProps {
    gameState: GameState;
    onClose: () => any;
    scenario: Scenario;
  }

const variabilityOptions = [
    { key: 'v', text: 'variable', value: 'variable' },
    { key: 'f', text: 'fixed', value: 'fixed' },
  ]

const ResourceManager = (props: IProps) => {
    const [boundaries, setBoundaries] = useState<IBoundary[]>();
    const [status, setStatus] = useState<string[]>([]);

    return (
    <Modal 
        open={true}
        closeIcon
        onClose={props.onClose}
        size='fullscreen'
    >
        <Header as='h2'>
            <Icon name='table' />
            <Header.Content>Resource Manager</Header.Content>
        </Header>
        <Modal.Content>
            <Table>
                <Table.Header>
                    <Table.Row verticalAlign='top'>
                        <Table.HeaderCell rowSpan='2'>Category</Table.HeaderCell>
                        <Table.HeaderCell rowSpan='2'>Objects</Table.HeaderCell>
                        <Table.HeaderCell colSpan='3'>Location</Table.HeaderCell>
                        <Table.HeaderCell colSpan='2'>Properties</Table.HeaderCell>
                        <Table.HeaderCell>Values</Table.HeaderCell>
                        <Table.HeaderCell>Constraints</Table.HeaderCell>
                        <Table.HeaderCell>MAR coins</Table.HeaderCell>
                        <Table.HeaderCell>Happiness Points</Table.HeaderCell>
                        <Table.HeaderCell>Comments</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell style={{fontWeight: 'normal'}}>Lat</Table.HeaderCell>
                        <Table.HeaderCell>Long</Table.HeaderCell>
                        <Table.HeaderCell>Variability</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Variability</Table.HeaderCell>
                        <Table.HeaderCell>m3/day</Table.HeaderCell>
                        <Table.HeaderCell>Min, max, slider steps</Table.HeaderCell>
                        <Table.HeaderCell>Cost/ m3</Table.HeaderCell>
                        <Table.HeaderCell>Profit/ m3</Table.HeaderCell>
                        <Table.HeaderCell>Additional Info</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell rowSpan='4'>Hydrotechnical structures</Table.Cell>
                        <Table.Cell>Public Well 01</Table.Cell>
                        <Table.Cell>34,73</Table.Cell>
                        <Table.Cell>32,46</Table.Cell>
                        <Table.Cell><Select placeholder='' options={variabilityOptions} style={{minWidth: '8em'}} /></Table.Cell>
                        <Table.Cell>Abstraction rate</Table.Cell>
                        <Table.Cell><Select placeholder='' options={variabilityOptions} style={{minWidth: '8em'}} /></Table.Cell>
                        <Table.Cell>1.500</Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </Modal.Content>
        <Modal.Actions>
        <Button color='red'>
          <Icon name='remove' /> No
        </Button>
        <Button color='green'>
          <Icon name='checkmark' /> Yes
        </Button>
      </Modal.Actions>
  </Modal>
)
}
export default ResourceManager