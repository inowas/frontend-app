import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input, Select} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfghb} from 'core/model/flopy/packages/mf';
import InfoPopup from '../../../../../shared/InfoPopup';
import {documentation} from '../../../../defaults/flow';

const styles = {
    inputFix: {
        padding: '0',
        height: 'auto'
    }
};

class GhbPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {readonly, mfPackage} = this.props;

        return (
            <Form>
                <Form.Group>
                    <Form.Field width={15}>
                        <label>Model object</label>
                        <Form.Dropdown
                            placeholder='Select model'
                            name='model'
                            selection
                            value={JSON.stringify(mfPackage.model)}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup description={documentation.model} title='Model' position='top right' iconOutside={true} />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Cell-by-cell budget data (ipakcb)</label>
                        <Input readOnly
                               name='ipakcb'
                               value={JSON.stringify(mfPackage.ipakcb)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.ipakcb, 'ipakcb')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>List of boundaries (stress_period_data)</label>
                        <Input readOnly
                               name='stress_period_data'
                               value={JSON.stringify(mfPackage.stress_period_data)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.stress_period_data, 'stress_period_data')}
                        />
                    </Form.Field>
                </Form.Group>

                    <Form.Field>
                        <label>Data type (dtype)</label>
                        <Input readOnly
                               name='dtype'
                               value={JSON.stringify(mfPackage.dtype)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.dtype, 'dtype')}
                        />
                    </Form.Field>

                <Form.Group>
                    <Form.Field width={15}>
                        <label style={styles.headerLabel}>Package Options</label>
                        <Select fluid
                                name={'options'}
                                value={mfPackage.options}
                                disabled={readonly}
                                onChange={this.handleOnSelect}
                                options={[
                                    {key: 0, value: 0, text: '0: Text'},
                                    {key: 1, value: 1, text: '1: Text'},
                                    {key: 2, value: 2, text: '2: Text'}
                                ]}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup description={documentation.options} title='Options' position='top right' iconOutside={true} />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Filename extension (extension)</label>
                        <Input readOnly
                               name='extension'
                               value={JSON.stringify(mfPackage.extension)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input readOnly
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>
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
