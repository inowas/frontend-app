import React from 'react';
import {Route, Switch} from "react-router-dom";
import UsersSection from "./scenes/user/containers/UsersSection";
import LandingPage from "./scenes/landingPage/LandingPage";
import {Login, T01} from "./scenes";
import Logout from "./scenes/user/containers/Logout";
import SignUp from "./scenes/user/containers/SignUp";
import Impressum from "./scenes/impressum/Impressum";
import Dashboard from "./scenes/dashboard/dashboard"

const routes = (
    <div>
        <UsersSection>
            <Switch>
                <Route exact path="/" component={LandingPage}/>
                <Route exact path="/tools" component={Dashboard}/>
                <Route exact path="/tools/T01" component={T01}/>
                <Route exact path="/tools/T01/:id" render={T01}/>
            </Switch>
        </UsersSection>
        <Switch>
            <Route path="/impressum" component={Impressum}/>
            <Route path="/login" component={Login}/>
            <Route path="/logout" component={Logout}/>
            <Route path="/signup" component={SignUp}/>
        </Switch>
    </div>
);

export default routes;
