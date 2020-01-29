import React, {useState} from 'react';
import {Checkbox, Form, Grid, Header, Input, Label, Segment} from 'semantic-ui-react';
import {FlopyModflowMfdis, FlopyModflowMffhb} from '../../../../../../core/model/flopy/packages/mf';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import {IFlopyModflowMffhb} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMffhb';
import {GridSize} from '../../../../../../core/model/modflow';
import {InfoPopup} from '../../../../../shared';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModflowMffhb;
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowMffhb) => void;
    readonly: boolean;
}

const fhbPackageProperties = (props: IProps) => {
    const [mfPackage] = useState<IFlopyModflowMffhb>(props.mfPackage.toObject());
    const {mfPackages, readonly} = props;

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

    return (
        <Form>
            <Header as={'h3'} dividing={true}>FHB: Flow and Head Boundary Package</Header>
            <Grid divided={'vertically'}>
                <Grid.Row columns={2}>
                    {affectedCellsLayers.map((layer: any, idx) => (
                        <Grid.Column key={idx}>
                            <Label>Layer {idx + 1}</Label>
                            <RasterDataImage
                                data={layer}
                                gridSize={GridSize.fromData(layer)}
                                unit={''}
                                border={'1px dotted black'}
                            />
                        </Grid.Column>
                    ))}
                </Grid.Row>
            </Grid>

            <Segment>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Form.Field>
                                <label>No. of times flow and head are specified (NBDTIM)</label>
                                <Input
                                    readOnly={true}
                                    name="nbdtim"
                                    value={mfPackage.nbdtim}
                                    icon={<InfoPopup description={documentation.nbdtim} title={'NBDTIM'}/>}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Cells with specified flow (NFLW)</label>
                                <Input
                                    readOnly={true}
                                    name="nflw"
                                    value={mfPackage.nflw}
                                    icon={<InfoPopup description={documentation.nflw} title={'NFLW'}/>}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Cells with specified head (NHED)</label>
                                <Input
                                    readOnly={true}
                                    name="nhed"
                                    value={mfPackage.nhed}
                                    icon={<InfoPopup description={documentation.nhed} title={'NHED'}/>}
                                />
                            </Form.Field>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <label>Auxiliary variables for each flow cell (NFHBX1)</label>
                                    <Input
                                        readOnly={true}
                                        name="nfhbx1"
                                        value={mfPackage.nfhbx1}
                                        icon={<InfoPopup description={documentation.nfhbx1} title={'NFHBX1'}/>}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Auxiliary variables for each head cell (NFHBX2)</label>
                                    <Input
                                        readOnly={true}
                                        name="nfhbx2"
                                        value={mfPackage.nfhbx2}
                                        icon={<InfoPopup description={documentation.nfhbx1} title={'NFHBX2'}/>}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Field>
                                <label>Steady-state option (IFHBSS)</label>
                                <Checkbox
                                    toggle={true}
                                    disabled={readonly}
                                    name="ifhbss"
                                    value={mfPackage.ifhbss}
                                    icon={<InfoPopup description={documentation.ifhbss} title={'IFHBSS'}/>}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Save cell-by-cell data (IPAKCB)</label>
                                <Checkbox
                                    toggle={true}
                                    disabled={readonly}
                                    name="ipakcb"
                                    value={mfPackage.ipakcb || ''}
                                    icon={<InfoPopup description={documentation.ipakcb} title={'IPAKCB'}/>}
                                />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>

            <Segment>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Form.Field>
                                <label>Constant multiplier for bdtime (BDTIMECNSTM)</label>
                                <Input
                                    readOnly={true}
                                    name="bdtimecnstm"
                                    value={mfPackage.bdtimecnstm}
                                    icon={<InfoPopup description={documentation.bdtimecnstm} title={'BDTIMECNSTM'}/>}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Simulation time (BDTIME)</label>
                                <Input
                                    readOnly={true}
                                    name="bdtime"
                                    value={mfPackage.bdtime}
                                    icon={<InfoPopup description={documentation.bdtime} title={'BDTIME'}/>}
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Field>
                                <label>Print data list (IFHBUN)</label>
                                <Checkbox
                                    toggle={true}
                                    name="ifhbpt"
                                    value={mfPackage.ifhbpt}
                                    icon={<InfoPopup description={documentation.ifhbpt} title={'IFHBUN'}/>}
                                />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>

            <Form.Group widths="equal">
                <Form.Field>
                    <label>Constant multiplier for flwrat (CNSTM5)</label>
                    <Input
                        readOnly={true}
                        name="cnstm5"
                        value={mfPackage.cnstm5}
                        icon={<InfoPopup description={documentation.cnstm5} title={'CNSTM5'}/>}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Dataset 5 (DS5)</label>
                    <Input
                        readOnly={true}
                        name="ds5"
                        value={mfPackage.ds5}
                        icon={<InfoPopup description={documentation.ds5} title={'DS5'}/>}
                    />
                </Form.Field>
            </Form.Group>

            <Form.Group widths="equal">
                <Form.Field>
                    <label>Constant multiplier for sbhedt (CNSTM7)</label>
                    <Input
                        readOnly={true}
                        name="cnstm7"
                        value={mfPackage.cnstm7}
                        icon={<InfoPopup description={documentation.cnstm7} title={'CNSTM7'}/>}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Dataset 7 (DS7)</label>
                    <Input
                        readOnly={true}
                        name="ds7"
                        value={mfPackage.ds7}
                        icon={<InfoPopup description={documentation.ds7} title={'DS7'}/>}
                    />
                </Form.Field>
            </Form.Group>

            <Form.Group widths="equal">
                <Form.Field>
                    <label>Filename extension (extension)</label>
                    <Input
                        readOnly={true}
                        name="extension"
                        value={mfPackage.extension}
                        icon={<InfoPopup description={documentation.extension} title={'extension'}/>}
                    />
                </Form.Field>
                <Form.Field>
                    <label>File unit number (unitnumber)</label>
                    <Input
                        readOnly={true}
                        name="unitnumber"
                        value={mfPackage.unitnumber || ''}
                        icon={<InfoPopup description={documentation.unitnumber} title={'unitnumber'}/>}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filenames (filenames)</label>
                    <Input
                        readOnly={true}
                        name="filenames"
                        value={mfPackage.filenames || ''}
                        icon={<InfoPopup description={documentation.filenames} title={'filenames'}/>}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default fhbPackageProperties;
