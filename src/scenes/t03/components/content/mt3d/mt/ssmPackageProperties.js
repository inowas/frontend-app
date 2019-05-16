import PropTypes from 'prop-types';
import React from 'react';
import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyMt3dMtssm} from '../../../../../../core/model/flopy/packages/mt';
import {FlopyModflow} from '../../../../../../core/model/flopy/packages/mf';
import {Form, Grid, Header, Input} from 'semantic-ui-react';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {GridSize} from '../../../../../../core/model/modflow';
import {documentation} from '../../../../defaults/flow';

class SsmPackageProperties extends AbstractPackageProperties {

    constructor(props) {
        super(props);
        this.state.selectedBoundary = null;
        this.state.selectedSubstanceId = null;
    }

    render() {
        if (!this.state.mtPackage) {
            return null;
        }

        const {mtPackage, mfPackages} = this.props;
        const basPackage = mfPackages.getPackage('bas');
        const {ibound} = basPackage;
        const affectedCellsLayers = ibound.map(l => l.map(r => r.map(() => 0)));

        if (mtPackage.stress_period_data) {
            Object.values(mtPackage.stress_period_data)[0].forEach(spv => {
                const [lay, row, col] = spv;
                affectedCellsLayers[lay][row][col] = 1;
            });
        }

        return (
            <Form>
                <Grid divided={'vertically'}>
                    <Header as={'h2'}>Source/Sink Package</Header>
                    <Grid.Row columns={2}>
                        {affectedCellsLayers.map((layer, idx) => (
                            <Grid.Column key={idx}>
                                <Header as={'p'}>Layer {idx + 1}</Header>
                                <RasterDataImage
                                    data={layer}
                                    gridSize={GridSize.fromData(layer)}
                                    unit={''}
                                    legend={[
                                        {value: 1, color: 'blue', label: 'SSM affected cells'},
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
                            value={mtPackage.extension}
                            icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input
                            readOnly
                            name='unitnumber'
                            value={mtPackage.unitnumber || ''}
                            icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
                        <Input
                            readOnly
                            name='filenames'
                            value={mtPackage.filenames || ''}
                            icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

SsmPackageProperties.propTypes = {
    mtPackage: PropTypes.instanceOf(FlopyMt3dMtssm),
    mtPackages: PropTypes.instanceOf(FlopyModflow),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired,
};


export default SsmPackageProperties;
