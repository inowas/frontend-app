import React, {MouseEvent, useEffect, useState} from 'react';
import {Button, ButtonProps, Form, Grid} from 'semantic-ui-react';
import {FlopyModpathMp7bas, FlopyModpathMp7particledata} from '../../../../../../core/model/flopy/packages/mp';
import {ModflowModel} from '../../../../../../core/model/modflow';
import Soilmodel from '../../../../../../core/model/modflow/soilmodel/Soilmodel';
import {IPropertyValueObject} from '../../../../../../core/model/types';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {documentation} from '../../../../defaults/modpath';

interface IProps {
    model: ModflowModel;
    mpPackage: FlopyModpathMp7bas;
    onChange: (mp: FlopyModpathMp7particledata) => any;
    readOnly: boolean;
    soilmodel: Soilmodel;
}

const mp7particledataPackageProperties = (props: IProps) => {
    const [mpPackage, setMpPackage] = useState<IPropertyValueObject>(props.mpPackage.toObject());

    useEffect(() => {
        return setMpPackage(props.mpPackage.toObject());
    }, [props.mpPackage]);

    const handleClickEdit = (e: MouseEvent<HTMLButtonElement>, {value}: ButtonProps) => {
        return null;
    };

    const renderParameterView = () => {
        const data = mpPackage.porosity;

        return (
            <React.Fragment>
                <h4>Porosity</h4>
                <Form.Group widths="equal">
                    {props.soilmodel.layersCollection.all.map((layer, key) => (
                        <Form.Field key={key}>
                            <div>
                                <label style={{float: 'left'}}>{layer.number}: {layer.name}</label>
                                <Button
                                    onClick={handleClickEdit}
                                    size="mini"
                                    value={layer.id}
                                >
                                    Edit
                                </Button>
                            </div>
                            <RasterDataImage
                                data={Array.isArray(data) ? data[key] : data}
                                gridSize={props.model.gridSize}
                                legend={Array.isArray(data) ? undefined : [{
                                    value: data,
                                    color: 'rgb(173, 221, 142)',
                                    isContinuous: false,
                                    label: data
                                }]}
                                unit={''}
                            />
                        </Form.Field>
                    ))}

                </Form.Group>
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

export default mp7particledataPackageProperties;
