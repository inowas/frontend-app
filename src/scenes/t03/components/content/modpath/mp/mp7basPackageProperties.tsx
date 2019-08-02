import React, {ChangeEvent, useEffect, useState} from 'react';
import {Form, Grid, InputOnChangeData} from 'semantic-ui-react';
import {FlopyModpathMp7bas} from '../../../../../../core/model/flopy/packages/mp';
import {IPropertyValueObject} from '../../../../../../core/model/types';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';
import {documentation} from '../../../../defaults/modpath';

interface IProps {
    mpPackage: FlopyModpathMp7bas;
    onChange: (mp: FlopyModpathMp7bas) => any;
    readOnly: boolean;
}

const mp7basPackageProperties = (props: IProps) => {
    const {readOnly} = props;
    const [mpPackage, setMpPackage] = useState<IPropertyValueObject>(props.mpPackage.toObject());

    useEffect(() => {
        return setMpPackage(props.mpPackage.toObject());
    }, [props.mpPackage]);

    const handleBlur = () => props.onChange(FlopyModpathMp7bas.fromObject(mpPackage) as FlopyModpathMp7bas);

    const handleChangePorosity = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => setMpPackage({
        ...mpPackage,
        [name]: value
    });

    return (
        <Grid style={{marginTop: '10px'}}>
            <Grid.Row>
                <Grid.Column>
                    <Form>
                        <Form.Group widths="equal">
                            <Form.Input
                                label="Extension"
                                name="extension"
                                value={mpPackage.extension || ''}
                                icon={renderInfoPopup(documentation.extension, 'extension')}
                                readOnly={true}
                            />
                            <Form.Input
                                label="Porosity"
                                name="porosity"
                                value={mpPackage.porosity || ''}
                                icon={renderInfoPopup(documentation.porosity, 'porosity')}
                                onBlur={handleBlur}
                                onChange={handleChangePorosity}
                                readOnly={readOnly}
                                type="number"
                            />
                        </Form.Group>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default mp7basPackageProperties;
