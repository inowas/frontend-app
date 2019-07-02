import React from 'react';
import {Form, Input} from 'semantic-ui-react';
import {FlopySeawatPackage} from '../../../../../../core/model/flopy/packages/swt';
import {Substance} from '../../../../../../core/model/modflow/transport';
import InfoPopup from '../../../../../shared/InfoPopup';
import {documentation} from '../../../../defaults/flow';
import AbstractPackageProperties from './AbstractPackageProperties';

class VdfPackageProperties extends AbstractPackageProperties {

    public render() {
        if (!this.state.swtPackage) {
            return null;
        }

        const {readOnly, transport} = this.props;
        const {swtPackage} = this.state;

        return (
            <Form>
                <Form.Group>
                    <Form.Field width={15}>
                        <label>Select substance to compute fluid-density (mtdnconc or mt3drhoflg)</label>
                        <Form.Dropdown
                            options={transport.substances.all.map((s: Substance, key: number) => {
                                return {value: key + 1, key, text: s.name};
                            })}
                            placeholder="Select mtdnconc"
                            name="mtdnconc"
                            selection={true}
                            value={swtPackage.mtdnconc || 1}
                            readOnly={readOnly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.mt3drhoflg}
                            title="MT3DRHOFLG"
                            position="bottom right"
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Fluid density at reference concentration (denseref)</label>
                        <Input
                            readOnly={readOnly}
                            name="denseref"
                            value={swtPackage.denseref}
                            disabled={readOnly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.denseref, 'denseref', 'bottom right')}
                            type="number"
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Slope linear equation (fluid density-solute concentration) (drhodc)</label>
                        <Input
                            readOnly={readOnly}
                            name="drhodc"
                            value={swtPackage.drhodc}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.drhodc, 'drhodc', 'bottom right')}
                            type="number"
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group>
                    <Form.Field width={15}>
                        <label>Calculation of intermodal density values (mfnadvfd)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 2, text: 'Central-in-space algorithm'},
                                {key: 1, value: 1, text: 'Upstream-weighted algorithm'},
                            ]}
                            placeholder="Select mfnadvfd"
                            name="mfnadvfd"
                            selection={true}
                            value={swtPackage.mfnadvfd || 0}
                            readOnly={readOnly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.mfnadvfd}
                            title="MFNADVFD"
                            position="bottom right"
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group>
                    <Form.Field width={15}>
                        <label>Flow and transport compiling mechanism (nswtcpl)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 1, text: 'Explicit coupling with one-timestep flag'},
                                {key: 1, value: 2, text: 'Non-linear coupling iterations'},
                                {key: 2, value: -1, text: 'Limited recalculation of flow solution'},
                            ]}
                            placeholder="Select nswtcpl"
                            name="nswtcpl"
                            selection={true}
                            value={swtPackage.nswtcpl}
                            readOnly={readOnly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.nswtcpl}
                            title="NSWTCPL"
                            position="top right"
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
                {swtPackage.nswtcpl > 1 &&
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Number of iterations</label>
                        <Input
                            readOnly={readOnly}
                            name="nswtcpl"
                            value={swtPackage.nswtcpl || ''}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.nswtcpl, 'nswtcpl')}
                            type="number"
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Convergence criterion</label>
                        <Input
                            readOnly={readOnly}
                            name="dnscrit"
                            value={swtPackage.dnscrit || ''}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.dnscrit, 'dnscrit', 'top right')}
                            type="number"
                        />
                    </Form.Field>
                </Form.Group>
                }
                {swtPackage.nswtcpl === -1 &&
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Maximum density threshold</label>
                        <Input
                            readOnly={readOnly}
                            name="dnscrit"
                            value={swtPackage.dnscrit || ''}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.dnscrit, 'dnscrit', 'top right')}
                            type="number"
                        />
                    </Form.Field>
                </Form.Group>
                }
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Minimum fluid density</label>
                        <Input
                            readOnly={readOnly}
                            name="densemin"
                            value={swtPackage.densemin || 0}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.densemin, 'densemin')}
                            type="number"
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Maximum fluid density</label>
                        <Input
                            readOnly={readOnly}
                            name="densemax"
                            value={swtPackage.densemax || 0}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.densemax, 'densemax', 'top right')}
                            type="number"
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group>
                    <Form.Field width={15}>
                        <label>Variable-density water table correction (iwtable)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: 'Inactive'},
                                {key: 1, value: 1, text: 'Active'},
                            ]}
                            placeholder="Select iwtable"
                            name="iwtable"
                            selection={true}
                            value={swtPackage.iwtable || 0}
                            readOnly={readOnly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.iwtable}
                            title="IWTABLE"
                            position="top right"
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

export default VdfPackageProperties;
