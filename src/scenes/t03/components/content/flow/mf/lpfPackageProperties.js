import PropTypes from 'prop-types';
import React from 'react';
import {Form, Grid, Header, Input, Table} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflow, FlopyModflowMfbas, FlopyModflowMflpf} from 'core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';
import {GridSize} from 'core/model/modflow';
import {RasterDataImage} from '../../../../../shared/rasterData';

class LpfPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const mfPackage = FlopyModflowMfbas.fromObject(this.state.mfPackage);
        const {mfPackages, readonly} = this.props;
        const disPackage = mfPackages.getPackage('dis');
        const {nrow, ncol} = disPackage;

        return (
            <Form>
                <Table basic>
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
                        {mfPackage.laytyp.map((laytyp, idx) => (
                            <Table.Row key={idx}>
                                <Table.Cell>{idx + 1}</Table.Cell>
                                <Table.Cell>{laytyp}</Table.Cell>
                                <Table.Cell>{mfPackage.layavg[idx]}</Table.Cell>
                                <Table.Cell>{mfPackage.chani[idx]}</Table.Cell>
                                <Table.Cell>{mfPackage.layvka[idx]}</Table.Cell>
                                <Table.Cell>{mfPackage.laywet[idx]}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

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
                            readOnly={readonly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(hdry)</label>
                        <Input
                            readOnly
                            name='hdry'
                            value={JSON.stringify(mfPackage.hdry)}
                            icon={this.renderInfoPopup(documentation.hdry, 'hdry')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(iwdflg)</label>
                        <Input
                            readOnly
                            name='iwdflg'
                            value={JSON.stringify(mfPackage.iwdflg)}
                            icon={this.renderInfoPopup(documentation.iwdflg, 'iwdflg')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>(wetfct)</label>
                        <Input
                            readOnly
                            name='wetfct'
                            value={JSON.stringify(mfPackage.wetfct)}
                            icon={this.renderInfoPopup(documentation.wetfct, 'wetfct')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(iwetit)</label>
                        <Input
                            readOnly
                            name='iwetit'
                            value={JSON.stringify(mfPackage.iwetit)}
                            icon={this.renderInfoPopup(documentation.iwetit, 'iwetit')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(ihdwet)</label>
                        <Input
                            readOnly
                            name='ihdwet'
                            value={JSON.stringify(mfPackage.ihdwet)}
                            icon={this.renderInfoPopup(documentation.ihdwet, 'ihdwet')}
                        />
                    </Form.Field>
                </Form.Group>

                <Grid>
                    {mfPackage.hk.map((hk, idx) => {
                        const hani = mfPackage.hani[idx];
                        return (
                            <Grid.Row key={idx} columns={2}>
                                <Grid.Column>
                                    <Header as={'p'}>Hk Layer {idx + 1}</Header>
                                    <RasterDataImage
                                        data={hk}
                                        gridSize={GridSize.fromNxNy(ncol, nrow)}
                                        legend={Array.isArray(hk) ? null : [{
                                            value: hk,
                                            color: 'rgb(173, 221, 142)',
                                            label: hk + ' m²/s'
                                        }]}
                                        unit={''}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <Header as={'p'}>Horizontal anisotropy Layer {idx + 1}</Header>
                                    <RasterDataImage
                                        data={hani}
                                        gridSize={GridSize.fromNxNy(ncol, nrow)}
                                        legend={Array.isArray(hani) ? null : [{
                                            value: hani,
                                            color: 'rgb(173, 221, 142)',
                                            label: hani
                                        }]}
                                        unit={''}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        )
                    })}
                </Grid>

                <Grid>
                    {mfPackage.vka.map((vka, idx) => {
                        return (
                            <Grid.Row key={idx} columns={2}>
                                <Grid.Column>
                                    <Header as={'p'}>Vka Layer {idx + 1}</Header>
                                    <RasterDataImage
                                        data={vka}
                                        gridSize={GridSize.fromNxNy(ncol, nrow)}
                                        legend={Array.isArray(vka) ? null : [{
                                            value: vka,
                                            color: 'rgb(173, 221, 142)',
                                            label: vka + ' m²/s'
                                        }]}
                                        unit={''}
                                    />
                                </Grid.Column>
                                <Grid.Column/>
                            </Grid.Row>
                        )
                    })}
                </Grid>

                <Grid>
                    {mfPackage.ss.map((ss, idx) => {
                        const sy = mfPackage.sy[idx];
                        return (
                            <Grid.Row key={idx} columns={2}>
                                <Grid.Column>
                                    <Header as={'p'}>Specific storage Layer {idx + 1}</Header>
                                    <RasterDataImage
                                        data={ss}
                                        gridSize={GridSize.fromNxNy(ncol, nrow)}
                                        legend={Array.isArray(ss) ? null : [{
                                            value: ss,
                                            color: 'rgb(173, 221, 142)',
                                            label: ss
                                        }]}
                                        unit={''}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <Header as={'p'}>Specific yield {idx + 1}</Header>
                                    <RasterDataImage
                                        data={sy}
                                        gridSize={GridSize.fromNxNy(ncol, nrow)}
                                        legend={Array.isArray(sy) ? null : [{
                                            value: sy,
                                            color: 'rgb(173, 221, 142)',
                                            label: sy
                                        }]}
                                        unit={''}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        )
                    })}
                </Grid>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>(vkcb)</label>
                        <Input
                            readOnly
                            name='vkcb'
                            value={mfPackage.vkcb || ''}
                            icon={this.renderInfoPopup(documentation.vkcb, 'vkcb')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(wetdry)</label>
                        <Input
                            readOnly={readonly}
                            name='wetdry'
                            value={mfPackage.wetdry}
                            icon={this.renderInfoPopup(documentation.wetdry, 'wetdry')}
                            onChange={this.handleOnChange}
                            onBlur={this.handleOnBlur}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Storagecoefficient</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: true, text: 'true'},
                                {key: 1, value: false, text: 'false'},
                            ]}
                            placeholder='Select storagecoefficient'
                            name='storagecoefficient'
                            selection
                            value={mfPackage.storagecoefficient}
                            readOnly={readonly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(constantcv)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: true, text: 'true'},
                                {key: 1, value: false, text: 'false'},
                            ]}
                            placeholder='Select constantcv'
                            name='constantcv'
                            selection
                            value={mfPackage.constantcv}
                            readOnly={readonly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(thickstrt)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: true, text: 'true'},
                                {key: 1, value: false, text: 'false'},
                            ]}
                            placeholder='Select thickstrt'
                            name='thickstrt'
                            selection
                            value={mfPackage.thickstrt}
                            readOnly={readonly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>(nocvcorrection)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: true, text: 'true'},
                                {key: 1, value: false, text: 'false'},
                            ]}
                            placeholder='Select nocvcorrection'
                            name='nocvcorrection'
                            selection
                            value={mfPackage.nocvcorrection}
                            readOnly={readonly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(novfc)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: true, text: 'true'},
                                {key: 1, value: false, text: 'false'},
                            ]}
                            placeholder='Select novfc'
                            name='novfc'
                            selection
                            value={mfPackage.novfc}
                            readOnly={readonly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>(extension)</label>
                        <Input
                            readOnly
                            name='extension'
                            value={mfPackage.extension || ''}
                            icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>(unitnumber)</label>
                        <Input
                            readOnly
                            name='unitnumber'
                            value={mfPackage.unitnumber || ''}
                            icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>(filenames)</label>
                        <Input
                            readOnly
                            name='filenames'
                            value={mfPackage.filenames || ''}
                            icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

LpfPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMflpf).isRequired,
    mfPackages: PropTypes.instanceOf(FlopyModflow).isRequired,
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default LpfPackageProperties;
