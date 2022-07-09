import { Card, Image, Menu } from 'semantic-ui-react';
import { IResourceSettings } from '../../../../core/marPro/Resource.type';
import { getImage } from '../../assets/images';
import GameState from '../../../../core/marPro/GameState';
import Scenario from '../../../../core/marPro/Scenario';

interface IProps {
  gameState: GameState;
  scenario: Scenario;
}

const Resources = (props: IProps) => {
  const renderResource = (resource: IResourceSettings) => {
    const state = props.gameState.resources.filter((r) => r.id === resource.id);

    if (state.length === 0) {
      return null;
    }

    return (
      <Menu.Item>
        <Card className="object">
          <Card.Content>
            <Image floated="right" src={getImage(resource.icon)} style={{ height: '20px' }} />
            <Card.Header>{resource.name}</Card.Header>
            <Card.Description>{state[0].value}</Card.Description>
          </Card.Content>
        </Card>
      </Menu.Item>
    );
  };

  return (
    <Menu className="objects" inverted vertical icon="labeled">
      <Menu.Item className="header">Resources</Menu.Item>
      {props.scenario.resources.map((r) => renderResource(r))}
    </Menu>
  );
};

export default Resources;
