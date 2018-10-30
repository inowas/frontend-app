import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Action} from '../actions/index';
import {hasSessionKey, isAdmin, getFetched} from '../reducers/index';
import {withRouter} from 'react-router-dom';

class AppForAdminUser extends React.Component {

    checkAuthentication() {
        if (!this.props.userIsLoggedIn) {
            this.props.router.push('/login');
        }

        if (this.props.userShouldBeFetched) {
            this.props.fetchUser();
        }

        if (!this.props.userIsAdmin) {
            this.props.router.push('/');
        }
    }

    render() {
        return null;
    }
}

const mapStateToProps = state => {
    return {
        userIsAdmin: isAdmin(state.user),
        userIsLoggedIn: hasSessionKey(state.session),
        userShouldBeFetched: !getFetched(state.user)
    };
};

const mapDispatchToProps = {
    fetchUser: Action.fetchUser,
};

AppForAdminUser.propTypes = {
    children: PropTypes.node,
    fetchUser: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    userIsAdmin: PropTypes.bool.isRequired,
    userIsLoggedIn: PropTypes.bool.isRequired,
    userShouldBeFetched: PropTypes.bool.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppForAdminUser));
