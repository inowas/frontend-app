import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {Checkbox, DropdownProps, Form, Grid, Header, Input, Label, Segment, Table} from 'semantic-ui-react';
import {FlopyModflowMfbcf, FlopyModflowMfdis} from '../../../../../../core/model/flopy/packages/mf';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import {IFlopyModflowMfbcf} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfbcf';
import {GridSize} from '../../../../../../core/model/modflow';
import {ILegendItemDiscrete} from '../../../../../../services/rainbowvis/types';
import InfoPopup from '../../../../../shared/InfoPopup';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {documentation} from '../../../../defaults/flow';

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
        props.onChange(FlopyModflowMfbcf.fromObject({...mfPackage, [name]: value}));
    };

    const handleOnSelect = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const {name, value} = data;
        setMfPackage({...mfPackage, [name]: value});
        props.onChange(FlopyModflowMfbcf.fromObject({...mfPackage, [name]: value}));
    };

    if (!mfPackage) {
        return null;
    }

    return (
        <Form>
            <Header as={'h3'}>BCF: Block Centered Flow Package</Header>
            <Table collapsing={true} size={'small'} className={'packages'}>
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
                            <Table.Cell>
                                {Array.isArray(mfPackage.intercellt) ? mfPackage.intercellt[idx] : mfPackage.intercellt}
                            </Table.Cell>
                            <Table.Cell>
                                {Array.isArray(mfPackage.iwdflg) ? mfPackage.iwdflg[idx] : mfPackage.iwdflg}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <Segment basic={true}>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Save cell-by-cell budget data (IPAKCB)</label>
                        <Checkbox
                            toggle={true}
                            disabled={readonly}
                            name="ipakcb"
                            value={mfPackage.ipakcb ? 1 : 0}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <InfoPopup
                            description={documentation.ipakcb}
                            title={'IPAKCB'}
                            position={'top right'}
                            iconOutside={true}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Wetting capability (IWDFLG)</label>
                        <Checkbox
                            toggle={true}
                            disabled={readonly}
                            name="iwdflg"
                            value={mfPackage.iwdflg ? 1 : 0}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <InfoPopup
                            description={documentation.iwdflg}
                            title={'IWDFLG'}
                            position={'top right'}
                            iconOutside={true}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Rewetting factor (WETFCT)</label>
                        <Input
                            readOnly={readonly}
                            name={'wetfct'}
                            type={'number'}
                            value={mfPackage.wetfct}
                            onChange={handleOnChange}
                            onBlur={handleOnBlur(parseFloat)}
                            icon={<InfoPopup description={documentation.wetfct} title={'WETFCT'}/>}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Iteration interval (IWETIT)</label>
                        <Input
                            readOnly={readonly}
                            name={'iwetit'}
                            type={'number'}
                            value={mfPackage.iwetit}
                            onChange={handleOnChange}
                            onBlur={handleOnBlur(parseFloat)}
                            icon={<InfoPopup description={documentation.iwetit} title={'IWETIT'}/>}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Dry cell head (HDRY)</label>
                        <Input
                            readOnly={true}
                            name={'hdry'}
                            value={mfPackage.hdry}
                            onChange={handleOnChange}
                            onBlur={handleOnBlur(parseFloat)}
                            icon={<InfoPopup description={documentation.hdry} title={'HDRY'}/>}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Wetting threshold (WETDRY)</label>
                        <Input
                            readOnly={true}
                            name={'wetdry'}
                            value={mfPackage.wetdry}
                            icon={<InfoPopup description={documentation.wetdry} title={'WETDRY'}/>}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Field>
                    <label>Rewetting equation (IHDWET)</label>
                    <Form.Dropdown
                        options={[
                            {key: 0, value: 0, text: '(0) h = BOT + WETFCT (hn - BOT) (eq 33A)'},
                            {key: 1, value: 1, text: '(1) h = BOT + WETFCT(THRESH), (eq 33B)'},
                        ]}
                        name={'ihdwet'}
                        selection={true}
                        value={mfPackage.ihdwet ? 1 : 0}
                        disabled={readonly}
                        onChange={handleOnSelect}
                    />
                </Form.Field>
        </Segment>
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
                    );
                })}
            </Grid>

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
                    );
                })}
            </Grid>
            <Segment basic={true}>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Filename extension (extension)</label>
                        <Input
                            readOnly={true}
                            name="extension"
                            value={mfPackage.extension || ''}
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
            </Segment>
        </Form>
    );
};

export default bcfPackageProperties;
