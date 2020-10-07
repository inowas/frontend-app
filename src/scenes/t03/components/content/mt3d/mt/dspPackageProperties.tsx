import React, {ChangeEvent, useEffect, useState} from 'react';
import {Form, Header, Input, Segment} from 'semantic-ui-react';
import FlopyMt3dMtdsp, {IFlopyMt3dMtdsp} from '../../../../../../core/model/flopy/packages/mt/FlopyMt3dMtdsp';
import {InfoPopup} from '../../../../../shared';
import {documentation} from '../../../../defaults/transport';

interface IProps {
    mtPackage: FlopyMt3dMtdsp;
    onChange: (p: FlopyMt3dMtdsp) => any;
    readOnly: boolean;
}

const dspPackageProperties = (props: IProps) => {

    const [mtPackage, setMtPackage] = useState<IFlopyMt3dMtdsp>(props.mtPackage.toObject());

    useEffect(() => {
        setMtPackage(props.mtPackage.toObject());
    }, [props.mtPackage]);

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        return setMtPackage({...mtPackage, [name]: value});
    };

    const handleOnBlur = (cast?: (v: any) => any) => (e: ChangeEvent<HTMLInputElement>) => {
        const {name} = e.target;
        let {value} = e.target;

        if (cast) {
            value = cast(value);
        }

        setMtPackage({...mtPackage, [name]: value});
        props.onChange(FlopyMt3dMtdsp.fromObject({...mtPackage, [name]: value}));
    };

    const {readOnly} = props;

    return (
        <Form>
            <Header as={'h3'} dividing={true}>DSP: Dispersion Package</Header>
            <Segment>
                <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Longitudinal dispersivity (AL)</label>
                        <Input
                            type={'number'}
                            name={'al'}
                            value={mtPackage.al}
                            disabled={readOnly}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                            icon={<InfoPopup
                                description={documentation.dsp.al}
                                title={'AL'}
                                position={'top right'}
                            />}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Effective molecular diffusion coefficient (DMCOEF)</label>
                        <Input
                            type={'number'}
                            name={'dmcoef'}
                            value={mtPackage.dmcoef}
                            disabled={readOnly}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                            icon={<InfoPopup
                                description={documentation.dsp.dmcoef}
                                title={'DMCOEF'}
                                position={'top right'}
                            />}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Horizontal dispersivity to AL ratio (TRPT)</label>
                        <Input
                            type={'number'}
                            name={'trpt'}
                            value={mtPackage.trpt}
                            disabled={readOnly}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                            icon={<InfoPopup
                                description={documentation.dsp.trpt}
                                title={'TRPT'}
                                position={'top left'}
                            />}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Vertical dispersivity to AL ratio (TRPV)</label>
                        <Input
                            type={'number'}
                            name={'trpv'}
                            value={mtPackage.trpv}
                            disabled={readOnly}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                            icon={<InfoPopup
                                description={documentation.dsp.trpv}
                                title={'TRPV'}
                                position={'top right'}
                            />}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
        </Form>
    );
};

export default dspPackageProperties;
