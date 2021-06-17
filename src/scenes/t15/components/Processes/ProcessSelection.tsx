import {Button, Label, List, Modal, Segment} from 'semantic-ui-react';
import React from 'react';
import _ from 'lodash';
import processes from '../defaults/processes.json';

interface IProps {
  onClose: () => void;
  onAdd: (name: string, group: string) => void;
}

const ProcessSelection = (props: IProps) => {

  const handleClickAdd = (n: string, g: string) => () => props.onAdd(n, g);

  const groups = _.orderBy(_.uniq(processes.map((p) => p.TreatmentGroup)));

  const renderGroup = (g: string) => {
    return (
      <List divided verticalAlign='middle'>
        {_.orderBy(processes.filter((p) => p.TreatmentGroup === g)).map((p, k) => (
          <List.Item key={k}>
            <List.Content floated='right'>
              <Button primary onClick={handleClickAdd(p.TreatmentName, p.TreatmentGroup)}>Add</Button>
            </List.Content>
            <List.Header>{p.TreatmentName}</List.Header>
            {p.TreatmentDescription}
          </List.Item>
        ))}
      </List>
    )
  };

  return (
    <Modal
      dimmer="inverted"
      onClose={props.onClose}
      open={true}
    >
      <Modal.Header>Select a Process</Modal.Header>
      <Modal.Content scrolling>
        {groups.map((g, k) => (
          <Segment key={k}>
            <Label ribbon color="blue">
              {g}
            </Label>
            {renderGroup(g)}
          </Segment>
        ))}
      </Modal.Content>
    </Modal>
  );
}

export default ProcessSelection;
