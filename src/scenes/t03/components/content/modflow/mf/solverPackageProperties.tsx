import React, {SyntheticEvent} from 'react';
import {DropdownProps, Form} from 'semantic-ui-react';

import FlopyModflow, {packagesMap, solverPackages} from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import FlopyModflowFlowPackage from '../../../../../../core/model/flopy/packages/mf/FlopyModflowFlowPackage';
import FlopyModflowSolverPackage from '../../../../../../core/model/flopy/packages/mf/FlopyModflowSolverPackage';
import InfoPopup from '../../../../../shared/InfoPopup';
import {documentation} from '../../../../defaults/flow';
import {De4PackageProperties, PcgPackageProperties} from './index';

interface IProps {
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowFlowPackage<any>) => void;
    onChangeFlowPackageType: (t: string) => void;
    readonly: boolean;
}

const solverPackageProperties = (props: IProps) => {

    const {mfPackages} = props;
    const {readonly} = props;
    const selectedSolverPackage = mfPackages.getSolverPackage() as FlopyModflowSolverPackage<any>;
    const selectedSolverPackageType = props.mfPackages.getTypeFromPackage(selectedSolverPackage);

    const handleSelectChange = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const value = data.value as string;
        if (selectedSolverPackageType !== value) {
            if (packagesMap[value]) {
                const className = packagesMap[value];
                props.onChange(className.fromDefault());
            }
        }
    };

    const renderPackageProperties = (type: string) => {
        const readOnly = props.readonly;
        const mf = props.mfPackages;

        switch (type) {
            case 'de4':
                return (
                    <De4PackageProperties
                        mfPackage={mf.getPackage(type)}
                        onChange={props.onChange}
                        readonly={readOnly}
                    />
                );
            case 'pcg':
                return (
                    <PcgPackageProperties
                        mfPackage={mf.getPackage(type)}
                        onChange={props.onChange}
                        readonly={readOnly}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div>
            <Form>
                <Form.Group>
                    <Form.Field width={15}>
                        <label>Flow Packages</label>
                        <Form.Dropdown
                            options={solverPackages.map((sp) => ({
                                key: sp, value: sp, text: sp
                            }))}
                            name="solverPackage"
                            selection={true}
                            value={selectedSolverPackageType}
                            onChange={handleSelectChange}
                            disabled={readonly}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.model}
                            title="Model"
                            position="top right"
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
            {renderPackageProperties(selectedSolverPackageType)}
        </div>
    );
};

export default solverPackageProperties;