import React, {ChangeEvent, useState} from 'react';
import {Checkbox, Form, Grid, Header, Input, Label, Segment} from 'semantic-ui-react';
import {
    FlopyModflowMfdis,
    FlopyModflowMffhb
} from '../../../../../../core/model/flopy/packages/mf';
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

const FhbPackageProperties = (props: IProps) => {
    const [mfPackage, setMfPackage] = useState<IFlopyModflowMffhb>(props.mfPackage.toObject());
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
        props.onChange(FlopyModflowMffhb.fromObject({...mfPackage, [name]: value}));
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
                                <label>Cells with specified flow (NFLW)</label>
                                <Input
                                    readOnly={readonly}
                                    type={'number'}
                                    name={'nflw'}
                                    value={mfPackage.nflw}
                                    onChange={handleOnChange}
                                    onBlur={handleOnBlur(parseFloat)}
                                    icon={<InfoPopup description={documentation.fhb.nflw} title={'NFLW'}/>}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Cells with specified head (NHED)</label>
                                <Input
                                    readOnly={readonly}
                                    type={'number'}
                                    name={'nhed'}
                                    value={mfPackage.nhed}
                                    onChange={handleOnChange}
                                    onBlur={handleOnBlur(parseFloat)}
                                    icon={<InfoPopup description={documentation.fhb.nhed} title={'NHED'}/>}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Auxiliary variables for each flow cell (NFHBX1)</label>
                                <Input
                                    readOnly={readonly}
                                    type={'number'}
                                    name={'nfhbx1'}
                                    value={mfPackage.nfhbx1}
                                    onChange={handleOnChange}
                                    onBlur={handleOnBlur(parseFloat)}
                                    icon={<InfoPopup description={documentation.fhb.nfhbx1} title={'NFHBX1'}/>}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Auxiliary variables for each head cell (NFHBX2)</label>
                                <Input
                                    readOnly={readonly}
                                    type={'number'}
                                    name={'nfhbx2'}
                                    value={mfPackage.nfhbx2}
                                    onChange={handleOnChange}
                                    onBlur={handleOnBlur(parseFloat)}
                                    icon={<InfoPopup description={documentation.fhb.nfhbx1} title={'NFHBX2'}/>}
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Field>
                                <label>No. of times flow and head are specified (NBDTIM)</label>
                                <Input
                                    readOnly={readonly}
                                    type={'number'}
                                    name={'nbdtim'}
                                    value={mfPackage.nbdtim}
                                    onChange={handleOnChange}
                                    onBlur={handleOnBlur(parseFloat)}
                                    icon={<InfoPopup description={documentation.fhb.nbdtim} title={'NBDTIM'}/>}
                                />
                            </Form.Field>
                            <Form.Group>
                                <Form.Field>
                                    <label>Steady-state option (IFHBSS)</label>
                                    <Checkbox
                                        toggle={true}
                                        disabled={readonly}
                                        name={'ifhbss'}
                                        value={mfPackage.ifhbss ? 1 : 0}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    <InfoPopup
                                        description={documentation.fhb.ifhbss}
                                        title={'IFHBSS'}
                                        position={'top right'}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field>
                                    <label>Save cell-by-cell data (IPAKCB)</label>
                                    <Checkbox
                                        toggle={true}
                                        disabled={readonly}
                                        name={'ipakcb'}
                                        value={mfPackage.ipakcb ? 1 : 0}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    <InfoPopup
                                        description={documentation.fhb.ipakcb}
                                        title={'IPAKCB'}
                                        position={'top right'}
                                    />
                                </Form.Field>
                            </Form.Group>
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
                                    readOnly={readonly}
                                    type={'number'}
                                    name={'bdtimecnstm'}
                                    value={mfPackage.bdtimecnstm}
                                    onChange={handleOnChange}
                                    onBlur={handleOnBlur(parseFloat)}
                                    icon={
                                        <InfoPopup
                                            description={documentation.fhb.bdtimecnstm}
                                            title={'BDTIMECNSTM'}
                                        />}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Simulation time (BDTIME)</label>
                                <Input
                                    readOnly={readonly}
                                    type={'number'}
                                    name={'bdtime'}
                                    value={mfPackage.bdtime || ''}
                                    onChange={handleOnChange}
                                    onBlur={handleOnBlur(parseFloat)}
                                    icon={<InfoPopup description={documentation.fhb.bdtime} title={'BDTIME'}/>}
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Group>
                                <Form.Field>
                                    <label>Print data list (IFHBPT)</label>
                                    <Checkbox
                                        toggle={true}
                                        disabled={readonly}
                                        name={'ifhbpt'}
                                        value={mfPackage.ifhbpt || 0}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    <InfoPopup
                                        description={documentation.fhb.ifhbpt}
                                        title={'IFHBPT'}
                                        position={'top right'}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Form.Field>
                                <label>Constant multiplier for flwrat (CNSTM5)</label>
                                <Input
                                    readOnly={readonly}
                                    type={'number'}
                                    name={'cnstm5'}
                                    value={mfPackage.cnstm5}
                                    onChange={handleOnChange}
                                    onBlur={handleOnBlur(parseFloat)}
                                    icon={<InfoPopup description={documentation.fhb.cnstm5} title={'CNSTM5'}/>}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Constant multiplier for sbhedt (CNSTM7)</label>
                                <Input
                                    readOnly={readonly}
                                    type={'number'}
                                    name={'cnstm7'}
                                    value={mfPackage.cnstm7}
                                    onChange={handleOnChange}
                                    onBlur={handleOnBlur(parseFloat)}
                                    icon={<InfoPopup description={documentation.fhb.cnstm7} title={'CNSTM7'}/>}
                                />
                            </Form.Field>
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Field>
                                <label>Dataset 5 (DS5)</label>
                                <Input
                                    readOnly={readonly}
                                    name={'ds5'}
                                    value={mfPackage.ds5}
                                    onChange={handleOnChange}
                                    onBlur={handleOnBlur(parseFloat)}
                                    icon={<InfoPopup description={documentation.fhb.ds5} title={'DS5'}/>}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Dataset 7 (DS7)</label>
                                <Input
                                    readOnly={readonly}
                                    name={'ds7'}
                                    value={mfPackage.ds7}
                                    onChange={handleOnChange}
                                    onBlur={handleOnBlur(parseFloat)}
                                    icon={<InfoPopup description={documentation.fhb.ds7} title={'DS7'}/>}
                                />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            <Segment>
                <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Filename extension (EXTENSION)</label>
                        <Input
                            readOnly={readonly}
                            name="extension"
                            value={mfPackage.extension}
                            icon={<InfoPopup description={documentation.fhb.extension} title={'EXTENSION'}/>}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (UNITNUMBER)</label>
                        <Input
                            readOnly={readonly}
                            name="unitnumber"
                            value={mfPackage.unitnumber || 0}
                            icon={<InfoPopup description={documentation.fhb.unitnumber} title={'UNITNUMBER'}/>}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (FILENAMES)</label>
                        <Input
                            readOnly={readonly}
                            name="filenames"
                            value={mfPackage.filenames || ''}
                            icon={<InfoPopup description={documentation.fhb.filenames} title={'FILENAMES'}/>}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
        </Form>
    );
};

export default FhbPackageProperties;
