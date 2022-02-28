import '../style.css';
import { AppContainer } from '../../shared';
import { Breadcrumb, Button, Grid, Header, Icon, Search, Segment } from 'semantic-ui-react';
import { IScenario } from '../../../core/marPro/Scenario.type';
import { scenario1, scenario2 } from '../../../core/marPro/scenarios';
import { useHistory, useParams, withRouter } from 'react-router-dom';
import { useState } from 'react';
import Editor from '../components/editor/Editor';
import Playground from '../components/playground/Playground_2';
import Scenario from '../../../core/marPro/Scenario';

const navigation = [
  {
    name: 'Documentation',
    path: 'https://inowas.com/tools',
    icon: <Icon name="file" />,
  },
];

const T100 = () => {
  const [activeScenario, setActiveScenario] = useState<IScenario>();
  const history = useHistory();
  const { property } = useParams<any>();

  const handleSelectScenario = (scenario: IScenario) => () => setActiveScenario(scenario);

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

  const renderContent = () => {
    if (property === 'editor') {
      return <Editor />;
    }

    if (activeScenario) {
      return <Playground scenario={Scenario.fromObject(activeScenario)} />;
    }

    return (
      <Grid padded={true}>
        <Grid.Row>
          <Grid.Column style={{ paddingTop: '0.3em' }}>{renderBreadcumbs()}</Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column textAlign="center">
            <Segment>
              <Header icon>
                <Icon name="play" />
                Playground
              </Header>
              <Button.Group fluid primary vertical>
                <Button onClick={handleSelectScenario(scenario1)}>Scenario 1.1: Ezousa</Button>
                <Button onClick={handleSelectScenario(scenario2)}>Scenario 1.2: Ezousa</Button>
              </Button.Group>
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
