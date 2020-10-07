import React, {ChangeEvent, useState} from 'react';
import {Checkbox, Form, Grid, Header, Input, Label} from 'semantic-ui-react';
import {FlopyModflowMfdis, FlopyModflowMfghb} from '../../../../../../core/model/flopy/packages/mf';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import {IFlopyModflowMfghb} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfghb';
import {GridSize} from '../../../../../../core/model/modflow';
import {RainbowOrLegend} from '../../../../../../services/rainbowvis/types';
import InfoPopup from '../../../../../shared/InfoPopup';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModflowMfghb;
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowMfghb) => void;
    readonly: boolean;
}

const ghbPackageProperties = (props: IProps) => {
    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfghb>(props.mfPackage.toObject());
    const {mfPackages, readonly} = props;

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
        props.onChange(FlopyModflowMfghb.fromObject({...mfPackage, [name]: value}));
    };

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

    if (mfPackage.stress_period_data) {
        Object.values(mfPackage.stress_period_data)[0].forEach((spv: number[]) => {
            const [lay, row, col] = spv;
            affectedCellsLayers[lay][row][col] = 1;
        });
    }

    return (
        <Form>
            <Header as={'h3'} dividing={true}>GHB: General-Head Boundary Package</Header>
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
                                    {value: 1, color: 'blue', label: 'GHB affected cells'},
                                ] as RainbowOrLegend}
                                border={'1px dotted black'}
                            />
                        </Grid.Column>
                    ))}
                </Grid.Row>
            </Grid>
            <Form.Group widths={'equal'}>
                <Form.Field width={14}>
                    <label>Save cell-by-cell budget data (IPAKCB)</label>
                    <Checkbox
                        toggle={true}
                        disabled={readonly}
                        name={'ipakcb'}
                        value={mfPackage.ipakcb ? 1 : 0}
                    />
                </Form.Field>
                <Form.Field width={1}>
                    <InfoPopup
                        description={documentation.ghb.ipakcb}
                        title={'IPAKCB'}
                        position={'top right'}
                        iconOutside={true}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Package Options (OPTIONS)</label>
                    <Input
                        readOnly={readonly}
                        name={'options'}
                        value={mfPackage.options || ''}
                        onChange={handleOnChange}
                        onBlur={handleOnBlur(parseFloat)}
                        icon={<InfoPopup description={documentation.ghb.options} title={'OPTIONS'}/>}
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
                        onChange={handleOnChange}
                        onBlur={handleOnBlur(parseFloat)}
                        icon={<InfoPopup description={documentation.ghb.extension} title={'EXTENSION'}/>}
                    />
                </Form.Field>
                <Form.Field>
                    <label>File unit number (UNITNUMBER)</label>
                    <Input
                        readOnly={readonly}
                        type={'number'}
                        name={'unitnumber'}
                        value={mfPackage.unitnumber || ''}
                        onChange={handleOnChange}
                        onBlur={handleOnBlur(parseFloat)}
                        icon={<InfoPopup description={documentation.ghb.unitnumber} title={'UNITNUMBER'}/>}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filenames (FILENAMES)</label>
                    <Input
                        readOnly={readonly}
                        name={'filenames'}
                        value={mfPackage.filenames || ''}
                        onChange={handleOnChange}
                        onBlur={handleOnBlur(parseFloat)}
                        icon={<InfoPopup description={documentation.ghb.filenames} title={'FILENAMES'}/>}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default ghbPackageProperties;
