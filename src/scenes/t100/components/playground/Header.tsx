import { Button, Grid, Icon, Image, Message } from 'semantic-ui-react';
import GameState from '../../../../core/marPro/GameState';
import Happiness from '../shared/Happiness';
import MarCoins from '../shared/MarCoins';
import WaterDrop from '../../assets/water-drop.png';

interface IProps {
  gameState: GameState;
  onToggleResourceManager: () => void;
}

const Header = (props: IProps) => {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={4}>
          <Message compact icon attached={'bottom'} className={'mission'}>
            <Icon name="info circle" />
            <Message.Content>
              Mission: Ezousa River, Cyprus
              <Icon name="chevron right" />
            </Message.Content>
          </Message>
        </Grid.Column>
        <Grid.Column width={6} verticalAlign={'middle'} className="water">
          <Image as="div" floated="left" src={WaterDrop} />
          <div className="ui progress">
            <div className="bar budget">
              <div className="progress">Budget 35%</div>
            </div>
            <div className="bar infiltration">
              <div className="progress">Infiltration 65%</div>
            </div>
          </div>
        </Grid.Column>
        <Grid.Column width={2} verticalAlign={'middle'}>
          <Button icon size="tiny" onClick={props.onToggleResourceManager}>
            <Icon name="table" />
            Resources
          </Button>
        </Grid.Column>
        <Grid.Column width={2} verticalAlign={'middle'}>
          <MarCoins amount={props.gameState.getResource('res_coins')} />
        </Grid.Column>
        <Grid.Column width={2} verticalAlign={'middle'}>
          <Happiness amount={props.gameState.getResource('res_happiness')} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Header;
