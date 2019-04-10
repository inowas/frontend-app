import PropTypes from 'prop-types';
import React from 'react';
import {Accordion, Form, Grid, Header, Icon, Segment, Table} from 'semantic-ui-react';

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
                        Starting Heads (strt)
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

                <Segment basic>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={7}>
                                <Form.Group>
                                    <Form.Field >
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
                                    <Form.Field>
                                        <label>&nbsp;</label>
                                        {this.renderInfoPopup(documentation.ichflg, 'ichflg', 'top left', true)}
                                    </Form.Field>
                                </Form.Group>
                            </Grid.Column>

                            <Grid.Column width={9}>
                                <Table basic='very'>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell collapsing>Head values for no-flow cells (hnoflo)</Table.Cell>
                                            <Table.Cell>{this.renderInfoPopup(documentation.hnoflo, 'hnoflo', 'center left')}</Table.Cell>
                                            <Table.Cell textAlign='right'>{mfPackage.hnoflo}</Table.Cell>
                                        </Table.Row>

                                        <Table.Row>
                                            <Table.Cell collapsing>Percent discrepancy (stoper)</Table.Cell>
                                            <Table.Cell>{this.renderInfoPopup(documentation.stoper, 'stoper', 'center left')}</Table.Cell>
                                            <Table.Cell textAlign='right'>{mfPackage.stoper || ''}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

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
