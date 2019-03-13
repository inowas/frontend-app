import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input, Select} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMf} from 'core/model/flopy/packages/mf';


class MfPackageProperties extends AbstractPackageProperties {

    handleSelectExecutable = (e, {value}) => {
        const mf = FlopyModflowMf.fromObject(this.state.mfPackage);
        mf.exe_name = value;
        this.props.onChange(mf);
        this.setState({
            mfPackage: mf.toObject()
        });
    };

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {readonly} = this.props;
        const {mfPackage} = this.state;

        return (
            <Form>
                <Form.Group>
                    <Form.Field>
                        <label>Executable name</label>
                        <Select
                            options={[
                                {key: 0, value: 'mf2005', text: 'MF2005'},
                            ]}
                            onChange={this.handleSelectExecutable}
                            value={mfPackage.exe_name}
                            disabled={readonly}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>&nbsp;</label>
                        {this.renderInfoPopup('PLACEHOLDER', 'Method', 'top right', true)}
                    </Form.Field>
                    <Form.Field>
                        <label>Version</label>
                        <Input value={mfPackage.version} readOnly/>
                    </Form.Field>
                    <Form.Field width={7}>
                        <label>Verbose</label>
                        <Input value={mfPackage.verbose} readOnly/>
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

MfPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMf),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default MfPackageProperties;
