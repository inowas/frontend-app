import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {DropdownProps, Form, Input, PopupProps} from 'semantic-ui-react';

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
    const handleOnSelect = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const {name, value} = data;
        setMfPackage({...mfPackage, [name]: value});
        props.onChange(FlopyModflowMfde4.fromObject({...mfPackage, [name]: value}));
    };

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        return setMfPackage({...mfPackage, [name]: value});
    };

    const handleOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        props.onChange(FlopyModflowMfde4.fromObject({...mfPackage, [name]: value}));
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
            <Form.Group>
                <Form.Field>
                    <label>Maximum number of iterations (itmx)</label>
                    <Input
                        type={'number'}
                        readOnly={readOnly}
                        name={'itmx'}
                        value={mfPackage.itmx}
                        icon={renderInfoPopup(documentation.itmx, 'itmx')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Maximum number of upper equations (mxup)</label>
                    <Input
                        readOnly={readOnly}
                        name={'mxup'}
                        value={mfPackage.mxup}
                        icon={renderInfoPopup(documentation.mxup, 'mxup')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Maximum number of lower equations (mxlow)</label>
                    <Input
                        readOnly={readOnly}
                        name="mxlow"
                        value={mfPackage.mxlow}
                        icon={renderInfoPopup(documentation.mxlow, 'mxlow')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>

            <Form.Group widths="equal">
                <Form.Field>
                    <label>Maximum bandwidth (mxbw)</label>
                    <Input
                        readOnly={readOnly}
                        name="mxbw"
                        value={mfPackage.mxbw}
                        icon={renderInfoPopup(documentation.mxbw, 'mxbw')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Frequency of change (ifreq)</label>
                    <Form.Dropdown
                        options={[
                            {key: 0, value: 1, text: '1'},
                            {key: 1, value: 2, text: '2'},
                            {key: 2, value: 3, text: '3'},
                        ]}
                        placeholder="Select ifreq"
                        name="ifreq"
                        selection={true}
                        value={mfPackage.ifreq}
                        disabled={readOnly}
                        onChange={handleOnSelect}
                    />
                </Form.Field>
                <Form.Field width={1}>
                    <label>&nbsp;</label>
                    {renderInfoPopup(documentation.ichflg, 'ifreq', 'top left', true)}
                </Form.Field>

                <Form.Field>
                    <label>Print convergence (mutd4)</label>
                    <Form.Dropdown
                        options={[
                            {key: 0, value: 0, text: '0'},
                            {key: 1, value: 1, text: '1'},
                            {key: 2, value: 2, text: '2'},
                        ]}
                        placeholder="Select mutd4"
                        name="mutd4"
                        selection={true}
                        value={mfPackage.mutd4}
                        disabled={readOnly}
                        onChange={handleOnSelect}
                    />
                </Form.Field>
                <Form.Field width={1}>
                    <label>&nbsp;</label>
                    {renderInfoPopup(documentation.mutd4, 'mutd4', 'top left', true)}
                </Form.Field>
            </Form.Group>

            <Form.Group widths="equal">
                <Form.Field width={12}>
                    <label>Head change multiplier (accl)</label>
                    <Input
                        readOnly={readOnly}
                        name="accl"
                        value={mfPackage.accl}
                        icon={renderInfoPopup(documentation.accl, 'accl')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Head change closure criterion (hclose)</label>
                    <Input
                        readOnly={readOnly}
                        name="hclose"
                        value={mfPackage.hclose}
                        icon={renderInfoPopup(documentation.hclose, 'hclose')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Interval for time step printing (iprd4)</label>
                    <Input
                        readOnly={readOnly}
                        name="iprd4"
                        value={mfPackage.iprd4}
                        icon={renderInfoPopup(documentation.iprd4, 'iprd4')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>

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
        </Form>
    );
};

export default de4PackageProperties;
