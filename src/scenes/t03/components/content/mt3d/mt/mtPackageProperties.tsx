import React, {SyntheticEvent} from 'react';
import {DropdownProps, Form, Header, Input, Select} from 'semantic-ui-react';
import {FlopyMt3dMt} from '../../../../../../core/model/flopy/packages/mt';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';
import {PopupPosition} from '../../../../../types';
import {documentation} from '../../../../defaults/transport';

interface IProps {
    mtPackage: FlopyMt3dMt;
    onChange: (p: FlopyMt3dMt) => any;
    readOnly: boolean;
}

const mtPackageProperties = (props: IProps) => {

    const handleOnSelect = (e: SyntheticEvent, {name, value}: DropdownProps) => {
        const cMtPackage = props.mtPackage.toObject();
        cMtPackage[name] = value;
        return props.onChange(FlopyMt3dMt.fromObject(cMtPackage));
    };

    const {mtPackage, readOnly} = props;

    return (
        <Form>
            <Header as={'h3'} dividing={true}>Transport Engine</Header>
            <Form.Group>
                <Form.Field>
                    <label>Executable name</label>
                    <Select
                        name={'exe_name'}
                        options={[
                            {key: 0, value: 'mt3dms', text: 'MT3DMS'},
                            {key: 1, value: 'mt3dusgs', text: 'MT3USGS'},
                        ]}
                        onChange={handleOnSelect}
                        value={mtPackage.exe_name}
                        disabled={readOnly}
                    />
                </Form.Field>
                <Form.Field>
                    <label>&nbsp;</label>
                    {renderInfoPopup(documentation.mt.exe_name, 'exe_name', PopupPosition.TOP_LEFT, true)}
                </Form.Field>
                <Form.Field>
                    <label>Version</label>
                    <Input
                        value={mtPackage.version}
                        readOnly={readOnly}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Ftl filename</label>
                    <Input
                        value={mtPackage.ftlfilename}
                        readOnly={readOnly}
                    />
                </Form.Field>
                <Form.Field width={7}>
                    <label>Verbose</label>
                    <Input
                        value={mtPackage.verbose}
                        readOnly={readOnly}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default mtPackageProperties;
