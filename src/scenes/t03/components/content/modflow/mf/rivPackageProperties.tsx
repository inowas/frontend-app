import React, {useState} from 'react';
import {Checkbox, Form, Grid, Header, Input, Label} from 'semantic-ui-react';
import {FlopyModflowMfdis, FlopyModflowMfriv} from '../../../../../../core/model/flopy/packages/mf';
import {GridSize} from '../../../../../../core/model/modflow';
import {documentation} from '../../../../defaults/flow';
import {RasterDataImage} from '../../../../../shared/rasterData';
import FlopyModflow from "../../../../../../core/model/flopy/packages/mf/FlopyModflow";
import {IFlopyModflowMfriv} from "../../../../../../core/model/flopy/packages/mf/FlopyModflowMfriv";
import {InfoPopup} from "../../../../../shared";
import {RainbowOrLegend} from "../../../../../../services/rainbowvis/types";

interface IProps {
    mfPackage: FlopyModflowMfriv;
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowMfriv) => void;
    readonly: boolean;
}

const rivPackageProperties = (props: IProps) => {
    const [mfPackage] = useState<IFlopyModflowMfriv>(props.mfPackage.toObject());
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

    /*
    const basPackage = mfPackages.getPackage('bas');
    const {ibound} = basPackage;
    const affectedCellsLayers = ibound.map(l => l.map(r => r.map(() => 0)));
    Object.values(mfPackage.stress_period_data)[0].forEach(spv => {
        const [lay, row, col] = spv;
        affectedCellsLayers[lay][row][col] = 1;
    });
    */

    const renderInfoPopup = (description: string | JSX.Element, title: string) => (
        <InfoPopup description={description} title={title}/>
    );

    return (
        <Form>
            <Header as={'h3'} dividing={true}>RIV: River Package</Header>
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
                                    {value: 1, color: 'blue', label: 'RIV affected cells'}
                                ] as RainbowOrLegend}
                                border={'1px dotted black'}
                            />
                        </Grid.Column>
                    ))}
                </Grid.Row>
            </Grid>
            <Form.Group widths='equal'>
                <Form.Field>
                    <label>Save cell-by-cell budget data (ipakcb)</label>
                    <Checkbox
                        toggle
                        disabled={readonly}
                        name='ipakcb'
                        value={mfPackage.ipakcb || 0}
                        icon={renderInfoPopup(documentation.ipakcb, 'IPAKCB')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Package options (options)</label>
                    <Input
                        readOnly
                        name='options'
                        value={mfPackage.options || ''}
                        icon={renderInfoPopup(documentation.options, 'OPTIONS')}
                    />
                </Form.Field>
            </Form.Group>

            <Form.Group widths='equal'>
                <Form.Field>
                    <label>Filename extension (extension)</label>
                    <Input
                        readOnly
                        name='extension'
                        value={mfPackage.extension || ''}
                        icon={renderInfoPopup(documentation.extension, 'EXTENSION')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>File unit number (unitnumber)</label>
                    <Input
                        readOnly
                        type={'number'}
                        name='unitnumber'
                        value={mfPackage.unitnumber || ''}
                        icon={renderInfoPopup(documentation.unitnumber, 'UNITNUMBER')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filenames (filenames)</label>
                    <Input
                        readOnly
                        name='filenames'
                        value={mfPackage.filenames || ''}
                        icon={renderInfoPopup(documentation.filenames, 'FILENAMES')}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default rivPackageProperties;
