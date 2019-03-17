import PropTypes from 'prop-types';
import React from 'react';
import {Container, Header} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfwel} from 'core/model/flopy/packages/mf';

class WelPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        //const {readonly} = this.props;
        //const {mfPackage} = this.state;

        return (
            <Container>
                <Header as={'h2'}>To be implemented</Header>
            </Container>
        );
    }
}

WelPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfwel),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default WelPackageProperties;
