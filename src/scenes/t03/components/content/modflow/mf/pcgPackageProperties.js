import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input} from 'semantic-ui-react';

import {FlopyModflowMfpcg} from '../../../../../../core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';
import {AbstractPackageProperties} from './index';

class PcgPackageProperties extends AbstractPackageProperties {
    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const mfPackage = FlopyModflowMfpcg.fromObject(this.state.mfPackage);
        const readOnly = this.props.readonly;

        return (
            <Form>
                <Form.Group>
                    <Form.Field>
                        <label>Maximum number of outer iterations (mxiter)</label>
                        <Input
                            readOnly={readOnly}
                            name='mxiter'
                            type={'number'}
                            value={mfPackage.mxiter}
                            icon={this.renderInfoPopup(documentation.mxiter, 'mxiter')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Maximum number of inner equations (iter1)</label>
                        <Input
                            readOnly={readOnly}
                            name='iter1'
                            type={'number'}
                            value={mfPackage.iter1}
                            icon={this.renderInfoPopup(documentation.iter1, 'iter1')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Matrix conditioning method (npcond)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 1, text: 'Modified Incomplete Cholesky (1)'},
                                {key: 1, value: 2, text: 'Polynomial'},
                            ]}
                            placeholder='Select npcond'
                            name='npcond'
                            selection
                            value={mfPackage.npcond}
                            readOnly={readOnly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {this.renderInfoPopup(documentation.npcond, 'npcond', 'top left', true)}
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Head change criterion (hclose)</label>
                        <Input
                            readOnly={readOnly}
                            name='hclose'
                            type={'number'}
                            value={mfPackage.hclose}
                            icon={this.renderInfoPopup(documentation.hclose, 'hclose')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Residual criterion (rclose)</label>
                        <Input
                            readOnly={readOnly}
                            name='rclose'
                            type={'number'}
                            value={mfPackage.rclose}
                            icon={this.renderInfoPopup(documentation.rclose, 'rclose')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Relaxation parameter (relax)</label>
                        <Input
                            readOnly={readOnly}
                            name='relax'
                            type={'number'}
                            value={mfPackage.relax}
                            icon={this.renderInfoPopup(documentation.relax, 'relax')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>(nbpol)</label>
                        <Input
                            readOnly={readOnly}
                            name='nbpol'
                            type={'number'}
                            value={mfPackage.nbpol}
                            icon={this.renderInfoPopup(documentation.nbpol, 'nbpol')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Solver print out interval(iprpcg)</label>
                        <Input
                            readOnly={readOnly}
                            name='iprpcg'
                            type={'number'}
                            value={mfPackage.iprpcg}
                            icon={this.renderInfoPopup(documentation.iprpcg, 'iprpcg')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Print options (mutpcg)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 1, text: '1'},
                                {key: 1, value: 2, text: '2'},
                                {key: 2, value: 3, text: '3'},
                            ]}
                            placeholder='Select mutpcg'
                            name='mutpcg'
                            selection
                            value={mfPackage.mutpcg}
                            readOnly={readOnly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {this.renderInfoPopup(documentation.mutpcg, 'mutpcg', 'top left', true)}
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Steady-state damping factor (damp)</label>
                        <Input
                            readOnly={readOnly}
                            name='damp'
                            value={mfPackage.damp}
                            icon={this.renderInfoPopup(documentation.damp, 'damp')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Transient damping factor (dampt)</label>
                        <Input
                            readOnly={readOnly}
                            name='dampt'
                            value={mfPackage.dampt}
                            icon={this.renderInfoPopup(documentation.dampt, 'dampt')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(ihcofadd)</label>
                        <Input
                            readOnly={readOnly}
                            name='ihcofadd'
                            value={mfPackage.ihcofadd}
                            icon={this.renderInfoPopup(documentation.ihcofadd, 'ihcofadd')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Filename extension (extension)</label>
                        <Input
                            readOnly
                            name='extension'
                            value={mfPackage.extension || ''}
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

PcgPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfpcg).isRequired,
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};

export default PcgPackageProperties;
