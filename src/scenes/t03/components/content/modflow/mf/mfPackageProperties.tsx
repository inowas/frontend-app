import React, {SyntheticEvent} from 'react';
import {DropdownProps, Form, Header, Select} from 'semantic-ui-react';
import {FlopyModflowMf} from '../../../../../../core/model/flopy/packages/mf';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';
import {PopupPosition} from '../../../../../types';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModflowMf;
    mfPackages: FlopyModflow;
    onChange: (p: FlopyModflowMf) => any;
    readonly: boolean;
}

const mfPackageProperties = (props: IProps) => {
    const handleOnSelect = (e: SyntheticEvent, {name, value}: DropdownProps) => {
        const cMfPackage = props.mfPackage.toObject();
        cMfPackage[name] = value;
        return props.onChange(FlopyModflowMf.fromObject(cMfPackage));
    };

    const {mfPackages, readonly} = props;
    const flowPackage = mfPackages.getFlowPackage();
    if (!props.mfPackage || !flowPackage) {
        return null;
    }

    const executableOptions = flowPackage
        .supportedModflowVersions()
        .map((mfVersion, idx) => ({key: idx, value: mfVersion.executable, text: mfVersion.name}));

    return (
        <Form>
            <Header as={'h3'} dividing={true}>Flow Engine</Header>
            <Form.Group>
                <Form.Field>
                    <label>Executable name</label>
                    <Select
                        options={executableOptions}
                        onChange={handleOnSelect}
                        value={props.mfPackage.exe_name}
                        disabled={readonly}
                        name={'exe_name'}
                    />
                </Form.Field>
                <Form.Field>
                    <label>&nbsp;</label>
                    {renderInfoPopup(documentation.exe_name, 'exe_name', PopupPosition.TOP_LEFT, true)}
                </Form.Field>
                <Form.Field width={5}>
                    <label>Version</label>
                    <Form.Input
                        value={props.mfPackage.version}
                        readOnly={true}
                        icon={renderInfoPopup(documentation.version, 'version', PopupPosition.TOP_RIGHT)}
                    />
                </Form.Field>
                <Form.Field width={5}>
                    <label>Verbose</label>
                    <Form.Select
                        options={[
                            {key: 0, value: true, text: 'true'},
                            {key: 1, value: false, text: 'false'},
                        ]}
                        onChange={handleOnSelect}
                        value={props.mfPackage.verbose}
                        disabled={readonly}
                        name={'verbose'}
                    />
                </Form.Field>
                <Form.Field>
                    <label>&nbsp;</label>
                    {renderInfoPopup(documentation.verbose, 'verbose', PopupPosition.TOP_RIGHT, true)}
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default mfPackageProperties;
