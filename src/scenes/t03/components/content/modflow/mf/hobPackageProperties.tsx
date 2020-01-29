import React, {ChangeEvent, useState} from 'react';
import {Form, Grid, Header, Input, InputOnChangeData, PopupProps} from 'semantic-ui-react';
import {
    FlopyModflowMfdis,
    FlopyModflowMfhob
} from '../../../../../../core/model/flopy/packages/mf';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import {IFlopyModflowMfhob, IObsData} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfhob';
import {GridSize} from '../../../../../../core/model/modflow';
import {RainbowOrLegend} from '../../../../../../services/rainbowvis/types';
import {InfoPopup} from '../../../../../shared';
import RasterDataImage from '../../../../../shared/rasterData/rasterDataImage';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModflowMfhob;
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowMfhob) => void;
    readonly: boolean;
}

const hobPackageProperties = (props: IProps) => {
    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfhob>(props.mfPackage.toObject());
    const {mfPackages, readonly} = props;
    const disPackage: FlopyModflowMfdis = mfPackages.getPackage('dis') as FlopyModflowMfdis;

    const affectedCellsLayers: number[][][] = [];
    for (let l = 0; l < disPackage.nlay; l++) {
        affectedCellsLayers[l] = [];
        for (let r = 0; r < disPackage.nrow; r++) {
            affectedCellsLayers[l][r] = [];
            for (let c = 0; c < disPackage.ncol; c++) {
                affectedCellsLayers[l][r][c] = 0;
            }
        }
    }

    if (mfPackage.obs_data) {
        Object.values(mfPackage.obs_data).forEach((spv: IObsData) => {
            const {layer, row, column} = spv;
            affectedCellsLayers[layer][row][column] = 1;
        });
    }

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        return setMfPackage({...mfPackage, [name]: value});
    };

    const handleOnBlur = () => {
        return props.onChange(FlopyModflowMfhob.fromObject(mfPackage));
    };

    const renderInfoPopup = (
        description: string | JSX.Element,
        title: string,
        position: PopupProps['position'] | undefined = undefined,
        iconOutside: boolean | undefined = undefined
    ) => (
        <InfoPopup description={description} title={title} position={position} iconOutside={iconOutside}/>
    );

    return (
        <Form>
            <Grid divided={'vertically'}>
                <Header as={'h2'}>Head Observation Package</Header>
                <Grid.Row columns={2}>
                    {affectedCellsLayers.map((layer: any, idx) => (
                        <Grid.Column key={idx}>
                            <Header as={'p'}>Layer {idx + 1}</Header>
                            <RasterDataImage
                                data={layer}
                                gridSize={GridSize.fromData(layer)}
                                unit={''}
                                legend={[
                                    {value: 1, color: 'blue', label: 'HOB affected cells'},
                                ] as RainbowOrLegend}
                                border={'1px dotted black'}
                            />
                        </Grid.Column>
                    ))}
                </Grid.Row>
            </Grid>

            <Form.Group widths="equal">
                <Form.Field>
                    <label>Unit number (iuhobsv)</label>
                    <Input
                        readOnly={readonly}
                        name="iuhobsv"
                        type="number"
                        value={mfPackage.iuhobsv || ''}
                        icon={renderInfoPopup(documentation.iuhobsv, 'iuhobsv')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Dry cell equivalent (hobdry)</label>
                    <Input
                        readOnly={readonly}
                        name="hobdry"
                        type="number"
                        value={mfPackage.hobdry || ''}
                        icon={renderInfoPopup(documentation.hobdry, 'hobdry')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Time step multiplier (tomulth)</label>
                    <Input
                        readOnly={readonly}
                        name="tomulth"
                        type="number"
                        value={mfPackage.tomulth || ''}
                        icon={renderInfoPopup(documentation.tomulth, 'tomulth')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default hobPackageProperties;
