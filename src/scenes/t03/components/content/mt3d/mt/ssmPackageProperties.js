import PropTypes from 'prop-types';
import React from 'react';
import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyMt3dMtssm} from '../../../../../../core/model/flopy/packages/mt';
import {Form, Grid, Header, Input, Label} from 'semantic-ui-react';
import InfoPopup from '../../../../../shared/InfoPopup';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {GridSize} from '../../../../../../core/model/modflow';
import {documentation} from '../../../../defaults/transport';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';

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
                <Header as={'h3'} dividing={true}>SSM: Source and Sink Mixing Package</Header>
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
                        <label>Filename extension (EXTENSION)</label>
                        <Input
                            readOnly
                            name='extension'
                            value={mtPackage.extension}
                            icon={<InfoPopup
                                description={documentation.ssm.extension}
                                title={'EXTENSION'}
                            />}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (UNITNUMBER)</label>
                        <Input
                            readOnly
                            name='unitnumber'
                            value={mtPackage.unitnumber || ''}
                            icon={this.renderInfoPopup(documentation.ssm.unitnumber, 'UNITNUMBER')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (FILENAMES)</label>
                        <Input
                            readOnly
                            name='filenames'
                            value={mtPackage.filenames || ''}
                            icon={this.renderInfoPopup(documentation.ssm.filenames, 'FILENAMES')}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

SsmPackageProperties.propTypes = {
    mtPackage: PropTypes.instanceOf(FlopyMt3dMtssm),
    mfPackages: PropTypes.instanceOf(FlopyModflow),
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
};


export default SsmPackageProperties;
