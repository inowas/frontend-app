import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

class LandingPage extends React.Component {
    render() {
        this.props.history.push('/login');
        return null;
    }
}

LandingPage.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(LandingPage);
