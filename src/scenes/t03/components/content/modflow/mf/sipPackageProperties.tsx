import React, {ChangeEvent, useState} from 'react';
import {Checkbox, Form, Grid, Header, Input, PopupProps} from 'semantic-ui-react';

import {FlopyModflowMfsip} from '../../../../../../core/model/flopy/packages/mf';
import {IFlopyModflowMfsip} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfsip';
import {InfoPopup} from '../../../../../shared';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModflowMfsip;
    onChange: (pck: FlopyModflowMfsip) => void;
    readonly: boolean;
}

const sipPackageProperties = (props: IProps) => {

    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfsip>(props.mfPackage.toObject());

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        return setMfPackage({...mfPackage, [name]: value});
    };

    const handleOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        props.onChange(FlopyModflowMfsip.fromObject({...mfPackage, [name]: value}));
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
            <Header as={'h3'}>SIP: Strongly Implicit Procedure Package</Header>
            <Grid columns={2} divided={true}>
                <Grid.Row>
                    <Grid.Column>
                        <Form.Field>
                            <label>Maximum iterations per time step (MXITER)</label>
                            <Input
                                type={'number'}
                                readOnly={readOnly}
                                name={'mxiter'}
                                value={mfPackage.mxiter}
                                icon={renderInfoPopup(documentation.sip.mxiter, 'MXITER')}
                                onBlur={handleOnBlur}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Number of iteration parameters (NPARM)</label>
                            <Input
                                readOnly={readOnly}
                                name="nparm"
                                value={mfPackage.nparm}
                                icon={renderInfoPopup(documentation.sip.nparm, 'NPARM')}
                                onBlur={handleOnBlur}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Acceleration parameter (ACCL)</label>
                            <Input
                                readOnly={readOnly}
                                name="accl"
                                value={mfPackage.accl}
                                icon={renderInfoPopup(documentation.sip.accl, 'ACCL')}
                                onBlur={handleOnBlur}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Head change criterion for convergence (HCLOSE)</label>
                            <Input
                                readOnly={readOnly}
                                name="hclose"
                                value={mfPackage.hclose}
                                icon={renderInfoPopup(documentation.sip.hclose, 'HCLOSE')}
                                onBlur={handleOnBlur}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                    </Grid.Column>
                    <Grid.Column>
                        <Form.Group>
                            <Form.Field width={14}>
                                <label>Calculate seed at start (IPCALC)</label>
                                <Checkbox
                                    toggle={true}
                                    readOnly={false}
                                    name="ipcalc"
                                    value={mfPackage.ipcalc || ''}
                                />
                            </Form.Field>
                            <Form.Field width={1}>
                                {renderInfoPopup(documentation.sip.ipcalc, 'IPCALC', 'top left', false)}
                            </Form.Field>
                        </Form.Group>
                        <Form.Field>
                            <label> (WSEED)</label>
                            <Input
                                disabled={true}
                                name="wseed"
                                value={mfPackage.wseed}
                                icon={renderInfoPopup(documentation.sip.wseed, 'WSEED')}
                                onBlur={handleOnBlur}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Printout Interval (IPRSIP)</label>
                            <Input
                                readOnly={readOnly}
                                name="iprsip"
                                value={mfPackage.iprsip}
                                icon={renderInfoPopup(documentation.sip.iprsip, 'IPRSIP')}
                                onBlur={handleOnBlur}
                                onChange={handleOnChange}
                            />
                        </Form.Field>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Form>
    );
};

export default sipPackageProperties;
