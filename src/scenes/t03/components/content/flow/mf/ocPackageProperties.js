import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfoc} from 'core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';

class OcPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackage} = this.props;

        return (
            <Form>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Format for printing head (ihedfm)</label>
                        <Input readOnly
                               name='ihedfm'
                               value={JSON.stringify(mfPackage.ihedfm)}
                               icon={this.renderInfoPopup(documentation.ihedfm, 'ihedfm')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Format for printing drawdown (iddnfm)</label>
                        <Input readOnly
                               name='iddnfm'
                               value={JSON.stringify(mfPackage.iddnfm)}
                               icon={this.renderInfoPopup(documentation.iddnfm, 'iddnfm')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Format for saving head (chedfm)</label>
                        <Input readOnly
                               name='chedfm'
                               value={JSON.stringify(mfPackage.chedfm)}
                               icon={this.renderInfoPopup(documentation.chedfm, 'chedfm')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Format for saving drawdown (cddnfm)</label>
                        <Input readOnly
                               name='cddnfm'
                               value={JSON.stringify(mfPackage.cddnfm)}
                               icon={this.renderInfoPopup(documentation.cddnfm, 'cddnfm')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Format for saving ibound (cboufm)</label>
                        <Input readOnly
                               name='cboufm'
                               value={JSON.stringify(mfPackage.cboufm)}
                               icon={this.renderInfoPopup(documentation.cboufm, 'cboufm')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>List of boundaries (stress_period_data)</label>
                        <Input readOnly
                               name='stress_period_data'
                               value={JSON.stringify(mfPackage.stress_period_data)}
                               icon={this.renderInfoPopup(documentation.stress_period_data, 'stress_period_data')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Compact budget form (compact)</label>
                        <Input readOnly
                               name='compact'
                               value={JSON.stringify(mfPackage.compact)}
                               icon={this.renderInfoPopup(documentation.compact, 'compact')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Label (label)</label>
                        <Input readOnly
                               name='label'
                               value={JSON.stringify(mfPackage.label)}
                               icon={this.renderInfoPopup(documentation.label, 'label')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Filename extension (extension)</label>
                        <Input readOnly
                               name='extension'
                               value={JSON.stringify(mfPackage.extension)}
                               icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input readOnly
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                               icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
                               icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>
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
