import { Grid, Icon, Message } from 'semantic-ui-react';
import GameState from '../../../../core/marPro/GameState';

interface IProps {
  gameState: GameState;
  onToggleResourceManager: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      </Grid.Row>
    </Grid>
  );
};

export default Header;
