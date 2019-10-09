import React from 'react';
import {Route, Switch} from 'react-router-dom';

import * as Scenes from './scenes';
import PrivateRoute from './services/router/PrivateRoute';


import getConfig from './config.default';

const {PUBLIC_PROJECTS_ACCESS} = getConfig();

const getRoutes = () => {

    if (PUBLIC_PROJECTS_ACCESS) {
        return (
            <Switch>
                <PrivateRoute exact path="/" component={Scenes.LandingPage} forRoles={['ROLE_USER']}/>
                <PrivateRoute exact path="/tools" component={Scenes.Dashboard} forRoles={['ROLE_USER']}/>
                <PrivateRoute exact path="/tools/T03/" component={Scenes.T03.CreateModel} forRoles={['ROLE_USER']}/>
                <PrivateRoute exact path="/tools/T07/" component={Scenes.T07.CreateScenarioAnalysis}
                              forRoles={['ROLE_USER']}/>
                <PrivateRoute exact path="/tools/T10/" component={Scenes.T10Create} forRoles={['ROLE_USER']}/>
                <PrivateRoute path="/credentials" component={Scenes.UserCredentials} forRoles={['ROLE_USER']}/>
                <PrivateRoute path="/profile" component={Scenes.UserProfile} forRoles={['ROLE_USER']}/>

                <Route exact path="/tools/T01" component={Scenes.T01}/>
                <Route exact path="/tools/T02/:id?" component={Scenes.T02}/>
                <Route exact path="/tools/T03/:id/:property?/:type?/:pid?" component={Scenes.T03.EditModel}/>
                <Route exact path="/tools/T04" component={Scenes.T04}/>
                <Route exact path="/tools/T05/:id?/:property?/:cid?/:tool?" component={Scenes.T05}/>
                <Route exact path="/tools/T06" component={Scenes.T06}/>
                <Route exact path="/tools/T07/:id/:property?/:type?/:pid?"
                       component={Scenes.T07.EditScenarioAnalysis}/>
                <Route exact path="/tools/T08/:id?" component={Scenes.T08}/>
                <Route exact path="/tools/T09" component={Scenes.T09}/>
                <Route exact path="/tools/T09A/:id?" component={Scenes.T09A}/>
                <Route exact path="/tools/T09B/:id?" component={Scenes.T09B}/>
                <Route exact path="/tools/T09C/:id?" component={Scenes.T09C}/>
                <Route exact path="/tools/T09D/:id?" component={Scenes.T09D}/>
                <Route exact path="/tools/T09E/:id?" component={Scenes.T09E}/>
                <Route exact path="/tools/T09F/:id?" component={Scenes.T09F}/>
                <Route exact path="/tools/T10/:id/:property?/:pid?" component={Scenes.T10}/>
                <Route exact path="/tools/T11" component={Scenes.T11}/>
                <Route exact path="/tools/T12/:id?" component={Scenes.T12}/>
                <Route exact path="/tools/T13" component={Scenes.T13}/>
                <Route exact path="/tools/T13A/:id?" component={Scenes.T13A}/>
                <Route exact path="/tools/T13B/:id?" component={Scenes.T13B}/>
                <Route exact path="/tools/T13C/:id?" component={Scenes.T13C}/>
                <Route exact path="/tools/T13D/:id?" component={Scenes.T13D}/>
                <Route exact path="/tools/T13E/:id?" component={Scenes.T13E}/>
                <Route exact path="/tools/T14" component={Scenes.T14}/>
                <Route exact path="/tools/T14A/:id?" component={Scenes.T14A}/>
                <Route exact path="/tools/T14B/:id?" component={Scenes.T14B}/>
                <Route exact path="/tools/T14C/:id?" component={Scenes.T14C}/>
                <Route exact path="/tools/T14D/:id?" component={Scenes.T14D}/>
                <Route exact path="/tools/T18/:id?" component={Scenes.T18}/>

                <Route path="/impressum" component={Scenes.Impressum}/>
                <Route path="/terms-and-conditions" component={Scenes.TermsAndConditions}/>
                <Route path="/login" component={Scenes.Login}/>
                <Route path="/logout" component={Scenes.Logout}/>
                <Route path="/signup" component={Scenes.SignUp}/>
            </Switch>
        )
    }

    return (
        <Switch>
            <PrivateRoute exact path="/" component={Scenes.LandingPage} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools" component={Scenes.Dashboard} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T01" component={Scenes.T01} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T02/:id?" component={Scenes.T02} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T03/" component={Scenes.T03.CreateModel} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T03/:id/:property?/:type?/:pid?" component={Scenes.T03.EditModel}
                          forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T04" component={Scenes.T04} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T05/:id?/:property?/:cid?/:tool?" component={Scenes.T05}
                          forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T06" component={Scenes.T06} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T07/" component={Scenes.T07.CreateScenarioAnalysis}
                          forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T07/:id/:property?/:type?/:pid?"
                          component={Scenes.T07.EditScenarioAnalysis} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T08/:id?" component={Scenes.T08} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T09" component={Scenes.T09} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T09A/:id?" component={Scenes.T09A} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T09B/:id?" component={Scenes.T09B} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T09C/:id?" component={Scenes.T09C} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T09D/:id?" component={Scenes.T09D} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T09E/:id?" component={Scenes.T09E} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T09F/:id?" component={Scenes.T09F} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T10/" component={Scenes.T10Create} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T10/:id/:property?/:pid?" component={Scenes.T10} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T11" component={Scenes.T11} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T12/:id?" component={Scenes.T12} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T13" component={Scenes.T13} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T13A/:id?" component={Scenes.T13A} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T13B/:id?" component={Scenes.T13B} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T13C/:id?" component={Scenes.T13C} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T13D/:id?" component={Scenes.T13D} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T13E/:id?" component={Scenes.T13E} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T14" component={Scenes.T14} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T14A/:id?" component={Scenes.T14A} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T14B/:id?" component={Scenes.T14B} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T14C/:id?" component={Scenes.T14C} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T14D/:id?" component={Scenes.T14D} forRoles={['ROLE_USER']}/>
            <PrivateRoute exact path="/tools/T18/:id?" component={Scenes.T18} forRoles={['ROLE_USER']}/>
            <PrivateRoute path="/credentials" component={Scenes.UserCredentials} forRoles={['ROLE_USER']}/>
            <PrivateRoute path="/profile" component={Scenes.UserProfile} forRoles={['ROLE_USER']}/>

            <Route path="/impressum" component={Scenes.Impressum}/>
            <Route path="/terms-and-conditions" component={Scenes.TermsAndConditions}/>
            <Route path="/login" component={Scenes.Login}/>
            <Route path="/logout" component={Scenes.Logout}/>
            <Route path="/signup" component={Scenes.SignUp}/>
        </Switch>
    );
};


export default getRoutes();
