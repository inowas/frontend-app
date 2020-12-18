import {Form, Header, Input} from 'semantic-ui-react';
import React, {ChangeEvent, useState} from 'react';

import {FlopyModflowMfsor} from '../../../../../../core/model/flopy/packages/mf';
import {IFlopyModflowMfsor} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfsor';
import {InfoPopup} from '../../../../../shared';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModflowMfsor;
    onChange: (pck: FlopyModflowMfsor) => void;
    readonly: boolean;
}

const SorPackageProperties = (props: IProps) => {

    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfsor>(props.mfPackage.toObject());
    const {readonly} = props;

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

    if (!mfPackage) {
        return null;
    }

    return (
        <Form>
            <Header as={'h3'}>SOR: Slice-successive overrelaxation Package</Header>
            <Form.Group widths={'equal'}>
                <Form.Field>
                    <label>Maximum iterations per time step (MXITER)</label>
                    <Input
                        name={'mxiter'}
                        readOnly={readonly}
                        type={'number'}
                        value={mfPackage.mxiter}
                        icon={<InfoPopup description={documentation.sor.mxiter} title={'MXITER'}/>}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Head change multiplier (ACCL)</label>
                    <Input
                        name={'accl'}
                        readOnly={readonly}
                        type={'number'}
                        value={mfPackage.accl}
                        icon={<InfoPopup description={documentation.sor.accl} title={'ACCL'}/>}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
            <Form.Group widths={'equal'}>
                <Form.Field>
                    <label>Head change closure criterion (HCLOSE)</label>
                    <Input
                        readOnly={readonly}
                        name={'hclose'}
                        type={'number'}
                        value={mfPackage.hclose}
                        icon={<InfoPopup description={documentation.sor.hclose} title={'HCLOSE'}/>}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Print out interval (IPRSOR)</label>
                    <Input
                        readOnly={readonly}
                        name={'iprsor'}
                        type={'number'}
                        value={mfPackage.iprsor}
                        icon={<InfoPopup description={documentation.sor.iprsor} title={'IPRSOR'}/>}
                        onBlur={handleOnBlur(parseFloat)}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
            <Form.Group widths={'equal'}>
                <Form.Field>
                    <label>Filename extension (EXTENSION)</label>
                    <Input
                        readOnly={readonly}
                        name={'extension'}
                        value={mfPackage.extension}
                        icon={<InfoPopup description={documentation.sor.extension} title={'EXTENSION'}/>}
                    />
                </Form.Field>
                <Form.Field>
                    <label>File unit number (UNITNUMBER)</label>
                    <Input
                        readOnly={readonly}
                        name={'unitnumber'}
                        type={'number'}
                        value={mfPackage.unitnumber || ''}
                        icon={<InfoPopup description={documentation.sor.unitnumber} title={'UNITNUMBER'}/>}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filenames (FILENAMES)</label>
                    <Input
                        readOnly={readonly}
                        name={'filenames'}
                        value={mfPackage.filenames || ''}
                        icon={<InfoPopup description={documentation.sor.filenames} title={'FILENAMES'}/>}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default SorPackageProperties;
