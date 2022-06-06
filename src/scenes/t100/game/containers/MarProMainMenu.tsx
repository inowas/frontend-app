import './style.css';
import { AppContainer } from '../../../shared';
import { Breadcrumb, Button, Grid, Header, Icon, List, Message, Segment } from 'semantic-ui-react';
import { IGameStateSimpleTool } from '../../../../core/marPro/GameState.type';
import { IToolInstance } from '../../../types';
import { asyncSendCommand, fetchApiWithToken, fetchUrl, sendCommand } from '../../../../services/api';
import { createToolInstance, deleteToolInstance } from '../../../dashboard/commands';
import { updateGameState, updateScenario } from '../actions/actions';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import GameDataFetcher from '../components/GameDataFetcher';
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
  const [creatingInstance, setCreatingInstance] = useState<boolean>(false);
  const [creatingInstanceSuccess, setCreatingInstanceSuccess] = useState<boolean | null>(null);

  const dispatch = useDispatch();

  const history = useHistory();
  const { id } = useParams<any>();

  const fetchingAttempts = useRef<number>(0);

  const fetchScenarioAndCreateGameState = async (id: string) => {
    setCreatingInstance(true);
    try {
      const s = (await fetchApiWithToken(`tools/T100/${id}`)).data;
      if (!s) {
        return;
      }
      const sc = Scenario.fromObject(s);

      dispatch(updateScenario(sc));
      const newInstance = GameState.fromScenario(sc);

      if (sc.modelId) {
        const modelId = uuid.v4();
        await asyncSendCommand(
          ModflowModelCommand.cloneModflowModel({ id: sc.modelId, newId: modelId, isTool: false })
        );
        newInstance.modelId = modelId;
      }

      sendCommand(
        createToolInstance('marpro', newInstance.toToolInstance()),
        () => {
          dispatch(updateGameState(newInstance));
          history.push(`marpro/${newInstance.id}`);
        },
        (e) => console.log('ERROR', e)
      );

      setCreatingInstanceSuccess(true);
    } catch (err) {
      setCreatingInstanceSuccess(false);
    } finally {
      setCreatingInstance(false);
    }
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      return fetchScenarioAndCreateGameState(s.id);
    };

    return (
      <List.Item key={s.id}>
        <List.Content floated="right">
          <Button onClick={handleClickStart} loading={creatingInstance} size="mini">
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
    if (id) {
      return <GameDataFetcher />;
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
              {errorLoading && <Message negative>Error loading scenarios or game states</Message>}
              {creatingInstanceSuccess === false && <Message negative>Error creating new game instance</Message>}
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
