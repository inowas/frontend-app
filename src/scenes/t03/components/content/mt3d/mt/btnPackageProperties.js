import PropTypes from 'prop-types';
import React from 'react';
import {Accordion, Form, Icon, Input} from 'semantic-ui-react';
import AbstractPackageProperties from './AbstractPackageProperties';
import {documentation} from '../../../../defaults/transport';
import {FlopyMt3dMtbtn} from 'core/model/flopy/packages/mt';

const styles = {
    inputFix: {
        padding: '0',
        height: 'auto'
    }
};

class BtnPackageProperties extends AbstractPackageProperties {
    render() {
        if (!this.state.mtPackage) {
            return null;
        }

        const {readonly} = this.props;
        const {activeIndex, mtPackage} = this.state;

        return (
            <Form>
                <Accordion styled fluid>
                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClickAccordion}>
                        <Icon name='dropdown'/>
                        Basic Transport Parameters
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Total species (Ncomp)</label>
                                <Input
                                    type='number'
                                    name='ncomp'
                                    value={mtPackage.ncomp}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseInt)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.ncomp, 'NCOMP')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Mobile species (Mcomp)</label>
                                <Input
                                    type={'number'}
                                    name={'mcomp'}
                                    value={mtPackage.mcomp}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseInt)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.mcomp, 'MCOMP', 'top right')}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Porosity (Prsity)</label>
                                <Input
                                    type={'number'}
                                    name={'prsity'}
                                    value={mtPackage.prsity}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseFloat)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.prsity, 'PRSITY')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Concentration boundary indicator (Icbund)</label>
                                <Input
                                    type={'number'}
                                    name={'icbund'}
                                    value={mtPackage.icbund}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseFloat)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.icbund, 'ICBUND', 'top right')}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Field>
                            <label>Starting concentration (Sconc)</label>
                            <Input
                                type={'number'}
                                name={'sconc'}
                                value={mtPackage.sconc}
                                disabled={readonly}
                                onBlur={this.handleOnBlur(parseFloat)}
                                onChange={this.handleOnChange}
                                style={styles.inputFix}
                                icon={this.renderInfoPopup(documentation.sconc, 'SCONC', 'top right')}
                            />
                        </Form.Field>
                    </Accordion.Content>
                    <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClickAccordion}>
                        <Icon name='dropdown'/>
                        Inactive Cells
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Inactive concentration cells (Cinact)</label>
                                <Input
                                    type={'number'}
                                    name={'cinact'}
                                    value={mtPackage.cinact}
                                    readOnly
                                    onBlur={this.handleOnBlur((value) => parseFloat(value).toExponential())}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.cinact, 'CINACT')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Minimum saturated thickness (Thkmin)</label>
                                <Input
                                    type={'number'}
                                    name={'thkmin'}
                                    value={mtPackage.thkmin}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseFloat)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.thkmin, 'THKMIN', 'top right')}
                                />
                            </Form.Field>
                        </Form.Group>
                    </Accordion.Content>
                    <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClickAccordion}>
                        <Icon name='dropdown'/>
                        Output Control Options
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Ifmtcn</label>
                                <Input
                                    type={'number'}
                                    name={'ifmtcn'}
                                    value={mtPackage.ifmtcn}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseInt)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.ifmtcn, 'IFMTCN')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Ifmtnp</label>
                                <Input
                                    type={'number'}
                                    name={'ifmtnp'}
                                    value={mtPackage.ifmtnp}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseInt)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.ifmtnp, 'IFMTNP', 'top right')}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Ifmtrf</label>
                                <Input
                                    type={'number'}
                                    name={'ifmtrf'}
                                    value={mtPackage.ifmtrf}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseInt)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.ifmtrf, 'IFMTRF')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Ifmtdp</label>
                                <Input
                                    type={'number'}
                                    name={'ifmtdp'}
                                    value={mtPackage.ifmtdp}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseInt)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.ifmtdp, 'IFMTDP', 'top right')}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Nprs</label>
                                <Input
                                    type={'number'}
                                    name={'nprs'}
                                    value={mtPackage.nprs}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseInt)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.nprs, 'NPRS')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Nprobs</label>
                                <Input
                                    type={'number'}
                                    name={'nprobs'}
                                    value={mtPackage.nprobs}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseInt)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.nprobs, 'NPROBS', 'top center')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Nprmas</label>
                                <Input
                                    type={'number'}
                                    name={'nprmas'}
                                    value={mtPackage.nprmas}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseInt)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.nprmas, 'NPRMAS', 'top right')}
                                />
                            </Form.Field>
                        </Form.Group>
                    </Accordion.Content>
                    <Accordion.Title active={activeIndex === 3} index={3} onClick={this.handleClickAccordion}>
                        <Icon name='dropdown'/>
                        Transport steps
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 3}>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Transport stepsize (Dt0)</label>
                                <Input
                                    type={'number'}
                                    name={'dt0'}
                                    value={mtPackage.dt0}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseFloat)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.dt0, 'DT0', 'bottom center')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Maximum transport steps (Mxstrn)</label>
                                <Input
                                    type={'number'}
                                    name={'mxstrn'}
                                    value={mtPackage.mxstrn}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseInt)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.mxstrn, 'MXSTRN', 'top right')}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Transport step multiplier (Ttsmult)</label>
                                <Input
                                    type={'number'}
                                    name={'ttsmult'}
                                    value={mtPackage.ttsmult}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseFloat)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.ttsmult, 'TTSMULT')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Maximum transport stepsize (Ttsmax)</label>
                                <Input
                                    type={'number'}
                                    name={'ttsmax'}
                                    value={mtPackage.ttsmax}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseFloat)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.ttsmax, 'TTSMAX', 'top right')}
                                />
                            </Form.Field>
                        </Form.Group>
                    </Accordion.Content>
                </Accordion>
            </Form>
        );
    }
}

BtnPackageProperties.propTypes = {
    mtPackage: PropTypes.instanceOf(FlopyMt3dMtbtn),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired,
};

export default BtnPackageProperties;
