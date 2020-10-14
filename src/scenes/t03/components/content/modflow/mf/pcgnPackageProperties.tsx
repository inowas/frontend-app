import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {DropdownProps, Form, Grid, Header, Input, PopupProps, Segment} from 'semantic-ui-react';

import {FlopyModflowMfpcgn} from '../../../../../../core/model/flopy/packages/mf';
import {IFlopyModflowMfpcgn} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfpcgn';
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
    mfPackage: FlopyModflowMfpcgn;
    onChange: (pck: FlopyModflowMfpcgn) => void;
    readonly: boolean;
}

const PcgnPackageProperties = (props: IProps) => {

    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfpcgn>(props.mfPackage.toObject());
    const handleOnSelect = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const {name, value} = data;
        setMfPackage({...mfPackage, [name]: value});
        props.onChange(FlopyModflowMfpcgn.fromObject({...mfPackage, [name]: value}));
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
        props.onChange(FlopyModflowMfpcgn.fromObject({...mfPackage, [name]: value}));
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
            <Header as={'h3'}>
                PCGN: Preconditioned Conjugate Gradient Solver with Improved Nonlinear Control Package
            </Header>
            <Segment>
                <label style={styles.headerLabel}>Basic</label>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Max. no. of outer iterations (ITER_MO)</label>
                        <Input
                            readOnly={readOnly}
                            name="iter_mo"
                            type={'number'}
                            value={mfPackage.iter_mo}
                            icon={renderInfoPopup(documentation.pcgn.iter_mo, 'ITER_MO')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Max. no. of inner iterations (ITER_MI)</label>
                        <Input
                            readOnly={readOnly}
                            name="iter_mi"
                            type={'number'}
                            value={mfPackage.iter_mi}
                            icon={renderInfoPopup(documentation.pcgn.iter_mi, 'ITER_MI')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Residual-based stopping criterion (CLOSE_R)</label>
                        <Input
                            readOnly={readOnly}
                            name="close_r"
                            type={'number'}
                            value={mfPackage.close_r}
                            icon={renderInfoPopup(documentation.pcgn.close_r, 'CLOSE_R')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Head-based stopping criterion (CLOSE_H)</label>
                        <Input
                            readOnly={readOnly}
                            name="close_h"
                            type={'number'}
                            value={mfPackage.close_h}
                            icon={renderInfoPopup(documentation.pcgn.close_h, 'CLOSE_H')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Relaxation parameter (RELAX)</label>
                        <Input
                            readOnly={readOnly}
                            name="relax"
                            type={'number'}
                            value={mfPackage.relax}
                            icon={renderInfoPopup(documentation.pcgn.relax, 'RELAX')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field width={14}>
                        <label>Fill level of the MIC preconditioner (IFILL)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: '(0) Less preconditioning'},
                                {key: 1, value: 1, text: '(1) More preconditioning'}
                            ]}
                            selection={true}
                            name={'ifill'}
                            value={mfPackage.ifill}
                            onChange={handleOnSelect}
                            disabled={readOnly}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {renderInfoPopup(documentation.pcgn.ifill, 'IFILL', 'top left', true)}
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Save progress for inner PCG iteration to file (UNIT_PC)</label>
                        <Input
                            readOnly={readOnly}
                            name="unit_pc"
                            type={'number'}
                            value={mfPackage.unit_pc}
                            icon={renderInfoPopup(documentation.pcgn.unit_pc, 'UNIT_PC')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Save time in PCG solver to file (UNIT_TS)</label>
                        <Input
                            readOnly={readOnly}
                            name="unit_ts"
                            type={'number'}
                            value={mfPackage.unit_ts}
                            icon={renderInfoPopup(documentation.pcgn.unit_ts, 'UNIT_PC')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
            <Segment>
                <label style={styles.headerLabel}>Non-Linear</label>
                <Grid columns={'2'}>
                    <Grid.Column>
                        <Form.Group>
                            <Form.Field width={14}>
                                <label>Damping mode (ADAMP)</label>
                                <Form.Dropdown
                                    options={[
                                        {key: 0, value: 0, text: '(0) Ordinary'},
                                        {key: 1, value: 1, text: '(1) Adaptive'},
                                        {key: 2, value: 2, text: '(2) Enhanced'}
                                    ]}
                                    selection={true}
                                    name={'adamp'}
                                    value={mfPackage.adamp}
                                    onChange={handleOnSelect}
                                    disabled={readOnly}
                                />
                            </Form.Field>
                            <Form.Field width={1}>
                                <label>&nbsp;</label>
                                {renderInfoPopup(documentation.pcgn.adamp, 'ADAMP', 'top left', true)}
                            </Form.Field>
                        </Form.Group>
                        <Form.Field>
                            <label>Damping restriction (DAMP) </label>
                            <Input
                                readOnly={readOnly}
                                name="damp"
                                type={'number'}
                                value={mfPackage.damp}
                                icon={renderInfoPopup(documentation.pcgn.damp, 'DAMP')}
                                onBlur={handleOnBlur(parseFloat)}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Damping lower bound (DAMP_LB)</label>
                            <Input
                                readOnly={readOnly}
                                name="damp_lb"
                                type={'number'}
                                value={mfPackage.damp_lb}
                                icon={renderInfoPopup(documentation.pcgn.damp_lb, 'DAMP_LB')}
                                onBlur={handleOnBlur}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Rate parameter (RATE_D)</label>
                            <Input
                                readOnly={readOnly}
                                name="rate_d"
                                type={'number'}
                                value={mfPackage.rate_d}
                                icon={renderInfoPopup(documentation.pcgn.rate_d, 'RATE_D')}
                                onBlur={handleOnBlur(parseFloat)}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Maximum head change (CHGLIMIT)</label>
                            <Input
                                readOnly={readOnly}
                                name="chglimit"
                                type={'number'}
                                value={mfPackage.chglimit}
                                icon={renderInfoPopup(documentation.pcgn.chglimit, 'CHGLIMIT')}
                                onBlur={handleOnBlur(parseFloat)}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                    </Grid.Column>
                    <Grid.Column>
                        <Form.Group>
                            <Form.Field width={14}>
                                <label>Convergence mode (ACNVG)</label>
                                <Form.Dropdown
                                    options={[
                                        {key: 0, value: 0, text: '(0) Standard'},
                                        {key: 1, value: 1, text: '(1) Adaptive'},
                                        {key: 2, value: 2, text: '(2) Enhanced'}
                                    ]}
                                    selection={true}
                                    name={'acnvg'}
                                    value={mfPackage.acnvg}
                                    onChange={handleOnSelect}
                                    disabled={readOnly}
                                />
                            </Form.Field>
                            <Form.Field width={1}>
                                <label>&nbsp;</label>
                                {renderInfoPopup(documentation.pcgn.acnvg, 'ACNVG', 'left center', true)}
                            </Form.Field>
                        </Form.Group>
                        <Form.Field>
                            <label>Minimum relative convergence (CNVG_LB)</label>
                            <Input
                                readOnly={readOnly}
                                name="cnvg_lb"
                                type={'number'}
                                value={mfPackage.cnvg_lb}
                                icon={renderInfoPopup(documentation.pcgn.cnvg_lb, 'CNVG_LB')}
                                onBlur={handleOnBlur(parseFloat)}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Relative convergence increase (MCNVG)</label>
                            <Input
                                readOnly={readOnly}
                                name="mcnvg"
                                type={'number'}
                                value={mfPackage.mcnvg}
                                icon={renderInfoPopup(documentation.pcgn.mcnvg, 'MCNVG')}
                                onBlur={handleOnBlur(parseFloat)}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Convergence enhancement control (RATE_C)</label>
                            <Input
                                readOnly={readOnly}
                                name="rate_c"
                                type={'number'}
                                value={mfPackage.rate_c}
                                icon={renderInfoPopup(documentation.pcgn.rate_c, 'RATE_C')}
                                onBlur={handleOnBlur(parseFloat)}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                        <Form.Group>
                            <Form.Field width={14}>
                                <label>Progress reporting (IPUNIT)</label>
                                <Form.Dropdown
                                    options={[
                                        {key: -1, value: -1, text: '(-1) None'},
                                        {key: 0, value: 0, text: '(0) Listing file'},
                                        {key: 1, value: 1, text: '(1) CSV file'}
                                    ]}
                                    selection={true}
                                    name={'ipunit'}
                                    value={mfPackage.ipunit}
                                    onChange={handleOnSelect}
                                    disabled={readOnly}
                                />
                            </Form.Field>
                            <Form.Field width={1}>
                                <label>&nbsp;</label>
                                {renderInfoPopup(documentation.pcgn.ipunit, 'IPUNIT', 'top left', true)}
                            </Form.Field>
                        </Form.Group>
                    </Grid.Column>
                </Grid>
            </Segment>
        </Form>
    );
};

export default PcgnPackageProperties;
