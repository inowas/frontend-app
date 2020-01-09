import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {DropdownProps, Form, Header, Input, PopupProps, Segment} from 'semantic-ui-react';

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
    const handleOnSelect = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const {name, value} = data;
        setMfPackage({...mfPackage, [name]: value});
        props.onChange(FlopyModflowMfgmg.fromObject({...mfPackage, [name]: value}));
    };

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        return setMfPackage({...mfPackage, [name]: value});
    };

    const handleOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        props.onChange(FlopyModflowMfgmg.fromObject({...mfPackage, [name]: value}));
    };

    const renderInfoPopup = (
        description: string | JSX.Element,
        title: string,
        position: PopupProps['position'] | undefined = undefined,
        iconOutside: boolean | undefined = undefined
    ) => (
        <InfoPopup description={description} title={title} position={position} iconOutside={iconOutside}/>
    );

    const readOnly = props.readonly;

    if (!props.mfPackage) {
        return null;
    }

    return (
        <Form>
            <Header as={'h3'}>GMG: Geometric Multigrid Solver Package</Header>
            <Segment>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Inner convergence residual (RCLOSE)</label>
                        <Input
                            readOnly={readOnly}
                            name="rclose"
                            value={mfPackage.rclose}
                            icon={renderInfoPopup(documentation.gmg.rclose, 'RCLOSE')}
                            onBlur={handleOnBlur}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Maximum inner iterations (IITER)</label>
                        <Input
                            readOnly={readOnly}
                            name={'iiter'}
                            value={mfPackage.iiter}
                            icon={renderInfoPopup(documentation.gmg.iiter, 'IITER')}
                            onBlur={handleOnBlur}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                <Form.Field>
                    <label>Outer convergence residual (HCLOSE)</label>
                    <Input
                        readOnly={readOnly}
                        name="hclose"
                        value={mfPackage.hclose}
                        icon={renderInfoPopup(documentation.gmg.hclose, 'HCLOSE')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Maximum outer iterations (MXITER)</label>
                    <Input
                        type={'number'}
                        readOnly={readOnly}
                        name={'mxiter'}
                        value={mfPackage.mxiter}
                        icon={renderInfoPopup(documentation.gmg.mxiter, 'MXITER')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
            </Segment>
            <Segment>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Damping parameter (DAMP)</label>
                        <Input
                            readOnly={readOnly}
                            name="damp"
                            value={mfPackage.damp}
                            icon={renderInfoPopup(documentation.gmg.damp, 'DAMP')}
                            onBlur={handleOnBlur}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field width={14}>
                        <label>Damping option (IADAMP)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 1, text: '(0) Constant'},
                                {key: 1, value: 2, text: '(1) Cooley adaptive'},
                                {key: 2, value: 3, text: '(2) RRR adaptive'},
                            ]}
                            selection={true}
                            disabled={readOnly}
                            name="iadamp"
                            value={mfPackage.iadamp}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {renderInfoPopup(documentation.gmg.iadamp, 'IADAMP', 'top left', true)}
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Output flag (IOUTGMG)</label>
                        <Input
                            readOnly={readOnly}
                            name="ioutgmg"
                            value={mfPackage.ioutgmg}
                            icon={renderInfoPopup(documentation.gmg.ioutgmg, 'IOUTGMG')}
                            onBlur={handleOnBlur}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Maximum head output (IUNITMHC)</label>
                        <Input
                            readOnly={readOnly}
                            name="iunitmhc"
                            value={mfPackage.iunitmhc}
                            icon={renderInfoPopup(documentation.gmg.iunitmhc, 'IUNITMHC')}
                            onBlur={handleOnBlur}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
            <Segment>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Multi-grid preconditioner smoothing (ISM)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 1, text: '(0) ILU smoothing'},
                                {key: 1, value: 2, text: '(1) SGS smoothing'}
                            ]}
                            selection={true}
                            disabled={readOnly}
                            name="ism"
                            value={mfPackage.ism}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {renderInfoPopup(documentation.gmg.ism, 'ISM', 'top left', true)}
                    </Form.Field>
                    <Form.Field>
                        <label>Multi-grid preconditioner coarsening (ISC)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 1, text: '(0) Row, Col., Layer'},
                                {key: 1, value: 2, text: '(1) Row, Col.'},
                                {key: 2, value: 3, text: '(2) Col., Layer'},
                                {key: 3, value: 4, text: '(3) Row, Layer'},
                                {key: 4, value: 5, text: '(4) None'}
                            ]}
                            selection={true}
                            disabled={readOnly}
                            name="isc"
                            value={mfPackage.isc}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {renderInfoPopup(documentation.gmg.isc, 'ISC', 'top left', true)}
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Maximum damping (DUP)</label>
                        <Input
                            readOnly={readOnly}
                            name="dup"
                            value={mfPackage.dup}
                            icon={renderInfoPopup(documentation.gmg.dup, 'DUP')}
                            onBlur={handleOnBlur}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Minimum damping (DLOW)</label>
                        <Input
                            readOnly={readOnly}
                            name="dlow"
                            value={mfPackage.dlow}
                            icon={renderInfoPopup(documentation.gmg.dlow, 'DLOW')}
                            onBlur={handleOnBlur}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Relocation parameter (RELAX)</label>
                        <Input
                            readOnly={readOnly}
                            name="relax"
                            value={mfPackage.relax}
                            icon={renderInfoPopup(documentation.gmg.relax, 'RELAX')}
                            onBlur={handleOnBlur}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Minimum damping (CHGLIMIT)</label>
                        <Input
                            readOnly={readOnly}
                            name="chglimit"
                            value={mfPackage.chglimit}
                            icon={renderInfoPopup(documentation.gmg.chglimit, 'CHGLIMIT')}
                            onBlur={handleOnBlur}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
            <Segment>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Filename extension (extension)</label>
                        <Input
                            readOnly={true}
                            name="extension"
                            value={mfPackage.extension || ''}
                            icon={renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input
                            readOnly={true}
                            name="unitnumber"
                            value={mfPackage.unitnumber || ''}
                            icon={renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
                        <Input
                            readOnly={true}
                            name="filenames"
                            value={mfPackage.filenames || ''}
                            icon={renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
        </Form>
    );
};

export default gmgPackageProperties;
