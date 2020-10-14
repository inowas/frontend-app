import React, {useState} from 'react';
import {Checkbox, Form, Grid, Header, Input, Label} from 'semantic-ui-react';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import {IFlopyModflowMfwel} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfwel';
import {RainbowOrLegend} from '../../../../../../services/rainbowvis/types';

import {
    FlopyModflowMfdis,
    FlopyModflowMfwel
} from '../../../../../../core/model/flopy/packages/mf';
import {GridSize} from '../../../../../../core/model/modflow';
import {InfoPopup} from '../../../../../shared';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModflowMfwel;
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowMfwel) => void;
    readonly: boolean;
}

const WelPackageProperties = (props: IProps) => {
    const [mfPackage] = useState<IFlopyModflowMfwel>(props.mfPackage.toObject());
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

    if (mfPackage.stress_period_data) {
        Object.values(mfPackage.stress_period_data)[0].forEach((spv: number[]) => {
            const [lay, row, col] = spv;
            affectedCellsLayers[lay][row][col] = 1;
        });
    }

    const renderInfoPopup = (description: string | JSX.Element, title: string) => (
        <InfoPopup description={description} title={title}/>
    );

    return (
        <Form>
            <Header as={'h3'} dividing={true}>WEL: Well Package</Header>
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
                                    {value: 1, color: 'blue', label: 'WEL affected cells'}
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
                        description={documentation.wel.ipakcb}
                        title={'IPAKCB'}
                        position={'top right'}
                        iconOutside={true}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Package options (OPTIONS)</label>
                    <Input
                        readOnly={true}
                        name={'options'}
                        value={mfPackage.options || ''}
                        icon={renderInfoPopup(documentation.wel.options, 'OPTIONS')}
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
                        icon={renderInfoPopup(documentation.wel.extension, 'EXTENSION')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>File unit number (UNITNUMBER)</label>
                    <Input
                        readOnly={readonly}
                        name={'unitnumber'}
                        value={mfPackage.unitnumber || ''}
                        icon={renderInfoPopup(documentation.wel.unitnumber, 'UNITNUMBER')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filename (FILENAMES)</label>
                    <Input
                        readOnly={readonly}
                        name={'filenames'}
                        value={mfPackage.filenames || ''}
                        icon={renderInfoPopup(documentation.wel.filenames, 'FILENAMES')}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default WelPackageProperties;
