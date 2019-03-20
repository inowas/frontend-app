import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input, Header} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfpcg} from 'core/model/flopy/packages/mf';

class SolverPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {readonly, mfPackage} = this.props;

        return (
            <Form>
                <Header as={'h4'}>Direct Solver Package</Header>

                <Form.Group>
                    <Form.Field>
                        <label>(itmx)</label>
                        <Input readOnly
                               name='itmx'
                               value={JSON.stringify(mfPackage.itmx)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(mxup)</label>
                        <Input readOnly
                               name='mxup'
                               value={JSON.stringify(mfPackage.mxup)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(mxlow)</label>
                        <Input readOnly
                               name='mxlow'
                               value={JSON.stringify(mfPackage.mxlow)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(mxbw)</label>
                        <Input readOnly
                               name='mxbw'
                               value={JSON.stringify(mfPackage.mxbw)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>(ifreq)</label>
                        <Input readOnly
                               name='ifreq'
                               value={JSON.stringify(mfPackage.ifreq)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(mutd4)</label>
                        <Input readOnly
                               name='mutd4'
                               value={JSON.stringify(mfPackage.mutd4)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(accl)</label>
                        <Input readOnly
                               name='accl'
                               value={JSON.stringify(mfPackage.accl)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(hclose)</label>
                        <Input readOnly
                               name='hclose'
                               value={JSON.stringify(mfPackage.hclose)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Field>
                    <label>(iprd4)</label>
                    <Input readOnly
                           name='iprd4'
                           value={JSON.stringify(mfPackage.iprd4)}
                    />
                </Form.Field>

                <Form.Group>
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
