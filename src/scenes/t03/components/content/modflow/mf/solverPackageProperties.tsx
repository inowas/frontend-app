import {DropdownProps, Form} from 'semantic-ui-react';
import React, {SyntheticEvent} from 'react';

import {
    De4PackageProperties,
    GmgPackageProperties,
    NwtPackageProperties,
    PcgPackageProperties,
    PcgnPackageProperties,
    SipPackageProperties,
    SmsPackageProperties,
    SorPackageProperties
} from './index';
import {documentation} from '../../../../defaults/flow';
import FlopyModflow, {packagesMap, solverPackages} from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import FlopyModflowMfde4 from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfde4';
import FlopyModflowMfgmg from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfgmg';
import FlopyModflowMfnwt from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfnwt';
import FlopyModflowMfpcg from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfpcg';
import FlopyModflowMfpcgn from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfpcgn';
import FlopyModflowMfsip from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfsip';
import FlopyModflowMfsms from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfsms';
import FlopyModflowMfsor from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfsor';
import FlopyModflowSolverPackage from '../../../../../../core/model/flopy/packages/mf/FlopyModflowSolverPackage';
import InfoPopup from '../../../../../shared/InfoPopup';

interface IProps {
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowSolverPackage<any>) => void;
    readonly: boolean;
}

const SolverPackageProperties = (props: IProps) => {

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
                        mfPackage={mf.getPackage(type) as FlopyModflowMfde4}
                        onChange={props.onChange}
                        readonly={readOnly}
                    />
                );
            case 'gmg':
                return (
                    <GmgPackageProperties
                        mfPackage={mf.getPackage(type) as FlopyModflowMfgmg}
                        onChange={props.onChange}
                        readonly={readOnly}
                    />
                );
            case 'nwt':
                return (
                    <NwtPackageProperties
                        mfPackage={mf.getPackage(type) as FlopyModflowMfnwt}
                        onChange={props.onChange}
                        readonly={readOnly}
                    />
                );
            case 'pcg':
                return (
                    <PcgPackageProperties
                        mfPackage={mf.getPackage(type) as FlopyModflowMfpcg}
                        onChange={props.onChange}
                        readonly={readOnly}
                    />
                );
            case 'pcgn':
                return (
                    <PcgnPackageProperties
                        mfPackage={mf.getPackage(type) as FlopyModflowMfpcgn}
                        onChange={props.onChange}
                        readonly={readOnly}
                    />
                );
            case 'sip':
                return (
                    <SipPackageProperties
                        mfPackage={mf.getPackage(type) as FlopyModflowMfsip}
                        onChange={props.onChange}
                        readonly={readOnly}
                    />
                );
            case 'sms':
                return (
                    <SmsPackageProperties
                        mfPackage={mf.getPackage(type) as FlopyModflowMfsms}
                        onChange={props.onChange}
                        readonly={readOnly}
                    />
                );
            case 'sor':
                return (
                    <SorPackageProperties
                        mfPackage={mf.getPackage(type) as FlopyModflowMfsor}
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
                        <label>Solver Packages</label>
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

export default SolverPackageProperties;
