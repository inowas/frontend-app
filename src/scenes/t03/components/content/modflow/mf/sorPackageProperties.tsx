import React, {ChangeEvent, useState} from 'react';
import {Form, Header, Input, PopupProps} from 'semantic-ui-react';

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
            <Header as={'h3'}>SOR: Slice-successive overrelaxation Package</Header>
            <Form.Group widths="equal">
                <Form.Field>
                    <label>Maximum iterations per time step (MXITER)</label>
                    <Input
                        name={'mxiter'}
                        readOnly={true}
                        type={'number'}
                        value={mfPackage.mxiter}
                        icon={renderInfoPopup(documentation.sor.mxiter, 'MXITER')}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Head change multiplier (ACCL)</label>
                    <Input
                        name="accl"
                        readOnly={true}
                        type={'number'}
                        value={mfPackage.accl}
                        icon={renderInfoPopup(documentation.sor.accl, 'ACCL')}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
                <Form.Field>
                    <label>Head change closure criterion (HCLOSE)</label>
                    <Input
                        readOnly={true}
                        name="hclose"
                        type={'number'}
                        value={mfPackage.hclose}
                        icon={renderInfoPopup(documentation.sor.hclose, 'HCLOSE')}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Print out interval (IPRSOR)</label>
                    <Input
                        readOnly={true}
                        name="iprsor"
                        type={'number'}
                        value={mfPackage.iprsor}
                        icon={renderInfoPopup(documentation.sor.iprsor, 'IPRSOR')}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default sorPackageProperties;
