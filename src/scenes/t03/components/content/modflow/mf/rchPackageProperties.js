import PropTypes from 'prop-types';
import React from 'react';
import {Form, Grid, Header, Input} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfrch} from '../../../../../../core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {GridSize} from '../../../../../../core/model/modflow';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';

class RchPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackage, mfPackages, readonly} = this.props;
        const spData2D = Object.values(mfPackage.stress_period_data)[0];

        const basPackage = mfPackages.getPackage('bas');
        const {ibound} = basPackage;

        return (
            <Form>
                <Grid divided={'vertically'}>
                    <Header as={'h3'}>RCH: Recharge Package</Header>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Header as={'p'}>Stress period data (SP1)</Header>
                            <RasterDataImage
                                data={spData2D}
                                gridSize={GridSize.fromData(ibound[0])}
                                unit={''}
                                border={'1px dotted black'}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Form.Group widths='equal'>
                    <Form.Field>
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
                            disabled={readonly}
                            onChange={this.handleOnSelect}
                        />
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
