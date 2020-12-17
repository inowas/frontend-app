import {
    Checkbox,
    CheckboxProps,
    DropdownProps,
    Form,
    Grid,
    Header,
    Input,
    PopupProps,
    Segment
} from 'semantic-ui-react';
import {FlopyModflowMfsms} from '../../../../../../core/model/flopy/packages/mf';
import {IFlopyModflowMfsms} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfsms';
import {InfoPopup} from '../../../../../shared';
import {documentation} from '../../../../defaults/flow';
import React, {ChangeEvent, FormEvent, SyntheticEvent, useState} from 'react';

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

const SmsPackageProperties = (props: IProps) => {

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

    const handleOnChangeCheckbox = (e: FormEvent<HTMLInputElement>, {checked, name}: CheckboxProps) => {
        if (typeof name === 'string') {
            setMfPackage({...mfPackage, [name]: checked ? 1 : 0});
            props.onChange(FlopyModflowMfsms.fromObject({...mfPackage, [name]: checked ? 1 : 0}));
        }
    };

    const handleOnBlur = (cast?: (v: any) => any) => (e: ChangeEvent<HTMLInputElement>) => {
        const {name} = e.target;
        let {value} = e.target;

        if (cast) {
            value = cast(value);
        }

        setMfPackage({...mfPackage, [name]: value});
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
            <Header as={'h3'}>SMS: Sparse Matrix Solver Package</Header>
            <Form.Group>
                <Form.Field width={15}>
                    <label>Pre-defined input values (OPTIONS)</label>
                    <Form.Dropdown
                        options={[
                            {key: 0, value: 0, text: 'SIMPLE'},
                            {key: 1, value: 1, text: 'MODERATE'},
                            {key: 2, value: 2, text: 'COMPLEX'},
                            {key: 3, value: 3, text: 'CUSTOM'}
                        ]}
                        selection={true}
                        name={'options'}
                        onChange={handleOnSelect}
                        disabled={readOnly}
                    />
                </Form.Field>
                <Form.Field width={1}>
                    <label>&nbsp;</label>
                    <InfoPopup
                        description={documentation.sms.options}
                        title="OPTIONS"
                        position="top right"
                        iconOutside={true}
                    />
            </Form.Field>
            </Form.Group>
            <Segment>
                <Grid>
                    <Grid.Row columns={2} divided={true}>
                        <Grid.Column>
                            <Form.Field>
                                <label>Head change criterion (HCLOSE)</label>
                                <Input
                                    name={'hclose'}
                                    readOnly={readOnly}
                                    type={'number'}
                                    value={mfPackage.hclose}
                                    icon={renderInfoPopup(documentation.sms.hclose, 'HCLOSE')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Head change criterion for convergence (HICLOSE)</label>
                                <Input
                                    name={'hiclose'}
                                    readOnly={readOnly}
                                    type={'number'}
                                    value={mfPackage.hiclose}
                                    icon={renderInfoPopup(documentation.sms.hiclose, 'HICLOSE')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Max. outer iterations (MXITER)</label>
                                <Input
                                    name={'mxiter'}
                                    readOnly={readOnly}
                                    type={'number'}
                                    value={mfPackage.mxiter}
                                    icon={renderInfoPopup(documentation.sms.mxiter, 'MXITER')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Max. inner iterations (ITER1)</label>
                                <Input
                                    name={'iter1'}
                                    readOnly={readOnly}
                                    type={'number'}
                                    value={mfPackage.iter1}
                                    icon={renderInfoPopup(documentation.sms.iter1, 'ITER1')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Group>
                                <Form.Field width={14}>
                                    <label>Print convergence info (IPRSMS)</label>
                                    <Form.Dropdown
                                        options={[
                                            {key: 0, value: 0, text: '(0) Print nothing'},
                                            {key: 1, value: 1, text: '(1) Print summary'},
                                            {key: 2, value: 2, text: '(2) Print detail'},
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
                            </Form.Group>
                            <Form.Group>
                                <Form.Field width={14}>
                                    <label>Nonlinear solution method (NONLINMETH)</label>
                                    <Form.Dropdown
                                        options={[
                                            {key: -2, value: -2, text: '(-2) Picard with Cooley'},
                                            {key: -1, value: -1, text: '(-1) Picard with Delta-Bar-Delta'},
                                            {key: 0, value: 0, text: '(0) Picard'},
                                            {key: 1, value: 1, text: '(1) Newton with Delta-Bar-Delta'},
                                            {key: 2, value: 2, text: '(2) Newton and Cooley'}
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
                            <Form.Group>
                                <Form.Field width={14}>
                                    <label>Linear matrix solver (LINMETH)</label>
                                    <Form.Dropdown
                                        options={[
                                            {key: 0, value: 0, text: '(0) χMD'},
                                            {key: 1, value: 1, text: '(1) PCGU'},
                                            {key: 2, value: 2, text: '(2) SAMG'},
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
                            </Form.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>

            <Segment>
                <label style={styles.headerLabel}>Nonlinear Solution Method Options</label>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Delta-bar-delta learning rate reduction factor (THETA)</label>
                        <Input
                            readOnly={readOnly}
                            type="number"
                            name="theta"
                            value={mfPackage.theta || ''}
                            icon={renderInfoPopup(documentation.sms.theta, 'THETA')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Delta-bar-delta learning rate increment (AKAPPA)</label>
                        <Input
                            readOnly={readOnly}
                            type="number"
                            name="akappa"
                            value={mfPackage.akappa || ''}
                            icon={renderInfoPopup(documentation.sms.akappa, 'AKAPPA')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Delta-bar-delta memory term factor (GAMA)</label>
                        <Input
                            readOnly={readOnly}
                            type="number"
                            name="gamma"
                            value={mfPackage.gamma || ''}
                            icon={renderInfoPopup(documentation.sms.gamma, 'GAMA')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Fraction of past history added (AMOMENTUM)</label>
                        <Input
                            readOnly={readOnly}
                            type="number"
                            name="amomentum"
                            value={mfPackage.amomentum || ''}
                            icon={renderInfoPopup(documentation.sms.amomentum, 'AMOMENTUM')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Backtracking Iterations Allowed (NUMTRACK)</label>
                        <Input
                            readOnly={readOnly}
                            type="number"
                            name="numtrack"
                            value={mfPackage.numtrack || ''}
                            icon={renderInfoPopup(documentation.sms.numtrack, 'NUMTRACK')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Residual change tolerance (BTOL)</label>
                        <Input
                            readOnly={readOnly}
                            type="number"
                            name="btol"
                            value={mfPackage.btol || ''}
                            icon={renderInfoPopup(documentation.sms.btol, 'BTOL')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Step Size Reduction (BREDUC)</label>
                        <Input
                            readOnly={readOnly}
                            type="number"
                            name="breduc"
                            value={mfPackage.breduc || ''}
                            icon={renderInfoPopup(documentation.sms.breduc, 'BREDUC')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Residual reduction limit (RESLIM)</label>
                        <Input
                            readOnly={readOnly}
                            type="number"
                            name="reslim"
                            value={mfPackage.reslim || ''}
                            icon={renderInfoPopup(documentation.sms.reslim, 'RESLIM')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
            <Segment>
                <label style={styles.headerLabel}>χMD Options</label>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Acceleration method (IACL)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: '(0) Conjugate Gradient'},
                                {key: 1, value: 1, text: '(1) ORTHOMIN'},
                                {key: 2, value: 2, text: '(2) BiCGSTAB'},
                            ]}
                            selection={true}
                            disabled={readOnly}
                            name={'iacl'}
                            value={mfPackage.iacl}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {renderInfoPopup(documentation.sms.iacl, 'IACL', 'top left', true)}
                    </Form.Field>
                    <Form.Field>
                        <label>Ordering scheme (NORDER)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: '(0) Original ordering'},
                                {key: 1, value: 1, text: '(1) Reverse Cuthill McKee ordering'},
                                {key: 2, value: 2, text: '(2) Minimum degree ordering'},
                            ]}
                            selection={true}
                            disabled={readOnly}
                            name={'norder'}
                            value={mfPackage.norder}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {renderInfoPopup(documentation.sms.norder, 'NORDER', 'top left', true)}
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Fill Level for ILU Decomposition (LEVEL)</label>
                        <Input
                            readOnly={readOnly}
                            type="number"
                            name="level"
                            value={mfPackage.level}
                            icon={renderInfoPopup(documentation.sms.level, 'LEVEL')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Number of orthogonalizations (NORTH)</label>
                        <Input
                            readOnly={readOnly}
                            type="number"
                            name="north"
                            value={mfPackage.north}
                            icon={renderInfoPopup(documentation.sms.north, 'NORTH')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Reduced system index (IREDSYS)</label>
                        <Checkbox
                            toggle={true}
                            readOnly={false}
                            name="iredsys"
                            checked={mfPackage.iredsys === 1}
                            icon={renderInfoPopup(documentation.sms.iredsys, 'IREDSYS')}
                            onChange={handleOnChangeCheckbox}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Residual tolerance criterion (RRCTOL)</label>
                        <Input
                            readOnly={readOnly}
                            type="number"
                            name="rrctol"
                            value={mfPackage.rrctol}
                            icon={renderInfoPopup(documentation.sms.rrctol, 'RRCTOL')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Perform drop tolerance (IDROPTOL)</label>
                        <Checkbox
                            toggle={true}
                            readOnly={false}
                            name="idroptol"
                            checked={mfPackage.idroptol === 1}
                            icon={renderInfoPopup(documentation.sms.idroptol, 'IDROPTOL')}
                            onChange={handleOnChangeCheckbox}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Drop tolerance value (EPSRN)</label>
                        <Input
                            readOnly={readOnly}
                            type="number"
                            name="epsrn"
                            value={mfPackage.epsrn}
                            icon={renderInfoPopup(documentation.sms.epsrn, 'EPSRN')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
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
                            readOnly={readOnly}
                            type="number"
                            name="clin"
                            value={mfPackage.clin}
                            icon={renderInfoPopup(documentation.sms.clin, 'CLIN')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Preconditioner (IPC)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: '(0) No preconditioning'},
                                {key: 1, value: 1, text: '(1) Jacobi preconditioning'},
                                {key: 2, value: 2, text: '(2) ILU(0) preconditioning'},
                                {key: 3, value: 3, text: '(3) MILU(0) preconditioning'}
                            ]}
                            selection={true}
                            disabled={readOnly}
                            name={'ipc'}
                            value={mfPackage.ipc}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {renderInfoPopup(documentation.sms.ipc, 'IPC', 'top left', true)}
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field width={14}>
                        <label>Matrix scaling approach (ISCL)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: '(0) No matrix scaling applied'},
                                {key: 1, value: 1, text: '(1) Symmetric matrix scaling (POLCG)'},
                                {key: 2, value: 2, text: '(2) Symmetric matrix scaling (L-squared norm)'}
                            ]}
                            selection={true}
                            disabled={readOnly}
                            name={'iscl'}
                            value={mfPackage.iscl}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {renderInfoPopup(documentation.sms.iscl, 'ISCL', 'top left', true)}
                    </Form.Field>
                    <Form.Field>
                        <label>Matrix reordering approach (IORD)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: '(0) Original ordering'},
                                {key: 1, value: 1, text: '(1) Reverse Cuthill McKee ordering'},
                                {key: 2, value: 2, text: '(2) Minimum degree ordering'}
                            ]}
                            selection={true}
                            disabled={readOnly}
                            name={'iord'}
                            value={mfPackage.iord}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {renderInfoPopup(documentation.sms.iord, 'IORD', 'top left', true)}
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Convergence flow residual tolerance (RCLOSEPCGU)</label>
                        <Input
                            readOnly={readOnly}
                            type="number"
                            name="rclosepcgu"
                            value={mfPackage.rclosepcgu}
                            icon={renderInfoPopup(documentation.sms.rclosepcgu, 'RCLOSEPCGU')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>MILU(0) relaxation factor (RELAXPCGU)</label>
                        <Input
                            readOnly={readOnly}
                            type="number"
                            name="relaxpcgu"
                            value={mfPackage.relaxpcgu}
                            icon={renderInfoPopup(documentation.sms.relaxpcgu, 'RELAXPCGU')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
        </Form>
    );
};

export default SmsPackageProperties;
