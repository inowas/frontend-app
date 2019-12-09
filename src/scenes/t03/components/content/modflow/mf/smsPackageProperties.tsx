import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {DropdownProps, Form, Input, PopupProps, Segment} from 'semantic-ui-react';

import {FlopyModflowMfsms} from '../../../../../../core/model/flopy/packages/mf';
import {IFlopyModflowMfsms} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfsms';
import {InfoPopup} from '../../../../../shared';
import {documentation} from '../../../../defaults/flow';

const styles = {
    headerLabel: {
        color: 'rgba(0,0,0,.95)',
        display: 'block',
        fontWeight: 700,
        marginBottom: '0.5em'
    }
};

interface IProps {
    mfPackage: FlopyModflowMfsms;
    onChange: (pck: FlopyModflowMfsms) => void;
    readonly: boolean;
}

const smsPackageProperties = (props: IProps) => {

    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfsms>(props.mfPackage.toObject());
    const handleOnSelect = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const {name, value} = data;
        setMfPackage({...mfPackage, [name]: value});
        props.onChange(FlopyModflowMfsms.fromObject({...mfPackage, [name]: value}));
    };

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        return setMfPackage({...mfPackage, [name]: value});
    };

    const handleOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        props.onChange(FlopyModflowMfsms.fromObject({...mfPackage, [name]: value}));
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
            <Form.Group widths="equal">
                <Form.Field>
                    <label>Max head change between outer iterations (L)(HCLOSE)</label>
                    <Input
                        type={'number'}
                        readOnly={readOnly}
                        name={'hclose'}
                        value={mfPackage.hclose}
                        icon={renderInfoPopup(documentation.sms.hclose, 'HCLOSE')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Max head change between inner iterations (L)(HICLOSE)</label>
                    <Input
                        type={'number'}
                        readOnly={readOnly}
                        name={'hiclose'}
                        value={mfPackage.hiclose}
                        icon={renderInfoPopup(documentation.sms.hiclose, 'HICLOSE')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
                <Form.Field>
                    <label>Max number of outer nonlinear iterations for problem (MXITER)</label>
                    <Input
                        type={'number'}
                        readOnly={readOnly}
                        name={'mxiter'}
                        value={mfPackage.mxiter}
                        icon={renderInfoPopup(documentation.sms.mxiter, 'MXITER')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Max number of inner linear iterations for problem (ITER1)</label>
                    <Input
                        type={'number'}
                        readOnly={readOnly}
                        name={'iter1'}
                        value={mfPackage.iter1}
                        icon={renderInfoPopup(documentation.sms.iter1, 'ITER1')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
                <Form.Field>
                    <label>Print additional info to listing file (IPRSMS)</label>
                    <Form.Dropdown
                        options={[
                            {key: 0, value: 1, text: '(0) print nothing'},
                            {key: 1, value: 2, text: '(1) print summary'},
                            {key: 2, value: 3, text: '(2) print detail'},
                        ]}
                        selection={true}
                        disabled={readOnly}
                        name={'iprsms'}
                        value={mfPackage.iprsms}
                        onChange={handleOnSelect}
                    />
                </Form.Field>
                <Form.Field width={1}>
                    <label>&nbsp;</label>
                    {renderInfoPopup(documentation.sms.iprsms, 'IPRSMS', 'top left', true)}
                </Form.Field>
                <Form.Field>
                    <label>Nonlinear solution method (NONLINMETH)</label>
                    <Form.Dropdown
                        options={[
                            {key: 0, value: 1, text: '(-2) Picard with Cooley'},
                            {key: 1, value: 2, text: '(-1) Picard with Delta-Bar-Delta'},
                            {key: 2, value: 3, text: '(0) Picard'},
                            {key: 3, value: 4, text: '(1) Newton with Delta-Bar-Delta'},
                            {key: 4, value: 5, text: '(2) Newton and Cooley'}
                        ]}
                        selection={true}
                        disabled={readOnly}
                        name={'nonlinmeth'}
                        value={mfPackage.nonlinmeth}
                        onChange={handleOnSelect}
                    />
                </Form.Field>
                <Form.Field width={1}>
                    <label>&nbsp;</label>
                    {renderInfoPopup(documentation.sms.nonlinmeth, 'NONLINMETH', 'top left', true)}
                </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
                <Form.Field>
                    <label>Linear matrix solver (LINMETH)</label>
                    <Form.Dropdown
                        options={[
                            {key: 0, value: 1, text: '(0) χMD'},
                            {key: 1, value: 2, text: '(1) PCGU'},
                            {key: 2, value: 3, text: '(2) SAMG'},
                        ]}
                        selection={true}
                        disabled={readOnly}
                        name={'linmeth'}
                        value={mfPackage.linmeth}
                        onChange={handleOnSelect}
                    />
                </Form.Field>
                <Form.Field width={1}>
                    <label>&nbsp;</label>
                    {renderInfoPopup(documentation.sms.linmeth, 'LINMETH', 'top left', true)}
                </Form.Field>
                <Form.Field>
                    <label>Options</label>
                    <Input
                        type={'options'}
                        readOnly={readOnly}
                        name={'options'}
                        value={mfPackage.options}
                        icon={renderInfoPopup(documentation.sms.options, 'OPTIONS')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
            <Segment>
                <label style={styles.headerLabel}>Nonlinear Solution Method Options</label>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Delta-bar-delta learning rate reduction factor (THETA)</label>
                        <Input
                            readOnly={true}
                            name="theta"
                            value={mfPackage.theta || ''}
                            icon={renderInfoPopup(documentation.sms.theta, 'THETA')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Delta-bar-delta learning rate increment (AKAPPA)</label>
                        <Input
                            readOnly={true}
                            name="akappa"
                            value={mfPackage.akappa || ''}
                            icon={renderInfoPopup(documentation.sms.akappa, 'AKAPPA')}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Delta-bar-delta memory term factor (GAMA)</label>
                        <Input
                            readOnly={true}
                            name="gamma"
                            value={mfPackage.gamma || ''}
                            icon={renderInfoPopup(documentation.sms.gamma, 'GAMA')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Nonlinear fraction history added (AMOMENTUM)</label>
                        <Input
                            readOnly={true}
                            name="amomentum"
                            value={mfPackage.amomentum || ''}
                            icon={renderInfoPopup(documentation.sms.amomentum, 'AMOMENTUM')}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Maximum residual backtracking iterations (NUMTRACK)</label>
                        <Input
                            readOnly={true}
                            name="numtrack"
                            value={mfPackage.numtrack || ''}
                            icon={renderInfoPopup(documentation.sms.numtrack, 'NUMTRACK')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Residual change tolerance (BTOL)</label>
                        <Input
                            readOnly={true}
                            name="btol"
                            value={mfPackage.btol || ''}
                            icon={renderInfoPopup(documentation.sms.btol, 'BTOL')}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Residual change reduction size (BREDUC)</label>
                        <Input
                            readOnly={true}
                            name="breduc"
                            value={mfPackage.breduc || ''}
                            icon={renderInfoPopup(documentation.sms.breduc, 'BREDUC')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Residual reduction limit (RESLIM)</label>
                        <Input
                            readOnly={true}
                            name="reslim"
                            value={mfPackage.reslim || ''}
                            icon={renderInfoPopup(documentation.sms.reslim, 'RESLIM')}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
            <Segment>
                <label style={styles.headerLabel}>χMD Options</label>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Acceleration method (IACL)</label>
                        <Input
                            readOnly={true}
                            name="iacl"
                            value={mfPackage.iacl || ''}
                            icon={renderInfoPopup(documentation.sms.iacl, 'IACL')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Ordering scheme (NORDER)</label>
                        <Input
                            readOnly={true}
                            name="norder"
                            value={mfPackage.norder || ''}
                            icon={renderInfoPopup(documentation.sms.norder, 'NORDER')}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>ILU decomposition level of fill (LEVEL)</label>
                        <Input
                            readOnly={true}
                            name="level"
                            value={mfPackage.level || ''}
                            icon={renderInfoPopup(documentation.sms.level, 'LEVEL')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Number of orthogonalizations for ORTHOMIN accel. (NORTH)</label>
                        <Input
                            readOnly={true}
                            name="north"
                            value={mfPackage.north || ''}
                            icon={renderInfoPopup(documentation.sms.north, 'NORTH')}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Reduced system (IREDSYS)</label>
                        <Input
                            readOnly={true}
                            name="iredsys"
                            value={mfPackage.iredsys || ''}
                            icon={renderInfoPopup(documentation.sms.iredsys, 'IREDSYS')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Residual tolerance criterion (RRCTOL)</label>
                        <Input
                            readOnly={true}
                            name="rrctol"
                            value={mfPackage.rrctol || ''}
                            icon={renderInfoPopup(documentation.sms.rrctol, 'RRCTOL')}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Perform drop tolerance (IDROPTOL)</label>
                        <Input
                            readOnly={true}
                            name="idroptol"
                            value={mfPackage.idroptol || ''}
                            icon={renderInfoPopup(documentation.sms.idroptol, 'IDROPTOL')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Drop tolerance value (EPSRN)</label>
                        <Input
                            readOnly={true}
                            name="epsrn"
                            value={mfPackage.epsrn || ''}
                            icon={renderInfoPopup(documentation.sms.epsrn, 'EPSRN')}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
            <Segment>
                <label style={styles.headerLabel}>PCGU Options</label>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Linear acceleration method (CLIN)</label>
                        <Input
                            readOnly={true}
                            name="clin"
                            value={mfPackage.clin || ''}
                            icon={renderInfoPopup(documentation.sms.clin, 'CLIN')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Preconditioner (IPC)</label>
                        <Input
                            readOnly={true}
                            name="ipc"
                            value={mfPackage.ipc || ''}
                            icon={renderInfoPopup(documentation.sms.ipc, 'IPC')}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Matrix scaling approach (ISCL)</label>
                        <Input
                            readOnly={true}
                            name="iscl"
                            value={mfPackage.iscl || ''}
                            icon={renderInfoPopup(documentation.sms.iscl, 'ISCL')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Matrix reordering approach (IORD)</label>
                        <Input
                            readOnly={true}
                            name="iord"
                            value={mfPackage.iord || ''}
                            icon={renderInfoPopup(documentation.sms.iord, 'IORD')}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Convergence flow residual tolerance (L^3)(RCLOSEPCGU)</label>
                        <Input
                            readOnly={true}
                            name="rclosepcgu"
                            value={mfPackage.rclosepcgu || ''}
                            icon={renderInfoPopup(documentation.sms.rclosepcgu, 'RCLOSEPCGU')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>MILU(0) relaxation factor (RELAXPCGU)</label>
                        <Input
                            readOnly={true}
                            name="relaxpcgu"
                            value={mfPackage.relaxpcgu || ''}
                            icon={renderInfoPopup(documentation.sms.relaxpcgu, 'RELAXPCGU')}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Perform drop tolerance (IDROPTOL)</label>
                        <Input
                            readOnly={true}
                            name="idroptol"
                            value={mfPackage.idroptol || ''}
                            icon={renderInfoPopup(documentation.sms.idroptol, 'IDROPTOL')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Drop tolerance value (EPSRN)</label>
                        <Input
                            readOnly={true}
                            name="epsrn"
                            value={mfPackage.epsrn || ''}
                            icon={renderInfoPopup(documentation.sms.epsrn, 'EPSRN')}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
        </Form>
    );
};

export default smsPackageProperties;
