import PropTypes from 'prop-types';
import React from 'react';
import {Checkbox, Form, Grid, Header, Input, Segment} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMffhb} from '../../../../../../core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {GridSize} from '../../../../../../core/model/modflow';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';

class FhbPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackage, mfPackages} = this.props;
        const basPackage = mfPackages.getPackage('bas');
        const {ibound} = basPackage;
        const affectedCellsLayers = ibound.map(l => l.map(r => r.map(() => 0)));

        return (
            <Form>
                <Grid divided={'vertically'}>
                    <Header as={'h3'}>FHB: Flow and Head Boundary Package</Header>
                    <Grid.Row columns={2}>
                        {affectedCellsLayers.map((layer, idx) => (
                            <Grid.Column key={idx}>
                                <Header as={'p'}>Layer {idx + 1}</Header>
                                <RasterDataImage
                                    data={layer}
                                    gridSize={GridSize.fromData(layer)}
                                    unit={''}
                                    border={'1px dotted black'}
                                />
                            </Grid.Column>
                        ))}
                    </Grid.Row>
                </Grid>

            <Segment>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Form.Field>
                                <label>No. of times flow and head are specified (NBDTIM)</label>
                                <Input
                                    readOnly
                                    name='nbdtim'
                                    value={mfPackage.nbdtim}
                                    icon={this.renderInfoPopup(documentation.nbdtim, 'NBDTIM')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Cells with specified flow (NFLW)</label>
                                <Input
                                    readOnly
                                    name='nflw'
                                    value={mfPackage.nflw}
                                    icon={this.renderInfoPopup(documentation.nflw, 'NFLW')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Cells with specified head (NHED)</label>
                                <Input
                                    readOnly
                                    name='nhed'
                                    value={mfPackage.nhed}
                                    icon={this.renderInfoPopup(documentation.nhed, 'NHED')}
                                />
                            </Form.Field>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <label>Auxiliary variables for each flow cell (NFHBX1)</label>
                                    <Input
                                        readOnly
                                        name='nfhbx1'
                                        value={mfPackage.nfhbx1}
                                        icon={this.renderInfoPopup(documentation.nfhbx1, 'NFHBX1')}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Auxiliary variables for each head cell (NFHBX2)</label>
                                    <Input
                                        readOnly
                                        name='nfhbx2'
                                        value={mfPackage.nfhbx2}
                                        icon={this.renderInfoPopup(documentation.nfhbx1, 'NFHBX2')}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Field>
                                <label>Steady-state option (IFHBSS)</label>
                                <Checkbox
                                    toggle
                                    name='ifhbss'
                                    value={mfPackage.ifhbss}
                                    icon={this.renderInfoPopup(documentation.ifhbss, 'IFHBSS')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Save cell-by-cell data (IPAKCB)</label>
                                <Checkbox
                                    toggle
                                    name='ipakcb'
                                    value={mfPackage.ipakcb}
                                    icon={this.renderInfoPopup(documentation.ipakcb, 'IPAKCB')}
                                />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>

            <Segment>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Form.Field>
                                <label>Constant multiplier for bdtime (BDTIMECNSTM)</label>
                                <Input
                                    readOnly
                                    name='bdtimecnstm'
                                    value={mfPackage.bdtimecnstm}
                                    icon={this.renderInfoPopup(documentation.bdtimecnstm, 'BDTIMECNSTM')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Simulation time (BDTIME)</label>
                                <Input
                                    readOnly
                                    name='bdtime'
                                    value={mfPackage.bdtime}
                                    icon={this.renderInfoPopup(documentation.bdtime, 'BDTIME')}
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Field>
                                <label>Print data list (IFHBUN)</label>
                                <Checkbox
                                    toggle={true}
                                    name='ifhbpt'
                                    value={mfPackage.ifhbpt}
                                    icon={this.renderInfoPopup(documentation.ifhbpt, 'IFHBUN')}
                                />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Constant multiplier for flwrat (CNSTM5)</label>
                        <Input
                            readOnly
                            name='cnstm5'
                            value={mfPackage.cnstm5}
                            icon={this.renderInfoPopup(documentation.cnstm5, 'CNSTM5')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Dataset 5 (DS5)</label>
                        <Input
                            readOnly
                            name='ds5'
                            value={mfPackage.ds5}
                            icon={this.renderInfoPopup(documentation.ds5, 'DS5')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Constant multiplier for sbhedt (CNSTM7)</label>
                        <Input
                            readOnly
                            name='cnstm7'
                            value={mfPackage.cnstm7}
                            icon={this.renderInfoPopup(documentation.cnstm7, 'CNSTM7')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Dataset 7 (DS7)</label>
                        <Input
                            readOnly
                            name='ds7'
                            value={mfPackage.ds7}
                            icon={this.renderInfoPopup(documentation.ds7, 'DS7')}
                        />
                    </Form.Field>
                </Form.Group>

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

FhbPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMffhb),
    mfPackages: PropTypes.instanceOf(FlopyModflow),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default FhbPackageProperties;
