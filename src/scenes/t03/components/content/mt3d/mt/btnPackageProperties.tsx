import React from 'react';
import {Accordion, Checkbox, Form, Grid, Header, Icon, Input} from 'semantic-ui-react';
import InfoPopup from '../../../../../shared/InfoPopup';
import {documentation} from '../../../../defaults/transport';
import AbstractPackageProperties from './AbstractPackageProperties';

class BtnPackageProperties extends AbstractPackageProperties {
    public render() {
        if (!this.state.mtPackage) {
            return null;
        }

        const {readOnly} = this.props;
        const {activeIndex, mtPackage} = this.state;

        return (
            <Form>
                <Header as={'h3'} dividing={true}>BTN: Basic Transport Package</Header>
                <Accordion styled={true} fluid={true}>
                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClickAccordion}>
                        <Icon name="dropdown"/>
                        Basic Transport Parameters
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                <Form.Field>
                                    <label>Total species (NCOMP)</label>
                                    <Input
                                        type={'number'}
                                        name={'ncomp'}
                                        value={mtPackage.ncomp}
                                        disabled={readOnly}
                                        onBlur={this.handleOnBlur(parseInt)}
                                        onChange={this.handleOnChange}
                                        icon={<InfoPopup
                                            description={documentation.btn.ncomp}
                                            title={'NCOMP'}
                                            position={'top right'}
                                        />}
                                    />
                                </Form.Field>
                                    <Form.Field>
                                        <label>Mobile species (MCOMP)</label>
                                        <Input
                                            type={'number'}
                                            name={'mcomp'}
                                            value={mtPackage.mcomp}
                                            disabled={readOnly}
                                            onBlur={this.handleOnBlur(parseInt)}
                                            onChange={this.handleOnChange}
                                            icon={<InfoPopup
                                                description={documentation.btn.mcomp}
                                                title={'MCOMP'}
                                                position={'top right'}
                                            />}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Starting concentration (SCONC)</label>
                                        <Input
                                            type={'number'}
                                            name={'sconc'}
                                            value={mtPackage.sconc}
                                            disabled={readOnly}
                                            onBlur={this.handleOnBlur(parseFloat)}
                                            onChange={this.handleOnChange}
                                            icon={<InfoPopup
                                                description={documentation.btn.sconc}
                                                title={'SCONC'}
                                                position={'top right'}
                                            />}
                                        />
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field>
                                        <label>Porosity (PRSITY)</label>
                                        <Input
                                            type={'number'}
                                            name={'prsity'}
                                            value={mtPackage.prsity}
                                            disabled={readOnly}
                                            onBlur={this.handleOnBlur(parseFloat)}
                                            onChange={this.handleOnChange}
                                            icon={<InfoPopup
                                                description={documentation.btn.prsity}
                                                title={'PRSITY'}
                                            />}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Concentration boundary indicator (ICBUND)</label>
                                        <Input
                                            type={'number'}
                                            name={'icbund'}
                                            value={mtPackage.icbund}
                                            disabled={readOnly}
                                            onBlur={this.handleOnBlur(parseFloat)}
                                            onChange={this.handleOnChange}
                                            icon={<InfoPopup
                                                description={documentation.btn.icbund}
                                                title={'ICBUND'}
                                                position={'top right'}
                                            />}
                                        />
                                    </Form.Field>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>
                    <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClickAccordion}>
                        <Icon name={'dropdown'}/>
                        Inactive Cells
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        <Form.Group widths={'equal'}>
                            <Form.Field>
                                <label>Inactive concentration cells (CINACT)</label>
                                <Input
                                    type={'number'}
                                    name={'cinact'}
                                    value={mtPackage.cinact}
                                    readOnly={readOnly}
                                    onBlur={this.handleOnBlur((value) => parseFloat(value).toExponential())}
                                    onChange={this.handleOnChange}
                                    icon={<InfoPopup
                                        description={documentation.btn.cinact}
                                        title={'CINACT'}
                                    />}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Minimum saturated thickness (THKMIN)</label>
                                <Input
                                    type={'number'}
                                    name={'thkmin'}
                                    value={mtPackage.thkmin}
                                    disabled={readOnly}
                                    onBlur={this.handleOnBlur(parseFloat)}
                                    onChange={this.handleOnChange}
                                    icon={<InfoPopup
                                        description={documentation.btn.thkmin}
                                        title={'THKMIN'}
                                        position={'top right'}
                                    />}
                                />
                            </Form.Field>
                        </Form.Group>
                    </Accordion.Content>
                    <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClickAccordion}>
                        <Icon name={'dropdown'}/>
                        Output Control Options
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Form.Field>
                                        <label>Print concentration (IFMTCN)</label>
                                        <Input
                                            type={'number'}
                                            name={'ifmtcn'}
                                            value={mtPackage.ifmtcn}
                                            disabled={readOnly}
                                            onBlur={this.handleOnBlur(parseInt)}
                                            onChange={this.handleOnChange}
                                            icon={<InfoPopup
                                                description={documentation.btn.ifmtcn}
                                                title={'IFMTCN'}
                                            />}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Print no. of particles (IFMTNP)</label>
                                        <Input
                                            type={'number'}
                                            name={'ifmtnp'}
                                            value={mtPackage.ifmtnp}
                                            disabled={readOnly}
                                            onBlur={this.handleOnBlur(parseInt)}
                                            onChange={this.handleOnChange}
                                            icon={<InfoPopup
                                                description={documentation.btn.ifmtnp}
                                                title={'IFMTNP'}
                                                position={'top right'}
                                            />}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Print retardation factor (IFMTRF)</label>
                                        <Input
                                            type={'number'}
                                            name={'ifmtrf'}
                                            value={mtPackage.ifmtrf}
                                            disabled={readOnly}
                                            onBlur={this.handleOnBlur(parseInt)}
                                            onChange={this.handleOnChange}
                                            icon={<InfoPopup
                                                description={documentation.btn.ifmtrf}
                                                title={'IFMTRF'}
                                            />}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Print dispersion coefficient (IFMTDP)</label>
                                        <Input
                                            type={'number'}
                                            name={'ifmtdp'}
                                            value={mtPackage.ifmtdp}
                                            disabled={readOnly}
                                            onBlur={this.handleOnBlur(parseInt)}
                                            onChange={this.handleOnChange}
                                            icon={<InfoPopup
                                                description={documentation.btn.ifmtdp}
                                                title={'IFMTDP'}
                                                position={'top right'}
                                            />}
                                        />
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Group>
                                        <Form.Field>
                                            <label>Save output (NPRS)</label>
                                            <Checkbox
                                                toggle={true}
                                                disabled={readOnly}
                                                name={'nprs'}
                                                value={mtPackage.nprs || 0}
                                            />
                                        </Form.Field>
                                        <Form.Field width={1}>
                                            <InfoPopup
                                                description={documentation.btn.nprs}
                                                title={'NPRS'}
                                                position={'top right'}
                                                iconOutside={true}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                    <Form.Field>
                                        <label>Concentration saving frequency (NPROBS)</label>
                                        <Input
                                            type={'number'}
                                            name={'nprobs'}
                                            value={mtPackage.nprobs}
                                            disabled={readOnly}
                                            onBlur={this.handleOnBlur(parseInt)}
                                            onChange={this.handleOnChange}
                                            icon={<InfoPopup
                                                description={documentation.btn.nprobs}
                                                title={'NPROBS'}
                                                position={'top center'}
                                            />}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Mass budget saving frequency (NPRMAS)</label>
                                        <Input
                                            type={'number'}
                                            name={'nprmas'}
                                            value={mtPackage.nprmas}
                                            disabled={readOnly}
                                            onBlur={this.handleOnBlur(parseInt)}
                                            onChange={this.handleOnChange}
                                            icon={<InfoPopup
                                                description={documentation.btn.nprmas}
                                                title={'NPRMAS'}
                                                position={'top right'}
                                            />}
                                        />
                                    </Form.Field>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>
                    <Accordion.Title active={activeIndex === 3} index={3} onClick={this.handleClickAccordion}>
                        <Icon name={'dropdown'}/>
                        Transport steps
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 3}>
                        <Form.Group widths={'equal'}>
                            <Form.Field>
                                <label>Transport step size (Dt0)</label>
                                <Input
                                    type={'number'}
                                    name={'dt0'}
                                    value={mtPackage.dt0}
                                    disabled={readOnly}
                                    onBlur={this.handleOnBlur(parseFloat)}
                                    onChange={this.handleOnChange}
                                    icon={<InfoPopup
                                        description={documentation.btn.dt0}
                                        title={'DT0'}
                                        position={'bottom center'}
                                    />}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Maximum transport steps (MXSTRN)</label>
                                <Input
                                    type={'number'}
                                    name={'mxstrn'}
                                    value={mtPackage.mxstrn}
                                    disabled={readOnly}
                                    onBlur={this.handleOnBlur(parseInt)}
                                    onChange={this.handleOnChange}
                                    icon={<InfoPopup
                                        description={documentation.btn.mxstrn}
                                        title={'MXSTRN'}
                                        position={'top right'}
                                    />}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <Form.Field>
                                <label>Transport step multiplier (TTSMULT)</label>
                                <Input
                                    type={'number'}
                                    name={'ttsmult'}
                                    value={mtPackage.ttsmult}
                                    disabled={readOnly}
                                    onBlur={this.handleOnBlur(parseFloat)}
                                    onChange={this.handleOnChange}
                                    icon={<InfoPopup
                                        description={documentation.btn.ttsmult}
                                        title={'TTSMULT'}
                                    />}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Maximum transport stepsize (TTSMAX)</label>
                                <Input
                                    type={'number'}
                                    name={'ttsmax'}
                                    value={mtPackage.ttsmax}
                                    disabled={readOnly}
                                    onBlur={this.handleOnBlur(parseFloat)}
                                    onChange={this.handleOnChange}
                                    icon={<InfoPopup
                                        description={documentation.btn.ttsmax}
                                        title={'TTSMAX'}
                                        position={'top right'}
                                    />}
                                />
                            </Form.Field>
                        </Form.Group>
                    </Accordion.Content>
                </Accordion>
            </Form>
        );
    }
}

export default BtnPackageProperties;
