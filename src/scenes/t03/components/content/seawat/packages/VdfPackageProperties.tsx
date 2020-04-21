import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import {DropdownProps, Form, Input} from 'semantic-ui-react';
import FlopySeawatSwtvdf, {IFlopySeawatSwtvdf} from '../../../../../../core/model/flopy/packages/swt/FlopySeawatSwtvdf';
import {Substance, Transport} from '../../../../../../core/model/modflow/transport';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';
import InfoPopup from '../../../../../shared/InfoPopup';
import {PopupPosition} from '../../../../../types';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    swtPackage: FlopySeawatSwtvdf;
    transport: Transport;
    onChange: (p: FlopySeawatSwtvdf) => any;
    readOnly: boolean;
}

const vdfPackageProperties = (props: IProps) => {
    const [swtPackage, setSwtPackage] = useState<IFlopySeawatSwtvdf>(props.swtPackage.toObject());

    useEffect(() => {
        setSwtPackage(props.swtPackage.toObject());
    }, [props.swtPackage]);

    const handleOnSelect = (e: SyntheticEvent, {name, value}: DropdownProps) => {
        setSwtPackage({...swtPackage, [name]: value});
        props.onChange(FlopySeawatSwtvdf.fromObject({...swtPackage, [name]: value}));
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
        props.onChange(FlopySeawatSwtvdf.fromObject({...swtPackage, [name]: value}));
    };

    const {readOnly, transport} = props;

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
                        disabled={readOnly}
                        onChange={handleOnSelect}
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
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                        icon={renderInfoPopup(documentation.denseref, 'denseref', PopupPosition.BOTTOM_RIGHT)}
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
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                        icon={renderInfoPopup(documentation.drhodc, 'drhodc', PopupPosition.BOTTOM_RIGHT)}
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
                        disabled={readOnly}
                        onChange={handleOnSelect}
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
                        disabled={readOnly}
                        onChange={handleOnSelect}
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
                    <label>Convergence criterion</label>
                    <Input
                        readOnly={readOnly}
                        name="dnscrit"
                        value={swtPackage.dnscrit}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                        icon={renderInfoPopup(documentation.dnscrit, 'dnscrit', PopupPosition.TOP_RIGHT)}
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
                        value={swtPackage.dnscrit}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                        icon={renderInfoPopup(documentation.dnscrit, 'dnscrit', PopupPosition.TOP_RIGHT)}
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
                        value={swtPackage.densemin}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                        icon={renderInfoPopup(documentation.densemin, 'densemin')}
                        type="number"
                    />
                </Form.Field>
                <Form.Field>
                    <label>Maximum fluid density</label>
                    <Input
                        readOnly={readOnly}
                        name="densemax"
                        value={swtPackage.densemax}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                        icon={renderInfoPopup(documentation.densemax, 'densemax', PopupPosition.TOP_RIGHT)}
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
                        disabled={readOnly}
                        onChange={handleOnSelect}
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
};

export default vdfPackageProperties;
