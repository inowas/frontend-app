import PropTypes from 'prop-types';
import React from 'react';
import {Header, Form} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfchd} from '../../../../../../core/model/flopy/packages/mf';

class ChdPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        return (
            <Form>
                <Header as={'h4'}>To be implemented</Header>
                <Form.Field>
                </Form.Field>
            </Form>
        );
    }
}

ChdPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfchd),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default ChdPackageProperties;
