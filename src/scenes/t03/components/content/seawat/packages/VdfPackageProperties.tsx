import React from 'react';
import {Form, Input} from 'semantic-ui-react';
import InfoPopup from '../../../../../shared/InfoPopup';
import {documentation} from '../../../../defaults/flow';
import AbstractPackageProperties from './AbstractPackageProperties';

class VdfPackageProperties extends AbstractPackageProperties {

    public render() {
        if (!this.state.swtPackage) {
            return null;
        }

        const {readonly} = this.props;
        const {swtPackage} = this.state;

        return (
            <Form>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Select substance to compute fluid-density (mt3drhoflg)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: 'substance1'},
                                {key: 1, value: 1, text: 'subatance2'},
                            ]}
                            placeholder="Select mt3drhoflg"
                            name="mt3drhoflg"
                            selection={true}
                            value={swtPackage.mt3drhoflg || 0}
                            readOnly={readonly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Fluid density at reference concentration (denseref)</label>
                        <Input
                            readOnly={true}
                            name="denseref"
                            value={swtPackage.denseref || ''}
                            disabled={readonly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.denseref, 'denseref')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Slope linear equation (fluid density-solute concentration) (drhodc)</label>
                        <Input
                            readOnly={true}
                            name="drhodc"
                            value={swtPackage.drhodc || ''}
                            disabled={readonly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.drhodc, 'drhodc')}
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
                            readOnly={readonly}
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
                            readOnly={readonly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.nswtcpl}
                            title="NSWTCPL"
                            position="bottom right"
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
                {swtPackage.nswtcpl > 1 &&
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Number of iterations</label>
                        <Input
                            readOnly={true}
                            name="nswtcpl"
                            value={swtPackage.nswtcpl || ''}
                            disabled={readonly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.nswtcpl, 'nswtcpl')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Convergence criterion</label>
                        <Input
                            readOnly={true}
                            name="denscrit"
                            value={swtPackage.denscrit || ''}
                            disabled={readonly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.denscrit, 'denscrit')}
                        />
                    </Form.Field>
                </Form.Group>
                }
                {swtPackage.nswtcpl === -1 &&
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Maximum density threshold</label>
                        <Input
                            readOnly={true}
                            name="denscrit"
                            value={swtPackage.denscrit || ''}
                            disabled={readonly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.denscrit, 'denscrit')}
                        />
                    </Form.Field>
                </Form.Group>
                }
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Minimum fluid density</label>
                        <Input
                            readOnly={true}
                            name="densemin"
                            value={swtPackage.densemin || 0}
                            disabled={readonly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.densemin, 'densemin')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Maximum fluid density</label>
                        <Input
                            readOnly={true}
                            name="densemax"
                            value={swtPackage.densemax || 0}
                            disabled={readonly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.densemax, 'densemax')}
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
                            readOnly={readonly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.iwtable}
                            title="IWTABLE"
                            position="bottom right"
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

export default VdfPackageProperties;
