import React, {useEffect, useState} from 'react';
import {Form, Grid, Header, Input, Label} from 'semantic-ui-react';
import {FlopyModflowMfdis} from '../../../../../../core/model/flopy/packages/mf';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import {FlopyMt3dMtssm} from '../../../../../../core/model/flopy/packages/mt';
import {IFlopyMt3dMtssm} from '../../../../../../core/model/flopy/packages/mt/FlopyMt3dMtssm';
import {Array2D} from '../../../../../../core/model/geometry/Array2D.type';
import {GridSize} from '../../../../../../core/model/modflow';
import {RainbowOrLegend} from '../../../../../../services/rainbowvis/types';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';
import InfoPopup from '../../../../../shared/InfoPopup';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {documentation} from '../../../../defaults/transport';

interface IProps {
    mfPackages: FlopyModflow;
    mtPackage: FlopyMt3dMtssm;
    onChange: (p: FlopyMt3dMtssm) => any;
    readOnly: boolean;
}

const SsmPackageProperties = (props: IProps) => {

    const [mtPackage, setMtPackage] = useState<IFlopyMt3dMtssm>(props.mtPackage.toObject());

    useEffect(() => {
        setMtPackage(props.mtPackage.toObject());
    }, [props.mtPackage]);

    const {mfPackages} = props;

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

    if (mtPackage.stress_period_data) {
        Object.values(mtPackage.stress_period_data)[0].forEach((spv) => {
            const [lay, row, col] = spv;
            affectedCellsLayers[lay][row][col] = 1;
        });
    }

    return (
        <Form>
            <Header as={'h3'} dividing={true}>SSM: Source and Sink Mixing Package</Header>
            <Grid divided={'vertically'}>
                <Grid.Row columns={2}>
                    {affectedCellsLayers.map((layer, idx) => (
                        <Grid.Column key={idx}>
                            <Label>Layer {idx + 1}</Label>
                            <RasterDataImage
                                data={layer as Array2D<number>}
                                gridSize={GridSize.fromData(layer as Array2D<number>)}
                                unit={''}
                                legend={[{value: 1, color: 'blue', label: 'SSM affected cells'}] as RainbowOrLegend}
                                border={'1px dotted black'}
                            />
                        </Grid.Column>
                    ))}
                </Grid.Row>
            </Grid>

            <Form.Group widths="equal">
                <Form.Field>
                    <label>Filename extension (EXTENSION)</label>
                    <Input
                        readOnly={true}
                        name="extension"
                        value={mtPackage.extension}
                        icon={<InfoPopup
                            description={documentation.ssm.extension}
                            title={'EXTENSION'}
                        />}
                    />
                </Form.Field>
                <Form.Field>
                    <label>File unit number (UNITNUMBER)</label>
                    <Input
                        readOnly={true}
                        name="unitnumber"
                        value={mtPackage.unitnumber || ''}
                        icon={renderInfoPopup(documentation.ssm.unitnumber, 'UNITNUMBER')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filenames (FILENAMES)</label>
                    <Input
                        readOnly={true}
                        name="filenames"
                        value={mtPackage.filenames || ''}
                        icon={renderInfoPopup(documentation.ssm.filenames, 'FILENAMES')}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default SsmPackageProperties;
