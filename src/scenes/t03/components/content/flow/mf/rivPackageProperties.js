import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfriv} from 'core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';

class RivPackageProperties extends AbstractPackageProperties {

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
                               value={mfPackage.dtype || ''}
                               icon={this.renderInfoPopup(documentation.dtype, 'dtype')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Package options (options)</label>
                        <Input readOnly
                               name='options'
                               value={mfPackage.options || ''}
                               icon={this.renderInfoPopup(documentation.options, 'options')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Filename extension</label>
                        <Input readOnly
                               name='extension'
                               value={mfPackage.extension || ''}
                               icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number</label>
                        <Input readOnly
                               type={'number'}
                               name='unitnumber'
                               value={mfPackage.unitnumber || ''}
                               icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames</label>
                        <Input readOnly
                               name='filenames'
                               value={mfPackage.filenames || ''}
                               icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>
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
