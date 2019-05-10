import PropTypes from 'prop-types';
import React from 'react';
import {Form} from 'semantic-ui-react';

import {FlopyModflow} from '../../../../../../core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';
import {De4PackageProperties, PcgPackageProperties} from './index';
import InfoPopup from '../../../../../shared/InfoPopup';

class SolverPackageProperties extends React.Component {

    handleSelectChange = (e, {value}) => {
        const {mfPackages} = this.props;
        const {availableSolverPackages} = mfPackages;
        const selectedFlowPackageType = mfPackages.getPackageType(mfPackages.getSolverPackage());

        if (selectedFlowPackageType !== value) {
            const solverPackage = availableSolverPackages.filter(sp => sp.type === value)[0]['package'];
            this.props.onChange(solverPackage.create());
        }
    };

    renderPackageProperties(type) {
        const readOnly = this.props.readonly;
        const mf = this.props.mfPackages;

        // noinspection JSRedundantSwitchStatement
        switch (type) {
            case 'de4':
                return (
                    <De4PackageProperties
                        mfPackage={mf.getPackage(type)}
                        onChange={this.props.onChange}
                        readonly={readOnly}
                    />
                );
            case 'pcg':
                return (
                    <PcgPackageProperties
                        mfPackage={mf.getPackage(type)}
                        onChange={this.props.onChange}
                        readonly={readOnly}
                    />
                );

            default:
                return null;
        }
    }


    render() {
        const {mfPackages} = this.props;
        const {availableSolverPackages} = mfPackages;
        const {readonly} = this.props;

        const selectedSolverPackagePackageType = mfPackages.getPackageType(mfPackages.getSolverPackage());

        return (
            <div>
                <Form>
                    <Form.Group>
                        <Form.Field width={15}>
                            <label>Flow Packages</label>
                            <Form.Dropdown
                                options={availableSolverPackages.map(fp => ({
                                    key: fp.type, value: fp.type, text: fp.name
                                }))}
                                placeholder='Select model'
                                name='model'
                                selection
                                value={selectedSolverPackagePackageType}
                                onChange={this.handleSelectChange}
                                readOnly={readonly}
                            />
                        </Form.Field>
                        <Form.Field width={1}>
                            <label>&nbsp;</label>
                            <InfoPopup description={documentation.model} title='Model' position='top right'
                                       iconOutside={true}/>
                        </Form.Field>
                    </Form.Group>
                </Form>
                {this.renderPackageProperties(selectedSolverPackagePackageType)}
            </div>
        );
    }
}

SolverPackageProperties.propTypes = {
    mfPackages: PropTypes.instanceOf(FlopyModflow).isRequired,
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};

export default SolverPackageProperties;
