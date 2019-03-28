import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfwel} from 'core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';

class WelPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackage} = this.props;

        return (
            <Form>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Cell-by-cell budget data (ipakcb)</label>
                        <Input readOnly
                               name='ipakcb'
                               value={JSON.stringify(mfPackage.ipakcb)}
                               icon={this.renderInfoPopup(documentation.ipakcb, 'ipakcb')}
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
                    <label>binary</label>
                    <Input readOnly
                           name='binary'
                           value={JSON.stringify(mfPackage.binary)}
                    />
                     </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
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
                        <label>Filename (filenames)</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

WelPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfwel),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default WelPackageProperties;
