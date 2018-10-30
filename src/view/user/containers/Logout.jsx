import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Action} from '../actions';

class Logout extends React.Component {

    componentWillMount() {
        this.logout();
    }

    logout = () => {
        this.props.logout();
        this.props.router.push('/');
    };

    render() {
        return null;
    }
}

const mapDispatchToProps = {
    logout: Action.logout
};

Logout.propTypes = {
    logout: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
};


export default withRouter(connect(null, mapDispatchToProps)(Logout));
