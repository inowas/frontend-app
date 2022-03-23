import {
  Accordion,
  AccordionTitleProps,
  Button,
  Grid,
  Icon,
  Label,
  List,
  Menu,
  MenuItemProps,
  Segment,
} from 'semantic-ui-react';
import { MouseEvent, useState } from 'react';
import Ressources from './Resources';
import Scenario from '../../../../core/marPro/Scenario';

interface IProps {
  scenario: Scenario;
}

const Settings = (props: IProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeItem, setActiveItem] = useState<string>('objects');

  const handleAdd = (type: string) => () => {
    const cScenario = Scenario.fromObject(props.scenario.toObject());

    switch (type) {
      case 'resource':
        cScenario.resources.push();
    }
  };

  const handleItemClick = (e: MouseEvent, { name }: MenuItemProps) => setActiveItem(name || 'objects');

  const handleAccordionClick = (e: MouseEvent, { index }: AccordionTitleProps) =>
    typeof index === 'number' ? setActiveIndex(index) : null;

  const renderContent = () => {
    return <Ressources />;
  };

  return (
    <Segment>
      <Grid>
        <Grid.Column width={4}>
          <Accordion styled>
            <Accordion.Title active={activeIndex === 0} index={0} onClick={handleAccordionClick}>
              <Icon name="dropdown" />
              Game-Objects
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              <Button icon="add" />
            </Accordion.Content>
            <Accordion.Title active={activeIndex === 1} index={1} onClick={handleAccordionClick}>
              <Icon name="dropdown" />
              Resources
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 1}>
              <List selection>
                <List.Item onClick={handleAdd('resource')}>
                  <Icon name="add" />
                  <List.Content>Add new Resource</List.Content>
                </List.Item>
                {props.scenario.resources.map((r) => (
                  <List.Item key={r.id}>{r.id}</List.Item>
                ))}
              </List>
            </Accordion.Content>
          </Accordion>

          <Menu fluid tabular vertical>
            {activeItem === 'objects' ? (
              <Menu.Item>
                <Menu.Header>Game Objects</Menu.Header>
                <Menu.Menu>
                  {props.scenario.objects.map((object) => (
                    <Menu.Item key={object.id}>{object.id}</Menu.Item>
                  ))}
                </Menu.Menu>
              </Menu.Item>
            ) : (
              <Menu.Item name="objects" active={activeItem === 'objects'} onClick={handleItemClick}>
                {props.scenario.objects.length > 0 && <Label color="teal">{props.scenario.objects.length}</Label>}
                Game Objects
              </Menu.Item>
            )}
            <Menu.Item name="ressources" active={activeItem === 'ressources'} onClick={handleItemClick}>
              Ressources
              <Icon link name="add" />
            </Menu.Item>
          </Menu>
        </Grid.Column>
        <Grid.Column width={12}>{renderContent()}</Grid.Column>
      </Grid>
    </Segment>
  );
};

export default Settings;
