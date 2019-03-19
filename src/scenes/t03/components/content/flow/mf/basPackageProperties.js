import PropTypes from 'prop-types';
import React from 'react';
import {Header, Form, Input} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfbas} from 'core/model/flopy/packages/mf';


class BasPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        //const {readonly} = this.props;
        //const {mfPackage} = this.state;

        return (
            <Form>
                <Header as={'h4'}>To be implemented</Header>
                <Form.Field>
                    <label>Parameter</label>
                    <Input
                    />
                </Form.Field>

            </Form>
        );
    }
}

BasPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfbas),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default BasPackageProperties;
