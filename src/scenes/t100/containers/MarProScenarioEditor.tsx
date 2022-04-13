import '../style.css';
import { AppContainer } from '../../shared';
import { Breadcrumb, Button, Grid, Header, Icon, List, Search, Segment } from 'semantic-ui-react';
import { IGameStateSimpleTool } from '../../../core/marPro/GameState.type';
import { IScenario } from '../../../core/marPro/Scenario.type';
import { IToolInstance } from '../../types';
import { asyncSendCommand, fetchUrl, sendCommand } from '../../../services/api';
import { createToolInstance, deleteToolInstance } from '../../dashboard/commands';
import { updateGameState, updateScenario } from '../actions/actions';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams, withRouter } from 'react-router-dom';
import Editor from '../components/editor/Editor';
import Game from '../components/playground/GameDataFetcher';
import GameState from '../../../core/marPro/GameState';
import ModflowModelCommand from '../../modflow/commands/modflowModelCommand';
import Scenario from '../../../core/marPro/Scenario';
import scenarios from '../../../core/marPro/scenarios';
import uuid from 'uuid';

const navigation = [
  {
    name: 'Documentation',
    path: 'https://inowas.com/tools',
    icon: <Icon name="file" />,
  },
];

const T100 = () => {
  const [errorLoading, setErrorLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toolInstances, setToolInstances] = useState<IToolInstance[]>([]);

  const history = useHistory();
  const { property } = useParams<any>();
  const dispatch = useDispatch();

  const fetchingAttempts = useRef<number>(0);

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
    fetchInstances();
  }, [fetchInstances]);

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
    history.push(`T100/scenario/${i.id}`);
  };

  const handleSelectScenario = async (scenario: IScenario) => {
    dispatch(updateScenario(Scenario.fromObject(scenario)));

    const newInstance = GameState.fromScenario(Scenario.fromObject(scenario));

    if (scenario.modelId) {
      const modelId = uuid.v4();
      await asyncSendCommand(
        ModflowModelCommand.cloneModflowModel({ id: scenario.modelId, newId: modelId, isTool: false })
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
    );
  };

  const handleClickNewScenario = () => {
    history.push('T100/editor');
  };

  const renderBreadcumbs = () => {
    return (
      <Breadcrumb>
        <Breadcrumb.Section link={true} onClick={() => history.push('/tools')}>
          Tools
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon="right chevron" />
        <Breadcrumb.Section active={true}>T100. MarPro - Scenario Editor</Breadcrumb.Section>
      </Breadcrumb>
    );
  };

  const renderScenarioListItem = (s: IScenario) => {
    const i = toolInstances.filter((i) => i.name === s.id);

    const handleClickStart = () => {
      if (i.length > 0) {
        return handleSelectInstance(i[0]);
      }
      return handleSelectScenario(s);
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
        <List.Content floated="left">{s.id}</List.Content>
      </List.Item>
    );
  };

  const renderContent = () => {
    if (property === 'editor') {
      return <Editor />;
    }

    if (property === 'scenario') {
      return <Game />;
    }

    return (
      <Grid padded={true}>
        <Grid.Row>
          <Grid.Column style={{ paddingTop: '0.3em' }}>{renderBreadcumbs()}</Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column textAlign="center">
            <Segment loading={isLoading}>
              <Header icon>
                <Icon name="play" />
                Playground
              </Header>
              <List divided>{scenarios.map((s) => renderScenarioListItem(s))}</List>
            </Segment>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <Segment>
              <Header icon>
                <Icon name="upload" />
                Upload JSON
              </Header>
              <Search disabled placeholder="Select file..." />
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <Segment>
              <Header icon>
                <Icon name="edit" />
                Editor
              </Header>
              <Button onClick={handleClickNewScenario} primary fluid>
                Create New Scenario
              </Button>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  return <AppContainer navbarItems={navigation}>{renderContent()}</AppContainer>;
};

export default withRouter(T100);
