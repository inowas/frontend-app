import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input, Select} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyMt3dMt} from 'core/model/flopy/packages/mt';


class MtPackageProperties extends AbstractPackageProperties {

    handleSelectExecutable = (e, {value}) => {
        const mtPackage = FlopyMt3dMt.fromObject(this.state.mtPackage);
        mtPackage.exeName = value;
        this.props.onChange(mtPackage);
        this.setState({
            mtPackage: mtPackage.toObject()
        });
    };

    render() {
        if (!this.state.mtPackage) {
            return null;
        }

        const {readonly} = this.props;
        const {mtPackage} = this.state;

        return (
            <Form>
                <Form.Group>
                    <Form.Field>
                        <label>Executable name</label>
                        <Select
                            options={[
                                {key: 0, value: 'mt3dms', text: 'MT3DMS'},
                                {key: 1, value: 'mt3dusgs', text: 'MT3USGS'},
                            ]}
                            onChange={this.handleSelectExecutable}
                            value={mtPackage.exe_name}
                            disabled={readonly}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>&nbsp;</label>
                        {this.renderInfoPopup('PLACEHOLDER', 'Method', 'top right', true)}
                    </Form.Field>
                    <Form.Field>
                        <label>Version</label>
                        <Input value={mtPackage.version} readOnly/>
                    </Form.Field>
                    <Form.Field>
                        <label>Ftl filename</label>
                        <Input value={mtPackage.ftlfilename} readOnly/>
                    </Form.Field>
                    <Form.Field width={7}>
                        <label>Verbose</label>
                        <Input value={mtPackage.verbose} readOnly/>
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

MtPackageProperties.propTypes = {
    mtPackage: PropTypes.instanceOf(FlopyMt3dMt),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired,
};


export default MtPackageProperties;
