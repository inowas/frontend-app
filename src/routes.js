import React from 'react';
import {Route, Switch} from "react-router-dom";

import * as Scenes from 'scenes';
import PrivateRoute from 'services/router/PrivateRoute';

const routes = (
    <Switch>
        <PrivateRoute exact path="/" component={Scenes.LandingPage} forRoles={['ROLE_USER']}/>
        <PrivateRoute exact path="/tools" component={Scenes.Dashboard} forRoles={['ROLE_USER']}/>
        <PrivateRoute exact path="/tools/T01" component={Scenes.T01} forRoles={['ROLE_USER']}/>
        <PrivateRoute exact path="/tools/T01/:id" component={Scenes.T01} forRoles={['ROLE_USER']}/>

        <Route path="/impressum" component={Scenes.Impressum}/>
        <Route path="/login" component={Scenes.Login}/>
        <Route path="/logout" component={Scenes.Logout}/>
        <Route path="/signup" component={Scenes.SignUp}/>
    </Switch>
);

export default routes;
