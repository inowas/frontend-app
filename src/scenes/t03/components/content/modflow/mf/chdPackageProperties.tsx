import React, {ChangeEvent, useState} from 'react';
import {Form, Grid, Header, Input, Label, Segment} from 'semantic-ui-react';
import {FlopyModflowMfchd, FlopyModflowMfdis} from '../../../../../../core/model/flopy/packages/mf';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import {IFlopyModflowMfchd} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfchd';
import {GridSize} from '../../../../../../core/model/modflow';
import {RainbowOrLegend} from '../../../../../../services/rainbowvis/types';
import InfoPopup from '../../../../../shared/InfoPopup';
import RasterDataImage from '../../../../../shared/rasterData/rasterDataImage';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModflowMfchd;
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowMfchd) => void;
    readonly: boolean;
}

const chdPackageProperties = (props: IProps) => {
    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfchd>(props.mfPackage.toObject());
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
        props.onChange(FlopyModflowMfchd.fromObject({...mfPackage, [name]: value}));
    };

    if (!mfPackage) {
        return null;
    }

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
            <Header as={'h3'} dividing={true}>CHD: Constant Head Package</Header>
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
            <Segment>
                <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Filename extension (EXTENSION)</label>
                        <Input
                            readOnly={readonly}
                            name={'extension'}
                            value={mfPackage.extension}
                            onChange={handleOnChange}
                            onBlur={handleOnBlur(parseFloat)}
                            icon={<InfoPopup description={documentation.chd.extension} title={'EXTENSION'}/>}
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
                            icon={<InfoPopup description={documentation.chd.unitnumber} title={'UNITNUMBER'}/>}
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
                            icon={<InfoPopup description={documentation.chd.filenames} title={'FILENAMES'}/>}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
        </Form>
    );
};

export default chdPackageProperties;
