import {
  Accordion,
  AccordionPanel,
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Label,
  List,
  SemanticCOLORS,
} from 'semantic-ui-react';
import { EObjectiveType, TObjective } from '../../../../core/marPro/Objective.type';
import { IGameObject } from '../../../../core/marPro/GameObject.type';
import { IGameState } from '../../../../core/marPro/GameState.type';
import { IParameter, IParameterRelation } from '../../../../core/marPro/Parameter.type';
import { IResourceSettings } from '../../../../core/marPro/Resource.type';
import { IScenario } from '../../../../core/marPro/Scenario.type';
import { useEffect, useState } from 'react';
import GameState from '../../../../core/marPro/GameState';
import Logo from '../../assets/logo_01.png';
import Objective from '../../../../core/marPro/Objective';
import Slider from 'rc-slider';

interface IProps {
  scenario: IScenario;
}

const Game = (props: IProps) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [gameState, setGameState] = useState<IGameState>(GameState.fromScenario(props.scenario).toObject());

  const sendMessage = (m: string) => setMessages([m, ...messages]);

  useEffect(() => {
    sendMessage('Load Scenario');
    setGameState(GameState.fromScenario(props.scenario).toObject());
  }, [props.scenario]);

  const handleSendSolution = () => {
    console.log(gameState);
    sendMessage('Send soultion!');
  };

  const checkObjective = (objective: TObjective) => Objective.fromObject(objective).check(gameState);

  const handleChangeSlider = (gameObject: IGameObject, parameterId: string) => (value: number) => {
    let relations: IParameterRelation[] = [];
    const gsObjects = props.scenario.objects.filter((o) => o.id === gameObject.id);
    if (gsObjects.length > 0) {
      const gsParameters = gsObjects[0].parameters.filter((p) => p.id === parameterId);
      if (gsParameters.length > 0) {
        relations = gsParameters[0].relations || [];
      }
    }

    let cResources = gameState.resources;
    if (relations.length > 0) {
      cResources = gameState.resources.map((r) => {
        const relationsWithThisResource = relations.filter((rRes) => rRes.resourceId === r.id);
        if (relationsWithThisResource.length > 0) {
          if (value > r.value) {
            r.value += Math.round(value * (relationsWithThisResource[0].relation || 1));
          }
          if (value < r.value) {
            r.value -= Math.round(value * (relationsWithThisResource[0].relation || 1));
          }
        }
        sendMessage(`Change slider for ${gameObject.id} - ${parameterId} to ${value}.`);
        return r;
      });
    }

    setGameState({
      ...gameState,
      objects: gameState.objects.map((object) => {
        if (object.id === gameObject.id) {
          object.parameters = object.parameters.map((p) => {
            if (parameterId === p.id) {
              p.value = value;
            }
            return p;
          });
        }
        return object;
      }),
      resources: cResources,
    });
  };

  const renderObjectiveCheck = (type: string, name: string, isDone: boolean, min?: number, max?: number) => {
    const Failed = <Icon name="cancel" />;
    const Success = <Icon name="check" />;

    if (min !== undefined && max !== undefined) {
      return (
        <List.Item>
          {type} {name} must be between {min} and {max}. {isDone ? Success : Failed}
        </List.Item>
      );
    }
    if (min !== undefined && max === undefined) {
      return (
        <List.Item>
          {type} {name} must be higher than {min} {isDone ? Success : Failed}
        </List.Item>
      );
    }
    if (min === undefined && max !== undefined) {
      return (
        <List.Item>
          {type} {name} must be lower than {max} {isDone ? Success : Failed}
        </List.Item>
      );
    }
    return (
      <List.Item>
        {type} {name} must be present. {isDone ? Success : Failed}
      </List.Item>
    );
  };

  const renderParameter = (object: IGameObject, parameter: IParameter) => {
    const gs = gameState.objects.filter;
    return (
      <p>
        {parameter.id}:{' '}
        <Slider
          onChange={handleChangeSlider(object, parameter.id)}
          max={parameter.max}
          min={parameter.min}
          value={parameter.value}
        />
      </p>
    );
  };

  const renderObject = (item: IGameObject) => {
    return (
      <Accordion>
        <AccordionPanel header={item.id} key={item.id}>
          <p>Type: {item.type}</p>
          {item.parameters.map((parameter) => renderParameter(item, parameter))}
        </AccordionPanel>
      </Accordion>
    );
  };

  const renderObjective = (item: TObjective) => {
    if (item.type === EObjectiveType.BY_CELLS) {
      return (
        <List.Item>
          In cells {item.cells.map((c) => `[${c}]`)},{' '}
          {item.parameters.map((p) => `${p.id} must be ${p.type} between ${p.min} and ${p.max}`)}{' '}
        </List.Item>
      );
    }
    if (item.type === EObjectiveType.BY_PARAMETER) {
      return renderObjectiveCheck('Parameter', item.parameterId, checkObjective(item), item.min, item.max);
    }
    if (item.type === EObjectiveType.BY_RESOURCE) {
      return renderObjectiveCheck('Resource', item.resourceId, checkObjective(item), item.min, item.max);
    }
  };

  const renderResource = (resource: IResourceSettings) => {
    const resState = gameState.resources.filter((res) => res.id === resource.id);
    if (resState.length > 0) {
      const res = resState[0];
      return (
        <Label color={resource.color as SemanticCOLORS}>
          {resource.name}: {res.value} {resource.unit}
        </Label>
      );
    }
  };

  return (
    <Grid padded>
      <Grid.Row>
        <Grid.Column width={4}>
          <Image src={Logo} />
        </Grid.Column>
        <Grid.Column width={12}>
          <Header>{props.scenario.title}</Header>
          <p>{props.scenario.description}</p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={8}>
          <Divider orientation="left">Resources</Divider>
          {props.scenario.resources.map((res) => renderResource(res))}
        </Grid.Column>
        <Grid.Column width={8}>
          <Divider orientation="left">Controls</Divider>
          <Button onClick={handleSendSolution} block type="primary">
            Send Soultion
          </Button>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Divider orientation="left">Objectives</Divider>
          <List bordered dataSource={props.scenario.objectives} renderItem={(item: any) => renderObjective(item)} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Divider orientation="left">Objects</Divider>
          <Accordion>{gameState.objects.map((item) => renderObject(item))}</Accordion>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Divider orientation="left">Debug</Divider>
          <div style={{ backgroundColor: 'black', color: 'lime' }}>
            {messages.map((m, k) => (
              <span key={k}>
                {`> ${m}`}
                <br />
              </span>
            ))}
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Game;
