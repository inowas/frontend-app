import {DropdownProps, Form, Header, Input, Segment} from 'semantic-ui-react';
import {documentation} from '../../../../defaults/transport';
import FlopyMt3dMtrct, {IFlopyMt3dMtrct} from '../../../../../../core/model/flopy/packages/mt/FlopyMt3dMtrct';
import InfoPopup from '../../../../../shared/InfoPopup';
import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import ToggleableInput from '../../../../../shared/complexTools/ToggleableInput';

interface IProps {
    mtPackage: FlopyMt3dMtrct;
    onChange: (p: FlopyMt3dMtrct) => any;
    readOnly: boolean;
}

const RctPackageProperties = (props: IProps) => {
    const [mtPackage, setMtPackage] = useState<IFlopyMt3dMtrct>(props.mtPackage.toObject());
    useEffect(() => {
        setMtPackage(props.mtPackage.toObject());
    }, [props.mtPackage]);

    const handleOnSelect = (e: SyntheticEvent, {name, value}: DropdownProps) => {
        setMtPackage({...mtPackage, [name]: value});
        props.onChange(FlopyMt3dMtrct.fromObject({...mtPackage, [name]: value}));
    };

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        return setMtPackage({...mtPackage, [name]: value});
    };

    const handleOnBlur = (cast?: (v: any) => any) => (e: ChangeEvent<HTMLInputElement>) => {
        const {name} = e.target;
        let {value} = e.target;

        if (cast) {
            value = cast(value);
        }

        setMtPackage({...mtPackage, [name]: value});
        props.onChange(FlopyMt3dMtrct.fromObject({...mtPackage, [name]: value}));
    };

    const handleOnToggleableChange = (name: string, value: any) => handleOnBlur()(
        {target: {name, value}} as ChangeEvent<HTMLInputElement>
    );

    const {readOnly} = props;

    return (
        <Form>
            <Header as={'h3'} dividing={true}>RCT: Chemical Reaction Package</Header>
            <Segment.Group>
                <Segment>
                    <Form.Group>
                        <Form.Field width={15}>
                            <label>Simulated sorption type (ISOTHM)</label>
                            <Form.Dropdown
                                options={[
                                    {key: 0, value: 0, text: 'No sorption is simulated'},
                                    {key: 1, value: 1, text: 'Linear isotherm (equilibrium-controlled)'},
                                    {key: 2, value: 2, text: 'Freundlich isotherm (equilibrium-controlled)'},
                                    {key: 3, value: 3, text: 'Langmuir isotherm (equilibrium-controlled)'},
                                    {key: 4, value: 4, text: 'First-order kinetic sorption (nonequilibrium)'},
                                    {key: 5, value: 5, text: 'Dual-domain mass transfer (without sorption)'},
                                    {key: 6, value: 6, text: 'Dual-domain mass transfer (with sorption)'}
                                ]}
                                placeholder={'Select isothm'}
                                name={'isothm'}
                                selection={true}
                                value={mtPackage.isothm || 0}
                                disabled={readOnly}
                                onChange={handleOnSelect}
                            />
                        </Form.Field>
                        <Form.Field width={1}>
                            <label>&nbsp;</label>
                            <InfoPopup
                                description={documentation.rct.isothm}
                                title={'ISOTHM'}
                                position={'bottom right'}
                                iconOutside={true}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <Form.Field>
                            <label>Kinetic rate reaction (IREACT)</label>
                            <Form.Dropdown
                                options={[
                                    {key: 0, value: 0, text: 'No kinetic rate reaction is simulated'},
                                    {key: 1, value: 1, text: 'First-order irreversible reaction'},
                                ]}
                                placeholder={'Select ireact'}
                                name={'ireact'}
                                selection={true}
                                value={mtPackage.ireact || 0}
                                disabled={readOnly}
                                onChange={handleOnSelect}
                            />
                        </Form.Field>
                        <Form.Field width={1}>
                            <label>&nbsp;</label>
                            <InfoPopup
                                description={documentation.rct.ireact}
                                title={'IREACT'}
                                position={'bottom right'}
                                iconOutside={true}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Reading initial concentrations (IGETSC)</label>
                            <Input
                                type={'number'}
                                name={'igetsc'}
                                value={mtPackage.igetsc}
                                disabled={readOnly}
                                onBlur={handleOnBlur(parseFloat)}
                                onChange={handleOnChange}
                                icon={<InfoPopup
                                    description={documentation.rct.igetsc}
                                    title={'IGETSC'}
                                    position={'bottom left'}
                                />
                                }
                            />
                        </Form.Field>
                    </Form.Group>
                </Segment>
                <Segment>
                    {mtPackage.isothm > 0 &&
                    <Form.Group>
                        {[1, 2, 3, 4, 6].includes(mtPackage.isothm) &&
                        <React.Fragment>
                            <Form.Field width={7}>
                                <label>Bulk density (RHOB)</label>
                                <ToggleableInput
                                    name={'rhob'}
                                    value={mtPackage.rhob}
                                    readOnly={readOnly}
                                    onChange={handleOnToggleableChange}
                                    placeholder={0}
                                    type="number"
                                />
                            </Form.Field>
                            <Form.Field width={1}>
                                <label>&nbsp;</label>
                                <InfoPopup
                                    description={documentation.rct.rhob}
                                    title="RHOB"
                                    position="top left"
                                    iconOutside={true}
                                />
                            </Form.Field>
                        </React.Fragment>
                        }
                        {[5, 6].includes(mtPackage.isothm) &&
                        <React.Fragment>
                            <Form.Field width={7}>
                                <label>Porosity (PRSITY2)</label>
                                <ToggleableInput
                                    name={'prsity2'}
                                    value={mtPackage.prsity2}
                                    readOnly={readOnly}
                                    onChange={handleOnToggleableChange}
                                    placeholder={0}
                                    type={'number'}
                                />
                            </Form.Field>
                            <Form.Field width={1}>
                                <label>&nbsp;</label>
                                <InfoPopup
                                    description={documentation.rct.prsity2}
                                    title={'PRSITY2'}
                                    position={'top right'}
                                    iconOutside={true}
                                />
                            </Form.Field>
                        </React.Fragment>
                        }
                    </Form.Group>
                    }
                    <Form.Group>
                        <Form.Field width={7}>
                            <label>Sorbed phase initial concentration (SRCONC)</label>
                            <ToggleableInput
                                name={'srconc'}
                                value={mtPackage.srconc}
                                readOnly={readOnly}
                                onChange={handleOnToggleableChange}
                                placeholder={0}
                                type={'number'}
                            />
                        </Form.Field>
                        <Form.Field width={1}>
                            <label>&nbsp;</label>
                            <InfoPopup
                                description={documentation.rct.srconc}
                                title={'SRCONC'}
                                position={'top right'}
                                iconOutside={true}
                            />
                        </Form.Field>
                    </Form.Group>
                </Segment>
                <Segment>
                    {mtPackage.isothm > 0 &&
                    <Form.Group>
                        <Form.Field width={7}>
                            <label>First parameter (SP1)</label>
                            <ToggleableInput
                                name={'sp1'}
                                value={mtPackage.sp1}
                                readOnly={readOnly}
                                onChange={handleOnToggleableChange}
                                placeholder={0}
                                type={'number'}
                            />
                        </Form.Field>
                        <Form.Field width={1}>
                            <label>&nbsp;</label>
                            <InfoPopup
                                description={documentation.rct.sp1}
                                title={'SP1'}
                                position={'top left'}
                                iconOutside={true}
                            />
                        </Form.Field>
                        <Form.Field width={7}>
                            <label>Second parameter (SP2)</label>
                            <ToggleableInput
                                name={'sp2'}
                                value={mtPackage.sp2}
                                readOnly={readOnly}
                                onChange={handleOnToggleableChange}
                                placeholder={0}
                                type={'number'}
                            />
                        </Form.Field>
                        <Form.Field width={1}>
                            <label>&nbsp;</label>
                            <InfoPopup
                                description={documentation.rct.sp2}
                                title={'SP2'}
                                position={'top right'}
                                iconOutside={true}
                            />
                        </Form.Field>
                    </Form.Group>
                    }
                    {mtPackage.ireact > 0 &&
                    <Form.Group>
                        <Form.Field width={7}>
                            <label>Dissolved phase reaction rate (RC1)</label>
                            <ToggleableInput
                                name={'rc1'}
                                value={mtPackage.rc1}
                                readOnly={readOnly}
                                onChange={handleOnToggleableChange}
                                placeholder={0}
                                type={'number'}
                            />
                        </Form.Field>
                        <Form.Field width={1}>
                            <label>&nbsp;</label>
                            <InfoPopup
                                description={documentation.rct.rc1}
                                title={'RC1'}
                                position={'top left'}
                                iconOutside={true}
                            />
                        </Form.Field>
                        <Form.Field width={7}>
                            <label>Sorbed phase reaction rate (RC2)</label>
                            <ToggleableInput
                                name={'rc2'}
                                value={mtPackage.rc2}
                                readOnly={readOnly}
                                onChange={handleOnToggleableChange}
                                placeholder={0}
                                type={'number'}
                            />
                        </Form.Field>
                        <Form.Field width={1}>
                            <label>&nbsp;</label>
                            <InfoPopup
                                description={documentation.rct.rc2}
                                title={'RC2'}
                                position={'top right'}
                                iconOutside={true}
                            />
                        </Form.Field>
                    </Form.Group>
                    }
                </Segment>
            </Segment.Group>
        </Form>
    );

};

export default RctPackageProperties;
