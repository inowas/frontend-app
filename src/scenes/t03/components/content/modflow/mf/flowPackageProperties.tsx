import React, {SyntheticEvent} from 'react';
import {DropdownProps, Form} from 'semantic-ui-react';
import {FlopyModflowMfbcf, FlopyModflowMflpf} from '../../../../../../core/model/flopy/packages/mf';
import FlopyModflow, {flowPackages} from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import FlopyModflowFlowPackage from '../../../../../../core/model/flopy/packages/mf/FlopyModflowFlowPackage';

import InfoPopup from '../../../../../shared/InfoPopup';
import {documentation} from '../../../../defaults/flow';
import BcfPackageProperties from './bcfPackageProperties';
import LpfPackageProperties from './lpfPackageProperties';

interface IProps {
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowFlowPackage<any>) => void;
    onChangeFlowPackageType: (t: string) => void;
    readonly: boolean;
}

const flowPackageProperties = (props: IProps) => {

    const {mfPackages} = props;
    const flowPackage = mfPackages.getFlowPackage();
    const selectedFlowPackageType = flowPackage ? mfPackages.getTypeFromPackage(flowPackage) : '';

    const handleSelectChange = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const {value} = data;
        if (selectedFlowPackageType !== value) {
            return props.onChangeFlowPackageType(value as string);
        }
    };

    const renderPackageProperties = (type: string) => {
        const readOnly = props.readonly;
        const mf = props.mfPackages;

        switch (type) {
            case 'bcf':
                return (
                    <BcfPackageProperties
                        mfPackage={mf.getPackage(type) as FlopyModflowMfbcf}
                        mfPackages={mf}
                        onChange={props.onChange}
                        readonly={readOnly}
                    />
                );
            case 'lpf':
                return (
                    <LpfPackageProperties
                        mfPackage={mf.getPackage(type) as FlopyModflowMflpf}
                        mfPackages={mf}
                        onChange={props.onChange}
                        readonly={readOnly}
                    />
                );

            default:
                return null;
        }
    };

    const {readonly} = props;

    return (
        <div>
            <Form>
                <Form.Group>
                    <Form.Field width={15}>
                        <label>Flow Packages</label>
                        <Form.Dropdown
                            options={flowPackages.map((fp) => ({
                                key: fp, value: fp, text: fp
                            }))}
                            placeholder={'Select model'}
                            name={'model'}
                            selection={true}
                            value={selectedFlowPackageType}
                            onChange={handleSelectChange}
                            disabled={readonly}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.model}
                            title={'Model'}
                            position={'top right'}
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
            {renderPackageProperties(selectedFlowPackageType)}
        </div>
    );
};

export default flowPackageProperties;
