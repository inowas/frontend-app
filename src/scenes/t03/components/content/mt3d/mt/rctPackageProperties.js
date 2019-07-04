import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input} from 'semantic-ui-react';
import AbstractPackageProperties from './AbstractPackageProperties';
import {documentation} from '../../../../defaults/transport';
import FlopyMt3dMtrct from "../../../../../../core/model/flopy/packages/mt/FlopyMt3dMtrct";
import InfoPopup from "../../../../../shared/InfoPopup";
import ToggleableInput from "../../../../../shared/complexTools/ToggleableInput";

class RctPackageProperties extends AbstractPackageProperties {

    handleOnToggleableChange = (name, value) => this.handleOnBlur()({
        target: {name, value}
    });

    render() {

        if (!this.state.mtPackage) {
            return null;
        }

        const {readOnly} = this.props;
        const {mtPackage} = this.state;

        return (
            <Form>
                <Form.Group>
                    <Form.Field width={15}>
                        <label>Simulated sorption type (isothm)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: 'No sorption is simulated'},
                                {key: 1, value: 1, text: 'Linear isotherm (equilibrium-controlled)'},
                                {key: 2, value: 2, text: 'Freundlich isotherm (equilibrium-controlled)'},
                                {key: 3, value: 3, text: 'Langmuir isotherm (equilibrium-controlled)'},
                                {key: 4, value: 4, text: 'First-order kinetic sorption (nonequilibrium)'},
                                {key: 5, value: 5, text: 'Dual-domain mass transfer (without sorption)'},
                                {key: 6, value: 6, text: 'Dual-domain mass transfer (with sorption)'}
                            ]}
                            placeholder="Select isothm"
                            name="isothm"
                            selection={true}
                            value={mtPackage.isothm || 0}
                            readOnly={readOnly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.isothm}
                            title="ISOTHM"
                            position="bottom right"
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group>
                    <Form.Field width={15}>
                        <label>Kinetic rate reaction (ireact)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: 'No kinetic rate reaction is simulated'},
                                {key: 1, value: 1, text: 'First-order irreversible reaction'},
                            ]}
                            placeholder="Select ireact"
                            name="ireact"
                            selection={true}
                            value={mtPackage.ireact || 0}
                            readOnly={readOnly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.ireact}
                            title="IREACT"
                            position="bottom right"
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group>
                    <Form.Field width={8}>
                        <label>Reading initial concentrations (igetsc)</label>
                        <Input
                            type={'number'}
                            name={'igetsc'}
                            value={mtPackage.igetsc}
                            disabled={readOnly}
                            onBlur={this.handleOnBlur(parseFloat)}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.igetsc, 'IGETSC', 'bottom left')}
                        />
                    </Form.Field>
                </Form.Group>
                {mtPackage.isothm > 0 &&
                <Form.Group>
                    {[1, 2, 3, 4, 6].includes(mtPackage.isothm) &&
                    <React.Fragment>
                        <Form.Field width={7}>
                            <label>Bulk density (rhob)</label>
                            <ToggleableInput
                                name={'rhob'}
                                value={mtPackage.rhob}
                                readOnly={readOnly}
                                onChange={this.handleOnToggleableChange}
                                placeholder={0}
                                type='number'
                            />
                        </Form.Field>
                        <Form.Field width={1}>
                            <label>&nbsp;</label>
                            <InfoPopup
                                description={documentation.rhob}
                                title="RHOB"
                                position="top left"
                                iconOutside={true}
                            />
                        </Form.Field>
                    </React.Fragment>
                    }
                    {[5, 6].includes(mtPackage.isothm) &&
                    <React.Fragment>
                        <Form.Field width={7}>
                            <label>Porosity (prsity2)</label>
                            <ToggleableInput
                                name={'prsity2'}
                                value={mtPackage.prsity2}
                                readOnly={readOnly}
                                onChange={this.handleOnToggleableChange}
                                placeholder={0}
                                type='number'
                            />
                        </Form.Field>
                        <Form.Field width={1}>
                            <label>&nbsp;</label>
                            <InfoPopup
                                description={documentation.prsity2}
                                title="PRSITY2"
                                position="top right"
                                iconOutside={true}
                            />
                        </Form.Field>
                    </React.Fragment>
                    }
                </Form.Group>
                }
                <Form.Group>
                    <Form.Field width={7}>
                        <label>Sorbed phase initial concentration (srconc)</label>
                        <ToggleableInput
                            name={'srconc'}
                            value={mtPackage.srconc}
                            readOnly={readOnly}
                            onChange={this.handleOnToggleableChange}
                            placeholder={0}
                            type='number'
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.srconc}
                            title="SRCONC"
                            position="top right"
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
                {mtPackage.isothm > 0 &&
                <Form.Group>
                    <Form.Field width={7}>
                        <label>First parameter (sp1)</label>
                        <ToggleableInput
                            name={'sp1'}
                            value={mtPackage.sp1}
                            readOnly={readOnly}
                            onChange={this.handleOnToggleableChange}
                            placeholder={0}
                            type='number'
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.sp1}
                            title="SP1"
                            position="top left"
                            iconOutside={true}
                        />
                    </Form.Field>
                    <Form.Field width={7}>
                        <label>Second parameter (sp2)</label>
                        <ToggleableInput
                            name={'sp2'}
                            value={mtPackage.sp2}
                            readOnly={readOnly}
                            onChange={this.handleOnToggleableChange}
                            placeholder={0}
                            type='number'
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.sp2}
                            title="SP2"
                            position="top right"
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
                }
                {mtPackage.ireact > 0 &&
                <Form.Group>
                    <Form.Field width={7}>
                        <label>Dissolved phase reaction rate (rc1)</label>
                        <ToggleableInput
                            name={'rc1'}
                            value={mtPackage.rc1}
                            readOnly={readOnly}
                            onChange={this.handleOnToggleableChange}
                            placeholder={0}
                            type='number'
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.rc1}
                            title="RC1"
                            position="top left"
                            iconOutside={true}
                        />
                    </Form.Field>
                    <Form.Field width={7}>
                        <label>Sorbed phase reaction rate (rc2)</label>
                        <ToggleableInput
                            name={'rc2'}
                            value={mtPackage.rc2}
                            readOnly={readOnly}
                            onChange={this.handleOnToggleableChange}
                            placeholder={0}
                            type='number'
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.rc2}
                            title="RC2"
                            position="top right"
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
                }
            </Form>
        );
    }
}

RctPackageProperties.propTypes = {
    mtPackage: PropTypes.instanceOf(FlopyMt3dMtrct),
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
};

export default RctPackageProperties;
