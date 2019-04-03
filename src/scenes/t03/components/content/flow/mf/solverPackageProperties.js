import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input, Header} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfpcg} from 'core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';

class SolverPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackage} = this.props;

        return (
            <Form>
                <Header as={'h4'}>Direct Solver Package</Header>

                <Form.Group>
                    <Form.Field>
                        <label>Maximum number of iterations (itmx)</label>
                        <Input readOnly
                               name='itmx'
                               value={JSON.stringify(mfPackage.itmx)}
                               icon={this.renderInfoPopup(documentation.itmx, 'itmx')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Maximum number of upper equations (mxup)</label>
                        <Input readOnly
                               name='mxup'
                               value={JSON.stringify(mfPackage.mxup)}
                               icon={this.renderInfoPopup(documentation.mxup, 'mxup')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Maximum number of lower equations (mxlow)</label>
                        <Input readOnly
                               name='mxlow'
                               value={JSON.stringify(mfPackage.mxlow)}
                               icon={this.renderInfoPopup(documentation.mxlow, 'mxlow')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Maximum bandwidth (mxbw)</label>
                        <Input readOnly
                               name='mxbw'
                               value={JSON.stringify(mfPackage.mxbw)}
                               icon={this.renderInfoPopup(documentation.mxbw, 'mxbw')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Frequency of change of coefficients (ifreq)</label>
                        <Input readOnly
                               name='ifreq'
                               value={JSON.stringify(mfPackage.ifreq)}
                               icon={this.renderInfoPopup(documentation.ifreq, 'ifreq')}
                        />
                    </Form.Field>
                </Form.Group>

                    <Form.Field>
                        <label>Print flag for convergence information per time step (mutd4)</label>
                        <Input readOnly
                               name='mutd4'
                               value={JSON.stringify(mfPackage.mutd4)}
                               icon={this.renderInfoPopup(documentation.mutd4, 'mutd4')}
                        />
                    </Form.Field>

                <Form.Group widths='equal'>
                    <Form.Field width={12}>
                        <label>Head change multiplier (accl)</label>
                        <Input readOnly
                               name='accl'
                               value={JSON.stringify(mfPackage.accl)}
                               icon={this.renderInfoPopup(documentation.accl, 'accl')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Head change closure criterion (hclose)</label>
                        <Input readOnly
                               name='hclose'
                               value={JSON.stringify(mfPackage.hclose)}
                               icon={this.renderInfoPopup(documentation.hclose, 'hclose')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Interval for time step printing (iprd4)</label>
                        <Input readOnly
                               name='iprd4'
                               value={JSON.stringify(mfPackage.iprd4)}
                               icon={this.renderInfoPopup(documentation.iprd4, 'iprd4')}
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

SolverPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfpcg),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default SolverPackageProperties;
