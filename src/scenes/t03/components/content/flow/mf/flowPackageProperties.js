import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input, Header} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMflpf} from 'core/model/flopy/packages/mf';
import InfoPopup from '../../../../../shared/InfoPopup';
import {documentation} from '../../../../defaults/flow';

const styles = {
    inputFix: {
        padding: '0',
        height: 'auto'
    }
};

class FlowPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackage} = this.props;

        return (
            <Form>
                <Header as={'h4'}>Block Centered Flow Package</Header>

                <Form.Group>
                    <Form.Field width={15}>
                        <label>Model object</label>
                        <Form.Dropdown
                            placeholder='Select model'
                            name='model'
                            selection
                            value={JSON.stringify(mfPackage.model)}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup description={documentation.model} title='Model' position='top right'
                                   iconOutside={true}/>
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field width={4}>
                        <label>(ipakcb)</label>
                        <Input readOnly
                               name='ipakcb'
                               value={JSON.stringify(mfPackage.ipakcb)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.ipakcb, 'ipakcb')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(intercellt)</label>
                        <Input readOnly
                               name='intercellt'
                               value={JSON.stringify(mfPackage.intercellt)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.intercellt, 'intercellt')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(laycon)</label>
                        <Input readOnly
                               name='laycon'
                               value={JSON.stringify(mfPackage.laycon)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.laycon, 'laycon')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(trpy)</label>
                        <Input readOnly
                               name='trpy'
                               value={JSON.stringify(mfPackage.trpy)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.trpy, 'trpy')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field width={4}>
                        <label>(hdry)</label>
                        <Input readOnly
                               name='hdry'
                               value={JSON.stringify(mfPackage.hdry)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.hdry, 'hdry')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(iwdflg)</label>
                        <Input readOnly
                               name='iwdflg'
                               value={JSON.stringify(mfPackage.iwdflg)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.iwdflg, 'iwdflg')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(wetfct)</label>
                        <Input readOnly
                               name='wetfct'
                               value={JSON.stringify(mfPackage.wetfct)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.wetfct, 'wetfct')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(iwetit)</label>
                        <Input readOnly
                               name='iwetit'
                               value={JSON.stringify(mfPackage.iwetit)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.iwetit, 'iwetit')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field width={4}>
                        <label>(ihdwet)</label>
                        <Input readOnly
                               name='ihdwet'
                               value={JSON.stringify(mfPackage.ihdwet)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.ihdwet, 'ihdwet')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(tran)</label>
                        <Input readOnly
                               name='tran'
                               value={JSON.stringify(mfPackage.tran)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.tran, 'tran')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(hy)</label>
                        <Input readOnly
                               name='hy'
                               value={JSON.stringify(mfPackage.hy)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.hy, 'hy')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(vcont)</label>
                        <Input readOnly
                               name='vcont'
                               value={JSON.stringify(mfPackage.vcont)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.vcont, 'vcont')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>(sf1)</label>
                        <Input readOnly
                               name='sf1'
                               value={JSON.stringify(mfPackage.sf1)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.sf1, 'sf1')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(sf2)</label>
                        <Input readOnly
                               name='sf2'
                               value={JSON.stringify(mfPackage.sf2)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.sf2, 'sf2')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(wetdry)</label>
                        <Input readOnly
                               name='wetdry'
                               value={JSON.stringify(mfPackage.wetdry)}
                               style={styles.inputFix}
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
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input readOnly
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>


                <Header as={'h4'}>Flow and Head Boundary Package</Header>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>(nbdtim)</label>
                        <Input readOnly
                               name='nbdtim'
                               value={JSON.stringify(mfPackage.nbdtim)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.nbdtim, 'nbdtim')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nflw)</label>
                        <Input readOnly
                               name='nflw'
                               value={JSON.stringify(mfPackage.nflw)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.nflw, 'nflw')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nhed)</label>
                        <Input readOnly
                               name='nhed'
                               value={JSON.stringify(mfPackage.nhed)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.nhed, 'nhed')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field width={4}>
                        <label>(ifhbss)</label>
                        <Input readOnly
                               name='ifhbss'
                               value={JSON.stringify(mfPackage.ifhbss)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.ifhbss, 'ifhbss')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(ipakcb)</label>
                        <Input readOnly
                               name='ipakcb'
                               value={JSON.stringify(mfPackage.ipakcb)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.ipakcb, 'ipakcb')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(nfhbx1)</label>
                        <Input readOnly
                               name='nfhbx1'
                               value={JSON.stringify(mfPackage.nfhbx1)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.nfhbx1, 'nfhbx1')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(nfhbx2)</label>
                        <Input readOnly
                               name='nfhbx2'
                               value={JSON.stringify(mfPackage.nfhbx2)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.nfhbx2, 'nfhbx2')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field width={4}>
                        <label>(ifhbpt)</label>
                        <Input readOnly
                               name='ifhbpt'
                               value={JSON.stringify(mfPackage.ifhbpt)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.ifhbpt, 'ifhbpt')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(bdtimecnstm)</label>
                        <Input readOnly
                               name='bdtimecnstm'
                               value={JSON.stringify(mfPackage.bdtimecnstm)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.bdtimecnstm, 'bdtimecnstm')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(bdtime)</label>
                        <Input readOnly
                               name='bdtime'
                               value={JSON.stringify(mfPackage.bdtime)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.bdtime, 'bdtime')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(cnstm5)</label>
                        <Input readOnly
                               name='cnstm5'
                               value={JSON.stringify(mfPackage.cnstm5)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.cnstm5, 'cnstm5')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>(ds5)</label>
                        <Input readOnly
                               name='ds5'
                               value={JSON.stringify(mfPackage.ds5)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.ds5, 'ds5')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(cnstm7)</label>
                        <Input readOnly
                               name='cnstm7'
                               value={JSON.stringify(mfPackage.cnstm7)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.cnstm7, 'cnstm7')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(ds7)</label>
                        <Input readOnly
                               name='ds7'
                               value={JSON.stringify(mfPackage.ds7)}
                               style={styles.inputFix}
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
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input readOnly
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>


                <Header as={'h4'}>Head-dependent flow boundary Observation package</Header>

                <Form.Group>
                    <Form.Field width={4}>
                        <label>Cell groups number (nqfb)</label>
                        <Input readOnly
                               name='nqfb'
                               value={JSON.stringify(mfPackage.nqfb)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.nqfb, 'nqfb')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(nqcfb)</label>
                        <Input readOnly
                               name='nqcfb'
                               value={JSON.stringify(mfPackage.nqcfb)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.nqcfb, 'nqcfb')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(nqtfb)</label>
                        <Input readOnly
                               name='nqtfb'
                               value={JSON.stringify(mfPackage.nqtfb)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.nqtfb, 'nqtfb')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(iufbobsv)</label>
                        <Input readOnly
                               name='iufbobsv'
                               value={JSON.stringify(mfPackage.iufbobsv)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.iufbobsv, 'iufbobsv')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>(tomultfb)</label>
                        <Input readOnly
                               name='tomultfb'
                               value={JSON.stringify(mfPackage.tomultfb)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.tomultfb, 'tomultfb')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nqobfb)</label>
                        <Input readOnly
                               name='nqobfb'
                               value={JSON.stringify(mfPackage.nqobfb)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.nqobfb, 'nqobfb')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nqclfb)</label>
                        <Input readOnly
                               name='nqclfb'
                               value={JSON.stringify(mfPackage.nqclfb)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.nqclfb, 'nqclfb')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field width={4}>
                        <label>(obsnam)</label>
                        <Input readOnly
                               name='obsnam'
                               value={JSON.stringify(mfPackage.obsnam)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.obsnam, 'obsnam')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(irefsp)</label>
                        <Input readOnly
                               name='irefsp'
                               value={JSON.stringify(mfPackage.irefsp)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.irefsp, 'irefsp')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(toffset)</label>
                        <Input readOnly
                               name='toffset'
                               value={JSON.stringify(mfPackage.toffset)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.toffset, 'toffset')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>(flwobs)</label>
                        <Input readOnly
                               name='flwobs'
                               value={JSON.stringify(mfPackage.flwobs)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.flwobs, 'flwobs')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>(layer)</label>
                        <Input readOnly
                               name='layer'
                               value={JSON.stringify(mfPackage.layer)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.layer, 'layer')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(row)</label>
                        <Input readOnly
                               name='row'
                               value={JSON.stringify(mfPackage.row)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.row, 'row')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(column)</label>
                        <Input readOnly
                               name='column'
                               value={JSON.stringify(mfPackage.column)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.column, 'column')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>(factor)</label>
                        <Input readOnly
                               name='factor'
                               value={JSON.stringify(mfPackage.factor)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.factor, 'factor')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(flowtype)</label>
                        <Input readOnly
                               name='flowtype'
                               value={JSON.stringify(mfPackage.flowtype)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.flowtype, 'flowtype')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input readOnly
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>

                <Header as={'h4'}>Horizontal Flow Barrier Package</Header>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>(nphfb)</label>
                        <Input readOnly
                               name='nphfb'
                               value={JSON.stringify(mfPackage.nphfb)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.nphfb, 'nphfb')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(mxfb)</label>
                        <Input readOnly
                               name='mxfb'
                               value={JSON.stringify(mfPackage.mxfb)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.mxfb, 'mxfb')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nhfbnp)</label>
                        <Input readOnly
                               name='nhfbnp'
                               value={JSON.stringify(mfPackage.nhfbnp)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.nhfbnp, 'nhfbnp')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>(hfb_data)</label>
                        <Input readOnly
                               name='hfb_data'
                               value={JSON.stringify(mfPackage.hfb_data)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.hfb_data, 'hfb_data')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nacthfb)</label>
                        <Input readOnly
                               name='nacthfb'
                               value={JSON.stringify(mfPackage.nacthfb)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.nacthfb, 'nacthfb')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(no_print)</label>
                        <Input readOnly
                               name='no_print'
                               value={JSON.stringify(mfPackage.no_print)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.no_print, 'no_print')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field width={4}>
                        <label>Package options</label>
                        <Input readOnly
                               name='options'
                               value={JSON.stringify(mfPackage.options)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.options, 'options')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>Filename extension</label>
                        <Input readOnly
                               name='extension'
                               value={JSON.stringify(mfPackage.extension)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>File unit number</label>
                        <Input readOnly
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>Filenames</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

FlowPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMflpf),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default FlowPackageProperties;
