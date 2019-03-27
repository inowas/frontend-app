import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input, Header} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfoc} from 'core/model/flopy/packages/mf';

class OcPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackage} = this.props;

        return (
            <Form>
                <Header as={'h2'}>To be implemented</Header>
                <Form.Field>
                    <label>Format for printing head (ihedfm)</label>
                    <Input readOnly
                           name='ihedfm'
                           value={JSON.stringify(mfPackage.ihedfm)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Format for printing drawdown (iddnfm)</label>
                    <Input readOnly
                           name='iddnfm'
                           value={JSON.stringify(mfPackage.iddnfm)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Format for saving head (chedfm)</label>
                    <Input readOnly
                           name='chedfm'
                           value={JSON.stringify(mfPackage.chedfm)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Format for saving drawdown (cddnfm)</label>
                    <Input readOnly
                           name='cddnfm'
                           value={JSON.stringify(mfPackage.cddnfm)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Format for saving ibound (cboufm)</label>
                    <Input readOnly
                           name='cboufm'
                           value={JSON.stringify(mfPackage.cboufm)}
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
                    <label>Compact budget form (compact)</label>
                    <Input readOnly
                           name='compact'
                           value={JSON.stringify(mfPackage.compact)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Compact budget form (compact)</label>
                    <Input readOnly
                           name='compact'
                           value={JSON.stringify(mfPackage.compact)}
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
                <Form.Field>
                    <label>Label (label)</label>
                    <Input readOnly
                           name='label'
                           value={JSON.stringify(mfPackage.label)}
                    />
                </Form.Field>
            </Form>
        );
    }
}

OcPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfoc),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default OcPackageProperties;
