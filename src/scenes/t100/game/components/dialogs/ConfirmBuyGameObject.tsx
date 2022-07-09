import { Button, Grid } from 'semantic-ui-react';
import { ICost } from '../../../../../core/marPro/Tool.type';
import Dialog from '../shared/Dialog';
import ResourceLabel from '../shared/ResourceLabel';
import ResourceSettings from '../../../../../core/marPro/ResourceSettings';
import Scenario from '../../../../../core/marPro/Scenario';
import Tool from '../../../../../core/marPro/Tool';

interface IProps {
  onClickConfirm: (tool: Tool) => any;
  onClickCancel: () => any;
  scenario: Scenario;
  tool: Tool;
}

const ConfirmBuyGameObject = (props: IProps) => {
  const handleConfirm = () => props.onClickConfirm(props.tool);

  const renderCost = (cost: ICost) => {
    const resource = props.scenario.resources.filter((r) => r.id === cost.resource);
    if (resource.length === 0) {
      return (
        <p key={`cost_${cost.resource}`}>
          {cost.id}: {cost.amount}
        </p>
      );
    }
    return (
      <p key={`cost_${cost.resource}`}>
        <ResourceLabel amount={cost.amount} resource={ResourceSettings.fromObject(resource[0])} />
      </p>
    );
  };

  return (
    <Dialog
      header="Purchase new object"
      content={
        <Grid style={{ width: '400px' }}>
          <Grid.Row>
            <Grid.Column width={16} textAlign="center">
              Do you really want to build this object?
            </Grid.Column>
          </Grid.Row>
          {props.tool.costs.length > 0 && (
            <Grid.Row>
              <Grid.Column width={16} textAlign="center">
                {props.tool.costs.map((cost) => renderCost(cost))}
              </Grid.Column>
            </Grid.Row>
          )}
          <Grid.Row>
            <Grid.Column width={16}>
              <Button.Group fluid widths={2}>
                <Button negative onClick={props.onClickCancel}>
                  Cancel
                </Button>
                <Button.Or />
                <Button positive onClick={handleConfirm}>
                  Confirm and Pay
                </Button>
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      }
      onClose={props.onClickCancel}
    />
  );
};

export default ConfirmBuyGameObject;
