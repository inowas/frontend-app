import React, {SyntheticEvent, useState} from 'react';
import {DropdownProps, Form, Grid, Header, Input, Label} from 'semantic-ui-react';

import {FlopyModflowMfdis, FlopyModflowMfghb} from '../../../../../../core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {GridSize} from '../../../../../../core/model/modflow';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import {IFlopyModflowMfghb} from "../../../../../../core/model/flopy/packages/mf/FlopyModflowMfghb";
import {RainbowOrLegend} from "../../../../../../services/rainbowvis/types";
import InfoPopup from "../../../../../shared/InfoPopup";

interface IProps {
    mfPackage: FlopyModflowMfghb;
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowMfghb) => void;
    readonly: boolean;
}

const ghbPackageProperties = (props: IProps) => {
    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfghb>(props.mfPackage.toObject());
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
        props.onChange(FlopyModflowMfghb.fromObject({...mfPackage, [name]: value}));
    };

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

            <Form.Group widths='equal'>
                <Form.Field>
                    <label>Cell-by-cell budget data (ipakcb)</label>
                    <Form.Dropdown
                        options={[
                            {key: 0, value: 0, text: 'false'},
                            {key: 1, value: 1, text: 'true'},
                        ]}
                        placeholder='Select ipakcb'
                        name='ipakcb'
                        selection
                        value={mfPackage.ipakcb}
                        disabled={readonly}
                        onChange={handleOnSelect}
                    />
                </Form.Field>

                <Form.Field>
                    <label>Package Options</label>
                    <Input
                        readOnly
                        name='options'
                        value={mfPackage.options || ''}
                        icon={<InfoPopup description={documentation.options} title={'options'}/>}
                    />
                </Form.Field>
            </Form.Group>

            <Form.Group widths='equal'>
                <Form.Field>
                    <label>Filename extension (extension)</label>
                    <Input
                        readOnly
                        name='extension'
                        value={mfPackage.extension}
                        icon={<InfoPopup description={documentation.extension} title={'extension'}/>}
                    />
                </Form.Field>
                <Form.Field>
                    <label>File unit number (unitnumber)</label>
                    <Input
                        readOnly
                        name='unitnumber'
                        value={mfPackage.unitnumber || ''}
                        icon={<InfoPopup description={documentation.unitnumber} title={'unitnumber'}/>}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filenames (filenames)</label>
                    <Input
                        readOnly
                        name='filenames'
                        value={mfPackage.filenames || ''}
                        icon={<InfoPopup description={documentation.filenames} title={'filenames'}/>}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

/*class GhbPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackage, mfPackages, readonly} = this.props;
        const basPackage = mfPackages.getPackage('bas');
        const {ibound} = basPackage;
        const affectedCellsLayers = ibound.map(l => l.map(r => r.map(() => 0)));
        Object.values(mfPackage.stress_period_data)[0].forEach(spv => {
            const [lay, row, col] = spv;
            affectedCellsLayers[lay][row][col] = 1;
        });
    }
}

GhbPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfghb),
    mfPackages: PropTypes.instanceOf(FlopyModflow),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};*/


export default ghbPackageProperties;
