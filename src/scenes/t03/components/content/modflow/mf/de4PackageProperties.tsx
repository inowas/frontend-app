import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {DropdownProps, Form, Grid, Header, Input, Segment} from 'semantic-ui-react';

import {FlopyModflowMfde4} from '../../../../../../core/model/flopy/packages/mf';
import {IFlopyModflowMfde4} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfde4';
import {InfoPopup} from '../../../../../shared';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModflowMfde4;
    onChange: (pck: FlopyModflowMfde4) => void;
    readonly: boolean;
}

const de4PackageProperties = (props: IProps) => {

    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfde4>(props.mfPackage.toObject());
    const {readonly} = props;
    const handleOnSelect = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const {name, value} = data;
        setMfPackage({...mfPackage, [name]: value});
        props.onChange(FlopyModflowMfde4.fromObject({...mfPackage, [name]: value}));
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
        props.onChange(FlopyModflowMfde4.fromObject({...mfPackage, [name]: value}));
    };
    const readOnly = props.readonly;

    if (!mfPackage) {
        return null;
    }

    return (
        <Form>
            <Header as={'h3'}>DE4: Direct Solver Package</Header>
            <Segment>
            <Form.Group widths={'equal'}>
                <Form.Field>
                    <label>Maximum number of iterations (ITMX)</label>
                    <Input
                        readOnly={readonly}
                        type={'number'}
                        name={'itmx'}
                        value={mfPackage.itmx}
                        icon={<InfoPopup description={documentation.de4.itmx} title={'ITMX'}/>}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Maximum number of upper equations (MXUP)</label>
                    <Input
                        readOnly={readonly}
                        type={'number'}
                        name={'mxup'}
                        value={mfPackage.mxup}
                        icon={<InfoPopup description={documentation.de4.mxup} title={'MXUP'}/>}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
            <Form.Group widths={'equal'}>
                <Form.Field>
                    <label>Maximum number of lower equations (MXLOW)</label>
                    <Input
                        readOnly={readonly}
                        type={'number'}
                        name={'mxlow'}
                        value={mfPackage.mxlow}
                        icon={<InfoPopup description={documentation.de4.mxlow} title={'MXLOW'}/>}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Maximum bandwidth (MXBW)</label>
                    <Input
                        readOnly={readonly}
                        type={'number'}
                        name={'mxbw'}
                        value={mfPackage.mxbw}
                        icon={<InfoPopup description={documentation.de4.mxbw} title={'MXBW'}/>}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
            </Segment>

            <Segment>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Form.Group>
                                <Form.Field>
                                    <label>Frequency of change (IFREQ)</label>
                                    <Form.Dropdown
                                        options={[
                                            {key: 0, value: 1, text: '1'},
                                            {key: 1, value: 2, text: '2'},
                                            {key: 2, value: 3, text: '3'},
                                        ]}
                                        name={'ifreq'}
                                        selection={true}
                                        value={mfPackage.ifreq}
                                        disabled={readonly}
                                        onChange={handleOnSelect}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    <label>&nbsp;</label>
                                    <InfoPopup
                                        description={documentation.de4.ifreq}
                                        title={'IFREQ'}
                                        position={'top left'}
                                        iconOutside={true}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field>
                                    <label>Print convergence (MUTD4)</label>
                                    <Form.Dropdown
                                        options={[
                                            {key: 0, value: 0, text: '0'},
                                            {key: 1, value: 1, text: '1'},
                                            {key: 2, value: 2, text: '2'},
                                        ]}
                                        name={'mutd4'}
                                        selection={true}
                                        value={mfPackage.mutd4}
                                        disabled={readOnly}
                                        onChange={handleOnSelect}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    <label>&nbsp;</label>
                                    <InfoPopup
                                        description={documentation.de4.mutd4}
                                        title={'MUTD4'}
                                        position={'top left'}
                                        iconOutside={true}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Field>
                                <label>Head change multiplier (ACCL)</label>
                                <Input
                                    readOnly={readonly}
                                    name={'accl'}
                                    type={'number'}
                                    value={mfPackage.accl}
                                    icon={<InfoPopup description={documentation.de4.accl} title={'ACCL'}/>}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Head change closure criterion (HCLOSE)</label>
                                <Input
                                    readOnly={readonly}
                                    name={'hclose'}
                                    type={'number'}
                                    value={mfPackage.hclose}
                                    icon={<InfoPopup description={documentation.de4.hclose} title={'HCLOSE'} />}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Time step interval for printing (IPRD4)</label>
                                <Input
                                    readOnly={readonly}
                                    name={'iprd4'}
                                    type={'number'}
                                    value={mfPackage.iprd4}
                                    icon={<InfoPopup description={documentation.de4.iprd4} title={'IPRD4'} />}
                                    onBlur={handleOnBlur(parseFloat)}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>

            <Segment>
                    <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Filename extension (EXTENSION)</label>
                        <Input
                            readOnly={readonly}
                            name={'extension'}
                            value={mfPackage.extension}
                            icon={<InfoPopup description={documentation.de4.extension} title={'EXTENSION'} />}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (UNITNUMBER)</label>
                        <Input
                            readOnly={readonly}
                            name={'unitnumber'}
                            value={mfPackage.unitnumber || 0}
                            icon={<InfoPopup description={documentation.de4.unitnumber} title={'UNITNUMBER'} />}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (FILENAMES)</label>
                        <Input
                            readOnly={readonly}
                            name={'filenames'}
                            value={mfPackage.filenames || ''}
                            icon={<InfoPopup description={documentation.de4.filenames} title={'FILENAMES'} />}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
        </Form>
    );
};

export default de4PackageProperties;
