import { Grid, Icon, Image, Message } from 'semantic-ui-react';
import happyPoints from '../../assets/happy-points.png';
import marCoin from '../../assets/mar-coin.png';

const Header = () => {
  return (
    <Grid>
      <Grid.Row style={{ paddingBottom: 0 }}>
        <Grid.Column width={10}>
          <Message compact icon attached={'bottom'} className={'mission'}>
            <Icon name='info circle' />
            <Message.Content>
              Mission: Ezousa River, Cyprus
              <i aria-hidden="true" className="right chevron icon"></i>
            </Message.Content>
            </Message>
        </Grid.Column>
        <Grid.Column width={2} verticalAlign={'middle'}>
          <div className="ui right labeled tiny button coins">
            <button className="ui icon button">
              <Image src={marCoin} alt="Mar Coins" />
            </button>
            <a className="ui left basic label">-25</a>
          </div>
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
