import React from 'react';
import {Form, Grid, Header, Input} from 'semantic-ui-react';
import AbstractPackageProperties from './AbstractPackageProperties';
import {documentation} from "../../../../defaults/flow";
import {GridSize} from "../../../../../../core/model/modflow";
import RasterDataImage from "../../../../../shared/rasterData/rasterDataImage";

class HobPackageProperties extends AbstractPackageProperties {
    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackages, readonly} = this.props;
        const {mfPackage} = this.state;

        const basPackage = mfPackages.getPackage('bas');
        const {ibound} = basPackage;
        const affectedCellsLayers = ibound.map(l => l.map(r => r.map(() => 0)));
        mfPackage.obs_data.forEach(obs => {
            affectedCellsLayers[obs.layer][obs.row][obs.column] = 1;
        });

        return (
            <Form>
                <Grid divided={'vertically'}>
                    <Header as={'h2'}>Head Observation Package</Header>
                    <Grid.Row columns={2}>
                        {affectedCellsLayers.map((layer, idx) => (
                            <Grid.Column key={idx}>
                                <Header as={'p'}>Layer {idx + 1}</Header>
                                <RasterDataImage
                                    data={layer}
                                    gridSize={GridSize.fromData(layer)}
                                    unit={''}
                                    legend={[
                                        {value: 1, color: 'blue', label: 'HOB affected cells'},
                                    ]}
                                    border={'1px dotted black'}
                                />
                            </Grid.Column>
                        ))}
                    </Grid.Row>
                </Grid>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Unit number (iuhobsv)</label>
                        <Input
                            readOnly={readonly}
                            name='iuhobsv'
                            value={mfPackage.iuhobsv || ''}
                            icon={this.renderInfoPopup(documentation.iuhobsv, 'iuhobsv')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Dry cell equivalent (hobdry)</label>
                        <Input
                            readOnly={readonly}
                            name='hobdry'
                            value={mfPackage.hobdry || ''}
                            icon={this.renderInfoPopup(documentation.hobdry, 'hobdry')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Time step multiplier (tomulth)</label>
                        <Input
                            readOnly={readonly}
                            name='tomulth'
                            value={mfPackage.tomulth || ''}
                            icon={this.renderInfoPopup(documentation.tomulth, 'tomulth')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

export default HobPackageProperties;
