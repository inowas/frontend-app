import { Button, Card, Image, Menu } from 'semantic-ui-react';
import { IScenario } from '../../../../core/marPro/Scenario.type';
import { getImage } from '../../assets/images';

interface IProps {
  scenario: IScenario;
}

const Toolbox = (props: IProps) => {
  const renderTool = () => {
    return (
      <Menu.Item>
        <Card className="object">
          <Card.Content>
            <Image draggable floated="right" size="mini" src={getImage('o_infiltration_pond')} />
            <Card.Header>Citrus Tree</Card.Header>
            <Card.Description>Property</Card.Description>
          </Card.Content>
        </Card>
      </Menu.Item>
    );
  };

  return (
    <Menu
      className="objects"
      inverted
      vertical
      icon="labeled"
      style={{ left: '0', top: '45px', position: 'absolute', zIndex: 1000 }}
    >
      <Menu.Item className="header" style={{ backgroundColor: '#20b142' }}>
        <Menu pagination secondary>
          <Menu.Item icon="chevron left" as="a" />
          <Menu.Item>
            <Button className="active">Land Use</Button>
          </Menu.Item>
          <Menu.Item icon="chevron right" as="a" />
        </Menu>
      </Menu.Item>
      <Menu.Item icon="angle up" as="a" style={{ padding: 0 }} />
      {renderTool()}
      {renderTool()}
      <Menu.Item icon="angle down" as="a" style={{ padding: 0 }} />
    </Menu>
  );
};

export default Toolbox;
