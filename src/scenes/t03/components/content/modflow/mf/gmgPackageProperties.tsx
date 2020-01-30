import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {DropdownProps, Form, Header, Input, Segment} from 'semantic-ui-react';

import {FlopyModflowMfgmg} from '../../../../../../core/model/flopy/packages/mf';
import {IFlopyModflowMfgmg} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfgmg';
import {InfoPopup} from '../../../../../shared';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModflowMfgmg;
    onChange: (pck: FlopyModflowMfgmg) => void;
    readonly: boolean;
}

const gmgPackageProperties = (props: IProps) => {

    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfgmg>(props.mfPackage.toObject());
    const {readonly} = props;

    const handleOnSelect = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const {name, value} = data;
        setMfPackage({...mfPackage, [name]: value});
        props.onChange(FlopyModflowMfgmg.fromObject({...mfPackage, [name]: value}));
    };

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        return setMfPackage({...mfPackage, [name]: value});
    };

    const handleOnBlur = (cast?: (v: any) => any) => (e: ChangeEvent<HTMLInputElement>) => {
        const {name} = e.target;
        let {value} = e.target;

        if (cast) {
            value = cast(value);
        }

        setMfPackage({...mfPackage, [name]: value});
        props.onChange(FlopyModflowMfgmg.fromObject({...mfPackage, [name]: value}));
    };
    const readOnly = props.readonly;

    if (!props.mfPackage) {
        return null;
    }

    return (
        <Form>
            <Header as={'h3'}>GMG: Geometric Multigrid Solver Package</Header>
            <Segment>
                <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Inner convergence residual (RCLOSE)</label>
                        <Input
                            readOnly={readonly}
                            name={'rclose'}
                            type={'number'}
                            value={mfPackage.rclose}
                            icon={<InfoPopup description={documentation.gmg.rclose} title={'RCLOSE'}/>}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Maximum inner iterations (IITER)</label>
                        <Input
                            readOnly={readonly}
                            name={'iiter'}
                            type={'number'}
                            value={mfPackage.iiter}
                            icon={<InfoPopup description={documentation.gmg.iiter} title={'IITER'}/>}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Outer convergence residual (HCLOSE)</label>
                        <Input
                            readOnly={readonly}
                            name={'hclose'}
                            type={'number'}
                            value={mfPackage.hclose}
                            icon={<InfoPopup description={documentation.gmg.hclose} title={'HCLOSE'}/>}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Maximum outer iterations (MXITER)</label>
                        <Input
                            readOnly={readonly}
                            name={'mxiter'}
                            type={'number'}
                            value={mfPackage.mxiter}
                            icon={<InfoPopup description={documentation.gmg.mxiter} title={'MXITER'}/>}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Relocation parameter (RELAX)</label>
                        <Input
                            readOnly={readonly}
                            name={'relax'}
                            type={'number'}
                            value={mfPackage.relax}
                            icon={<InfoPopup description={documentation.gmg.relax} title={'RELAX'}/>}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field width={14}>
                        <label>Damping option (IADAMP)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: '(0) Constant'},
                                {key: 1, value: 1, text: '(1) Cooley adaptive'},
                                {key: 2, value: 2, text: '(2) RRR adaptive'},
                            ]}
                            selection={true}
                            disabled={readonly}
                            name={'iadamp'}
                            value={mfPackage.iadamp}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.gmg.iadamp}
                            title={'IADAMP'}
                            position={'top left'}
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
            <Segment>
                <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Output flag (IOUTGMG)</label>
                        <Input
                            readOnly={readonly}
                            name={'ioutgmg'}
                            type={'number'}
                            value={mfPackage.ioutgmg}
                            icon={<InfoPopup description={documentation.gmg.ioutgmg} title={'IOUTGMG'}/>}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Maximum head output (IUNITMHC)</label>
                        <Input
                            readOnly={readonly}
                            name={'iunitmhc'}
                            type={'number'}
                            value={mfPackage.iunitmhc || 0}
                            icon={<InfoPopup description={documentation.gmg.iunitmhc} title={'IUNITMHC'}/>}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Multi-grid preconditioner smoothing (ISM)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: '(0) ILU smoothing'},
                                {key: 1, value: 1, text: '(1) SGS smoothing'}
                            ]}
                            selection={true}
                            disabled={readOnly}
                            name={'ism'}
                            value={mfPackage.ism}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.gmg.ism}
                            title={'ISM'}
                            position={'top left'}
                            iconOutside={true}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Multi-grid preconditioner coarsening (ISC)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: '(0) Row, Col., Layer'},
                                {key: 1, value: 1, text: '(1) Row, Col.'},
                                {key: 2, value: 2, text: '(2) Col., Layer'},
                                {key: 3, value: 3, text: '(3) Row, Layer'},
                                {key: 4, value: 4, text: '(4) None'}
                            ]}
                            selection={true}
                            disabled={readonly}
                            name={'isc'}
                            value={mfPackage.isc}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.gmg.isc}
                            title={'ISC'}
                            position={'top left'}
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Maximum damping (DUP)</label>
                        <Input
                            name={'dup'}
                            readOnly={readonly}
                            type={'number'}
                            value={mfPackage.dup}
                            icon={<InfoPopup description={documentation.gmg.dup} title={'DUP'}/>}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Minimum damping (DLOW)</label>
                        <Input
                            name={'dlow'}
                            readOnly={readonly}
                            type={'number'}
                            value={mfPackage.dlow}
                            icon={<InfoPopup description={documentation.gmg.dlow} title={'DLOW'}/>}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Damping parameter (DAMP)</label>
                        <Input
                            readOnly={readonly}
                            name={'damp'}
                            type={'number'}
                            value={mfPackage.damp}
                            icon={<InfoPopup description={documentation.gmg.damp} title={'DAMP'}/>}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Minimum damping (CHGLIMIT)</label>
                        <Input
                            readOnly={readonly}
                            name={'chglimit'}
                            type={'number'}
                            value={mfPackage.chglimit}
                            icon={<InfoPopup description={documentation.gmg.chglimit} title={'CHGLIMIT'}/>}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
            <Segment>
                <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Filename extension (EXTENSION)</label>
                        <Input
                            readOnly={readonly}
                            name={'extension'}
                            value={mfPackage.extension}
                            icon={<InfoPopup description={documentation.gmg.extension} title={'EXTENSION'}/>}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (UNITNUMBER)</label>
                        <Input
                            readOnly={readonly}
                            name={'unitnumber'}
                            type={'number'}
                            value={mfPackage.unitnumber || ''}
                            icon={<InfoPopup description={documentation.gmg.unitnumber} title={'UNITNUMBER'}/>}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (FILENAMES)</label>
                        <Input
                            readOnly={readonly}
                            name={'filenames'}
                            value={mfPackage.filenames || ''}
                            icon={<InfoPopup description={documentation.gmg.filenames} title={'FILENAMES'}/>}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
        </Form>
    );
};

export default gmgPackageProperties;
