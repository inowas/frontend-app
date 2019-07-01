import React, {SyntheticEvent} from 'react';
import {DropdownProps, Form, Input, Select} from 'semantic-ui-react';
import {FlopyMt3dMt} from '../../../../../../core/model/flopy/packages/mt';
import AbstractPackageProperties from './AbstractPackageProperties';

class SeawatPackageProperties extends AbstractPackageProperties {

    public handleSelectExecutable = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const swtPackage = FlopyMt3dMt.fromObject(this.state.swtPackage);
        swtPackage.exeName = data.value;
        this.props.onChange(swtPackage);
        this.setState({
            swtPackage: swtPackage.toObject()
        });
    };

    public render() {
        if (!this.state.swtPackage) {
            return null;
        }

        const {readonly} = this.props;
        const {swtPackage} = this.state;

        return (
            <Form>
                <Form.Group>
                    <Form.Field>
                        <label>Executable name</label>
                        <Select
                            options={[
                                {key: 0, value: 'seawat', text: 'SEAWAT'}
                            ]}
                            onChange={this.handleSelectExecutable}
                            value={swtPackage.exe_name}
                            disabled={readonly}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Executable name</label>
                        <Input value="SEAWAT" readOnly={true}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Version</label>
                        <Input value="4." readOnly={true}/>
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

export default SeawatPackageProperties;
