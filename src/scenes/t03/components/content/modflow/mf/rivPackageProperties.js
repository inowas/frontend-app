import PropTypes from 'prop-types';
import React from 'react';
import {Form, Grid, Header, Input, Label} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfriv} from '../../../../../../core/model/flopy/packages/mf';
import {GridSize} from '../../../../../../core/model/modflow';
import {documentation} from '../../../../defaults/flow';
import {RasterDataImage} from '../../../../../shared/rasterData';

class RivPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackage, mfPackages, readonly} = this.props;
        const basPackage = mfPackages.getPackage('bas');
        const {ibound} = basPackage;
        const affectedCellsLayers = ibound.map(l => l.map(r => r.map(() => 0)));
        Object.values(mfPackage.stress_period_data)[0].forEach(spv => {
            const [lay, row, col] = spv;
            affectedCellsLayers[lay][row][col] = 1;
        });

        return (
            <Form>
                <Header as={'h3'} dividing={true}>RIV: River Package</Header>
                <Grid divided={'vertically'}>
                    <Grid.Row columns={2}>
                        {affectedCellsLayers.map((layer, idx) => (
                            <Grid.Column key={idx}>
                                <Label>Layer {idx + 1}</Label>
                                <RasterDataImage
                                    data={layer}
                                    gridSize={GridSize.fromData(layer)}
                                    unit={''}
                                    legend={[
                                        {value: 1, color: 'blue', label: 'RIV affected cells'},
                                    ]}
                                    border={'1px dotted black'}
                                />
                            </Grid.Column>
                        ))}
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
                            value={mfPackage.ipakcb || 0}
                            disabled={readonly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Data type (dtype)</label>
                        <Input
                            readOnly
                            name='dtype'
                            value={mfPackage.dtype || ''}
                            icon={this.renderInfoPopup(documentation.dtype, 'dtype')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Package options (options)</label>
                        <Input
                            readOnly
                            name='options'
                            value={mfPackage.options || ''}
                            icon={this.renderInfoPopup(documentation.options, 'options')}
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

RivPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfriv),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default RivPackageProperties;