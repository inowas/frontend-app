import { Grid, Icon, Message } from 'semantic-ui-react';
import GameState from '../../../../core/marPro/GameState';
import Happiness from '../shared/Happiness';
import MarCoins from '../shared/MarCoins';

interface IProps {
  gameState: GameState;
}

const Header = (props: IProps) => {
  return (
    <Grid>
      <Grid.Row style={{ paddingBottom: 0 }}>
        <Grid.Column width={10}>
          <Message compact icon attached={'bottom'} className={'mission'}>
            <Icon name="info circle" />
            <Message.Content>
              Mission: Ezousa River, Cyprus
              <i aria-hidden="true" className="right chevron icon"></i>
            </Message.Content>
          </Message>
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
