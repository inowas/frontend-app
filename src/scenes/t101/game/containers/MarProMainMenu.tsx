import './style.css';
import { AppContainer } from '../../../shared';
import { Breadcrumb, Button, Grid, Header, Icon, List, Search, Segment } from 'semantic-ui-react';
import { IGameStateSimpleTool } from '../../../../core/marPro/GameState.type';
import { IScenarioTool } from '../../../../core/marPro/Scenario.type';
import { IToolInstance } from '../../../types';
import { asyncSendCommand, fetchUrl, sendCommand } from '../../../../services/api';
import { createToolInstance, deleteToolInstance } from '../../../dashboard/commands';
import { updateGameState, updateScenario } from '../actions/actions';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Game from '../components/Game';
import GameState from '../../../../core/marPro/GameState';
import ModflowModelCommand from '../../../t03/commands/modflowModelCommand';
import Scenario from '../../../../core/marPro/Scenario';
import uuid from 'uuid';

const navigation = [
  {
    name: 'Documentation',
    path: 'https://inowas.com/tools',
    icon: <Icon name="file" />,
  },
];

const MarProMainMenu = () => {
  const [errorLoading, setErrorLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toolInstances, setToolInstances] = useState<IToolInstance[]>([]);
  const [scenarios, setScenarios] = useState<IToolInstance[]>([]);

  const history = useHistory();
  const { property } = useParams<any>();
  const dispatch = useDispatch();

  const fetchingAttempts = useRef<number>(0);

  console.log({ toolInstances, scenarios });

  const fetchScenarios = useCallback(() => {
    fetchUrl(
      'tools/T100?public=false',
      (data: any) => {
        setScenarios(data);
        setIsLoading(false);
      },
      () => {
        // TODO: not pretty but works for now
        fetchingAttempts.current = fetchingAttempts.current + 1;
        if (fetchingAttempts.current <= 5) {
          fetchInstances();
        }

        if (fetchingAttempts.current > 5) {
          setErrorLoading(true);
        }
      }
    );
  }, []);

  const fetchInstances = useCallback(() => {
    fetchUrl(
      'tools/marpro?public=false',
      (data: any) => {
        setToolInstances(data);
        setIsLoading(false);
      },
      () => {
        // TODO: not pretty but works for now
        fetchingAttempts.current = fetchingAttempts.current + 1;
        if (fetchingAttempts.current <= 5) {
          fetchInstances();
        }

        if (fetchingAttempts.current > 5) {
          setErrorLoading(true);
        }
      }
    );
  }, []);

  useEffect(() => {
    fetchScenarios();
    fetchInstances();
  }, []);

  const handleDeleteInstance = (i: IToolInstance) => () => {
    setIsLoading(true);

    fetchUrl(
      `tools/marpro/${i.id}`,
      (g: IGameStateSimpleTool) => {
        sendCommand(
          deleteToolInstance('marpro', i.id),
          async () => {
            if (g.data.modelId) {
              await asyncSendCommand(ModflowModelCommand.deleteModflowModel({ id: g.data.modelId }));
            }
            fetchInstances();
          },
          () => {
            setIsLoading(false);
          }
        );
      },
      () => {
        setIsLoading(false);
      }
    );
  };

  const handleSelectInstance = (i: IToolInstance) => {
    history.push(`marpro/${i.id}`);
  };

  const handleSelectScenario = async (id: string) => {
    // FETCH SCENARIO FROM ID
    /*
    dispatch(updateScenario(Scenario.fromObject(scenario)));

    const newInstance = GameState.fromScenario(Scenario.fromObject(scenario));

    if (scenario.data.modelId) {
      const modelId = uuid.v4();
      await asyncSendCommand(
        ModflowModelCommand.cloneModflowModel({ id: scenario.data.modelId, newId: modelId, isTool: false })
      );
      newInstance.modelId = modelId;
    }

    sendCommand(
      createToolInstance('marpro', newInstance.toToolInstance()),
      () => {
        dispatch(updateGameState(newInstance));
        history.push(`T100/scenario/${newInstance.id}`);
      },
      (e) => console.log('ERROR', e)
    );*/
  };

  const renderBreadcumbs = () => {
    return (
      <Breadcrumb>
        <Breadcrumb.Section link={true} onClick={() => history.push('/tools')}>
          Tools
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon="right chevron" />
        <Breadcrumb.Section active={true}>MarPro</Breadcrumb.Section>
      </Breadcrumb>
    );
  };

  const renderScenarioListItem = (s: IToolInstance) => {
    const i = toolInstances.filter((i) => i.name === s.id);

    const handleClickStart = () => {
      if (i.length > 0) {
        return handleSelectInstance(i[0]);
      }
      return handleSelectScenario(s.id);
    };

    return (
      <List.Item key={s.id}>
        <List.Content floated="right">
          <Button onClick={handleClickStart} size="mini">
            {i.length > 0 ? 'Continue' : 'Start'}
          </Button>
          {i.length > 0 && (
            <Button negative onClick={handleDeleteInstance(i[0])} size="mini">
              Delete
            </Button>
          )}
        </List.Content>
        <List.Content floated="left">{s.name}</List.Content>
      </List.Item>
    );
  };

  const renderContent = () => {
    if (property === 'scenario') {
      return <Game />;
    }

    return (
      <Grid padded={true}>
        <Grid.Row>
          <Grid.Column style={{ paddingTop: '0.3em' }}>{renderBreadcumbs()}</Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <Segment loading={isLoading}>
              <Header>Scenarios</Header>
              <List divided>{scenarios.map((s) => renderScenarioListItem(s))}</List>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  return <AppContainer navbarItems={navigation}>{renderContent()}</AppContainer>;
};

export default MarProMainMenu;
