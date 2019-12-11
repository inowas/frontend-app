import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {Checkbox, DropdownProps, Form, Input, PopupProps, Segment} from 'semantic-ui-react';

import {FlopyModflowMfnwt, FlopyModflowMfpcg} from '../../../../../../core/model/flopy/packages/mf';
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

    const handleOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
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
            <Form.Group widths="equal">
                <Form.Field>
                    <label>Max. head change between outer iterations (headtol)</label>
                    <Input
                        readOnly={readOnly}
                        type={'number'}
                        name={'headtol'}
                        value={mfPackage.headtol}
                        icon={renderInfoPopup(documentation.nwt.headtol, 'headtol')}
                        onBlur={handleOnBlur}
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
                        icon={renderInfoPopup(documentation.nwt.fluxtol, 'fluxtol')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
                <Form.Field>
                    <label>Max. no. of outer iterations (maxiterout)</label>
                    <Input
                        readOnly={readOnly}
                        type={'number'}
                        name={'maxiterout'}
                        value={mfPackage.maxiterout}
                        icon={renderInfoPopup(documentation.nwt.maxiterout, 'maxiterout')}
                        onBlur={handleOnBlur}
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
                        icon={renderInfoPopup(documentation.nwt.thickfact, 'thickfact')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
                <Form.Field>
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
                    {renderInfoPopup(documentation.nwt.linmeth, 'linmeth', 'top left', true)}
                </Form.Field>
                <Form.Field>
                    <label>Print additional info (iprnwt)</label>
                    <Input
                        readOnly={readOnly}
                        type={'number'}
                        name={'iprnwt'}
                        value={mfPackage.iprnwt}
                        icon={renderInfoPopup(documentation.nwt.iprnwt, 'iprnwt')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
                <Form.Field>
                    <label>Correct head relative to cell-bottom if surrounded by dewatered cells (ibotav)</label>
                    <Checkbox
                        toggle={true}
                        readOnly={false}
                        name="ibotav"
                        value={mfPackage.ibotav || ''}
                        icon={renderInfoPopup(documentation.nwt.ibotav, 'ibotav')}
                    />
                </Form.Field>
                <Form.Field width={15}>
                    <label>Options (options)</label>
                    <Form.Dropdown
                        options={[
                            {key: 0, value: 0, text: 'SPECIFIED'},
                            {key: 1, value: 1, text: 'SIMPLE'},
                            {key: 2, value: 2, text: 'MODERATE'},
                            {key: 3, value: 3, text: 'COMPLEX'},
                            {key: 4, value: 4, text: 'CONTINUE'}
                        ]}
                        selection={true}
                        name={'options'}
                        value={mfPackage.options}
                        onChange={handleOnSelect}
                        disabled={readOnly}
                    />
                </Form.Field>
            </Form.Group>
            <Segment>
                <label style={styles.headerLabel}>General Specified Options</label>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Coefficient to reduce weight applied to head change (dbdtheta)</label>
                        <Input
                            readOnly={readOnly}
                            type={'number'}
                            name={'dbdtheta'}
                            value={mfPackage.dbdtheta}
                            icon={renderInfoPopup(documentation.nwt.dbdtheta, 'dbdtheta')}
                            onBlur={handleOnBlur}
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
                            icon={renderInfoPopup(documentation.nwt.dbdkappa, 'dbdkappa')}
                            onBlur={handleOnBlur}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Factor used to weight the head change for previous and current iteration (dbdgamma)</label>
                        <Input
                            readOnly={readOnly}
                            type={'number'}
                            name={'dbdgamma'}
                            value={mfPackage.dbdgamma}
                            icon={renderInfoPopup(documentation.nwt.dbdgamma, 'dbdgamma')}
                            onBlur={handleOnBlur}
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
                            icon={renderInfoPopup(documentation.nwt.momfact, 'momfact')}
                            onBlur={handleOnBlur}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Use residual control (backflag)</label>
                        <Checkbox
                            toggle={true}
                            readOnly={false}
                            name="backflag"
                            value={mfPackage.backflag}
                            icon={renderInfoPopup(documentation.nwt.backflag, 'backflag')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Max. no. of reductions (backtracks) in head change (maxbackiter)</label>
                        <Input
                            readOnly={readOnly}
                            type={'number'}
                            name={'maxbackiter'}
                            value={mfPackage.maxbackiter}
                            icon={renderInfoPopup(documentation.nwt.maxbackiter, 'maxbackiter')}
                            onBlur={handleOnBlur}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Proportional decrease in root-mean-squared error (backtol)</label>
                        <Input
                            readOnly={readOnly}
                            type={'number'}
                            name={'backtol'}
                            value={mfPackage.backtol}
                            icon={renderInfoPopup(documentation.nwt.backtol, 'backtol')}
                            onBlur={handleOnBlur}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Reduction factor for residual control that reduces head change (backreduce)</label>
                        <Input
                            readOnly={readOnly}
                            type={'number'}
                            name={'backreduce'}
                            value={mfPackage.backreduce}
                            icon={renderInfoPopup(documentation.nwt.backreduce, 'backreduce')}
                            onBlur={handleOnBlur}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
            <Segment>
                <label style={styles.headerLabel}>GMRES Specified Options</label>
            </Segment>
            <Segment>
                <label style={styles.headerLabel}>χMD Specified Options</label>
            </Segment>
        </Form>
    );
};

export default nwtPackageProperties;
