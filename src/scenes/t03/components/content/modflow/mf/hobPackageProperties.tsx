import React, {ChangeEvent, useState} from 'react';
import {Form, Grid, Header, Input, Label, PopupProps} from 'semantic-ui-react';
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

const HobPackageProperties = (props: IProps) => {
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
        props.onChange(FlopyModflowMfhob.fromObject({...mfPackage, [name]: value}));
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            <Header as={'h3'} dividing={true}>HOB: Head Observation Package</Header>
            <Grid divided={'vertically'}>
                <Grid.Row columns={2}>
                    {affectedCellsLayers.map((layer: any, idx) => (
                        <Grid.Column key={idx}>
                            <Label>Layer {idx + 1}</Label>
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

            <Form.Group widths={'equal'}>
                <Form.Field>
                    <label>Unit number (IUHOBSV)</label>
                    <Input
                        readOnly={readonly}
                        name={'iuhobsv'}
                        type={'number'}
                        value={mfPackage.iuhobsv}
                        icon={<InfoPopup description={documentation.hob.iuhobsv} title={'IUHOBSV'}/>}
                        onChange={handleOnChange}
                        onBlur={handleOnBlur(parseFloat)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Dry cell equivalent (HOBDRY)</label>
                    <Input
                        readOnly={readonly}
                        name={'hobdry'}
                        type={'number'}
                        value={mfPackage.hobdry}
                        icon={<InfoPopup description={documentation.hob.hobdry} title={'HOBDRY'}/>}
                        onChange={handleOnChange}
                        onBlur={handleOnBlur(parseFloat)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Time step multiplier (TOMULTH)</label>
                    <Input
                        readOnly={readonly}
                        name={'tomulth'}
                        type={'number'}
                        value={mfPackage.tomulth}
                        icon={<InfoPopup description={documentation.hob.tomulth} title={'TOMULTH'}/>}
                        onChange={handleOnChange}
                        onBlur={handleOnBlur(parseFloat)}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default HobPackageProperties;
