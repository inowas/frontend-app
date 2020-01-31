import React, {SyntheticEvent, useState} from 'react';
import {DropdownProps, Form, Grid, Header, Input, Label} from 'semantic-ui-react';
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

const welPackageProperties = (props: IProps) => {
    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfwel>(props.mfPackage.toObject());
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

    const handleOnSelect = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const {name, value} = data;
        setMfPackage({...mfPackage, [name]: value});
        props.onChange(FlopyModflowMfwel.fromObject({...mfPackage, [name]: value}));
    };

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
                <Form.Field>
                    <label>Save cell-by-cell budget data (ipakcb)</label>
                    <Form.Dropdown
                        options={[
                            {key: 0, value: 0, text: 'false'},
                            {key: 1, value: 1, text: 'true'},
                        ]}
                        placeholder="Select ipakcb"
                        name="ipakcb"
                        selection={true}
                        value={mfPackage.ipakcb || 0}
                        disabled={readonly}
                        onChange={handleOnSelect}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Package options (options)</label>
                    <Input
                        readOnly={true}
                        name="options"
                        value={mfPackage.options || ''}
                        icon={renderInfoPopup(documentation.options, 'options')}
                    />
                </Form.Field>
            </Form.Group>

            <Form.Group widths="equal">
                <Form.Field>
                    <label>Filename extension (extension)</label>
                    <Input
                        readOnly={true}
                        name="extension"
                        value={mfPackage.extension || ''}
                        icon={renderInfoPopup(documentation.extension, 'extension')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>File unit number (unitnumber)</label>
                    <Input
                        readOnly={true}
                        name="unitnumber"
                        value={mfPackage.unitnumber || ''}
                        icon={renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filename (filenames)</label>
                    <Input
                        readOnly={true}
                        name="filenames"
                        value={mfPackage.filenames || ''}
                        icon={renderInfoPopup(documentation.filenames, 'filenames')}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default welPackageProperties;
