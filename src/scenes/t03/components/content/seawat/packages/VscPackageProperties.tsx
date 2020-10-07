import React, {ChangeEvent, FocusEvent, SyntheticEvent, useEffect, useState} from 'react';
import {DropdownProps, Form, Input, InputOnChangeData} from 'semantic-ui-react';
import {FlopySeawatSwtvsc} from '../../../../../../core/model/flopy/packages/swt';
import {IFlopySeawatSwtvsc} from '../../../../../../core/model/flopy/packages/swt/FlopySeawatSwtvsc';
import {Substance, Transport} from '../../../../../../core/model/modflow/transport';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';
import InfoPopup from '../../../../../shared/InfoPopup';
import {PopupPosition} from '../../../../../types';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    swtPackage: FlopySeawatSwtvsc;
    transport: Transport;
    onChange: (p: FlopySeawatSwtvsc) => any;
    readOnly: boolean;
}

const vscPackageProperties = (props: IProps) => {

    const [swtPackage, setSwtPackage] = useState<IFlopySeawatSwtvsc>(props.swtPackage.toObject());

    useEffect(() => {
        setSwtPackage(props.swtPackage.toObject());
    }, [props.swtPackage]);

    const handleOnSelect = (e: SyntheticEvent, {name, value}: DropdownProps) => {
        setSwtPackage({...swtPackage, [name]: value});
        props.onChange(FlopySeawatSwtvsc.fromObject({...swtPackage, [name]: value}));
    };

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        return setSwtPackage({...swtPackage, [name]: value});
    };

    const handleOnBlur = (cast?: (v: any) => any) => (e: ChangeEvent<HTMLInputElement>) => {
        const {name} = e.target;
        let {value} = e.target;

        if (cast) {
            value = cast(value);
        }

        setSwtPackage({...swtPackage, [name]: value});
        props.onChange(FlopySeawatSwtvsc.fromObject({...swtPackage, [name]: value}));
    };

    const handleOnChangeAmuncoeff = (key: number) => (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        const value = parseFloat(data.value);

        let amucoeff = swtPackage.amucoeff;
        if (!Array.isArray(amucoeff) || amucoeff.length < key) {
            switch (swtPackage.mutempopt) {
                case 1:
                    amucoeff = [0, 0, 0, 0];
                    break;
                case 2:
                    amucoeff = [0, 0, 0, 0, 0];
                    break;
                case 3:
                    amucoeff = [0, 0];
                    break;
                default:
                    return null;
            }
        }

        amucoeff[key] = value;
        setSwtPackage({...swtPackage, amucoeff});
    };

    const handleOnBlurAmuncoeff = (key: number) => (e: FocusEvent<HTMLInputElement>) => {
        const {value} = e.currentTarget;

        let amucoeff = swtPackage.amucoeff;
        if (!Array.isArray(amucoeff) || amucoeff.length < key) {
            switch (swtPackage.mutempopt) {
                case 1:
                    amucoeff = [0, 0, 0, 0];
                    break;
                case 2:
                    amucoeff = [0, 0, 0, 0, 0];
                    break;
                case 3:
                    amucoeff = [0, 0];
                    break;
                default:
                    return null;
            }
        }
        amucoeff[key] = parseFloat(value);
        setSwtPackage({...swtPackage, amucoeff});
        props.onChange(FlopySeawatSwtvsc.fromObject(swtPackage));
    };

    const renderAmucoeff = () => {
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
                            value={
                                swtPackage.amucoeff && swtPackage.amucoeff.length > key ? swtPackage.amucoeff[key] : 0
                            }
                            disabled={readOnly}
                            type="number"
                            onBlur={handleOnBlurAmuncoeff(key)}
                            onChange={handleOnChangeAmuncoeff(key)}
                        />
                    </Form.Field>
                ))}
                <Form.Field width={1}>
                    <label>&nbsp;</label>
                    <InfoPopup
                        description={documentation.amucoeff}
                        title="AMUCOEFF"
                        position="top right"
                        iconOutside={true}
                    />
                </Form.Field>
            </Form.Group>
        );
    };

    const {readOnly, transport} = props;

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
                    <label>Select substance to compute fluid viscosity (mtmuspec)</label>
                    <Form.Dropdown
                        options={options}
                        placeholder="Select mtmuspec"
                        name="mtmuspec"
                        selection={true}
                        value={swtPackage.mtmuspec || 0}
                        disabled={readOnly}
                        onChange={handleOnSelect}
                    />
                </Form.Field>
                <Form.Field width={1}>
                    <label>&nbsp;</label>
                    <InfoPopup
                        description={documentation.mtmuspec}
                        title="MTMUSPEC"
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
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                        icon={renderInfoPopup(documentation.viscmin, 'viscmin', PopupPosition.BOTTOM_LEFT)}
                        type="number"
                    />
                </Form.Field>
                <Form.Field>
                    <label>Maximum fluid viscosity (viscmax)</label>
                    <Input
                        name="viscmax"
                        value={swtPackage.viscmax || 0}
                        disabled={readOnly}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                        icon={renderInfoPopup(documentation.viscmax, 'viscmax', PopupPosition.BOTTOM_RIGHT)}
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
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                        icon={renderInfoPopup(documentation.viscref, 'viscref', PopupPosition.BOTTOM_RIGHT)}
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
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                        icon={renderInfoPopup(documentation.dmudc, 'dmudc', PopupPosition.BOTTOM_RIGHT)}
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
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                        icon={renderInfoPopup(documentation.cmuref, 'cmuref', PopupPosition.TOP_RIGHT)}
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
                            {key: 1, value: 1, text: 'Equation 18 (Langevin et al., 2008)'},
                            {key: 2, value: 2, text: 'Equation 19 (Langevin et al., 2008)'},
                            {key: 3, value: 3, text: 'Equation 20 (Langevin et al., 2008)'}
                        ]}
                        placeholder="Select mutempopt"
                        name="mutempopt"
                        selection={true}
                        value={swtPackage.mutempopt || 0}
                        disabled={readOnly}
                        onChange={handleOnSelect}
                    />
                </Form.Field>
                <Form.Field width={1}>
                    <label>&nbsp;</label>
                    <InfoPopup
                        description={documentation.mutempopt}
                        title="MUTEMPOPT"
                        position="top right"
                        iconOutside={true}
                    />
                </Form.Field>
            </Form.Group>
            {renderAmucoeff()}
        </Form>
    );

};

export default vscPackageProperties;
