import PropTypes from 'prop-types';
import React from 'react';
import {Checkbox, Form, Select} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {MtPackage} from 'core/model/modflow/mt3d';


class MtPackageProperties extends AbstractPackageProperties {

    handleSelectExecutable = (e, {value}) => {
        const mtPackage = MtPackage.fromObject(this.state.mtPackage);
        mtPackage.exeName = value;
        this.props.onChange(mtPackage);
        this.setState({
            mtPackage: mtPackage.toObject
        });
    };

    render() {
        if (!this.state.mtPackage) {
            return null;
        }

        const {enabled, readonly, toggleEnabled} = this.props;
        const {mtPackage} = this.state;

        return (
            <Form>
                <Form.Field>
                    <label>Enabled</label>
                    <Checkbox checked={enabled} onChange={toggleEnabled} disabled={readonly}/>
                </Form.Field>
                <Form.Group>
                    <Form.Field width={15}>
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
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {this.renderInfoPopup('PLACEHOLDER', 'Method', 'top right', true)}
                    </Form.Field>
                </Form.Group>
                <Form.Field>
                    <label>Version</label>
                    <input value={mtPackage.version} readOnly/>
                </Form.Field>
                <Form.Field>
                    <label>Ftl filename</label>
                    <input value={mtPackage.ftlfilename} readOnly/>
                </Form.Field>
                <Form.Field>
                    <label>Verbose</label>
                    <input value={mtPackage.verbose} readOnly/>
                </Form.Field>
            </Form>
        );
    }
}

MtPackageProperties.propTypes = {
    mtPackage: PropTypes.instanceOf(MtPackage),
    onChange: PropTypes.func.isRequired,
    enabled: PropTypes.bool.isRequired,
    readonly: PropTypes.bool.isRequired,
    toggleEnabled: PropTypes.func.isRequired,
};


export default MtPackageProperties;
