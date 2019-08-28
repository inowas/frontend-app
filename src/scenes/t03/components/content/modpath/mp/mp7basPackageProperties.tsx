import React, {MouseEvent, useEffect, useState} from 'react';
import {ButtonProps, Form, Grid} from 'semantic-ui-react';
import {FlopyModpathMp7bas} from '../../../../../../core/model/flopy/packages/mp';
import {ModflowModel} from '../../../../../../core/model/modflow';
import Soilmodel from '../../../../../../core/model/modflow/soilmodel/Soilmodel';
import {IPropertyValueObject} from '../../../../../../core/model/types';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';
import RasterDataFormGroup from '../../../../../shared/rasterData/rasterDataFormGroup';
import {documentation} from '../../../../defaults/modpath';

interface IProps {
    model: ModflowModel;
    mpPackage: FlopyModpathMp7bas;
    onChange: (mp: FlopyModpathMp7bas) => any;
    onClickEdit: (layerId: string, parameter: string) => any;
    readOnly: boolean;
    soilmodel: Soilmodel;
}

const mp7basPackageProperties = (props: IProps) => {
    const [mpPackage, setMpPackage] = useState<IPropertyValueObject>(props.mpPackage.toObject());

    useEffect(() => {
        return setMpPackage(props.mpPackage.toObject());
    }, [props.mpPackage]);

    const handleClickEdit = (property: string) => (e: MouseEvent<HTMLButtonElement>, data: ButtonProps) => {
        return props.onClickEdit(data.value, property);
    };

    const renderParameterView = () => {
        return (
            <React.Fragment>
                <h4>Porosity</h4>
                <RasterDataFormGroup
                    data={mpPackage.porosity}
                    onClickEdit={handleClickEdit('porosity')}
                    layers={props.soilmodel.layersCollection}
                    model={props.model}
                />
            </React.Fragment>
        );
    };

    return (
        <Grid style={{marginTop: '10px'}}>
            <Grid.Row>
                <Grid.Column>
                    <Form>
                        <Form.Input
                            label="Extension"
                            name="extension"
                            value={mpPackage.extension || ''}
                            icon={renderInfoPopup(documentation.extension, 'extension')}
                            readOnly={true}
                        />
                        {renderParameterView()}
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default mp7basPackageProperties;
