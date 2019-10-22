import React from 'react';
import {Form, Input} from 'semantic-ui-react';
import AbstractPackageProperties from './AbstractPackageProperties';

class SeawatPackageProperties extends AbstractPackageProperties {
    public render() {
        if (!this.state.swtPackage) {
            return null;
        }

        const {swtPackage} = this.state;

        return (
            <Form>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Executable name</label>
                        <Input value={swtPackage.exe_name} readOnly={true}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Version</label>
                        <Input value={swtPackage.version} readOnly={true}/>
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

export default SeawatPackageProperties;
