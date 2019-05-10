import PropTypes from 'prop-types';
import React from 'react';
import {Form} from 'semantic-ui-react';

import InfoPopup from '../../../../../shared/InfoPopup';
import {documentation} from '../../../../defaults/flow';
import {FlopyModflow} from '../../../../../../core/model/flopy/packages/mf';
import LpfPackageProperties from './lpfPackageProperties';
import BcfPackageProperties from './bcfPackageProperties';

class FlowPackageProperties extends React.Component {

    handleSelectChange = (e, {value}) => {
        const {mfPackages} = this.props;
        const selectedFlowPackageType = mfPackages.getPackageType(mfPackages.getFlowPackage());

        if (selectedFlowPackageType !== value) {
            return this.props.onChangeFlowPackageType(value);
        }
    };

    renderPackageProperties(type) {
        const readOnly = this.props.readonly;
        const mf = this.props.mfPackages;

        switch (type) {
            case 'bcf':
                return (
                    <BcfPackageProperties
                        mfPackage={mf.getPackage(type)}
                        mfPackages={mf}
                        onChange={this.props.onChange}
                        readonly={readOnly}
                    />
                );
            case 'lpf':
                return (
                    <LpfPackageProperties
                        mfPackage={mf.getPackage(type)}
                        mfPackages={mf}
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
        const {availableFlowPackages} = mfPackages;
        const {readonly} = this.props;

        const selectedFlowPackageType = mfPackages.getPackageType(mfPackages.getFlowPackage());

        return (
            <div>
                <Form>
                    <Form.Group>
                        <Form.Field width={15}>
                            <label>Flow Packages</label>
                            <Form.Dropdown
                                options={availableFlowPackages.map(fp => ({
                                    key: fp.type, value: fp.type, text: fp.name
                                }))}
                                placeholder='Select model'
                                name='model'
                                selection
                                value={selectedFlowPackageType}
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
                {this.renderPackageProperties(selectedFlowPackageType)}
            </div>
        );
    }
}

FlowPackageProperties.propTypes = {
    mfPackages: PropTypes.instanceOf(FlopyModflow).isRequired,
    onChange: PropTypes.func.isRequired,
    onChangeFlowPackageType: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired,
};


export default FlowPackageProperties;
