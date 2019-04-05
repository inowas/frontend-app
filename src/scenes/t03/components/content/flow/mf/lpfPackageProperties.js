import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input, Header} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMflpf} from 'core/model/flopy/packages/mf';
import InfoPopup from '../../../../../shared/InfoPopup';
import {documentation} from '../../../../defaults/flow';

class LpfPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackage} = this.props;

        return (
            <Form>
                <Form.Group>
                    <Form.Field width={7}>
                        <label>Intercell transmissivities (intercellt)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: 'harmonic mean'},
                                {key: 1, value: 1, text: 'arithmetic mean'},
                                {key: 2, value: 2, text: 'logarithmetic mean'},
                                {key: 3, value: 3, text: 'combination'},
                            ]}
                            selection
                            name='intercellt'
                            value={mfPackage.intercellt}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup description={documentation.model} title='Model' position='top right'
                                   iconOutside={true}/>
                    </Form.Field>
                    <Form.Field width={7}>
                        <label>Layer type (laycon)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 'laycon0', text: 'confined'},
                                {key: 1, value: 'laycon1', text: 'unconfined'},
                                {key: 2, value: 'laycon2', text: 'constant T, variable S'},
                                {key: 3, value: 'laycon3', text: 'variable T, variable S'},
                            ]}
                            selection
                            name='intercellt'
                            value={JSON.stringify(mfPackage.intercellt)}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup description={documentation.model} title='Model' position='top right'
                                   iconOutside={true}/>
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Cell-by-cell budget data (ipakcb)</label>
                        <Input readOnly
                               name='ipakcb'
                               value={JSON.stringify(mfPackage.ipakcb)}
                               icon={this.renderInfoPopup(documentation.ipakcb, 'ipakcb')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Horizontal anisotropy ratio (trpy)</label>
                        <Input readOnly
                               name='trpy'
                               value={JSON.stringify(mfPackage.trpy)}
                               icon={this.renderInfoPopup(documentation.trpy, 'trpy')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Dry cell head (hdry)</label>
                        <Input readOnly
                               name='hdry'
                               value={JSON.stringify(mfPackage.hdry)}
                               icon={this.renderInfoPopup(documentation.hdry, 'hdry')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field width={4}>
                        <label>Wetting active (iwdflg)</label>
                        <Input readOnly
                               name='iwdflg'
                               value={JSON.stringify(mfPackage.iwdflg)}
                               icon={this.renderInfoPopup(documentation.iwdflg, 'iwdflg')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>Rewetting factor (wetfct)</label>
                        <Input readOnly
                               name='wetfct'
                               value={JSON.stringify(mfPackage.wetfct)}
                               icon={this.renderInfoPopup(documentation.wetfct, 'wetfct')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field width={4}>
                        <label>Iteration interval (iwetit)</label>
                        <Input readOnly
                               name='iwetit'
                               value={JSON.stringify(mfPackage.iwetit)}
                               icon={this.renderInfoPopup(documentation.iwetit, 'iwetit')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>Rewetting equation (ihdwet)</label>
                        <Input readOnly
                               name='ihdwet'
                               value={JSON.stringify(mfPackage.ihdwet)}

                               icon={this.renderInfoPopup(documentation.ihdwet, 'ihdwet')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Transmissivity (tran)</label>
                        <Input readOnly
                               name='tran'
                               value={JSON.stringify(mfPackage.tran)}
                               icon={this.renderInfoPopup(documentation.tran, 'tran')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Hydraulic conductivity (hy)</label>
                        <Input readOnly
                               name='hy'
                               value={JSON.stringify(mfPackage.hy)}
                               icon={this.renderInfoPopup(documentation.hy, 'hy')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Vertical leakance (vcont)</label>
                        <Input readOnly
                               name='vcont'
                               value={JSON.stringify(mfPackage.vcont)}
                               icon={this.renderInfoPopup(documentation.vcont, 'vcont')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Storage coefficient (sf1)</label>
                        <Input readOnly
                               name='sf1'
                               value={JSON.stringify(mfPackage.sf1)}
                               icon={this.renderInfoPopup(documentation.sf1, 'sf1')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Specific yield (sf2)</label>
                        <Input readOnly
                               name='sf2'
                               value={JSON.stringify(mfPackage.sf2)}
                               icon={this.renderInfoPopup(documentation.sf2, 'sf2')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Wetting threshold (wetdry)</label>
                        <Input readOnly
                               name='wetdry'
                               value={JSON.stringify(mfPackage.wetdry)}
                               icon={this.renderInfoPopup(documentation.wetdry, 'wetdry')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Filename extension (extension)</label>
                        <Input readOnly
                               name='extension'
                               value={JSON.stringify(mfPackage.extension)}
                               icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input readOnly
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                               icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
                               icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>


                <Header as={'h4'} dividing>Flow and Head Boundary Package</Header>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>(nbdtim)</label>
                        <Input readOnly
                               name='nbdtim'
                               value={JSON.stringify(mfPackage.nbdtim)}
                               icon={this.renderInfoPopup(documentation.nbdtim, 'nbdtim')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nflw)</label>
                        <Input readOnly
                               name='nflw'
                               value={JSON.stringify(mfPackage.nflw)}
                               icon={this.renderInfoPopup(documentation.nflw, 'nflw')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nhed)</label>
                        <Input readOnly
                               name='nhed'
                               value={JSON.stringify(mfPackage.nhed)}
                               icon={this.renderInfoPopup(documentation.nhed, 'nhed')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field width={4}>
                        <label>Steady (ifhbss)</label>
                        <Input readOnly
                               name='ifhbss'
                               value={JSON.stringify(mfPackage.ifhbss)}
                               icon={this.renderInfoPopup(documentation.ifhbss, 'ifhbss')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>Cell-by-cell budget data (ipakcb)</label>
                        <Input readOnly
                               name='ipakcb'
                               value={JSON.stringify(mfPackage.ipakcb)}
                               icon={this.renderInfoPopup(documentation.ipakcb, 'ipakcb')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field width={4}>
                        <label>Flow auxiliary variables (nfhbx1)</label>
                        <Input readOnly
                               name='nfhbx1'
                               value={JSON.stringify(mfPackage.nfhbx1)}
                               icon={this.renderInfoPopup(documentation.nfhbx1, 'nfhbx1')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>Head auxiliary variables (nfhbx2)</label>
                        <Input readOnly
                               name='nfhbx2'
                               value={JSON.stringify(mfPackage.nfhbx2)}
                               icon={this.renderInfoPopup(documentation.nfhbx2, 'nfhbx2')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Print item values (ifhbpt)</label>
                        <Input readOnly
                               name='ifhbpt'
                               value={JSON.stringify(mfPackage.ifhbpt)}
                               icon={this.renderInfoPopup(documentation.ifhbpt, 'ifhbpt')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Bdtime constant multiplier (bdtimecnstm)</label>
                        <Input readOnly
                               name='bdtimecnstm'
                               value={JSON.stringify(mfPackage.bdtimecnstm)}
                               icon={this.renderInfoPopup(documentation.bdtimecnstm, 'bdtimecnstm')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Simulation time (bdtime)</label>
                        <Input readOnly
                               name='bdtime'
                               value={JSON.stringify(mfPackage.bdtime)}
                               icon={this.renderInfoPopup(documentation.bdtime, 'bdtime')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Flwrat contant multiplier (cnstm5)</label>
                        <Input readOnly
                               name='cnstm5'
                               value={JSON.stringify(mfPackage.cnstm5)}
                               icon={this.renderInfoPopup(documentation.cnstm5, 'cnstm5')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Flwrat cell boundaries (ds5)</label>
                        <Input readOnly
                               name='ds5'
                               value={JSON.stringify(mfPackage.ds5)}
                               icon={this.renderInfoPopup(documentation.ds5, 'ds5')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field width={4}>
                        <label>Sbhedt constant multiplier (cnstm7)</label>
                        <Input readOnly
                               name='cnstm7'
                               value={JSON.stringify(mfPackage.cnstm7)}
                               icon={this.renderInfoPopup(documentation.cnstm7, 'cnstm7')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>Sbhead cell boundaries (ds7)</label>
                        <Input readOnly
                               name='ds7'
                               value={JSON.stringify(mfPackage.ds7)}
                               icon={this.renderInfoPopup(documentation.ds7, 'ds7')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Filename extension (extension)</label>
                        <Input readOnly
                               name='extension'
                               value={JSON.stringify(mfPackage.extension)}
                               icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input readOnly
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                               icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
                               icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>


                <Header as={'h4'} dividing>Head-dependent flow boundary Observation package</Header>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Cell groups (nqfb)</label>
                        <Input readOnly
                               name='nqfb'
                               value={JSON.stringify(mfPackage.nqfb)}
                               icon={this.renderInfoPopup(documentation.nqfb, 'nqfb')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nqcfb)</label>
                        <Input readOnly
                               name='nqcfb'
                               value={JSON.stringify(mfPackage.nqcfb)}
                               icon={this.renderInfoPopup(documentation.nqcfb, 'nqcfb')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Total no. of observations (nqtfb)</label>
                        <Input readOnly
                               name='nqtfb'
                               value={JSON.stringify(mfPackage.nqtfb)}
                               icon={this.renderInfoPopup(documentation.nqtfb, 'nqtfb')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Unit number (iufbobsv)</label>
                        <Input readOnly
                               name='iufbobsv'
                               value={JSON.stringify(mfPackage.iufbobsv)}
                               icon={this.renderInfoPopup(documentation.iufbobsv, 'iufbobsv')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Time-offset multiplier (tomultfb)</label>
                        <Input readOnly
                               name='tomultfb'
                               value={JSON.stringify(mfPackage.tomultfb)}
                               icon={this.renderInfoPopup(documentation.tomultfb, 'tomultfb')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Flows for cell group (nqobfb)</label>
                        <Input readOnly
                               name='nqobfb'
                               value={JSON.stringify(mfPackage.nqobfb)}
                               icon={this.renderInfoPopup(documentation.nqobfb, 'nqobfb')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Cell number in group (nqclfb)</label>
                        <Input readOnly
                               name='nqclfb'
                               value={JSON.stringify(mfPackage.nqclfb)}
                               icon={this.renderInfoPopup(documentation.nqclfb, 'nqclfb')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Observation name (obsnam)</label>
                        <Input readOnly
                               name='obsnam'
                               value={JSON.stringify(mfPackage.obsnam)}
                               icon={this.renderInfoPopup(documentation.obsnam, 'obsnam')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Reference stress period (irefsp)</label>
                        <Input readOnly
                               name='irefsp'
                               value={JSON.stringify(mfPackage.irefsp)}
                               icon={this.renderInfoPopup(documentation.irefsp, 'irefsp')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Time offset (toffset)</label>
                        <Input readOnly
                               name='toffset'
                               value={JSON.stringify(mfPackage.toffset)}
                               icon={this.renderInfoPopup(documentation.toffset, 'toffset')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Observed flow value (flwobs)</label>
                        <Input readOnly
                               name='flwobs'
                               value={JSON.stringify(mfPackage.flwobs)}
                               icon={this.renderInfoPopup(documentation.flwobs, 'flwobs')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Cell layer index (layer)</label>
                        <Input readOnly
                               name='layer'
                               value={JSON.stringify(mfPackage.layer)}
                               icon={this.renderInfoPopup(documentation.layer, 'layer')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Cell row index (row)</label>
                        <Input readOnly
                               name='row'
                               value={JSON.stringify(mfPackage.row)}
                               icon={this.renderInfoPopup(documentation.row, 'row')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Cell column index (column)</label>
                        <Input readOnly
                               name='column'
                               value={JSON.stringify(mfPackage.column)}
                               icon={this.renderInfoPopup(documentation.column, 'column')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>(factor)</label>
                        <Input readOnly
                               name='factor'
                               value={JSON.stringify(mfPackage.factor)}
                               icon={this.renderInfoPopup(documentation.factor, 'factor')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(flowtype)</label>
                        <Input readOnly
                               name='flowtype'
                               value={JSON.stringify(mfPackage.flowtype)}
                               icon={this.renderInfoPopup(documentation.flowtype, 'flowtype')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input readOnly
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                               icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
                               icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>

                <Header as={'h4'}>Horizontal Flow Barrier Package</Header>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>No. of parameters (nphfb)</label>
                        <Input readOnly
                               name='nphfb'
                               value={JSON.stringify(mfPackage.nphfb)}
                               icon={this.renderInfoPopup(documentation.nphfb, 'nphfb')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Max. no. of barriers defined by parameters (mxfb)</label>
                        <Input readOnly
                               name='mxfb'
                               value={JSON.stringify(mfPackage.mxfb)}
                               icon={this.renderInfoPopup(documentation.mxfb, 'mxfb')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Barriers not defined by parameters (nhfbnp)</label>
                        <Input readOnly
                               name='nhfbnp'
                               value={JSON.stringify(mfPackage.nhfbnp)}
                               icon={this.renderInfoPopup(documentation.nhfbnp, 'nhfbnp')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Horizontal-flow barrier records (hfb_data)</label>
                        <Input readOnly
                               name='hfb_data'
                               value={JSON.stringify(mfPackage.hfb_data)}
                               icon={this.renderInfoPopup(documentation.hfb_data, 'hfb_data')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Active parameters (nacthfb)</label>
                        <Input readOnly
                               name='nacthfb'
                               value={JSON.stringify(mfPackage.nacthfb)}
                               icon={this.renderInfoPopup(documentation.nacthfb, 'nacthfb')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>(no_print)</label>
                        <Input readOnly
                               name='no_print'
                               value={JSON.stringify(mfPackage.no_print)}
                               icon={this.renderInfoPopup(documentation.no_print, 'no_print')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Package options</label>
                        <Input readOnly
                               name='options'
                               value={JSON.stringify(mfPackage.options)}
                               icon={this.renderInfoPopup(documentation.options, 'options')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Filename extension</label>
                        <Input readOnly
                               name='extension'
                               value={JSON.stringify(mfPackage.extension)}
                               icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number</label>
                        <Input readOnly
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                               icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
                               icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

LpfPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMflpf).isRequired,
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default LpfPackageProperties;
