import PropTypes from 'prop-types';
import React from 'react';
import {Container, Header} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfpcg} from 'core/model/flopy/packages/mf';

class SolverPackageProperties extends AbstractPackageProperties {

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

SolverPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfpcg),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default SolverPackageProperties;
