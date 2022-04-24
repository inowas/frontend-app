import { Accordion, AccordionTitleProps, Button, Grid, Icon, List, Menu, Popup, Segment } from 'semantic-ui-react';
import { IResourceSettings } from '../../../../core/marPro/Resource.type';
import { MouseEvent, useState } from 'react';
import ResourceSettings from '../../../../core/marPro/ResourceSettings';
import Ressources from './Resources';
import Scenario from '../../../../core/marPro/Scenario';
import uuid from 'uuid';

interface IProps {
  onChange: (scenario: Scenario) => void;
  scenario: Scenario;
}

const Settings = (props: IProps) => {
  const [activeIndex, setActiveIndex] = useState<string>('resources');
  const [activeResource, setActiveResource] = useState<IResourceSettings>();

  const handleAdd = () => {
    const cScenario = props.scenario.toObject();

    if (activeIndex === 'resources') {
      const newResource = ResourceSettings.fromDefaults();
      cScenario.resources.push(newResource.toObject());
      setActiveResource(newResource.toObject());
    }

    props.onChange(Scenario.fromObject(cScenario));
  };

  const handleCloneItem = (id: string) => () => {
    const cScenario = props.scenario.toObject();

    if (activeIndex === 'resources') {
      const fResource = props.scenario.resources.filter((r) => r.id === id);
      if (fResource.length > 0) {
        const newResource = ResourceSettings.fromObject(fResource[0]).getClone();
        newResource.id = uuid.v4();
        cScenario.resources.push(newResource.toObject());
      }
    }

    props.onChange(Scenario.fromObject(cScenario));
  };

  const handleDeleteItem = (id: string) => () => {
    const cScenario = props.scenario.toObject();

    if (activeIndex === 'resources') {
      cScenario.resources = cScenario.resources.filter((r) => r.id !== id);
    }

    setActiveResource(undefined);
    props.onChange(Scenario.fromObject(cScenario));
  };

  const handleChangeResource = (resource: ResourceSettings) => {
    const cScenario = props.scenario.toObject();

    const fResource = props.scenario.resources.filter((r) => r.id === resource.id);
    if (fResource.length > 0) {
      cScenario.resources = cScenario.resources.map((res) => {
        if (res.id === resource.id) {
          return resource.toObject();
        }
        return res;
      });
    }

    props.onChange(Scenario.fromObject(cScenario));
    setActiveResource(resource.toObject());
  };

  const handleItemClick = (id: string) => (e: MouseEvent) => {
    if (e.currentTarget !== e.target) {
      return;
    }
    if (activeIndex === 'resources') {
      const fResources = props.scenario.resources.filter((r) => r.id === id);
      if (fResources.length > 0) {
        setActiveResource(fResources[0]);
      }
    }
  };

  const handleAccordionClick = (_: MouseEvent, { index }: AccordionTitleProps) =>
    typeof index === 'string' ? setActiveIndex(index) : null;

  const renderContent = () => {
    if (activeIndex === 'resources' && activeResource) {
      return <Ressources resource={ResourceSettings.fromObject(activeResource)} onChange={handleChangeResource} />;
    }
    return null;
  };

  return (
    <Segment>
      <Grid>
        <Grid.Column width={4}>
          <Accordion styled>
            <Accordion.Title active={activeIndex === 'resources'} index={'resources'} onClick={handleAccordionClick}>
              <Icon name="dropdown" />
              Resources
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 'resources'}>
              <Menu fluid vertical secondary>
                <Menu.Item>
                  <Button fluid icon labelPosition="left" onClick={handleAdd}>
                    <Icon name="add" />
                    Add new Resource
                  </Button>
                </Menu.Item>
                {props.scenario.resources.map((r) => (
                  <Menu.Item
                    active={activeResource && activeResource.id === r.id && activeIndex === 'resources'}
                    key={r.id}
                    onClick={handleItemClick(r.id)}
                  >
                    {r.name}
                    <Popup
                      trigger={<Icon name="ellipsis horizontal" />}
                      content={
                        <Button.Group floated="right" size="small">
                          <Popup
                            trigger={<Button icon={'clone'} onClick={handleCloneItem(r.id)} />}
                            content="Clone"
                            position="top center"
                            size="mini"
                          />
                          <Popup
                            trigger={<Button icon={'trash'} onClick={handleDeleteItem(r.id)} />}
                            content="Delete"
                            position="top center"
                            size="mini"
                          />
                        </Button.Group>
                      }
                      on={'click'}
                      position={'right center'}
                    />
                  </Menu.Item>
                ))}
              </Menu>
            </Accordion.Content>
            <Accordion.Title active={activeIndex === 'objectives'} index={'objectives'} onClick={handleAccordionClick}>
              <Icon name="dropdown" />
              Objectives
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 'objectives'}>
              <List selection>
                <List.Item onClick={handleAdd}>
                  <Icon name="add" />
                  <List.Content>Add new Objective</List.Content>
                </List.Item>
                {props.scenario.objectives.map((o) => (
                  <List.Item key={o.id}>{o.id}</List.Item>
                ))}
              </List>
            </Accordion.Content>

            <Accordion.Title active={activeIndex === 'objects'} index={'objects'} onClick={handleAccordionClick}>
              <Icon name="dropdown" />
              Game Objects
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 'objects'}>
              <List selection>
                <List.Item onClick={handleAdd}>
                  <Icon name="add" />
                  <List.Content>Add new Game Object</List.Content>
                </List.Item>
                {props.scenario.objects.map((o) => (
                  <List.Item key={o.id}>{o.id}</List.Item>
                ))}
              </List>
            </Accordion.Content>
          </Accordion>
        </Grid.Column>
        <Grid.Column width={12}>{renderContent()}</Grid.Column>
      </Grid>
    </Segment>
  );
};

export default Settings;
