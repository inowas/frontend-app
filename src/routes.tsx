import * as Scenes from './scenes';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from './services/router/PrivateRoute';
import getConfig from './config.default';

const { PUBLIC_PROJECTS_ACCESS, DISABLE_TOOL } = getConfig();

const disabledTools = DISABLE_TOOL.split(',')
  .map((s) => s.trim())
  .map((s) => s.toUpperCase());
const isDisabled = (tool: string) => disabledTools.findIndex((e) => e === tool) >= 0;

const getRoutes = () => {
  if (PUBLIC_PROJECTS_ACCESS) {
    return (
      <Switch>
        <PrivateRoute exact={true} path="/" component={Scenes.LandingPage} forRoles={['ROLE_USER']} />
        <PrivateRoute exact={true} path="/admin/:property?/:id?" component={Scenes.Admin} forRoles={['ROLE_ADMIN']} />
        <PrivateRoute exact={true} path="/tools" component={Scenes.Dashboard} forRoles={['ROLE_USER']} />
        <PrivateRoute exact={true} path="/tools/T03/" component={Scenes.T03.CreateModel} forRoles={['ROLE_USER']} />
        <PrivateRoute exact={true} path="/tools/T05/" component={Scenes.T05Create} forRoles={['ROLE_USER']} />
        <PrivateRoute
          exact={true}
          path="/tools/T07/"
          component={Scenes.T07.CreateScenarioAnalysis}
          forRoles={['ROLE_USER']}
        />
        <PrivateRoute exact={true} path="/tools/T10/" component={Scenes.T10Create} forRoles={['ROLE_USER']} />
        <PrivateRoute path="/credentials" component={Scenes.UserCredentials} forRoles={['ROLE_USER']} />
        <PrivateRoute path="/profile" component={Scenes.UserProfile} forRoles={['ROLE_USER']} />

        <Route exact={true} path="/tools/T01" component={Scenes.T01} />
        <Route exact={true} path="/tools/T02/:id?" component={Scenes.T02} />
        <Route exact={true} path="/tools/T03/:id/:property?/:type?/:pid?" component={Scenes.T03.EditModel} />
        <Route exact={true} path="/tools/T04" component={Scenes.T04} />
        <Route exact={true} path="/tools/T05/:id/:property?/:cid?/:tool?" component={Scenes.T05} />
        <Route exact={true} path="/tools/T06" component={Scenes.T06} />
        <Route exact={true} path="/tools/T07/:id/:property?/:type?/:pid?" component={Scenes.T07.EditScenarioAnalysis} />
        <Route exact={true} path="/tools/T08/:id?" component={Scenes.T08} />
        <Route exact={true} path="/tools/T09" component={Scenes.T09} />
        <Route exact={true} path="/tools/T09A/:id?" component={Scenes.T09A} />
        <Route exact={true} path="/tools/T09B/:id?" component={Scenes.T09B} />
        <Route exact={true} path="/tools/T09C/:id?" component={Scenes.T09C} />
        <Route exact={true} path="/tools/T09D/:id?" component={Scenes.T09D} />
        <Route exact={true} path="/tools/T09E/:id?" component={Scenes.T09E} />
        <Route exact={true} path="/tools/T09F/:id?" component={Scenes.T09F} />
        {!isDisabled('T10') && <Route exact={true} path="/tools/T10/:id/:property?/:pid?" component={Scenes.T10} />}
        <Route exact={true} path="/tools/T11" component={Scenes.T11} />
        <Route exact={true} path="/tools/T12/:id?" component={Scenes.T12} />
        <Route exact={true} path="/tools/T13" component={Scenes.T13} />
        <Route exact={true} path="/tools/T13A/:id?" component={Scenes.T13A} />
        <Route exact={true} path="/tools/T13B/:id?" component={Scenes.T13B} />
        <Route exact={true} path="/tools/T13C/:id?" component={Scenes.T13C} />
        <Route exact={true} path="/tools/T13D/:id?" component={Scenes.T13D} />
        <Route exact={true} path="/tools/T13E/:id?" component={Scenes.T13E} />
        <Route exact={true} path="/tools/T14" component={Scenes.T14} />
        <Route exact={true} path="/tools/T14A/:id?" component={Scenes.T14A} />
        <Route exact={true} path="/tools/T14B/:id?" component={Scenes.T14B} />
        <Route exact={true} path="/tools/T14C/:id?" component={Scenes.T14C} />
        <Route exact={true} path="/tools/T14D/:id?" component={Scenes.T14D} />
        <Route exact={true} path="/tools/T15/:id?/:property?/:pid?" component={Scenes.T15} />
        <Route exact={true} path="/tools/T18/:id?" component={Scenes.T18} />
        <Route exact={true} path="/tools/T19/:id?" component={Scenes.T19} />
        <Route exact={true} path="/tools/T20" component={Scenes.T20.CreateRealTimeModelling} />
        <Route exact={true} path="/tools/T20/:id/:property?/:pid?" component={Scenes.T20.EditRealTimeModelling} />
        <Route exact={true} path="/tools/T100/:id?/:property?/:pid?" component={Scenes.MarProEditor} />

        <Route path="/imprint" component={Scenes.Imprint} />
        <Route path="/terms-and-conditions" component={Scenes.TermsAndConditions} />
        <Route path="/login/:id?/:token?" component={Scenes.Login} />
        <Route path="/login" component={Scenes.Login} />
        <Route path="/logout" component={Scenes.Logout} />
        <Route path="/signup" component={Scenes.SignUp} />
      </Switch>
    );
  }

  return (
    <Switch>
      <PrivateRoute exact={true} path="/" component={Scenes.LandingPage} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/admin/:property?/:id?" component={Scenes.Admin} forRoles={['ROLE_ADMIN']} />
      <PrivateRoute exact={true} path="/tools" component={Scenes.Dashboard} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T01" component={Scenes.T01} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T02/:id?" component={Scenes.T02} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T03/" component={Scenes.T03.CreateModel} forRoles={['ROLE_USER']} />
      <PrivateRoute
        exact={true}
        path="/tools/T03/:id/:property?/:type?/:pid?"
        component={Scenes.T03.EditModel}
        forRoles={['ROLE_USER']}
      />
      <PrivateRoute exact={true} path="/tools/T04" component={Scenes.T04} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T05/" component={Scenes.T05Create} forRoles={['ROLE_USER']} />
      <PrivateRoute
        exact={true}
        path="/tools/T05/:id/:property?/:cid?/:tool?"
        component={Scenes.T05}
        forRoles={['ROLE_USER']}
      />
      <PrivateRoute exact={true} path="/tools/T06" component={Scenes.T06} forRoles={['ROLE_USER']} />
      <PrivateRoute
        exact={true}
        path="/tools/T07/"
        component={Scenes.T07.CreateScenarioAnalysis}
        forRoles={['ROLE_USER']}
      />
      <PrivateRoute
        exact={true}
        path="/tools/T07/:id/:property?/:type?/:pid?"
        component={Scenes.T07.EditScenarioAnalysis}
        forRoles={['ROLE_USER']}
      />
      <PrivateRoute exact={true} path="/tools/T08/:id?" component={Scenes.T08} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T09" component={Scenes.T09} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T09A/:id?" component={Scenes.T09A} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T09B/:id?" component={Scenes.T09B} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T09C/:id?" component={Scenes.T09C} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T09D/:id?" component={Scenes.T09D} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T09E/:id?" component={Scenes.T09E} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T09F/:id?" component={Scenes.T09F} forRoles={['ROLE_USER']} />
      {!isDisabled('T10') && (
        <PrivateRoute exact={true} path="/tools/T10/" component={Scenes.T10Create} forRoles={['ROLE_USER']} />
      )}
      <PrivateRoute
        exact={true}
        path="/tools/T10/:id/:property?/:pid?"
        component={Scenes.T10}
        forRoles={['ROLE_USER']}
      />
      <PrivateRoute exact={true} path="/tools/T11" component={Scenes.T11} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T12/:id?" component={Scenes.T12} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T13" component={Scenes.T13} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T13A/:id?" component={Scenes.T13A} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T13B/:id?" component={Scenes.T13B} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T13C/:id?" component={Scenes.T13C} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T13D/:id?" component={Scenes.T13D} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T13E/:id?" component={Scenes.T13E} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T14" component={Scenes.T14} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T14A/:id?" component={Scenes.T14A} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T14B/:id?" component={Scenes.T14B} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T14C/:id?" component={Scenes.T14C} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T14D/:id?" component={Scenes.T14D} forRoles={['ROLE_USER']} />
      <PrivateRoute
        exact={true}
        path="/tools/T15/:id?/:property?/:pid?"
        component={Scenes.T15}
        forRoles={['ROLE_USER']}
      />
      <PrivateRoute exact={true} path="/tools/T18/:id?" component={Scenes.T18} forRoles={['ROLE_USER']} />
      <PrivateRoute exact={true} path="/tools/T19/:id?" component={Scenes.T19} forRoles={['ROLE_USER']} />
      <PrivateRoute
        exact={true}
        path="/tools/T20/"
        component={Scenes.T20.CreateRealTimeModelling}
        forRoles={['ROLE_USER']}
      />
      <PrivateRoute
        exact={true}
        path="/tools/T20/:id/:property?/:pid?"
        component={Scenes.T20.EditRealTimeModelling}
        forRoles={['ROLE_USER']}
      />
      <PrivateRoute
        exact={true}
        path="/tools/T100/:id?/:property?/:pid?"
        component={Scenes.MarProEditor}
        forRoles={['ROLE_USER']}
      />
      <PrivateRoute path="/credentials" component={Scenes.UserCredentials} forRoles={['ROLE_USER']} />
      <PrivateRoute path="/profile" component={Scenes.UserProfile} forRoles={['ROLE_USER']} />

      <Route path="/imprint" component={Scenes.Imprint} />
      <Route path="/terms-and-conditions" component={Scenes.TermsAndConditions} />
      <Route path="/login/:id?/:token?" component={Scenes.Login} />
      <Route path="/logout" component={Scenes.Logout} />
      <Route path="/signup" component={Scenes.SignUp} />
    </Switch>
  );
};

export default getRoutes();
