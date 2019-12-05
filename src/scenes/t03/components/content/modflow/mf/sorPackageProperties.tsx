import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {DropdownProps, Form, Input, PopupProps} from 'semantic-ui-react';

import {FlopyModflowMfsor} from '../../../../../../core/model/flopy/packages/mf';
import {IFlopyModflowMfsor} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfsor';
import {InfoPopup} from '../../../../../shared';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModflowMfsor;
    onChange: (pck: FlopyModflowMfsor) => void;
    readonly: boolean;
}

const sorPackageProperties = (props: IProps) => {

    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfsor>(props.mfPackage.toObject());
    const handleOnSelect = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const {name, value} = data;
        setMfPackage({...mfPackage, [name]: value});
        props.onChange(FlopyModflowMfsor.fromObject({...mfPackage, [name]: value}));
    };

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        return setMfPackage({...mfPackage, [name]: value});
    };

    const handleOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        props.onChange(FlopyModflowMfsor.fromObject({...mfPackage, [name]: value}));
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
                    <label>Maximum iterations per time step (MXITER)</label>
                    <Input
                        type={'number'}
                        readOnly={readOnly}
                        name={'mxiter'}
                        value={mfPackage.mxiter}
                        icon={renderInfoPopup(documentation.sor.mxiter, 'MXITER')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Head change multiplier (ACCL)</label>
                    <Input
                        readOnly={readOnly}
                        name="accl"
                        value={mfPackage.accl}
                        icon={renderInfoPopup(documentation.sor.accl, 'ACCL')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
                <Form.Field>
                    <label>Head change closure criterion (HCLOSE)</label>
                    <Input
                        readOnly={readOnly}
                        name="hclose"
                        value={mfPackage.hclose}
                        icon={renderInfoPopup(documentation.sor.hclose, 'HCLOSE')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Print out interval (IPRSOR)</label>
                    <Input
                        readOnly={readOnly}
                        name="iprsor"
                        value={mfPackage.iprsor}
                        icon={renderInfoPopup(documentation.sor.iprsor, 'IPRSOR')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default sorPackageProperties;
