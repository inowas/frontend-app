import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input, Header} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfghb} from 'core/model/flopy/packages/mf';

class GhbPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {readonly, mfPackage} = this.props;

        return (
            <Form>
                <Header as={'h4'}>General-Head Boundary Package</Header>

                <Form.Field>
                    <label>Model object</label>
                    <Form.Input
                        name='model'
                        value={JSON.stringify(mfPackage.model)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Cell-by-cell budget data (ipakcb)</label>
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
                <Form.Field>
                    <label>File unit number (unitnumber)</label>
                    <Input readOnly
                           name='unitnumber'
                           value={JSON.stringify(mfPackage.unitnumber)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filenames (filenames)</label>
                    <Input readOnly
                           name='filenames'
                           value={JSON.stringify(mfPackage.filenames)}
                    />
                </Form.Field>
            </Form>
        );
    }
}

GhbPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfghb),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default GhbPackageProperties;
