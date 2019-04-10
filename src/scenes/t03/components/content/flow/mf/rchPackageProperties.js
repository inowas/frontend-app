import PropTypes from 'prop-types';
import React from 'react';
import {Accordion, Form, Grid, Header, Icon, Segment, Table} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflow, FlopyModflowMfrch} from 'core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {GridSize} from 'core/model/modflow';

class RchPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackage, mfPackages, readonly} = this.props;
        const {activeIndex} = this.state;
        const spData2D = Object.values(mfPackage.stress_period_data)[0];

        const basPackage = mfPackages.getPackage('bas');
        const {ibound} = basPackage;

        const disPackage = mfPackages.getPackage('dis');
        const {nlay} = disPackage;

        return (
            <Form>
                <Accordion styled fluid>
                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClickAccordion}>
                        <Icon name='dropdown'/>
                        Recharge Boundaries (RCH)
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Header size='small' as='label'>Stress period data (SP1)</Header>
                                    <RasterDataImage
                                        data={spData2D}
                                        gridSize={GridSize.fromData(ibound[0])}
                                        unit={''}
                                        border={'1px dotted black'}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>
                </Accordion>

                <Segment basic>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>

                                <Form.Group>
                                    <Form.Field width={15}>
                                        <label>Cell-by-cell budget data (ipakcb)</label>
                                        <Form.Dropdown
                                            options={[
                                                {key: 0, value: 0, text: 'false'},
                                                {key: 1, value: 1, text: 'true'},
                                            ]}
                                            placeholder='Select ipakcb'
                                            name='ipakcb'
                                            selection
                                            value={mfPackage.ipakcb}
                                            readOnly={readonly}
                                            onChange={this.handleOnSelect}
                                        />
                                    </Form.Field>
                                    <Form.Field width={1}>
                                        <label>&nbsp;</label>
                                        {this.renderInfoPopup(documentation.ipakcb, 'ipakcb', 'top left', true)}
                                    </Form.Field>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Field width={15}>
                                        <label>Recharge option (nrchop)</label>
                                        <Form.Dropdown
                                            options={[
                                                {key: 0, value: 1, text: '1: Top grid layer only'},
                                                {key: 1, value: 2, text: '2: Layer defined in irch'},
                                                {key: 2, value: 3, text: '3: Highest active cell (default)'},
                                            ]}
                                            placeholder='Select nrchop'
                                            name='nrchop'
                                            selection
                                            value={mfPackage.nrchop}
                                            readOnly={readonly}
                                            onChange={this.handleOnSelect}
                                        />
                                    </Form.Field>
                                    <Form.Field width={1}>
                                        <label>&nbsp;</label>
                                        {this.renderInfoPopup(documentation.nrchop, 'nrchop', 'top left', true)}
                                    </Form.Field>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Field width={15}>
                                        <label>Recharge layer (irch)</label>
                                        <Form.Dropdown
                                            options={new Array(nlay).fill(0).map((l, idx) => ({key: idx, value: idx, text: idx}))}
                                            placeholder='Select irch'
                                            name='irch'
                                            selection
                                            value={mfPackage.irch}
                                            readOnly={readonly}
                                            onChange={this.handleOnSelect}
                                            disabled={mfPackage.nrchop !== 2}
                                        />
                                    </Form.Field>
                                    <Form.Field width={1}>
                                        <label>&nbsp;</label>
                                        {this.renderInfoPopup(documentation.irch, 'irch', 'top left', true)}
                                    </Form.Field>
                                </Form.Group>

                            </Grid.Column>
                            <Grid.Column>
                                <Table basic='very'>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell collapsing>Filename extension (extension)</Table.Cell>
                                            <Table.Cell>{this.renderInfoPopup(documentation.extension, 'extension', 'left center')}</Table.Cell>
                                            <Table.Cell textAlign='right'>{mfPackage.extension}</Table.Cell>
                                        </Table.Row>

                                        <Table.Row>
                                            <Table.Cell collapsing>File unit number (unitnumber)</Table.Cell>
                                            <Table.Cell>{this.renderInfoPopup(documentation.unitnumber, 'unitnumber', 'left center')}</Table.Cell>
                                            <Table.Cell textAlign='right'>{mfPackage.unitnumber || ''}</Table.Cell>
                                        </Table.Row>

                                        <Table.Row>
                                            <Table.Cell collapsing>Filenames (filenames)</Table.Cell>
                                            <Table.Cell>{this.renderInfoPopup(documentation.filenames, 'filenames', 'left center')}</Table.Cell>
                                            <Table.Cell textAlign='right'>{mfPackage.filenames || ''}</Table.Cell>
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

RchPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfrch),
    mfPackages: PropTypes.instanceOf(FlopyModflow),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default RchPackageProperties;
