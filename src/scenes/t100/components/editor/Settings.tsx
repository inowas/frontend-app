import { Grid, Label, Menu, MenuItemProps, Segment } from 'semantic-ui-react';
import { MouseEvent, useState } from 'react';
import Scenario from '../../../../core/marPro/Scenario';

interface IProps {
  scenario: Scenario;
}

const Settings = (props: IProps) => {
  const [activeItem, setActiveItem] = useState<string>('objects');

  const handleItemClick = (e: MouseEvent, { name }: MenuItemProps) => setActiveItem(name || 'objects');

  return (
    <Segment>
      <Grid>
        <Grid.Column width={4}>
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
            <Menu.Item name="consumer" active={activeItem === 'consumer'} onClick={handleItemClick} />
          </Menu>
        </Grid.Column>
        <Grid.Column width={12}>Test</Grid.Column>
      </Grid>
    </Segment>
  );
};

export default Settings;
