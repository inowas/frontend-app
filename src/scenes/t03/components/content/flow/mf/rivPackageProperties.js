import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input, Header} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfriv} from 'core/model/flopy/packages/mf';

class RivPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackage} = this.props;

        return (
            <Form>
                <Header as={'h4'}>To be implemented</Header>
                <Form.Field>
                    <label>ipakcb</label>
                    <Input readOnly
                           name='ipakcb'
                           value={JSON.stringify(mfPackage.ipakcb)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>List of boundaries (stress_period_data)</label>
                    <Input readOnly
                           name='stress_period_data'
                           value={JSON.stringify(mfPackage.stress_period_data)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Data type (dtype)</label>
                    <Input readOnly
                           name='dtype'
                           value={JSON.stringify(mfPackage.dtype)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Package options (options)</label>
                    <Input readOnly
                           name='options'
                           value={JSON.stringify(mfPackage.options)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filename extension (extension)</label>
                    <Input readOnly
                           name='extension'
                           value={JSON.stringify(mfPackage.extension)}
                    />
                </Form.Field>
            </Form>
        );
    }
}

RivPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfriv),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default RivPackageProperties;
