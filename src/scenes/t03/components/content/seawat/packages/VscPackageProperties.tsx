import React, {ChangeEvent, FocusEvent, SyntheticEvent} from 'react';
import {Form, Input, InputOnChangeData} from 'semantic-ui-react';

import {FlopyModflowMfriv} from '../../../../../../core/model/flopy/packages/mf';
import {FlopySeawatPackage} from '../../../../../../core/model/flopy/packages/swt';
import {GridSize} from '../../../../../../core/model/modflow';
import {Substance} from '../../../../../../core/model/modflow/transport';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopUp';
import InfoPopup from '../../../../../shared/InfoPopup';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {documentation} from '../../../../defaults/flow';
import AbstractPackageProperties from './AbstractPackageProperties';

interface IIndexObject {
    [index: string]: any;
}

class VscPackageProperties extends AbstractPackageProperties {

    public render() {
        if (!this.state.swtPackage) {
            return null;
        }

        const {readOnly, transport} = this.props;
        const {swtPackage} = this.state;

        const options = [
            {key: 0, value: 0, text: 'None'}
        ];

        transport.substances.all.forEach((s: Substance, key: number) => {
            options.push({
                key: key + 1,
                value: key + 1,
                text: s.name
            });
        });

        return (
            <Form>
                <Form.Group>
                    <Form.Field width={15}>
                        <label>Select substance to compute fluid viscosity (mt3dmuflg or mt3drhoflg)</label>
                        <Form.Dropdown
                            options={options}
                            placeholder="Select mt3dmuflg"
                            name="mt3dmuflg"
                            selection={true}
                            value={swtPackage.mt3dmuflg || -1}
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
                        <label>Minimum fluid viscosity (viscmin)</label>
                        <Input
                            name="viscmin"
                            value={swtPackage.viscmin}
                            disabled={readOnly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={renderInfoPopup(documentation.viscmin, 'viscmin')}
                            type="number"
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Maximum fluid viscosity (viscmax)</label>
                        <Input
                            name="viscmax"
                            value={swtPackage.viscmax || 0}
                            disabled={readOnly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={renderInfoPopup(documentation.viscmax, 'viscmax')}
                            type="number"
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Fluid viscosity at reference concentration and temperature (viscref)</label>
                        <Input
                            name="viscref"
                            value={swtPackage.viscref || 0}
                            disabled={readOnly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={renderInfoPopup(documentation.viscref, 'viscref')}
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
                            disabled={readOnly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={renderInfoPopup(documentation.dmudc, 'dmudc')}
                            type="number"
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Reference concentration (cmuref)</label>
                        <Input
                            name="cmuref"
                            value={swtPackage.cmuref || 0}
                            disabled={readOnly}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            icon={renderInfoPopup(documentation.cmuref, 'cmuref')}
                            type="number"
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
                            readOnly={readOnly}
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

    private handleOnChangeAmuncoeff = (key: number) => (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        const {value} = data;

        const amucoeff = this.state.swtPackage.amucoeff;
        amucoeff[key] = parseFloat(value);

        return this.setState({
            swtPackage: {
                ...this.state.swtPackage,
                amucoeff
            }
        });
    };

    private handleOnBlurAmuncoeff = (key: number) => (e: FocusEvent<HTMLInputElement>) => {
        const {value} = e.currentTarget;

        const amucoeff = this.state.swtPackage.amucoeff;
        amucoeff[key] = parseFloat(value);

        this.setState({swtPackage: {...this.state.swtPackage, amucoeff}});
        const swtPackage: IIndexObject = this.props.swtPackage;
        swtPackage.amucoeff = amucoeff;
        this.props.onChange(swtPackage);
    };

    private renderAmucoeff() {
        const {readOnly} = this.props;
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
                            value={swtPackage.amucoeff ? swtPackage.amucoeff[key] : 0}
                            disabled={readOnly}
                            type="number"
                            onBlur={this.handleOnBlurAmuncoeff(key)}
                            onChange={this.handleOnChangeAmuncoeff(key)}
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
