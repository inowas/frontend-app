import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Action} from '../actions';
import {hasSessionKey, getFetched} from '../reducers';
import {withRouter} from 'react-router';

class AppForAllUsers extends React.Component {
    render() {
        if (this.props.userIsLoggedIn && this.props.userShouldBeFetched) {
            this.props.fetchUser();
        }

        return this.props.children;
    }
}

const mapStateToProps = state => {
    return {
        userIsLoggedIn: hasSessionKey(state.session),
        userShouldBeFetched: !getFetched(state.user)
    };
};

const mapDispatchToProps = {
    fetchUser: Action.fetchUser,
};

AppForAllUsers.propTypes = {
    children: PropTypes.node,
    fetchUser: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    userIsLoggedIn: PropTypes.bool.isRequired,
    userShouldBeFetched: PropTypes.bool.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppForAllUsers));
