import { AppContainer } from '../../../shared';
import { BoundaryCollection, ModflowModel } from '../../../../core/model/modflow';
import { Grid, Icon, List, Message, Segment } from 'semantic-ui-react';
import { IRootReducer } from '../../../../reducers';
import { IToolMetaDataEdit } from '../../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import { ToolMetaData } from '../../../shared/simpleTools';
import { ToolNavigation } from '../../../shared/complexTools';
import { clear, updateBoundaries, updateModel, updateScenario } from '../actions/actions';
import { createToolInstance } from '../../../dashboard/commands';
import { fetchApiWithToken, sendCommand, sendCommandAsync } from '../../../../services/api';
import { menuItems } from '../defaults/menuItems';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import GameObjectsEditor from '../components/GameObjectsEditor';
import Georeferencing from '../components/Georeferencing';
import ResourcesEditor from '../components/ResourcesEditor';
import Scenario from '../../../../core/marPro/Scenario';
import Setup from '../components/Setup';
import SimpleToolsCommand from '../../../shared/simpleTools/commands/SimpleToolsCommand';
import ToolsEditor from '../components/ToolsEditor';

const navigation = [
  {
    name: 'Documentation',
    path: 'https://inowas.com/tools',
    icon: <Icon name="file" />,
  },
];

const tool = 'T100';

