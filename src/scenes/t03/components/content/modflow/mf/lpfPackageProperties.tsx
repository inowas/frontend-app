import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {Checkbox, DropdownProps, Form, Grid, Header, Input, Label, Segment, Table} from 'semantic-ui-react';

import {FlopyModflowMfdis, FlopyModflowMflpf} from '../../../../../../core/model/flopy/packages/mf';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import {IFlopyModflowMflpf} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMflpf';
import {GridSize} from '../../../../../../core/model/modflow';
import {ILegendItemContinuous, ILegendItemDiscrete} from '../../../../../../services/rainbowvis/types';
import {InfoPopup} from '../../../../../shared';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModflowMflpf;
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowMflpf) => void;
    readonly: boolean;
}

const lpfPackageProperties = (props: IProps) => {

    const [mfPackage, setMfPackage] = useState<IFlopyModflowMflpf>(props.mfPackage.toObject());

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
        props.onChange(FlopyModflowMflpf.fromObject({...mfPackage, [name]: value}));
    };

    const handleOnSelect = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const {name, value} = data;
        setMfPackage({...mfPackage, [name]: value});
        props.onChange(FlopyModflowMflpf.fromObject({...mfPackage, [name]: value}));
    };

    return (
        <Form>
            <Header as={'h3'}>LPF: Layer Property Flow Package</Header>
            <Table collapsing={true} size={'small'} className={'packages'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell><Label>Layer</Label></Table.HeaderCell>
                        <Table.HeaderCell><Label>Laytyp</Label></Table.HeaderCell>
                        <Table.HeaderCell><Label>Layavg</Label></Table.HeaderCell>
                        <Table.HeaderCell><Label>Chani</Label></Table.HeaderCell>
                        <Table.HeaderCell><Label>Layvka</Label></Table.HeaderCell>
                        <Table.HeaderCell><Label>Laywet</Label></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {Array.isArray(mfPackage.laytyp) && mfPackage.laytyp.map((laytyp, idx) => (
                        <Table.Row key={idx}>
                            <Table.Cell>{idx + 1}</Table.Cell>
                            <Table.Cell>{laytyp}</Table.Cell>
                            <Table.Cell>
                                {Array.isArray(mfPackage.layavg) ? mfPackage.layavg[idx] : mfPackage.layavg}
                            </Table.Cell>
                            <Table.Cell>
                                {Array.isArray(mfPackage.chani) ? mfPackage.chani[idx] : mfPackage.chani}
                            </Table.Cell>
                            <Table.Cell>
                                {Array.isArray(mfPackage.layvka) ? mfPackage.layvka[idx] : mfPackage.layvka}
                            </Table.Cell>
                            <Table.Cell>
                                {Array.isArray(mfPackage.laywet) ? mfPackage.laywet[idx] : mfPackage.laywet}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <Segment basic={true}>
                <Form.Group widths={'equal'}>
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
                <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Wetting factor (WETFCT)</label>
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
                        <label>Wetting interval (IWETIT)</label>
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

                <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Dry cells head (HDRY)</label>
                        <Input
                            readOnly={true}
                            name={'hdry'}
                            type={'number'}
                            value={mfPackage.hdry}
                            onChange={handleOnChange}
                            onBlur={handleOnBlur(parseFloat)}
                            icon={<InfoPopup description={documentation.hdry} title={'HDRY'}/>}
                        />
                    </Form.Field>
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
                </Form.Group>
            </Segment>

            <Grid>
                {Array.isArray(mfPackage.hk) && mfPackage.hk.map((hk, idx) => {
                    const hani = Array.isArray(mfPackage.hani) ? mfPackage.hani[idx] : mfPackage.hani;
                    return (
                        <Grid.Row key={idx} columns={2}>
                            <Grid.Column>
                                <Label>Hk Layer {idx + 1}</Label>
                                <RasterDataImage
                                    data={hk}
                                    gridSize={GridSize.fromNxNy(ncol, nrow)}
                                    legend={Array.isArray(hk) ? undefined : [{
                                        value: hk,
                                        color: 'rgb(173, 221, 142)',
                                        label: hk + ' m²/s'
                                    }] as ILegendItemDiscrete[]}
                                    unit={''}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Label>Horizontal anisotropy Layer {idx + 1}</Label>
                                <RasterDataImage
                                    data={hani}
                                    gridSize={GridSize.fromNxNy(ncol, nrow)}
                                    legend={Array.isArray(hani) ? undefined : [{
                                        value: hani,
                                        color: 'rgb(173, 221, 142)',
                                        label: hani.toString()
                                    }] as ILegendItemDiscrete[]}
                                    unit={''}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    );
                })}
            </Grid>

            <Grid>
                {Array.isArray(mfPackage.vka) && mfPackage.vka.map((vka, idx) => {
                    return (
                        <Grid.Row key={idx} columns={2}>
                            <Grid.Column>
                                <Label>Vka Layer {idx + 1}</Label>
                                <RasterDataImage
                                    data={vka}
                                    gridSize={GridSize.fromNxNy(ncol, nrow)}
                                    legend={Array.isArray(vka) ? undefined : [{
                                        value: vka,
                                        color: 'rgb(173, 221, 142)',
                                        label: vka + ' m²/s'
                                    }] as ILegendItemDiscrete[]}
                                    unit={''}
                                />
                            </Grid.Column>
                            <Grid.Column/>
                        </Grid.Row>
                    );
                })}
            </Grid>

            <Grid>
                {Array.isArray(mfPackage.ss) && mfPackage.ss.map((ss, idx) => {
                    const sy = Array.isArray(mfPackage.sy) ? mfPackage.sy[idx] : mfPackage.sy;
                    return (
                        <Grid.Row key={idx} columns={2}>
                            <Grid.Column>
                                <Label>Specific storage Layer {idx + 1}</Label>
                                <RasterDataImage
                                    data={ss}
                                    gridSize={GridSize.fromNxNy(ncol, nrow)}
                                    legend={Array.isArray(ss) ? undefined : [{
                                        value: ss,
                                        color: 'rgb(173, 221, 142)',
                                        label: ss.toString()
                                    }] as ILegendItemContinuous[]}
                                    unit={''}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Label>Specific yield {idx + 1}</Label>
                                <RasterDataImage
                                    data={sy}
                                    gridSize={GridSize.fromNxNy(ncol, nrow)}
                                    legend={Array.isArray(sy) ? undefined : [{
                                        value: sy,
                                        color: 'rgb(173, 221, 142)',
                                        label: sy.toString()
                                    }] as ILegendItemContinuous[]}
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
                        <label>Vertical hydraulic conductivity (VKCB)</label>
                        <Input
                            readOnly={true}
                            name={'vkcb'}
                            type={'number'}
                            value={mfPackage.vkcb}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                            icon={<InfoPopup description={documentation.vkcb} title={'VKCB'}/>}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Wetting threshold and flag (WETDRY)</label>
                        <Input
                            readOnly={true}
                            name={'wetdry'}
                            type={'number'}
                            value={mfPackage.wetdry}
                            onChange={handleOnChange}
                            onBlur={handleOnBlur(parseFloat)}
                            icon={<InfoPopup description={documentation.wetdry} title={'WETDRY'}/>}
                        />
                    </Form.Field>
                </Form.Group>

                <Grid columns={2} divided={true}>
                    <Grid.Row>
                        <Grid.Column>
                            <Form.Group>
                                <Form.Field width={14}>
                                    <label>Storage coefficient (STORAGECOEFFICIENT)</label>
                                    <Checkbox
                                        toggle={true}
                                        disabled={readonly}
                                        name={'storagecoefficient'}
                                        value={mfPackage.storagecoefficient ? 1 : 0}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    <InfoPopup
                                        description={documentation.storagecoefficient}
                                        title={'STORAGECOEFFICIENT'}
                                        position={'top right'}
                                        iconOutside={true}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field width={14}>
                                    <label>Vertical conductance (CONSTANTCV)</label>
                                    <Checkbox
                                        toggle={true}
                                        disabled={readonly}
                                        name={'constantcv'}
                                        value={mfPackage.constantcv ? 1 : 0}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    <InfoPopup
                                        description={documentation.constantcv}
                                        title={'CONSTANTCV'}
                                        position={'top right'}
                                        iconOutside={true}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field width={14}>
                                    <label>Computed cell thickness (THICKSTRT)</label>
                                    <Checkbox
                                        toggle={true}
                                        disabled={readonly}
                                        name={'thickstrt'}
                                        value={mfPackage.thickstrt ? 1 : 0}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    <InfoPopup
                                        description={documentation.thickstrt}
                                        title={'THICKSTRT'}
                                        position={'top right'}
                                        iconOutside={true}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field width={14}>
                                    <label>Vertical conductance correction (NOCVCORRECTION)</label>
                                    <Checkbox
                                        toggle={true}
                                        disabled={readonly}
                                        name={'nocvcorrection'}
                                        value={mfPackage.nocvcorrection ? 1 : 0}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    <InfoPopup
                                        description={documentation.nocvcorrection}
                                        title={'NOCVCORRECTION'}
                                        position={'top right'}
                                        iconOutside={true}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field width={14}>
                                    <label>Vertical flow correction (NOVFC)</label>
                                    <Checkbox
                                        toggle={true}
                                        disabled={readonly}
                                        name={'novfc'}
                                        value={mfPackage.novfc ? 1 : 0}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    <InfoPopup
                                        description={documentation.novfc}
                                        title={'NOVFC'}
                                        position={'top right'}
                                        iconOutside={true}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Form.Group widths="equal">
                    <Form.Field>
                        <label>File extension (extension)</label>
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
                        <label>File names (filenames)</label>
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

export default lpfPackageProperties;
