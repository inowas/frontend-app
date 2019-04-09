import PropTypes from 'prop-types';
import React from 'react';
import {Accordion, Form, Grid, Header, Icon, Input} from 'semantic-ui-react';

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

                <Form.Group style={{marginTop: '20px'}}>
                    <Form.Field width={7}>
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
                    <Form.Field width={7}>
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
                    <Form.Field width={7}>
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
                        {this.renderInfoPopup(documentation.irch, 'irch', 'top right', true)}
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Filename extension</label>
                        <Input
                            readOnly
                            name='extension'
                            value={mfPackage.extension || ''}
                            icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number</label>
                        <Input
                            readOnly
                            type={'number'}
                            name='unitnumber'
                            value={mfPackage.unitnumber || ''}
                            icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames</label>
                        <Input
                            readOnly
                            name='filenames'
                            value={mfPackage.filenames || ''}
                            icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>
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
