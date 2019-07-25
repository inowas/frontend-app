import PropTypes from 'prop-types';
import React from 'react';
import {Header, Form, Grid, Input} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflow, FlopyModflowMfchd} from '../../../../../../core/model/flopy/packages/mf';
import {GridSize} from "../../../../../../core/model/modflow";
import RasterDataImage from "../../../../../shared/rasterData/rasterDataImage";
import {documentation} from "../../../../defaults/flow";

class ChdPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackage, mfPackages} = this.props;
        const basPackage = mfPackages.getPackage('bas');
        const {ibound} = basPackage;
        const affectedCellsLayers = ibound.map(l => l.map(r => r.map(() => 0)));
        Object.values(mfPackage.stress_period_data)[0].forEach(spv => {
            const [lay, row, col] = spv;
            affectedCellsLayers[lay][row][col] = 1;
        });

        return (
            <Form>
                <Grid divided={'vertically'}>
                    <Header as={'h2'}>General Head Boundaries</Header>
                    <Grid.Row columns={2}>
                        {affectedCellsLayers.map((layer, idx) => (
                            <Grid.Column key={idx}>
                                <Header as={'p'}>Layer {idx + 1}</Header>
                                <RasterDataImage
                                    data={layer}
                                    gridSize={GridSize.fromData(layer)}
                                    unit={''}
                                    legend={[
                                        {value: 1, color: 'blue', label: 'GHB affected cells'},
                                    ]}
                                    border={'1px dotted black'}
                                />
                            </Grid.Column>
                        ))}
                    </Grid.Row>
                </Grid>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Filename extension (extension)</label>
                        <Input
                            readOnly
                            name='extension'
                            value={mfPackage.extension}
                            icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input
                            readOnly
                            name='unitnumber'
                            value={mfPackage.unitnumber || ''}
                            icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
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

ChdPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfchd),
    mfPackages: PropTypes.instanceOf(FlopyModflow),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default ChdPackageProperties;
