import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {DropdownProps, Form, Grid, Header, Input, Label, List, Segment} from 'semantic-ui-react';

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

    const handleOnSelect = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const {name, value} = data;
        setMfPackage({...mfPackage, [name]: value});
        props.onChange(FlopyModflowMflpf.fromObject({...mfPackage, [name]: value}));
    };

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

    return (
        <Form>
            <Header as={'h3'}>LPF: Layer Property Flow Package</Header>
            {Array.isArray(mfPackage.laytyp) && mfPackage.laytyp.map((laytyp, idx) => (
                <List selection={true} horizontal={true} key={idx}>
                    <List.Item>
                        <Label horizontal={true}>
                            Layer
                        </Label>
                        {idx + 1}
                    </List.Item>
                    <List.Item>
                        <Label horizontal={true}>
                            Laytyp
                        </Label>
                        {laytyp}
                    </List.Item>
                    <List.Item>
                        <Label horizontal={true}>
                            Layavg
                        </Label>
                        {Array.isArray(mfPackage.layavg) ? mfPackage.layavg[idx] : mfPackage.layavg}
                    </List.Item>
                    <List.Item>
                        <Label horizontal={true}>
                            Chani
                        </Label>
                        {Array.isArray(mfPackage.chani) ? mfPackage.chani[idx] : mfPackage.chani}
                    </List.Item>
                    <List.Item>
                        <Label horizontal={true}>
                            Layvka
                        </Label>
                        {Array.isArray(mfPackage.layvka) ? mfPackage.layvka[idx] : mfPackage.layvka}
                    </List.Item>
                    <List.Item>
                        <Label horizontal={true}>
                            Laywet
                        </Label>
                        {Array.isArray(mfPackage.laywet) ? mfPackage.laywet[idx] : mfPackage.laywet}
                    </List.Item>
                </List>
            ))}
            {/*<Table basic={true}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Layer</Table.HeaderCell>
                        <Table.HeaderCell>Laytyp</Table.HeaderCell>
                        <Table.HeaderCell>Layavg</Table.HeaderCell>
                        <Table.HeaderCell>Chani</Table.HeaderCell>
                        <Table.HeaderCell>Layvka</Table.HeaderCell>
                        <Table.HeaderCell>Laywet</Table.HeaderCell>
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
            </Table>*/}

            <Segment>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Cell-by-cell budget data (ipakcb)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: 'false'},
                                {key: 1, value: 1, text: 'true'},
                            ]}
                            placeholder="Select ipakcb"
                            name="ipakcb"
                            selection={true}
                            value={mfPackage.ipakcb}
                            disabled={readonly}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(hdry)</label>
                        <Input
                            readOnly={true}
                            name="hdry"
                            value={JSON.stringify(mfPackage.hdry)}
                            icon={<InfoPopup description={documentation.hdry} title={'hdry'}/>}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(iwdflg)</label>
                        <Input
                            readOnly={true}
                            name="iwdflg"
                            value={JSON.stringify(mfPackage.iwdflg)}
                            icon={<InfoPopup description={documentation.iwdflg} title={'iwdflg'}/>}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths="equal">
                    <Form.Field>
                        <label>(wetfct)</label>
                        <Input
                            readOnly={true}
                            name="wetfct"
                            value={JSON.stringify(mfPackage.wetfct)}
                            icon={<InfoPopup description={documentation.wetfct} title={'wetfct'}/>}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(iwetit)</label>
                        <Input
                            readOnly={true}
                            name="iwetit"
                            value={JSON.stringify(mfPackage.iwetit)}
                            icon={<InfoPopup description={documentation.iwetit} title={'iwetit'}/>}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(ihdwet)</label>
                        <Input
                            readOnly={true}
                            name="ihdwet"
                            value={JSON.stringify(mfPackage.ihdwet)}
                            icon={<InfoPopup description={documentation.ihdwet} title={'ihdwet'}/>}
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

            <Form.Group widths="equal">
                <Form.Field>
                    <label>(vkcb)</label>
                    <Input
                        readOnly={true}
                        name="vkcb"
                        value={mfPackage.vkcb || ''}
                        icon={<InfoPopup description={documentation.vkcb} title={'vkcb'}/>}
                    />
                </Form.Field>
                <Form.Field>
                    <label>(wetdry)</label>
                    <Input
                        readOnly={readonly}
                        name="wetdry"
                        type={'number'}
                        value={mfPackage.wetdry}
                        icon={<InfoPopup description={documentation.wetdry} title={'wetdry'}/>}
                        onChange={handleOnChange}
                        onBlur={handleOnBlur(parseFloat)}
                    />
                </Form.Field>
            </Form.Group>

            <Form.Group widths="equal">
                <Form.Field>
                    <label>Storagecoefficient</label>
                    <Form.Dropdown
                        options={[
                            {key: 0, value: true, text: 'true'},
                            {key: 1, value: false, text: 'false'},
                        ]}
                        placeholder="Select storagecoefficient"
                        name="storagecoefficient"
                        selection={true}
                        value={mfPackage.storagecoefficient}
                        disabled={readonly}
                        onChange={handleOnSelect}
                    />
                </Form.Field>
                <Form.Field>
                    <label>(constantcv)</label>
                    <Form.Dropdown
                        options={[
                            {key: 0, value: true, text: 'true'},
                            {key: 1, value: false, text: 'false'},
                        ]}
                        placeholder="Select constantcv"
                        name="constantcv"
                        selection={true}
                        value={mfPackage.constantcv}
                        disabled={readonly}
                        onChange={handleOnSelect}
                    />
                </Form.Field>
                <Form.Field>
                    <label>(thickstrt)</label>
                    <Form.Dropdown
                        options={[
                            {key: 0, value: true, text: 'true'},
                            {key: 1, value: false, text: 'false'},
                        ]}
                        placeholder="Select thickstrt"
                        name="thickstrt"
                        selection={true}
                        value={mfPackage.thickstrt}
                        disabled={readonly}
                        onChange={handleOnSelect}
                    />
                </Form.Field>
            </Form.Group>

            <Form.Group widths="equal">
                <Form.Field>
                    <label>(nocvcorrection)</label>
                    <Form.Dropdown
                        options={[
                            {key: 0, value: true, text: 'true'},
                            {key: 1, value: false, text: 'false'},
                        ]}
                        placeholder="Select nocvcorrection"
                        name="nocvcorrection"
                        selection={true}
                        value={mfPackage.nocvcorrection}
                        disabled={readonly}
                        onChange={handleOnSelect}
                    />
                </Form.Field>
                <Form.Field>
                    <label>(novfc)</label>
                    <Form.Dropdown
                        options={[
                            {key: 0, value: true, text: 'true'},
                            {key: 1, value: false, text: 'false'},
                        ]}
                        placeholder="Select novfc"
                        name="novfc"
                        selection={true}
                        value={mfPackage.novfc}
                        disabled={readonly}
                        onChange={handleOnSelect}
                    />
                </Form.Field>

                <Form.Field>
                    <label>(extension)</label>
                    <Input
                        readOnly={true}
                        name="extension"
                        value={mfPackage.extension || ''}
                        icon={<InfoPopup description={documentation.extension} title={'extension'}/>}
                    />
                </Form.Field>
            </Form.Group>

            <Form.Group widths="equal">
                <Form.Field>
                    <label>(unitnumber)</label>
                    <Input
                        readOnly={true}
                        name="unitnumber"
                        value={mfPackage.unitnumber || ''}
                        icon={<InfoPopup description={documentation.unitnumber} title={'unitnumber'}/>}
                    />
                </Form.Field>
                <Form.Field>
                    <label>(filenames)</label>
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

export default lpfPackageProperties;
