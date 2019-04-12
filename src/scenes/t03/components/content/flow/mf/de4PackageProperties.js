import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input} from 'semantic-ui-react';

import {FlopyModflowMfde4} from 'core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';
import {AbstractPackageProperties} from './index';

class De4PackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const mfPackage = FlopyModflowMfde4.fromObject(this.state.mfPackage);
        const readOnly = this.props.readonly;

        return (
            <Form>
                <Form.Group>
                    <Form.Field>
                        <label>Maximum number of iterations (itmx)</label>
                        <Input
                            type={'number'}
                            readOnly={readOnly}
                            name='itmx'
                            value={mfPackage.itmx}
                            icon={this.renderInfoPopup(documentation.itmx, 'itmx')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Maximum number of upper equations (mxup)</label>
                        <Input
                            readOnly={readOnly}
                            name='mxup'
                            value={mfPackage.mxup}
                            icon={this.renderInfoPopup(documentation.mxup, 'mxup')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Maximum number of lower equations (mxlow)</label>
                        <Input
                            readOnly={readOnly}
                            name='mxlow'
                            value={mfPackage.mxlow}
                            icon={this.renderInfoPopup(documentation.mxlow, 'mxlow')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Maximum bandwidth (mxbw)</label>
                        <Input
                            readOnly={readOnly}
                            name='mxbw'
                            value={mfPackage.mxbw}
                            icon={this.renderInfoPopup(documentation.mxbw, 'mxbw')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Frequency of change (ifreq)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 1, text: '1'},
                                {key: 1, value: 2, text: '2'},
                                {key: 2, value: 3, text: '3'},
                            ]}
                            placeholder='Select ifreq'
                            name='ifreq'
                            selection
                            value={mfPackage.ifreq}
                            readOnly={readOnly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {this.renderInfoPopup(documentation.ichflg, 'ifreq', 'top left', true)}
                    </Form.Field>

                    <Form.Field>
                        <label>Print convergence (mutd4)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: '0'},
                                {key: 1, value: 1, text: '1'},
                                {key: 2, value: 2, text: '2'},
                            ]}
                            placeholder='Select mutd4'
                            name='mutd4'
                            selection
                            value={mfPackage.mutd4}
                            readOnly={readOnly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {this.renderInfoPopup(documentation.mutd4, 'mutd4', 'top left', true)}
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field width={12}>
                        <label>Head change multiplier (accl)</label>
                        <Input
                            readOnly={readOnly}
                            name='accl'
                            value={mfPackage.accl}
                            icon={this.renderInfoPopup(documentation.accl, 'accl')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Head change closure criterion (hclose)</label>
                        <Input
                            readOnly={readOnly}
                            name='hclose'
                            value={mfPackage.hclose}
                            icon={this.renderInfoPopup(documentation.hclose, 'hclose')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Interval for time step printing (iprd4)</label>
                        <Input
                            readOnly={readOnly}
                            name='iprd4'
                            value={mfPackage.iprd4}
                            icon={this.renderInfoPopup(documentation.iprd4, 'iprd4')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Filename extension (extension)</label>
                        <Input
                            readOnly
                            name='extension'
                            value={mfPackage.extension || ''}
                            icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input
                            readOnly
                            name='unitnumber'
                            value={mfPackage.unitnumber || ''}
                            icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
                        <Input
                            readOnly
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

De4PackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfde4).isRequired,
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};

export default De4PackageProperties;
