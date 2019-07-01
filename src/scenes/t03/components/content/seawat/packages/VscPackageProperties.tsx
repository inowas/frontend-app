import React from 'react';
import {Form, Input} from 'semantic-ui-react';

import {FlopyModflowMfriv} from '../../../../../../core/model/flopy/packages/mf';
import {GridSize} from '../../../../../../core/model/modflow';
import InfoPopup from '../../../../../shared/InfoPopup';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {documentation} from '../../../../defaults/flow';
import AbstractPackageProperties from './AbstractPackageProperties';

class VscPackageProperties extends AbstractPackageProperties {

    public render() {
        if (!this.state.swtPackage) {
            return null;
        }

        const {readonly} = this.props;
        const {swtPackage} = this.state;

        return (
            <Form>
                <Form.Group>
                    <Form.Field width={15}>
                        <label>Select substance to compute fluid viscosity (mt3drhoflg)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: 'None'},
                                {key: 1, value: 1, text: 'subatance1'}
                            ]}
                            placeholder="Select mt3drhoflg"
                            name="mt3drhoflg"
                            selection={true}
                            value={swtPackage.mt3drhoflg || 0}
                            readOnly={readonly}
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
                        <label>Minimum fluid viscosity (viscmin)</label>
                        <Input
                            name="viscmin"
                            value={swtPackage.viscmin || 0}
                            disabled={readonly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.viscmin, 'viscmin')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Maximum fluid viscosity (viscmax)</label>
                        <Input
                            name="viscmax"
                            value={swtPackage.viscmax || 0}
                            disabled={readonly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.viscmax, 'viscmax')}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Fluid viscosity at reference concentration and temperature (viscref)</label>
                        <Input
                            name="viscref"
                            value={swtPackage.viscref || 0}
                            disabled={readonly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.viscref, 'viscref')}
                            type="number"
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Slope of linear equation (fluid viscosity - solute concentration) (dmudc)</label>
                        <Input
                            name="dmudc"
                            value={swtPackage.dmudc || 0}
                            disabled={readonly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.dmudc, 'dmudc')}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Reference concentration (cmuref)</label>
                        <Input
                            name="cmuref"
                            value={swtPackage.cmuref || 0}
                            disabled={readonly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={this.renderInfoPopup(documentation.cmuref, 'cmuref')}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group>
                    <Form.Field width={15}>
                        <label>Effect of temperature on fluid viscosity (mutempopt)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: 'None'},
                                {key: 1, value: 1, text: 'Equation 18'},
                                {key: 2, value: 2, text: 'Equation 19'},
                                {key: 3, value: 3, text: 'Equation 20'}
                            ]}
                            placeholder="Select mutempopt"
                            name="mutempopt"
                            selection={true}
                            value={swtPackage.mutempopt || 0}
                            readOnly={readonly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.mutempopt}
                            title="MUTEMPOPT"
                            position="bottom right"
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
                {this.renderAmucoeff()}
            </Form>
        );
    }

    private renderAmucoeff() {
        const {readonly} = this.props;
        const {swtPackage} = this.state;

        let coefficients = [];

        switch (swtPackage.mutempopt) {
            case 1:
                coefficients = [1, 2, 3, 4];
                break;
            case 2:
                coefficients = [1, 2, 3, 4, 5];
                break;
            case 3:
                coefficients = [1, 2];
                break;
            default:
                return null;
        }

        return (
            <Form.Group>
                {coefficients.map((c, key) => (
                    <Form.Field key={key} width={3}>
                        <label>A{c}</label>
                        <Input
                            name={`amucoeff${key}`}
                            value={swtPackage.amucoeff[key] || 0}
                            disabled={readonly}
                            type="number"
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                ))}
                <Form.Field width={1}>
                    <label>&nbsp;</label>
                    <InfoPopup
                        description={documentation.amucoeff}
                        title="AMUCOEFF"
                        position="bottom right"
                        iconOutside={true}
                    />
                </Form.Field>
            </Form.Group>
        );
    }
}

export default VscPackageProperties;
