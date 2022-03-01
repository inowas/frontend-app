import { Button, Grid } from 'semantic-ui-react';
import Dialog from '../shared/Dialog';
import MarCoins from '../shared/MarCoins';
import Tool from '../../../../core/marPro/Tool';
import sound from '../../assets/sounds/cash.mp3';

interface IProps {
  onClickConfirm: (tool: Tool) => any;
  onClickCancel: () => any;
  tool: Tool;
}

const ConfirmBuyGameObject = (props: IProps) => {
  const handleConfirm = () => {
    const audio = new Audio(sound);
    audio.play();
    props.onClickConfirm(props.tool);
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
          <Grid.Row>
            <Grid.Column width={16} textAlign="center">
              {props.tool.cost?.resource === 'res_coins' && <MarCoins amount={props.tool.cost.amount} />}
            </Grid.Column>
          </Grid.Row>
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
