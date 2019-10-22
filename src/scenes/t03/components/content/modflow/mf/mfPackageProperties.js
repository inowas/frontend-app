import PropTypes from 'prop-types';
import React from 'react';
import {Form, Select} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflow, FlopyModflowMf} from '../../../../../../core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';

class MfPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackages, readonly} = this.props;
        const {mfPackage} = this.state;

        const executableOptions = mfPackages.getFlowPackage()
            .supportedModflowVersions()
            .map((mfVersion, idx) => ({key: idx, value: mfVersion.executable, text: mfVersion.name}));

        return (
            <Form>
                <Form.Group>
                    <Form.Field>
                        <label>Executable name</label>
                        <Select
                            options={executableOptions}
                            onChange={this.handleOnSelect}
                            value={mfPackage.exe_name}
                            disabled={readonly}
                            name={'exe_name'}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>&nbsp;</label>
                        {this.renderInfoPopup(documentation.exe_name, 'exe_name', 'top left', true)}
                    </Form.Field>
                    <Form.Field  width={5}>
                        <label>Version</label>
                        <Form.Input
                            value={mfPackage.version}
                            readOnly
                            icon={this.renderInfoPopup(documentation.version, 'version', 'top right')}
                        />
                    </Form.Field>
                    <Form.Field width={5}>
                        <label>Verbose</label>
                        <Form.Select
                            options={[
                                {key: 0, value: true, text: 'true'},
                                {key: 1, value: false, text: 'false'},
                            ]}
                            onChange={this.handleOnSelect}
                            value={mfPackage.verbose}
                            disabled={readonly}
                            name={'verbose'}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>&nbsp;</label>
                        {this.renderInfoPopup(documentation.verbose, 'verbose', 'top right', true)}
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

MfPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMf).isRequired,
    mfPackages: PropTypes.instanceOf(FlopyModflow).isRequired,
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default MfPackageProperties;
