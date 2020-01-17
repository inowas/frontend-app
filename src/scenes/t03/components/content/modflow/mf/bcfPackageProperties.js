import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input, Header, Label, List, Grid} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfbcf} from '../../../../../../core/model/flopy/packages/mf';
import InfoPopup from '../../../../../shared/InfoPopup';
import {documentation} from '../../../../defaults/flow';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {GridSize} from '../../../../../../core/model/modflow';

class BcfPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const mfPackage = FlopyModflowMfbcf.fromObject(this.state.mfPackage);
        const {mfPackages, readonly} = this.props;
        const disPackage = mfPackages.getPackage('dis');
        const {nrow, ncol} = disPackage;

        return (
            <Form>
                <Header as={'h3'}>BCF: Block Centered Flow Package</Header>
                {mfPackage.laycon.map((laycon, idx) => (
                    <List selection horizontal key={idx}>
                        <List.Item>
                            <Label horizontal>
                                Layer
                            </Label>
                            {idx + 1}
                        </List.Item>
                        <List.Item>
                            <Label horizontal>
                                Laycon
                            </Label>
                            {laycon}
                        </List.Item>
                        <List.Item>
                            <Label horizontal>
                                intercellt
                            </Label>
                            {mfPackage.intercellt[idx]}
                        </List.Item>
                        <List.Item>
                            <Label horizontal>
                                Laywet
                            </Label>
                            {mfPackage.iwdflg[idx]}
                        </List.Item>
                    </List>
                ))}
                {/*<Table basic>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Layer</Table.HeaderCell>
                            <Table.HeaderCell>Laycon</Table.HeaderCell>
                            <Table.HeaderCell>intercellt</Table.HeaderCell>
                            <Table.HeaderCell>Laywet</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {mfPackage.laycon.map((laycon, idx) => (
                            <Table.Row key={idx}>
                                <Table.Cell>{idx + 1}</Table.Cell>
                                <Table.Cell>{laycon}</Table.Cell>
                                <Table.Cell>{mfPackage.intercellt[idx]}</Table.Cell>
                                <Table.Cell>{mfPackage.iwdflg[idx]}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>*/}

                <Grid>
                    {mfPackage.tran.map((tran, idx) => {
                        const trpy = mfPackage.trpy[idx];
                        return (
                            <Grid.Row key={idx} columns={2}>
                                <Grid.Column>
                                    <Label>Hk Layer {idx + 1}</Label>
                                    <RasterDataImage
                                        data={tran}
                                        gridSize={GridSize.fromNxNy(ncol, nrow)}
                                        legend={Array.isArray(tran) ? null : [{
                                            value: tran,
                                            color: 'rgb(173, 221, 142)',
                                            label: tran + ' m²/s'
                                        }]}
                                        unit={''}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <Label>Horizontal anisotropy Layer {idx + 1}</Label>
                                    <RasterDataImage
                                        data={trpy}
                                        gridSize={GridSize.fromNxNy(ncol, nrow)}
                                        legend={Array.isArray(trpy) ? null : [{
                                            value: trpy,
                                            color: 'rgb(173, 221, 142)',
                                            label: trpy
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
                        <label>(ipakcb)</label>
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
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup
                            description={documentation.ipakcb}
                            title='ipakcb'
                            position='top right'
                            iconOutside={true}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Dry cell head (hdry)</label>
                        <Input
                            readOnly
                            name='hdry'
                            value={JSON.stringify(mfPackage.hdry)}
                            icon={this.renderInfoPopup(documentation.hdry, 'hdry')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Rewetting factor (wetfct)</label>
                        <Input
                            readOnly
                            name='wetfct'
                            value={JSON.stringify(mfPackage.wetfct)}
                            icon={this.renderInfoPopup(documentation.wetfct, 'wetfct')}
                        />
                    </Form.Field>
                </Form.Group>

                <Grid>
                    {mfPackage.sf1.map((sf1, idx) => {
                        const sf2 = mfPackage.sf2[idx];
                        return (
                            <Grid.Row key={idx} columns={2}>
                                <Grid.Column>
                                    <Label>Specific storage Layer {idx + 1}</Label>
                                    <RasterDataImage
                                        data={sf1}
                                        gridSize={GridSize.fromNxNy(ncol, nrow)}
                                        legend={Array.isArray(sf1) ? null : [{
                                            value: sf1,
                                            color: 'rgb(173, 221, 142)',
                                            label: sf1
                                        }]}
                                        unit={''}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <Label>Specific yield {idx + 1}</Label>
                                    <RasterDataImage
                                        data={sf2}
                                        gridSize={GridSize.fromNxNy(ncol, nrow)}
                                        legend={Array.isArray(sf2) ? null : [{
                                            value: sf2,
                                            color: 'rgb(173, 221, 142)',
                                            label: sf2
                                        }]}
                                        unit={''}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        )
                    })}
                </Grid>

                <Form.Group widths='equal'>
                    <Form.Field width={4}>
                        <label>Iteration interval (iwetit)</label>
                        <Input
                            readOnly
                            name='iwetit'
                            value={mfPackage.iwetit}
                            icon={this.renderInfoPopup(documentation.iwetit, 'iwetit')}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>Rewetting equation (ihdwet)</label>
                        <Input
                            readOnly
                            name='ihdwet'
                            value={JSON.stringify(mfPackage.ihdwet)}
                            icon={this.renderInfoPopup(documentation.ihdwet, 'ihdwet')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Wetting threshold (wetdry)</label>
                        <Input
                            readOnly
                            name='wetdry'
                            value={mfPackage.wetdry}
                            icon={this.renderInfoPopup(documentation.wetdry, 'wetdry')}
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
                            icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input
                            readOnly
                            name='unitnumber'
                            value={mfPackage.unitnumber || ''}
                            icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
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

BcfPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfbcf).isRequired,
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default BcfPackageProperties;
