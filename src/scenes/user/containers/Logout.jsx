import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Action} from '../actions/index';

class Logout extends React.Component {
    render() {
        this.props.logout();
        this.props.history.push('/');
        return null;
    }
}

const mapDispatchToProps = {
    logout: Action.logout
};

Logout.propTypes = {
    logout: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
};


export default withRouter(connect(null, mapDispatchToProps)(Logout));
