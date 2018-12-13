import PropTypes from 'prop-types';
import React from 'react';
import AbstractPackageProperties from './AbstractPackageProperties';
import {AdvPackage} from 'core/model/modflow/mt3d';
import {Accordion, Form, Icon, Input, Segment, Select} from 'semantic-ui-react';
import {documentation} from '../../../../defaults/transport';

const styles = {
    accordionFix: {
        width: 'auto'
    },
    inputFix: {
        padding: '0',
        height: 'auto'
    }
};

class AdvPackageProperties extends AbstractPackageProperties {
    render() {
        if (!this.state.mtPackage) {
            return null;
        }

        const {readonly} = this.props;
        const {activeIndex, mtPackage} = this.state;

        return (
            <Form>
                <Segment color='grey'>
                    <Form.Group>
                        <Form.Field width={15}>
                            <label>Advection solution option (Mixelm)</label>
                            <Select fluid
                                    name={'mixelm'}
                                    value={mtPackage.mixelm}
                                    disabled={readonly}
                                    onChange={this.handleOnSelect}
                                    options={[
                                        {key: 0, value: 0, text: '0: Standard finite difference method'},
                                        {key: 1, value: 1, text: '1: Forward-tracking (MOC)'},
                                        {key: 2, value: 2, text: '2: Backward-tracking (MMOC)'},
                                        {key: 3, value: 3, text: '3: Hybrid (HMOC)'},
                                        {key: 4, value: -1, text: '-1: Third-order TVD (ULTIMATE)'}
                                    ]}
                            />
                        </Form.Field>
                        <Form.Field width={1}>
                            <label>&nbsp;</label>
                            {this.renderInfoPopup(documentation.mixelm, 'MIXELM', 'bottom right', true)}
                        </Form.Field>
                    </Form.Group>
                </Segment>
                <Accordion styled style={styles.accordionFix}>
                    <Accordion.Title active={activeIndex === 5} index={5} onClick={this.handleClickAccordion}>
                        <Icon name='dropdown'/>
                        Advection Parameters and Particle Tracking
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 5}>
                        <Form.Field>
                            <label>Courant number (Percel)</label>
                            <Input
                                type={'number'}
                                name={'percel'}
                                value={mtPackage.percel}
                                disabled={readonly}
                                onBlur={this.handleOnBlur(parseFloat)}
                                onChange={this.handleOnChange}
                                style={styles.inputFix}
                                icon={this.renderInfoPopup(documentation.percel, 'PERCEL', 'top right')}
                            />
                        </Form.Field>
                        {[0].includes(mtPackage.mixelm) &&
                        <Form.Group>
                            <Form.Field width={15}>
                                <label>Weighting scheme (Nadvfd)</label>
                                <Select fluid
                                        name={'nadvfd'}
                                        value={mtPackage.nadvfd}
                                        disabled={readonly}
                                        onChange={this.handleOnSelect}
                                        options={[
                                            {key: 0, value: 1, text: '0 or 1: Upstream weighting (default)'},
                                            {key: 1, value: 2, text: '2: Central-in-space weighting'},
                                        ]}
                                />
                            </Form.Field>
                            <Form.Field width={1}>
                                <label>&nbsp;</label>
                                {this.renderInfoPopup(documentation.nadvfd, 'NADVFD', 'top right', true)}
                            </Form.Field>
                        </Form.Group>
                        }
                        {[1, 3].includes(mtPackage.mixelm) &&
                        <Form.Field>
                            <label>Maximum moving particles (Mxpart)</label>
                            <Input
                                type={'number'}
                                name={'mxpart'}
                                value={mtPackage.mxpart}
                                disabled={readonly}
                                onBlur={this.handleOnBlur(parseInt)}
                                onChange={this.handleOnChange}
                                style={styles.inputFix}
                                icon={this.renderInfoPopup(documentation.mxpart, 'MXPART', 'top right')}
                            />
                        </Form.Field>
                        }
                        {[1, 2, 3].includes(mtPackage.mixelm) &&
                        <div>
                            <Form.Group>
                                <Form.Field width={15}>
                                    <label>Particle tracking algorithm (Itrack)</label>
                                    <Select fluid
                                            name={'itrack'}
                                            value={mtPackage.itrack}
                                            disabled={readonly}
                                            onChange={this.handleOnSelect}
                                            options={[
                                                {key: 0, value: 1, text: '1: First-order Euler'},
                                                {key: 1, value: 2, text: '2: Fourth-order Runge-Kutta'},
                                                {key: 2, value: 3, text: '3: Hybrid'},
                                            ]}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    <label>&nbsp;</label>
                                    {this.renderInfoPopup(documentation.itrack, 'ITRACK', 'top right', true)}
                                </Form.Field>
                            </Form.Group>
                            <Form.Field>
                                <label>Concentration weighting factor (Wd)</label>
                                <Input
                                    type={'number'}
                                    name={'wd'}
                                    value={mtPackage.wd}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseFloat)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.wd, 'WD', 'top right')}
                                />
                            </Form.Field>
                        </div>
                        }
                    </Accordion.Content>
                    {[1, 3].includes(mtPackage.mixelm) &&
                    <div>
                        <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClickAccordion}>
                            <Icon name='dropdown'/>
                            Particle Distribution
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === 1}>
                            <Form.Field>
                                <label>Dceps</label>
                                <Input
                                    type={'number'}
                                    name={'dceps'}
                                    value={mtPackage.dceps}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseFloat)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.dceps, 'DCEPS', 'top right')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Nplane</label>
                                <Input
                                    type={'number'}
                                    name={'nplane'}
                                    value={mtPackage.nplane}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseInt)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.nplane, 'NPLANE', 'top right')}
                                />
                            </Form.Field>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <label>Npl</label>
                                    <Input
                                        type={'number'}
                                        name={'npl'}
                                        value={mtPackage.npl}
                                        disabled={readonly}
                                        onBlur={this.handleOnBlur(parseInt)}
                                        onChange={this.handleOnChange}
                                        style={styles.inputFix}
                                        icon={this.renderInfoPopup(documentation.npl, 'NPL')}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Nph</label>
                                    <Input
                                        type={'number'}
                                        name={'nph'}
                                        value={mtPackage.nph}
                                        disabled={readonly}
                                        onBlur={this.handleOnBlur(parseInt)}
                                        onChange={this.handleOnChange}
                                        style={styles.inputFix}
                                        icon={this.renderInfoPopup(documentation.nph, 'NPH', 'top right')}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <label>Npmin</label>
                                    <Input
                                        type={'number'}
                                        name={'npmin'}
                                        value={mtPackage.npmin}
                                        disabled={readonly}
                                        onBlur={this.handleOnBlur(parseInt)}
                                        onChange={this.handleOnChange}
                                        style={styles.inputFix}
                                        icon={this.renderInfoPopup(documentation.npmin, 'NPMIN')}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Npmax</label>
                                    <Input
                                        type={'number'}
                                        name={'npmax'}
                                        value={mtPackage.npmax}
                                        disabled={readonly}
                                        onBlur={this.handleOnBlur(parseInt)}
                                        onChange={this.handleOnChange}
                                        style={styles.inputFix}
                                        icon={this.renderInfoPopup(documentation.npmax, 'NPMAX', 'top right')}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Accordion.Content>
                    </div>
                    }
                    {[2, 3].includes(mtPackage.mixelm) &&
                    <div>
                        <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClickAccordion}>
                            <Icon name='dropdown'/>
                            Solution Flags and Critical Concentration
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === 2}>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <label>Nlsink</label>
                                    <Input
                                        type={'number'}
                                        name={'nlsink'}
                                        value={mtPackage.nlsink}
                                        disabled={readonly}
                                        onBlur={this.handleOnBlur(parseInt)}
                                        onChange={this.handleOnChange}
                                        style={styles.inputFix}
                                        icon={this.renderInfoPopup(documentation.nlsink, 'NLSINK')}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Npsink</label>
                                    <Input
                                        type={'number'}
                                        name={'npsink'}
                                        value={mtPackage.npsink}
                                        disabled={readonly}
                                        onBlur={this.handleOnBlur(parseInt)}
                                        onChange={this.handleOnChange}
                                        style={styles.inputFix}
                                        icon={this.renderInfoPopup(documentation.npsink, 'NPSINK', 'top right')}
                                    />
                                </Form.Field>
                            </Form.Group>
                            {mtPackage.mixelm === 3 &&
                            <Form.Field>
                                <label>Dchmoc</label>
                                <Input
                                    type={'number'}
                                    name={'dchmoc'}
                                    value={mtPackage.dchmoc}
                                    disabled={readonly}
                                    onBlur={this.handleOnBlur(parseFloat)}
                                    onChange={this.handleOnChange}
                                    style={styles.inputFix}
                                    icon={this.renderInfoPopup(documentation.dchmoc, 'DCHMOC', 'top right')}
                                />
                            </Form.Field>
                            }
                        </Accordion.Content>
                    </div>
                    }
                </Accordion>
            </Form>
        );
    }
}

AdvPackageProperties.propTypes = {
    mtPackage: PropTypes.instanceOf(AdvPackage),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired,
};


export default AdvPackageProperties;
