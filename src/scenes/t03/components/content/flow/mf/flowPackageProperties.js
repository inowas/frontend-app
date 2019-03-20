import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input, Header} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMflpf} from 'core/model/flopy/packages/mf';

class FlowPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {readonly, mfPackage} = this.props;

        return (
            <Form>
                <Header as={'h4'}>Block Centered Flow Package</Header>

                <Form.Group>
                    <Form.Field>
                        <label>(ipakcb)</label>
                        <Input readOnly
                               name='ipakcb'
                               value={JSON.stringify(mfPackage.ipakcb)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(intercellt)</label>
                        <Input readOnly
                               name='intercellt'
                               value={JSON.stringify(mfPackage.intercellt)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(laycon)</label>
                        <Input readOnly
                               name='laycon'
                               value={JSON.stringify(mfPackage.laycon)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(trpy)</label>
                        <Input readOnly
                               name='trpy'
                               value={JSON.stringify(mfPackage.trpy)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>(hdry)</label>
                        <Input readOnly
                               name='hdry'
                               value={JSON.stringify(mfPackage.hdry)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(iwdflg)</label>
                        <Input readOnly
                               name='iwdflg'
                               value={JSON.stringify(mfPackage.iwdflg)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(wetfct)</label>
                        <Input readOnly
                               name='wetfct'
                               value={JSON.stringify(mfPackage.wetfct)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(iwetit)</label>
                        <Input readOnly
                               name='iwetit'
                               value={JSON.stringify(mfPackage.iwetit)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>(ihdwet)</label>
                        <Input readOnly
                               name='ihdwet'
                               value={JSON.stringify(mfPackage.ihdwet)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(tran)</label>
                        <Input readOnly
                               name='tran'
                               value={JSON.stringify(mfPackage.tran)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(hy)</label>
                        <Input readOnly
                               name='hy'
                               value={JSON.stringify(mfPackage.hy)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(vcont)</label>
                        <Input readOnly
                               name='vcont'
                               value={JSON.stringify(mfPackage.vcont)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>(sf1)</label>
                        <Input readOnly
                               name='sf1'
                               value={JSON.stringify(mfPackage.sf1)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(sf2)</label>
                        <Input readOnly
                               name='sf2'
                               value={JSON.stringify(mfPackage.sf2)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(wetdry)</label>
                        <Input readOnly
                               name='wetdry'
                               value={JSON.stringify(mfPackage.wetdry)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>Filename extension (extension)</label>
                        <Input readOnly
                               name='extension'
                               value={JSON.stringify(mfPackage.extension)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input readOnly
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
                        />
                    </Form.Field>
                </Form.Group>


                <Header as={'h4'}>Flow and Head Boundary Package</Header>

                <Form.Group>
                    <Form.Field>
                        <label>(nbdtim)</label>
                        <Input readOnly
                               name='nbdtim'
                               value={JSON.stringify(mfPackage.nbdtim)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nflw)</label>
                        <Input readOnly
                               name='nflw'
                               value={JSON.stringify(mfPackage.nflw)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nhed)</label>
                        <Input readOnly
                               name='nhed'
                               value={JSON.stringify(mfPackage.nhed)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>(ifhbss)</label>
                        <Input readOnly
                               name='ifhbss'
                               value={JSON.stringify(mfPackage.ifhbss)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(ipakcb)</label>
                        <Input readOnly
                               name='ipakcb'
                               value={JSON.stringify(mfPackage.ipakcb)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nfhbx1)</label>
                        <Input readOnly
                               name='nfhbx1'
                               value={JSON.stringify(mfPackage.nfhbx1)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nfhbx2)</label>
                        <Input readOnly
                               name='nfhbx2'
                               value={JSON.stringify(mfPackage.nfhbx2)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>(ifhbpt)</label>
                        <Input readOnly
                               name='ifhbpt'
                               value={JSON.stringify(mfPackage.ifhbpt)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(bdtimecnstm)</label>
                        <Input readOnly
                               name='bdtimecnstm'
                               value={JSON.stringify(mfPackage.bdtimecnstm)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(bdtime)</label>
                        <Input readOnly
                               name='bdtime'
                               value={JSON.stringify(mfPackage.bdtime)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(cnstm5)</label>
                        <Input readOnly
                               name='cnstm5'
                               value={JSON.stringify(mfPackage.cnstm5)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>(ds5)</label>
                        <Input readOnly
                               name='ds5'
                               value={JSON.stringify(mfPackage.ds5)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(cnstm7)</label>
                        <Input readOnly
                               name='cnstm7'
                               value={JSON.stringify(mfPackage.cnstm7)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(ds7)</label>
                        <Input readOnly
                               name='ds7'
                               value={JSON.stringify(mfPackage.ds7)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>Filename extension (extension)</label>
                        <Input readOnly
                               name='extension'
                               value={JSON.stringify(mfPackage.extension)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input readOnly
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
                        />
                    </Form.Field>
                </Form.Group>


                <Header as={'h4'}>Head-dependent flow boundary Observation package</Header>

                <Form.Group>
                    <Form.Field>
                        <label>Cell groups number (nqfb)</label>
                        <Input readOnly
                               name='nqfb'
                               value={JSON.stringify(mfPackage.nqfb)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nqcfb)</label>
                        <Input readOnly
                               name='nqcfb'
                               value={JSON.stringify(mfPackage.nqcfb)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nqtfb)</label>
                        <Input readOnly
                               name='nqtfb'
                               value={JSON.stringify(mfPackage.nqtfb)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(iufbobsv)</label>
                        <Input readOnly
                               name='iufbobsv'
                               value={JSON.stringify(mfPackage.iufbobsv)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>(tomultfb)</label>
                        <Input readOnly
                               name='tomultfb'
                               value={JSON.stringify(mfPackage.tomultfb)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nqobfb)</label>
                        <Input readOnly
                               name='nqobfb'
                               value={JSON.stringify(mfPackage.nqobfb)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nqclfb)</label>
                        <Input readOnly
                               name='nqclfb'
                               value={JSON.stringify(mfPackage.nqclfb)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>(obsnam)</label>
                        <Input readOnly
                               name='obsnam'
                               value={JSON.stringify(mfPackage.obsnam)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(irefsp)</label>
                        <Input readOnly
                               name='irefsp'
                               value={JSON.stringify(mfPackage.irefsp)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(toffset)</label>
                        <Input readOnly
                               name='toffset'
                               value={JSON.stringify(mfPackage.toffset)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(flwobs)</label>
                        <Input readOnly
                               name='flwobs'
                               value={JSON.stringify(mfPackage.flwobs)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>(layer)</label>
                        <Input readOnly
                               name='layer'
                               value={JSON.stringify(mfPackage.layer)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(row)</label>
                        <Input readOnly
                               name='row'
                               value={JSON.stringify(mfPackage.row)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(column)</label>
                        <Input readOnly
                               name='column'
                               value={JSON.stringify(mfPackage.column)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>(factor)</label>
                        <Input readOnly
                               name='factor'
                               value={JSON.stringify(mfPackage.factor)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(flowtype)</label>
                        <Input readOnly
                               name='flowtype'
                               value={JSON.stringify(mfPackage.flowtype)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input readOnly
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
                        />
                    </Form.Field>
                </Form.Group>

                <Header as={'h4'}>Horizontal Flow Barrier Package</Header>

                <Form.Group>
                    <Form.Field>
                        <label>(nphfb)</label>
                        <Input readOnly
                               name='nphfb'
                               value={JSON.stringify(mfPackage.nphfb)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(mxfb)</label>
                        <Input readOnly
                               name='mxfb'
                               value={JSON.stringify(mfPackage.mxfb)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nhfbnp)</label>
                        <Input readOnly
                               name='nhfbnp'
                               value={JSON.stringify(mfPackage.nhfbnp)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>(hfb_data)</label>
                        <Input readOnly
                               name='hfb_data'
                               value={JSON.stringify(mfPackage.hfb_data)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(nacthfb)</label>
                        <Input readOnly
                               name='nacthfb'
                               value={JSON.stringify(mfPackage.nacthfb)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(no_print)</label>
                        <Input readOnly
                               name='no_print'
                               value={JSON.stringify(mfPackage.no_print)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>Package options (options)</label>
                        <Input readOnly
                               name='options'
                               value={JSON.stringify(mfPackage.options)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filename extension (extension)</label>
                        <Input readOnly
                               name='extension'
                               value={JSON.stringify(mfPackage.extension)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input readOnly
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
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
