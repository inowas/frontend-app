import React from 'react';
import {Accordion, Checkbox, Form, Grid, Header, Icon, Input, Segment, Select} from 'semantic-ui-react';
import InfoPopup from '../../../../../shared/InfoPopup';
import {documentation} from '../../../../defaults/transport';
import AbstractPackageProperties from './AbstractPackageProperties';

class AdvPackageProperties extends AbstractPackageProperties {
    public render() {
        if (!this.state.mtPackage) {
            return null;
        }

        const {readOnly} = this.props;
        const {activeIndex, mtPackage} = this.state;

        return (
            <Form>
                <Header as={'h3'}>ADV: Advection Package</Header>
                <Segment>
                    <Form.Group>
                        <Form.Field width={15}>
                            <label className={'headerLabel'}>Advection solution option (MIXELM)</label>
                            <Select
                                fluid={true}
                                name={'mixelm'}
                                value={mtPackage.mixelm}
                                disabled={readOnly}
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
                            <InfoPopup
                                description={documentation.mixelm}
                                title={'MIXELM'}
                                position={'bottom right'}
                                iconOutside={true}
                            />
                        </Form.Field>
                    </Form.Group>
                </Segment>

                <Accordion styled={true} fluid={true}>
                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClickAccordion}>
                        <Icon name="dropdown"/>
                        Advection Parameters and Particle Tracking
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Form.Field>
                                        <label>Courant number (PERCEL)</label>
                                        <Input
                                            type={'number'}
                                            name={'percel'}
                                            value={mtPackage.percel}
                                            disabled={readOnly}
                                            onBlur={this.handleOnBlur(parseFloat)}
                                            onChange={this.handleOnChange}
                                            icon={<InfoPopup
                                                description={documentation.percel}
                                                title="PERCEL"
                                                position="top right"
                                            />}
                                        />
                                    </Form.Field>
                                    {[1, 3].includes(mtPackage.mixelm) &&
                                    <Form.Field>
                                        <label>Maximum moving particles (MXPART)</label>
                                        <Input
                                            type={'number'}
                                            name={'mxpart'}
                                            value={mtPackage.mxpart}
                                            disabled={readOnly}
                                            onBlur={this.handleOnBlur(parseInt)}
                                            onChange={this.handleOnChange}
                                            icon={<InfoPopup
                                                description={documentation.mxpart}
                                                title="MXPART"
                                                position="top right"
                                            />}
                                        />
                                    </Form.Field>
                                    }
                                </Grid.Column>
                                <Grid.Column>
                                    {[0].includes(mtPackage.mixelm) &&
                                    <Form.Group>
                                        <Form.Field width={14}>
                                            <label>Weighting scheme (NADVFD)</label>
                                            <Select
                                                fluid={true}
                                                name={'nadvfd'}
                                                value={mtPackage.nadvfd}
                                                disabled={readOnly}
                                                onChange={this.handleOnSelect}
                                                options={[
                                                    {key: 0, value: 1, text: '0 or 1: Upstream weighting (default)'},
                                                    {key: 1, value: 2, text: '2: Central-in-space weighting'},
                                                ]}
                                            />
                                        </Form.Field>
                                        <Form.Field width={1}>
                                            <label>&nbsp;</label>
                                            <InfoPopup
                                                description={documentation.nadvfd}
                                                title={'NADVFD'}
                                                position={'top right'}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    }
                                    {[1, 2, 3].includes(mtPackage.mixelm) &&
                                    <div>
                                        <Form.Group>
                                            <Form.Field width={14}>
                                                <label>Particle tracking algorithm (ITRACK)</label>
                                                <Select
                                                    fluid={true}
                                                    name={'itrack'}
                                                    value={mtPackage.itrack}
                                                    disabled={readOnly}
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
                                                <InfoPopup
                                                    description={documentation.itrack}
                                                    title={'ITRACK'}
                                                    position={'top right'}
                                                />
                                            </Form.Field>
                                        </Form.Group>
                                        <Form.Field>
                                            <label>Concentration weighting factor (WD)</label>
                                            <Input
                                                type={'number'}
                                                name={'wd'}
                                                value={mtPackage.wd}
                                                disabled={readOnly}
                                                onBlur={this.handleOnBlur(parseFloat)}
                                                onChange={this.handleOnChange}
                                                icon={<InfoPopup
                                                    description={documentation.wd}
                                                    title="WD"
                                                    position="top right"
                                                />}
                                            />
                                        </Form.Field>
                                    </div>
                                    }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>

                    {[1, 3].includes(mtPackage.mixelm) &&
                    <div>
                        <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClickAccordion}>
                            <Icon name={'dropdown'}/>
                            Particle Distribution
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === 1}>
                            <Form.Group widths={'equal'}>
                                <Form.Field>
                                    <label>Small Relative Cell Concentration Gradient (DCEPS)</label>
                                    <Input
                                        type={'number'}
                                        name={'dceps'}
                                        value={mtPackage.dceps}
                                        disabled={readOnly}
                                        onBlur={this.handleOnBlur(parseFloat)}
                                        onChange={this.handleOnChange}
                                        icon={<InfoPopup
                                            description={documentation.dceps}
                                            title="DCEPS"
                                            position="top right"
                                        />}
                                    />
                                </Form.Field>
                                <Form.Field width={14}>
                                    <label>Particle placement pattern (NPLANE)</label>
                                    <Checkbox
                                        toggle={true}
                                        name={'nplane'}
                                        value={mtPackage.nplane || 0}
                                        disabled={readOnly}
                                        icon={<InfoPopup
                                            description={documentation.nplane}
                                            title="NPLANE"
                                            position="top right"
                                        />}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    <label>&nbsp;</label>
                                    <InfoPopup
                                        description={documentation.nplane}
                                        title={'NPLANE'}
                                        position={'top right'}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths={'equal'}>
                                <Form.Field>
                                    <label>Initial particles at cells ≤ DCEPS (NPL)</label>
                                    <Input
                                        type={'number'}
                                        name={'npl'}
                                        value={mtPackage.npl}
                                        disabled={readOnly}
                                        onBlur={this.handleOnBlur(parseInt)}
                                        onChange={this.handleOnChange}
                                        icon={<InfoPopup description={documentation.npl} title="NPL"/>}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Initial particles at cells > DCEPS (NPH)</label>
                                    <Input
                                        type={'number'}
                                        name={'nph'}
                                        value={mtPackage.nph}
                                        disabled={readOnly}
                                        onBlur={this.handleOnBlur(parseInt)}
                                        onChange={this.handleOnChange}
                                        icon={<InfoPopup
                                            description={documentation.nph}
                                            title={'NPH'}
                                            position={'top right'}
                                        />}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths={'equal'}>
                                <Form.Field>
                                    <label>Min. no. of particles per cell (NPMIN)</label>
                                    <Input
                                        type={'number'}
                                        name={'npmin'}
                                        value={mtPackage.npmin}
                                        disabled={readOnly}
                                        onBlur={this.handleOnBlur(parseInt)}
                                        onChange={this.handleOnChange}
                                        icon={<InfoPopup
                                            description={documentation.npmin}
                                            title={'NPMIN'}
                                        />}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Max. no. of particles per cell (NPMAX)</label>
                                    <Input
                                        type={'number'}
                                        name={'npmax'}
                                        value={mtPackage.npmax}
                                        disabled={readOnly}
                                        onBlur={this.handleOnBlur(parseInt)}
                                        onChange={this.handleOnChange}
                                        icon={<InfoPopup
                                            description={documentation.npmax}
                                            title="NPMAX"
                                            position="top right"
                                        />}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Accordion.Content>
                    </div>
                    }

                    {[2, 3].includes(mtPackage.mixelm) &&
                    <div>
                        <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClickAccordion}>
                            <Icon name={'dropdown'}/>
                            Solution Flags and Critical Concentration
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === 2}>
                            <Form.Group widths={'equal'}>
                                <Form.Field>
                                    <label>Particle pattern to approximate sink cells (NLSINK)</label>
                                    <Checkbox
                                        toggle={true}
                                        name={'nlsink'}
                                        value={mtPackage.nlsink || 0}
                                        disabled={readOnly}
                                        // label={mtPackage.nlsink === 0 ? 'fixed' : 'random'} TODO!!
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    <label>&nbsp;</label>
                                    <InfoPopup
                                        description={documentation.nlsink}
                                        title={'NLSINK'}
                                        position={'top right'}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>No. of particles used to approximate sink cells (NPSINK)</label>
                                    <Input
                                        type={'number'}
                                        name={'npsink'}
                                        value={mtPackage.npsink}
                                        disabled={readOnly}
                                        onBlur={this.handleOnBlur(parseInt)}
                                        onChange={this.handleOnChange}
                                        icon={<InfoPopup
                                            description={documentation.npsink}
                                            title="NPSINK"
                                            position="top right"
                                        />}
                                    />
                                </Form.Field>
                            </Form.Group>
                            {mtPackage.mixelm === 3 &&
                            <Form.Field>
                                <label>Critical Relative Concentration Gradient (DCHMOC)</label>
                                <Input
                                    type={'number'}
                                    name={'dchmoc'}
                                    value={mtPackage.dchmoc}
                                    disabled={readOnly}
                                    onBlur={this.handleOnBlur(parseFloat)}
                                    onChange={this.handleOnChange}
                                    icon={<InfoPopup
                                        description={documentation.dchmoc}
                                        title="DCHMOC"
                                        position="top right"
                                    />}
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

export default AdvPackageProperties;
