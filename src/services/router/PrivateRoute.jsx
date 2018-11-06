import React from 'react';
import {connect} from 'react-redux';
import {Route, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import {getFetched, getRoles, hasSessionKey} from '../../scenes/user/reducers';
import * as Action from "../../scenes/user/actions/actions";

class PrivateRoute extends React.Component {

    userHasAccessToRoute = () => {
        const {forRoles, userRoles} = this.props;
        let hasAccess = false;
        userRoles.forEach(role => {
            if (forRoles.indexOf(role) >= 0) {
                hasAccess = true;
            }
        });

        return hasAccess;
    };

    render() {
        if (!this.props.userHasSessionKey) {
            return (<Redirect to={'/login'}/>);
        }

        if (!this.props.userDataIsFetched) {
            this.props.fetchUser();
            return null;
        }

        if (!this.userHasAccessToRoute()) {
            return (<Redirect to={'/tools'}/>);
        }

        const {component, ...rest} = this.props;
        return (<Route {...rest} component={component}/>);
    }
}

const mapDispatchToProps = {
    fetchUser: Action.fetchUser,
};

const mapStateToProps = state => {
    return {
        userRoles: getRoles(state.user),
        userHasSessionKey: hasSessionKey(state.session),
        userDataIsFetched: getFetched(state.user)
    };
};

PrivateRoute.propTypes = {
    component: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
    forRoles: PropTypes.array.isRequired,
    userDataIsFetched: PropTypes.bool.isRequired,
    userHasSessionKey: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
