import React, {useState} from 'react';
import {Form, Grid, Input, Header, Label, Table, Checkbox, Segment} from 'semantic-ui-react';
import {FlopyModflowMfbcf, FlopyModflowMfdis} from '../../../../../../core/model/flopy/packages/mf';
import InfoPopup from '../../../../../shared/InfoPopup';
import {documentation} from '../../../../defaults/flow';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {GridSize} from '../../../../../../core/model/modflow';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import {IFlopyModflowMfbcf} from "../../../../../../core/model/flopy/packages/mf/FlopyModflowMfbcf";
import {ILegendItemDiscrete} from "../../../../../../services/rainbowvis/types";

interface IProps {
    mfPackage: FlopyModflowMfbcf;
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowMfbcf) => void;
    readonly: boolean;
}

const bcfPackageProperties = (props: IProps) => {

    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfbcf>(props.mfPackage.toObject());
    const {mfPackages, readonly} = props;
    const disPackage: FlopyModflowMfdis = mfPackages.getPackage('dis') as FlopyModflowMfdis;
    const {nrow, ncol} = disPackage;

   /*
   class BcfPackageProperties extends AbstractPackageProperties {

        render() {
            if (!this.state.mfPackage) {
                return null;
            }

            const mfPackage = FlopyModflowMfbcf.fromObject(this.state.mfPackage);
            const {mfPackages, readonly} = this.props;
            const disPackage = mfPackages.getPackage('dis');
            const {nrow, ncol} = disPackage;


        }
    }*/

    return (
        <Form>
            <Header as={'h3'}>BCF: Block Centered Flow Package</Header>
            <Table collapsing size={'small'} className={'packages'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell><Label>Layer</Label></Table.HeaderCell>
                        <Table.HeaderCell><Label>Laycon</Label></Table.HeaderCell>
                        <Table.HeaderCell><Label>intercellt</Label></Table.HeaderCell>
                        <Table.HeaderCell><Label>Laywet</Label></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {Array.isArray(mfPackage.laycon) && mfPackage.laycon.map((laycon, idx) => (
                        <Table.Row key={idx}>
                            <Table.Cell>{idx + 1}</Table.Cell>
                            <Table.Cell>{laycon}</Table.Cell>
                            <Table.Cell>{Array.isArray(mfPackage.intercellt) ? mfPackage.intercellt[idx] : mfPackage.intercellt}</Table.Cell>
                            <Table.Cell>{Array.isArray(mfPackage.iwdflg) ? mfPackage.iwdflg[idx] : mfPackage.iwdflg}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <Grid>
                {Array.isArray(mfPackage.tran) && mfPackage.tran.map((tran, idx) => {
                    const trpy = Array.isArray(mfPackage.trpy) ? mfPackage.trpy[idx] : mfPackage.trpy;
                    return (
                        <Grid.Row key={idx} columns={2}>
                            <Grid.Column>
                                <Label>Hk Layer {idx + 1}</Label>
                                <RasterDataImage
                                    data={tran}
                                    gridSize={GridSize.fromNxNy(ncol, nrow)}
                                    legend={Array.isArray(tran) ? undefined : [{
                                        value: tran,
                                        color: 'rgb(173, 221, 142)',
                                        label: tran + ' m²/s'
                                    }] as ILegendItemDiscrete[]}
                                    unit={''}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Label>Horizontal anisotropy Layer {idx + 1}</Label>
                                <RasterDataImage
                                    data={trpy}
                                    gridSize={GridSize.fromNxNy(ncol, nrow)}
                                    legend={Array.isArray(trpy) ? undefined : [{
                                        value: trpy,
                                        color: 'rgb(173, 221, 142)',
                                        label: trpy.toString()
                                    }] as ILegendItemDiscrete[]}
                                    unit={''}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                })}
            </Grid>
            <Segment basic={true}>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Save cell-by-cell budget data (ipakcb)</label>
                        <Checkbox
                            toggle
                            disabled={readonly}
                            name='ipakcb'
                            value={mfPackage.ipakcb || 0}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        {<InfoPopup description={documentation.ipakcb} title={'IPAKCB'} position={'top right'} iconOutside={true}/>}
                    </Form.Field>
                    <Form.Field>
                        <label>Dry cell head (hdry)</label>
                        <Input
                            readOnly
                            name='hdry'
                            value={JSON.stringify(mfPackage.hdry)}
                            icon={<InfoPopup description={documentation.hdry} title={'hdry'}/>}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Rewetting factor (wetfct)</label>
                        <Input
                            readOnly
                            name='wetfct'
                            value={JSON.stringify(mfPackage.wetfct)}
                            icon={<InfoPopup description={documentation.wetfct} title={'wetfct'}/>}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>


            <Grid>
                {Array.isArray(mfPackage.sf1) && mfPackage.sf1.map((sf1, idx) => {
                    const sf2 = Array.isArray(mfPackage.sf2) ? mfPackage.sf2[idx] : mfPackage.sf2;
                    return (
                        <Grid.Row key={idx} columns={2}>
                            <Grid.Column>
                                <Label>Specific storage Layer {idx + 1}</Label>
                                <RasterDataImage
                                    data={sf1}
                                    gridSize={GridSize.fromNxNy(ncol, nrow)}
                                    legend={Array.isArray(sf1) ? undefined : [{
                                        value: sf1,
                                        color: 'rgb(173, 221, 142)',
                                        label: sf1.toString()
                                    }] as ILegendItemDiscrete[]}
                                    unit={''}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Label>Specific yield {idx + 1}</Label>
                                <RasterDataImage
                                    data={sf2}
                                    gridSize={GridSize.fromNxNy(ncol, nrow)}
                                    legend={Array.isArray(sf2) ? undefined : [{
                                        value: sf2,
                                        color: 'rgb(173, 221, 142)',
                                        label: sf2.toString()
                                    }] as ILegendItemDiscrete[]}
                                    unit={''}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                })}
            </Grid>

            <Segment basic={true}>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Iteration interval (iwetit)</label>
                        <Input
                            readOnly
                            name='iwetit'
                            value={mfPackage.iwetit}
                            icon={<InfoPopup description={documentation.iwetit} title={'iwetit'}/>}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Rewetting equation (ihdwet)</label>
                        <Input
                            readOnly
                            name='ihdwet'
                            value={JSON.stringify(mfPackage.ihdwet)}
                            icon={<InfoPopup description={documentation.ihdwet} title={'ihdwet'}/>}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Wetting threshold (wetdry)</label>
                        <Input
                            readOnly
                            name='wetdry'
                            value={mfPackage.wetdry}
                            icon={<InfoPopup description={documentation.wetdry} title={'wetdry'}/>}
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
            </Segment>
        </Form>
    );
};

export default bcfPackageProperties;
