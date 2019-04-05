import PropTypes from 'prop-types';
import React from 'react';
import {Form, Grid, Header, Input} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfbas} from 'core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {GridSize} from 'core/model/modflow';

const styles = {
    inputFix: {
        padding: '0',
        height: 'auto'
    }
};

class BasPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {readonly} = this.props;
        const mfPackage = FlopyModflowMfbas.fromObject(this.state.mfPackage);
        const {ibound, strt} = mfPackage;

        return (
            <Grid divided={'vertically'}>
                <Header as={'h2'}>Ibound</Header>
                <Grid.Row columns={2}>
                    {ibound.map((layer, idx) => (
                        <Grid.Column key={idx}>
                            <Header as={'p'}>Layer {idx + 1}</Header>
                            <RasterDataImage
                                data={layer}
                                gridSize={GridSize.fromData(layer)}
                                unit={''}
                                legend={[
                                    {value: -1, color: 'red', label: 'constant'},
                                    {value: 0, color: 'white', label: 'no flow'},
                                    {value: 1, color: 'blue', label: 'flow'},
                                ]}/>
                        </Grid.Column>
                    ))}
                </Grid.Row>

                <Header as={'h2'}>Starting head</Header>
                <Grid.Row columns={2}>
                    {strt.map((layer, idx) => (
                        <Grid.Column key={idx}>
                            <Header as={'p'}>Layer {idx + 1}</Header>
                            <RasterDataImage
                                data={layer}
                                gridSize={GridSize.fromData(layer)}
                                unit={'m'}
                            />
                        </Grid.Column>
                    ))}
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column>
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <label>Flow between chd cells (ichflg)</label>
                                    <Form.Dropdown
                                        options={[
                                            {key: 0, value: true, text: 'true'},
                                            {key: 1, value: false, text: 'false'},
                                        ]}
                                        placeholder='Select ichflg'
                                        name='ichflg'
                                        selection
                                        value={mfPackage.ichflg}
                                        readOnly={readonly}
                                        onChange={this.handleOnSelect}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>hnoflo</label>
                                    <Form.Input
                                        readOnly={readonly}
                                        type={'number'}
                                        name='hnoflo'
                                        value={mfPackage.hnoflo}
                                        style={styles.inputFix}
                                        onChange={this.handleOnChange}
                                        onBlur={this.handleOnBlur}
                                        icon={this.renderInfoPopup(documentation.hnoflo, 'hnoflo')}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Budget percent discrepancy (stoper)</label>
                                    <Input
                                        readOnly
                                        name='stoper'
                                        value={mfPackage.stoper || ''}
                                        style={styles.inputFix}
                                        icon={this.renderInfoPopup(documentation.stoper, 'stoper')}
                                    />
                                </Form.Field>
                            </Form.Group>

                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

BasPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfbas).isRequired,
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};

export default BasPackageProperties;
