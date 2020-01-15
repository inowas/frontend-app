import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {Checkbox, DropdownProps, Form, Grid, Input, PopupProps, Segment} from 'semantic-ui-react';

import {FlopyModflowMfnwt} from '../../../../../../core/model/flopy/packages/mf';
import {IFlopyModflowMfnwt} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfnwt';
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
    mfPackage: FlopyModflowMfnwt;
    onChange: (pck: FlopyModflowMfnwt) => void;
    readonly: boolean;
}

const nwtPackageProperties = (props: IProps) => {

    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfnwt>(props.mfPackage.toObject());

    const handleOnSelect = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const {name, value} = data;
        setMfPackage({...mfPackage, [name]: value});
        props.onChange(FlopyModflowMfnwt.fromObject({...mfPackage, [name]: value}));
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
        props.onChange(FlopyModflowMfnwt.fromObject({...mfPackage, [name]: value}));
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
            <Grid columns={2} divided={true}>
                <Grid.Row>
                    <Grid.Column stretched={true}>
                        <Form.Field>
                            <label>Max. head change between outer iterations (headtol)</label>
                            <Input
                                readOnly={readOnly}
                                type={'number'}
                                name={'headtol'}
                                value={mfPackage.headtol}
                                icon={renderInfoPopup(documentation.nwt.headtol, 'HEADTOL')}
                                onBlur={handleOnBlur(parseFloat)}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Max. root-mean-squared flux difference between outer iterations (fluxtol)</label>
                            <Input
                                readOnly={readOnly}
                                type={'number'}
                                name={'fluxtol'}
                                value={mfPackage.fluxtol}
                                icon={renderInfoPopup(documentation.nwt.fluxtol, 'FLUXTOL')}
                                onBlur={handleOnBlur(parseFloat)}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Max. no. of outer iterations (maxiterout)</label>
                            <Input
                                readOnly={readOnly}
                                type={'number'}
                                name={'maxiterout'}
                                value={mfPackage.maxiterout}
                                icon={renderInfoPopup(documentation.nwt.maxiterout, 'MAXITEROUT')}
                                onBlur={handleOnBlur(parseFloat)}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Max. root-mean-squared flux difference between outer iterations (thickfact)</label>
                            <Input
                                readOnly={readOnly}
                                type={'number'}
                                name={'thickfact'}
                                value={mfPackage.thickfact}
                                icon={renderInfoPopup(documentation.nwt.thickfact, 'THICKFACT')}
                                onBlur={handleOnBlur(parseFloat)}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                    </Grid.Column>
                    <Grid.Column stretched={true}>
                        <Form.Group>
                            <Form.Field width={14}>
                                <label>Matrix solver to be used (linmeth)</label>
                                <Form.Dropdown
                                    options={[
                                        {key: 0, value: 1, text: '(1) GMRES'},
                                        {key: 1, value: 2, text: '(2) χMD'},
                                    ]}
                                    placeholder="Select linmeth"
                                    name="linmeth"
                                    selection={true}
                                    value={mfPackage.linmeth}
                                    disabled={readOnly}
                                    onChange={handleOnSelect}
                                />
                            </Form.Field>
                            <Form.Field width={1}>
                                <label>&nbsp;</label>
                                {renderInfoPopup(documentation.nwt.linmeth, 'LINMETH', 'top left', true)}
                            </Form.Field>
                        </Form.Group>
                        <Form.Group>
                            <Form.Field width={14}>
                                <label>Print additional info (iprnwt)</label>
                                <Checkbox
                                    toggle={true}
                                    label={''}
                                    disabled={readOnly}
                                    name="iprnwt"
                                    value={mfPackage.iprnwt}
                                />
                            </Form.Field>
                            <Form.Field width={1}>
                                {renderInfoPopup(documentation.nwt.iprnwt, 'IPRNWT', 'top left', false)}
                            </Form.Field>
                        </Form.Group>
                        <Form.Group>
                            <Form.Field width={14}>
                                <label>Correct head relative to cell-bottom if surrounded by dewatered cells
                                    (ibotav)</label>
                                <Checkbox
                                    toggle={true}
                                    label={''}
                                    disabled={readOnly}
                                    name="ibotav"
                                    value={mfPackage.ibotav}
                                />
                            </Form.Field>
                            <Form.Field width={1}>
                                {renderInfoPopup(documentation.nwt.ibotav, 'ibotav', 'top left', false)}
                            </Form.Field>
                        </Form.Group>
                        <Form.Group>
                            <Form.Field width={14}>
                                <label>Automate Solver Options (options)</label>
                                <Form.Dropdown
                                    options={[
                                        {key: 0, value: 'SPECIFIED', text: 'SPECIFIED'},
                                        {key: 1, value: 'SIMPLE', text: 'SIMPLE'},
                                        {key: 2, value: 'MODERATE', text: 'MODERATE'},
                                        {key: 3, value: 'COMPLEX', text: 'COMPLEX'},
                                        {key: 4, value: 'CONTINUE', text: 'CONTINUE'}
                                    ]}
                                    selection={true}
                                    name={'options'}
                                    value={mfPackage.options}
                                    onChange={handleOnSelect}
                                    disabled={readOnly}
                                />
                            </Form.Field>
                            <Form.Field width={1}>
                                <label>&nbsp;</label>
                                {renderInfoPopup(documentation.nwt.options, 'OPTIONS', 'top left', true)}
                            </Form.Field>
                        </Form.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Segment>
                <label style={styles.headerLabel}>General Specified Options</label>
                <Grid columns={2} divided={true}>
                    <Grid.Row>
                        <Grid.Column stretched={true}>
                            <Form.Field>
                                <label>Coefficient to reduce weight applied to head change (dbdtheta)</label>
                                <Input
                                    readOnly={readOnly}
                                    type={'number'}
                                    name={'dbdtheta'}
                                    value={mfPackage.dbdtheta}
                                    icon={renderInfoPopup(documentation.nwt.dbdtheta, 'DBDTHETA')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Coefficient to increase weight applied to head change (dbdkappa)</label>
                                <Input
                                    readOnly={readOnly}
                                    type={'number'}
                                    name={'dbdkappa'}
                                    value={mfPackage.dbdkappa}
                                    icon={renderInfoPopup(documentation.nwt.dbdkappa, 'DBDKAPPA')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Factor used to weight the head change for previous and current iteration
                                    (dbdgamma)</label>
                                <Input
                                    readOnly={readOnly}
                                    type={'number'}
                                    name={'dbdgamma'}
                                    value={mfPackage.dbdgamma}
                                    icon={renderInfoPopup(documentation.nwt.dbdgamma, 'DBGGAMMA')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Momentum coefficient (momfact)</label>
                                <Input
                                    readOnly={readOnly}
                                    type={'number'}
                                    name={'momfact'}
                                    value={mfPackage.momfact}
                                    icon={renderInfoPopup(documentation.nwt.momfact, 'MOMFACT')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column stretched={true}>
                            <Form.Group>
                                <Form.Field width={14}>
                                    <label>Use residual control (backflag)</label>
                                    <Checkbox
                                        toggle={true}
                                        readOnly={false}
                                        label={''}
                                        name="backflag"
                                        value={mfPackage.backflag}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    {renderInfoPopup(documentation.nwt.backflag, 'BACKFLAG', 'top left', false)}
                                </Form.Field>
                            </Form.Group>
                            <Form.Field>
                                <label>Max. no. of reductions (backtracks) in head change (maxbackiter)</label>
                                <Input
                                    readOnly={readOnly}
                                    type={'number'}
                                    name={'maxbackiter'}
                                    value={mfPackage.maxbackiter}
                                    icon={renderInfoPopup(documentation.nwt.maxbackiter, 'MAXBACKITER')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Proportional decrease in root-mean-squared error (backtol)</label>
                                <Input
                                    readOnly={readOnly}
                                    type={'number'}
                                    name={'backtol'}
                                    value={mfPackage.backtol}
                                    icon={renderInfoPopup(documentation.nwt.backtol, 'BACKTOL')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Reduction factor for residual control that reduces head change
                                    (backreduce)</label>
                                <Input
                                    readOnly={readOnly}
                                    type={'number'}
                                    name={'backreduce'}
                                    value={mfPackage.backreduce}
                                    icon={renderInfoPopup(documentation.nwt.backreduce, 'BACKREDUCE')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            {[1].includes(mfPackage.linmeth) &&
            <Segment>
                <label style={styles.headerLabel}>GMRES Specified Options</label>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Method of incomplete factorization used as preconditioner (ilumethod)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 1, text: '(1) ILU with drop tolerance and fill limit'},
                                {key: 1, value: 2, text: '(2) ILU(k), Order k incomplete LU factorization'},
                            ]}
                            placeholder="Select ilumethod"
                            name="ilumethod"
                            selection={true}
                            value={mfPackage.ilumethod}
                            disabled={readOnly}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {renderInfoPopup(documentation.nwt.ilumethod, 'ILUMETHOD', 'top left', true)}
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Max number of iterations for the linear solution (maxitinner)</label>
                        <Input
                            readOnly={readOnly}
                            type={'number'}
                            name={'maxitinner'}
                            value={mfPackage.maxitinner}
                            icon={renderInfoPopup(documentation.nwt.maxitinner, 'MAXITINNER')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Fill limit for ILUMETHOD 1 or level of fill for ILUMETHOD 2 (LEVFILL) (levfill)</label>
                        <Input
                            readOnly={readOnly}
                            type={'number'}
                            name={'levfill'}
                            value={mfPackage.levfill}
                            icon={renderInfoPopup(documentation.nwt.levfill, 'LEVFILL')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Tolerance for convergence of linear solver (stoptol)</label>
                        <Input
                            readOnly={readOnly}
                            type={'number'}
                            name={'stoptol'}
                            value={mfPackage.stoptol}
                            icon={renderInfoPopup(documentation.nwt.stoptol, 'STOPTOL')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Number of iterations between restarts of GMRES (msdr)</label>
                        <Input
                            readOnly={readOnly}
                            type={'number'}
                            name={'msdr'}
                            value={mfPackage.msdr}
                            icon={renderInfoPopup(documentation.nwt.msdr, 'MSDR')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
            }
            {[2].includes(mfPackage.linmeth) &&
            <Segment>
                <label style={styles.headerLabel}>χMD Specified Options</label>
                <Form.Group>
                    <Form.Field width={14}>
                        <label>Acceleration method (iacl)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: '(0) conjugate gradient'},
                                {key: 1, value: 1, text: '(1) ORTHOMIN'},
                                {key: 2, value: 2, text: '(2) Bi-CGSTAB'},
                            ]}
                            placeholder="Select iacl"
                            name="iacl"
                            selection={true}
                            value={mfPackage.iacl}
                            disabled={readOnly}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {renderInfoPopup(documentation.nwt.iacl, 'IACL', 'top left', true)}
                    </Form.Field>
                    <Form.Field width={14}>
                        <label>Scheme of ordering unknowns (norder)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: '(0) original ordering'},
                                {key: 1, value: 1, text: '(1) RCM ordering'},
                                {key: 2, value: 2, text: '(2) Minimum Degree ordering'},
                            ]}
                            placeholder="Select norder"
                            name="norder"
                            selection={true}
                            value={mfPackage.norder}
                            disabled={readOnly}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {renderInfoPopup(documentation.nwt.norder, 'NORDER', 'top left', true)}
                    </Form.Field>
                </Form.Group>
                <Grid columns={2} divided={true}>
                    <Grid.Row>
                        <Grid.Column stretched={true}>
                            <Form.Field>
                                <label>Level of fill for incomplete LU factorization (level)</label>
                                <Input
                                    readOnly={readOnly}
                                    type={'number'}
                                    name={'level'}
                                    value={mfPackage.level}
                                    icon={renderInfoPopup(documentation.nwt.level, 'LEVEL')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>No. of orthogonalization for the ORTHOMIN acceleration scheme (north)</label>
                                <Input
                                    readOnly={readOnly}
                                    type={'number'}
                                    name={'north'}
                                    value={mfPackage.north}
                                    icon={renderInfoPopup(documentation.nwt.north, 'NORTH')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                            <Form.Group>
                                <Form.Field width={14}>
                                    <label>Reduced system preconditioning (iredsys)</label>
                                    <Checkbox
                                        toggle={true}
                                        readOnly={false}
                                        name="iredsys"
                                        value={mfPackage.iredsys || ''}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    {renderInfoPopup(documentation.nwt.iredsys, 'IREDSYS', 'top left', false)}
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field>
                                    <label>Use drop tolerance in preconditioning (idroptol)</label>
                                    <Checkbox
                                        toggle={true}
                                        readOnly={false}
                                        name="idroptol"
                                        value={mfPackage.idroptol || ''}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    {renderInfoPopup(documentation.nwt.idroptol, 'IDROPTOL', 'top left', false)}
                                </Form.Field>
                            </Form.Group>
                        </Grid.Column>
                        <Grid.Column stretched={true}>
                            <Form.Field>
                                <label>Residual reduction-convergence criteria (rrctols)</label>
                                <Input
                                    readOnly={readOnly}
                                    type={'number'}
                                    name={'rrctols'}
                                    value={mfPackage.rrctols}
                                    icon={renderInfoPopup(documentation.nwt.rrctols, 'RRCTOLS')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Drop tolerance for preconditioning (epsrn)</label>
                                <Input
                                    readOnly={readOnly}
                                    type={'number'}
                                    name={'epsrn'}
                                    value={mfPackage.epsrn}
                                    icon={renderInfoPopup(documentation.nwt.epsrn, 'EPSRN')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Head closure criteria for inner (linear) iterations (hclosexmd)</label>
                                <Input
                                    readOnly={readOnly}
                                    type={'number'}
                                    name={'hclosexmd'}
                                    value={mfPackage.hclosexmd}
                                    icon={renderInfoPopup(documentation.nwt.hclosexmd, 'HCLOSEXMD')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Max. no. of iterations for linear solution (mxiterxmd)</label>
                                <Input
                                    readOnly={readOnly}
                                    type={'number'}
                                    name={'mxiterxmd'}
                                    value={mfPackage.mxiterxmd}
                                    icon={renderInfoPopup(documentation.nwt.mxiterxmd, 'MXITERXMD')}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            }
        </Form>
    );
};

export default nwtPackageProperties;
