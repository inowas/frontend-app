import PropTypes from 'prop-types';
import React from 'react';
import {Accordion, Form, Grid, Header, Icon, Input} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfbas} from 'core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {GridSize} from 'core/model/modflow';

class BasPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {readonly} = this.props;
        const {activeIndex} = this.state;
        const mfPackage = FlopyModflowMfbas.fromObject(this.state.mfPackage);
        const {ibound, strt} = mfPackage;

        return (
            <Form>
                <Accordion styled fluid>
                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClickAccordion}>
                        <Icon name='dropdown'/>
                        Boundary variable (ibound)
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <Grid>
                        <Grid.Row columns={2}>
                            {ibound.map((layer, idx) => (
                                <Grid.Column key={idx}>
                                    <Header size='small' as='label'>Layer {idx + 1}</Header>
                                    <RasterDataImage
                                        data={layer}
                                        gridSize={GridSize.fromData(layer)}
                                        unit={''}
                                        legend={[
                                            {value: -1, color: 'red', label: 'constant'},
                                            {value: 0, color: 'white', label: 'no flow'},
                                            {value: 1, color: 'blue', label: 'flow'},
                                        ]}/>
                                </Grid.Column>
                            ))}
                        </Grid.Row>
                        </Grid>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClickAccordion}>
                        <Icon name='dropdown'/>
                        Starting Head
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        <Grid>
                            <Grid.Row columns={2}>
                                {strt.map((layer, idx) => {
                                    return (
                                        <Grid.Column key={idx}>
                                            <Header size='small' as='label'>Layer {idx + 1}</Header>
                                            <RasterDataImage
                                                data={layer}
                                                gridSize={GridSize.fromData(ibound[0])}
                                                unit={'m'}
                                            />
                                        </Grid.Column>
                                    );
                                })}
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>
                </Accordion>

                <Form.Group style={{marginTop: '20px'}}>
                    <Form.Field width={5}>
                        <label>Flow between chd cells (ichflg)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: true, text: 'true'},
                                {key: 1, value: false, text: 'false'},
                            ]}
                            placeholder='Select ichflg'
                            name='ichflg'
                            selection
                            value={mfPackage.ichflg}
                            readOnly={readonly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {this.renderInfoPopup(documentation.ichflg, 'ichflg', 'top left', true)}
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>hnoflo</label>
                        <Form.Input
                            readOnly={readonly}
                            type={'number'}
                            name='hnoflo'
                            value={mfPackage.hnoflo}
                            onChange={this.handleOnChange}
                            onBlur={this.handleOnBlur}
                            icon={this.renderInfoPopup(documentation.hnoflo, 'hnoflo')}
                        />
                    </Form.Field>
                    <Form.Field width={6}>
                        <label>Budget percent discrepancy (stoper)</label>
                        <Input
                            readOnly
                            name='stoper'
                            value={mfPackage.stoper || ''}
                            icon={this.renderInfoPopup(documentation.stoper, 'stoper')}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

BasPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfbas).isRequired,
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};

export default BasPackageProperties;
