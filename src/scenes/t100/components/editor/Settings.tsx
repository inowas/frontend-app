import { Accordion, AccordionTitleProps, Button, Dropdown, Grid, Icon, Menu, Popup, Segment } from 'semantic-ui-react';
import { BoundaryCollection } from '../../../../core/model/modflow';
import { EObjectiveType, TObjective } from '../../../../core/marPro/Objective.type';
import { IGameObject } from '../../../../core/marPro/GameObject.type';
import { IResourceSettings } from '../../../../core/marPro/Resource.type';
import { MouseEvent, useState } from 'react';
import GameObject from '../../../../core/marPro/GameObject';
import GameObjects from './GameObjects';
import Objective from '../../../../core/marPro/Objective';
import ResourceSettings from '../../../../core/marPro/ResourceSettings';
import Ressources from './Resources';
import Scenario from '../../../../core/marPro/Scenario';
import uuid from 'uuid';

interface IProps {
  boundaries: BoundaryCollection;
  onChange: (scenario: Scenario) => void;
  scenario: Scenario;
}

const Settings = (props: IProps) => {
  const [activeIndex, setActiveIndex] = useState<string>('resources');
  const [activeResource, setActiveResource] = useState<IResourceSettings>();
  const [activeObject, setActiveObject] = useState<IGameObject>();
  const [activeObjective, setActiveObjective] = useState<TObjective>();

  const handleAdd = (type?: string, id?: string) => () => {
    const cScenario = props.scenario.toObject();

    if (activeIndex === 'resources') {
      const newResource = ResourceSettings.fromDefaults();
      cScenario.resources.push(newResource.toObject());
      setActiveResource(newResource.toObject());
    }

    if (activeIndex === 'objects') {
      const newGameObject = GameObject.createInfiltrationPond();
      cScenario.objects.push(newGameObject.toObject());
      setActiveObject(newGameObject.toObject());
    }

    if (activeIndex === 'objectives' && type && id) {
      const newObjective = Objective.fromType(type, id);
      cScenario.objectives.push(newObjective.toObject());
      setActiveObjective(newObjective.toObject());
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

    if (activeIndex === 'objects') {
      const fObject = props.scenario.objects.filter((o) => o.id === id);
      if (fObject.length > 0) {
        const newObject = GameObject.fromObject(fObject[0]).getClone();
        newObject.id = uuid.v4();
        cScenario.objects.push(newObject.toObject());
      }
    }

    if (activeIndex === 'objectives') {
      const fObjective = props.scenario.objectives.filter((o) => o.id === id);
      if (fObjective.length > 0) {
        const newObjective = Objective.fromObject(fObjective[0]).getClone();
        newObjective.id = uuid.v4();
        cScenario.objectives.push(newObjective.toObject());
      }
    }

    props.onChange(Scenario.fromObject(cScenario));
  };

  const handleDeleteItem = (id: string) => () => {
    const cScenario = props.scenario.toObject();

    if (activeIndex === 'resources') {
      cScenario.resources = cScenario.resources.filter((r) => r.id !== id);
    }

    if (activeIndex === 'objects') {
      cScenario.objects = cScenario.objects.filter((o) => o.id !== id);
    }

    if (activeIndex === 'objectives') {
      cScenario.objectives = cScenario.objectives.filter((o) => o.id !== id);
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

  const handleChangeGameObject = (object: GameObject) => {
    const cScenario = props.scenario.toObject();

    const fObject = props.scenario.objects.filter((o) => o.id === object.id);
    if (fObject.length > 0) {
      cScenario.objects = cScenario.objects.map((obj) => {
        if (obj.id === object.id) {
          return object.toObject();
        }
        return obj;
      });
    }

    props.onChange(Scenario.fromObject(cScenario));
    setActiveObject(object.toObject());
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

    if (activeIndex === 'objects') {
      const fObjects = props.scenario.objects.filter((o) => o.id === id);
      if (fObjects.length > 0) {
        setActiveObject(fObjects[0]);
      }
    }

    if (activeIndex === 'objectives') {
      const fObjectives = props.scenario.objectives.filter((o) => o.id === id);
      if (fObjectives.length > 0) {
        setActiveObjective(fObjectives[0]);
      }
    }
  };

  const handleAccordionClick = (_: MouseEvent, { index }: AccordionTitleProps) =>
    typeof index === 'string' ? setActiveIndex(index) : null;

  const renderContent = () => {
    if (activeIndex === 'resources' && activeResource) {
      return <Ressources resource={ResourceSettings.fromObject(activeResource)} onChange={handleChangeResource} />;
    }
    if (activeIndex === 'objects' && activeObject) {
      return (
        <GameObjects
          boundaries={props.boundaries}
          object={GameObject.fromObject(activeObject)}
          onChange={handleChangeGameObject}
          scenario={props.scenario}
        />
      );
    }
    return null;
  };

  const getObjectiveName = (o: TObjective) => {
    if (o.type === EObjectiveType.BY_PARAMETER) {
      return `Parameter ${o.parameterId}`;
    }
    if (o.type === EObjectiveType.BY_RESOURCE) {
      const resource = props.scenario.resources.filter((r) => r.id === o.resourceId);
      return `Resource ${resource.length > 0 ? resource[0].name : o.resourceId}`;
    }
    return 'Observation';
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
                  <Button fluid positive icon labelPosition="left" onClick={handleAdd()}>
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

            <Accordion.Title active={activeIndex === 'objects'} index={'objects'} onClick={handleAccordionClick}>
              <Icon name="dropdown" />
              Game Objects
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 'objects'}>
              <Menu fluid vertical secondary>
                <Menu.Item>
                  <Button fluid positive icon labelPosition="left" onClick={handleAdd()}>
                    <Icon name="add" />
                    Add new Game Object
                  </Button>
                </Menu.Item>
                {props.scenario.objects.map((o) => (
                  <Menu.Item
                    active={activeObject && activeObject.id === o.id && activeIndex === 'objects'}
                    key={o.id}
                    onClick={handleItemClick(o.id)}
                  >
                    {o.type}
                    <Popup
                      trigger={<Icon name="ellipsis horizontal" />}
                      content={
                        <Button.Group floated="right" size="small">
                          <Popup
                            trigger={<Button icon={'clone'} onClick={handleCloneItem(o.id)} />}
                            content="Clone"
                            position="top center"
                            size="mini"
                          />
                          <Popup
                            trigger={<Button icon={'trash'} onClick={handleDeleteItem(o.id)} />}
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
              <Menu fluid vertical secondary>
                <Menu.Item>
                  <Dropdown
                    text="Add new Objective"
                    icon="add"
                    labeled={true}
                    button={true}
                    fluid
                    className="icon blue"
                  >
                    <Dropdown.Menu>
                      <Dropdown.Header>Choose type</Dropdown.Header>
                      <Dropdown.Item disabled={true}>
                        <Dropdown text="Depending on Parameter">
                          <Dropdown.Menu>
                            <Dropdown.Header>Mens</Dropdown.Header>
                            <Dropdown.Item>Shirts</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Dropdown.Item>
                      <Dropdown.Item disabled={props.scenario.resources.length === 0}>
                        <Dropdown text="Depending on Resource">
                          <Dropdown.Menu>
                            {props.scenario.resources.map((r, k) => (
                              <Dropdown.Item key={`obj_res_${k}`} onClick={handleAdd(EObjectiveType.BY_RESOURCE, r.id)}>
                                {r.name}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleAdd(EObjectiveType.BY_OBSERVATION, 'TODO')}>
                        Depending on Observation
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu.Item>
                {props.scenario.objectives.map((o) => (
                  <Menu.Item
                    active={activeObjective && activeObjective.id === o.id && activeIndex === 'objectives'}
                    key={o.id}
                    onClick={handleItemClick(o.id)}
                  >
                    {getObjectiveName(o)}
                    <Popup
                      trigger={<Icon name="ellipsis horizontal" />}
                      content={
                        <Button.Group floated="right" size="small">
                          <Popup
                            trigger={<Button icon={'clone'} onClick={handleCloneItem(o.id)} />}
                            content="Clone"
                            position="top center"
                            size="mini"
                          />
                          <Popup
                            trigger={<Button icon={'trash'} onClick={handleDeleteItem(o.id)} />}
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
          </Accordion>
        </Grid.Column>
        <Grid.Column width={12}>{renderContent()}</Grid.Column>
      </Grid>
    </Segment>
  );
};

export default Settings;