const MarProEditor = () => {
  const [errors, setErrors] = useState<string[]>([]);

  const [fetchingModel, setFetchingModel] = useState<boolean>(false);
  const [fetchingModelSuccess, setFetchingModelSuccess] = useState<boolean | null>(null);

  const [fetchingBoundaries, setFetchingBoundaries] = useState<boolean>(false);
  const [fetchingBoundariesSuccess, setFetchingBoundariesSuccess] = useState<boolean | null>(null);

  const [fetchingScenario, setFetchingScenario] = useState<boolean>(false);
  const [fetchingScenarioSuccess, setFetchingScenarioSuccess] = useState<boolean | null>(null);

  const { id, property, pid } = useParams<any>();

  const dispatch = useDispatch();
  const history = useHistory();

  const MarPro = useSelector((state: IRootReducer) => state.MarProEditorReducer);
  const scenario = MarPro.scenario ? Scenario.fromObject(MarPro.scenario) : null;

  const createScenario = useCallback(async () => {
    const scenario = Scenario.fromDefaults();
    await sendCommandAsync(createToolInstance(scenario.tool, scenario.toObject()));
    history.push(`/tools/${scenario.tool}/${scenario.id}`);
  }, [history]);

  const handleError = (err: string) => {
    setErrors([...errors, err]);
  };

  const fetchBoundaries = useCallback(
    async (id: string) => {
      setFetchingBoundaries(true);
      try {
        const b = (await fetchApiWithToken(`modflowmodels/${id}/boundaries`)).data;
        const bc = BoundaryCollection.fromQuery(b);
        dispatch(updateBoundaries(bc));
        setFetchingBoundariesSuccess(true);
      } catch (err) {
        setFetchingBoundariesSuccess(false);
        handleError('Fetching boundaries failed.');
      } finally {
        setFetchingBoundaries(false);
      }
    },
    [dispatch]
  );

  const fetchModel = useCallback(
    async (id: string) => {
      setFetchingModel(true);
      try {
        const m = (await fetchApiWithToken(`modflowmodels/${id}`)).data;
        const mfModel = ModflowModel.fromObject(m);
        dispatch(updateModel(mfModel));
        setFetchingModelSuccess(true);
      } catch (err) {
        setFetchingModelSuccess(false);
        handleError('Fetching model failed.');
      } finally {
        setFetchingModel(false);
      }
    },
    [dispatch]
  );

  const fetchScenario = useCallback(
    async (id: string) => {
      setFetchingScenario(true);
      try {
        const s = (await fetchApiWithToken(`tools/${tool}/${id}`)).data;
        if (!s) {
          return;
        }
        const sc = Scenario.fromObject(s);
        dispatch(updateScenario(sc));
        setFetchingScenarioSuccess(true);
        await fetchModel(sc.modelId);
        await fetchBoundaries(sc.modelId);
      } catch (err) {
        setFetchingScenarioSuccess(false);
      } finally {
        setFetchingScenario(false);
      }
    },
    [dispatch, fetchBoundaries, fetchModel]
  );

  useEffect(() => {
    return function () {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!id) {
      createScenario();
    } else {
      console.log('FETCH SCENARIO');
      fetchScenario(id);
    }
  }, [createScenario, fetchScenario, id]);

  if (!scenario) {
    return <p>LOADING</p>;
  }

  const handleSaveMetaData = (tool: IToolMetaDataEdit) => {
    const cScenario = scenario.toObject();
    cScenario.name = tool.name;
    cScenario.description = tool.description;
    cScenario.public = tool.public;
    handleSave(Scenario.fromObject(cScenario));
  };

  const handleSave = (s: Scenario) => {
    sendCommand(SimpleToolsCommand.updateToolInstance(s.toObject()), () => {
      dispatch(updateScenario(s));
    });
  };

  const renderErrors = () => {
    if (errors.length > 0) {
      return errors.map((e, k) => (
        <Message negative key={k}>
          {e}
        </Message>
      ));
    }
  };

  const renderContent = () => {
    if (fetchingScenario) {
      return <div>Fetching Scenario ...</div>;
    }
    if (fetchingBoundaries) {
      return <div>Fetching Boundaries ...</div>;
    }
    if (fetchingModel) {
      return <div>Fetching Model ...</div>;
    }

    if (property === 'tools') {
      return <ToolsEditor onChange={handleSave} scenario={scenario} />;
    }

    if (property === 'objects') {
      return <GameObjectsEditor onChange={handleSave} scenario={scenario} />;
    }

    if (property === 'model') {
      return <Georeferencing onChange={handleSave} scenario={scenario} />;
    }

    if (property === 'resources') {
      return <ResourcesEditor onChange={handleSave} scenario={scenario} />;
    }

    return <Setup onChange={handleSave} scenario={scenario} />;
  };

  return (
    <AppContainer navbarItems={navigation}>
      {scenario && (
        <ToolMetaData
          isDirty={false}
          readOnly={false}
          tool={{
            tool,
            name: scenario.name,
            description: scenario.description,
            public: scenario.public,
          }}
          onSave={handleSaveMetaData}
        />
      )}
      <Grid padded={true}>
        <Grid.Row>
          <Grid.Column width={3}>
            <ToolNavigation navigationItems={menuItems} />
            <Segment>
              <List>
                <List.Item>
                  <List.Content floated="right">
                    {fetchingScenario ? (
                      <Icon loading name="spinner" />
                    ) : fetchingScenarioSuccess ? (
                      <Icon color="green" name="check circle" />
                    ) : (
                      <Icon color="red" name="exclamation circle" />
                    )}
                  </List.Content>
                  <List.Content>Scenario</List.Content>
                </List.Item>
                <List.Item>
                  <List.Content floated="right">
                    {fetchingModel ? (
                      <Icon loading name="spinner" />
                    ) : fetchingModelSuccess ? (
                      <Icon color="green" name="check circle" />
                    ) : (
                      <Icon color="red" name="exclamation circle" />
                    )}
                  </List.Content>
                  <List.Content>Model</List.Content>
                </List.Item>
                <List.Item>
                  <List.Content floated="right">
                    {fetchingBoundaries ? (
                      <Icon loading name="spinner" />
                    ) : fetchingBoundariesSuccess ? (
                      <Icon color="green" name="check circle" />
                    ) : (
                      <Icon color="red" name="exclamation circle" />
                    )}
                  </List.Content>
                  <List.Content>Boundaries</List.Content>
                </List.Item>
              </List>
            </Segment>
          </Grid.Column>
          <Grid.Column width={13}>
            {renderErrors()}
            {renderContent()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </AppContainer>
  );
};

export default MarProEditor;
