import { Grid, Icon, Image, Message } from 'semantic-ui-react';
import GameState from '../../../../core/marPro/GameState';
import MarCoins from '../shared/MarCoins';
import happyPoints from '../../assets/happy-points.png';

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
          <div className="ui right labeled tiny button coins">
            <button className="ui icon button">
              <Image src={happyPoints} className="ui image" />
            </button>
            <div className="ui indicating progress" data-percent="44">
              <div className="bar" style={{ width: '44%' }}>
                <div className="progress">44%</div>
              </div>
            </div>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Header;
