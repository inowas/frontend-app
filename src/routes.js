import React from 'react';
import {Route, Switch} from "react-router-dom";

import * as Scenes from 'scenes';
import PrivateRoute from 'services/router/PrivateRoute';

const routes = (
    <Switch>
        <PrivateRoute exact path="/" component={Scenes.LandingPage} forRoles={['ROLE_USER']}/>
        <PrivateRoute exact path="/tools" component={Scenes.Dashboard} forRoles={['ROLE_USER']}/>
        <PrivateRoute exact path="/tools/T01" component={Scenes.T01} forRoles={['ROLE_USER']}/>
        <PrivateRoute exact path="/tools/T02/:id?" component={Scenes.T02} forRoles={['ROLE_USER']}/>
        <PrivateRoute exact path="/tools/T04" component={Scenes.T04} forRoles={['ROLE_USER']}/>
        <PrivateRoute exact path="/tools/T06" component={Scenes.T06} forRoles={['ROLE_USER']}/>
        <PrivateRoute exact path="/tools/T08/:id?" component={Scenes.T08} forRoles={['ROLE_USER']}/>
        <PrivateRoute exact path="/tools/T09" component={Scenes.T09} forRoles={['ROLE_USER']}/>
        <PrivateRoute exact path="/tools/T09A/:id?" component={Scenes.T09A} forRoles={['ROLE_USER']}/>
        <PrivateRoute exact path="/tools/T09B/:id?" component={Scenes.T09B} forRoles={['ROLE_USER']}/>
        <PrivateRoute exact path="/tools/T09C/:id?" component={Scenes.T09C} forRoles={['ROLE_USER']}/>
        <PrivateRoute exact path="/tools/T11" component={Scenes.T11} forRoles={['ROLE_USER']}/>

        <Route path="/impressum" component={Scenes.Impressum}/>
        <Route path="/login" component={Scenes.Login}/>
        <Route path="/logout" component={Scenes.Logout}/>
        <Route path="/signup" component={Scenes.SignUp}/>
    </Switch>
);

export default routes;
