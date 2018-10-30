import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Action} from '../actions/index';
import {hasSessionKey, getFetched} from '../reducers/index';

class UsersSection extends React.Component {
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

UsersSection.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    fetchUser: PropTypes.func.isRequired,
    userIsLoggedIn: PropTypes.bool.isRequired,
    userShouldBeFetched: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersSection);
