import PropTypes from 'prop-types';
import React from 'react';
import {heatMapColors} from '../../defaults/gis';
import {Button, Checkbox, Form, Grid, Icon, Radio, Segment} from 'semantic-ui-react';
import {MCDA} from 'core/model/mcda';
import CriteriaRasterMap from '../cd/criteriaRasterMap';

class SuitabilityResults extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            colors: 'reclassified',
            layer: 'suitability',
            showBasicLayer: false
        }
    }

    handleChange = (e, {name, value}) => {
        if (name === 'layer') {
            return this.setState({
                layer: value,
                colors: 'default'
            });
        }
        return this.setState({
            [name]: value
        });
    };

    handleDownload = () => {
        const {mcda} = this.props;

        const cellSize = (mcda.constraints.boundingBox.yMax - mcda.constraints.boundingBox.yMin) / mcda.constraints.gridSize.nY;

        let content = `NCOLS ${mcda.constraints.gridSize.nX}
NROWS ${mcda.constraints.gridSize.nY}
XLLCORNER ${mcda.constraints.boundingBox.xMin}
YLLCORNER ${mcda.constraints.boundingBox.yMin}
CELLSIZE ${cellSize}
NODATA_VALUE -9999
`;

        mcda.suitability.raster.data.forEach(row => {
            content += row.join(' ');
            content += '\n';

        });

        console.log({
            data: mcda.suitability.raster.data,
        });

        console.log(content);


        const file = new Blob([content], {type: 'text/plain'});
        const element = document.createElement('a');
        element.href = URL.createObjectURL(file);
        element.download = 'suitability.asc';
        element.click();
    };

    handleToggleBasicLayer = () => this.setState(prevState => ({showBasicLayer: !prevState.showBasicLayer}));

    render() {
        const {colors, layer, showBasicLayer} = this.state;
        const {mcda} = this.props;
        const suitability = mcda.suitability;

        let legend = null;
        if (layer === 'suitability') {
            if (colors === 'default') {
                legend = suitability.raster.generateRainbow(heatMapColors.default, [0, 1]);
            }
            if (colors === 'reclassified') {
                legend = suitability.generateLegend('reclassified');
            }
            if (colors === 'colorBlind') {
                legend = suitability.raster.generateRainbow(heatMapColors.colorBlind, [0, 1]);
            }
        }

        let raster;
        switch (layer) {
            default:
                raster = suitability.raster;
                break;
        }

        return (
            <Grid>
                <Grid.Column width={5}>
                    <Segment textAlign='center' inverted color='grey' secondary>
                        Layer
                    </Segment>
                    <Segment>
                        <Form>
                            <Form.Field>
                                <Checkbox
                                    radio
                                    label='Suitability'
                                    name='layer'
                                    value='suitability'
                                    checked={layer === 'suitability'}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Segment>
                    <Segment textAlign='center' inverted color='grey' secondary>
                        Color Scheme
                    </Segment>
                    <Segment>
                        {layer === 'suitability' &&
                        <Form>
                            <Form.Field>
                                <Checkbox
                                    radio
                                    label='Reclassified'
                                    name='colors'
                                    value='reclassified'
                                    checked={colors === 'reclassified'}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox
                                    radio
                                    label='Default heat map'
                                    name='colors'
                                    value='default'
                                    checked={colors === 'default'}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox
                                    radio
                                    label='Barrier-free colors'
                                    name='colors'
                                    value='colorBlind'
                                    checked={colors === 'colorBlind'}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                        }
                    </Segment>
                    <Segment textAlign='center' inverted color='grey' secondary>
                        Base map
                    </Segment>
                    <Segment>
                        <Form>
                            <Form.Field>
                                <Radio
                                    checked={showBasicLayer}
                                    label='OSM'
                                    name='showBasicLayer'
                                    onChange={this.handleToggleBasicLayer}
                                    toggle
                                />
                            </Form.Field>
                        </Form>
                    </Segment>
                    <Segment textAlign='center' inverted color='grey' secondary>
                        Commands
                    </Segment>
                    <Button
                        fluid
                        primary
                        icon
                        labelPosition='left'
                        onClick={this.handleDownload}
                    >
                        <Icon name='download'/>
                        Download GeoTiff
                    </Button>
                </Grid.Column>
                <Grid.Column width={11}>
                    {mcda.suitability.raster.data.length > 0 && !!legend &&
                    <CriteriaRasterMap
                        raster={raster}
                        showBasicLayer={showBasicLayer}
                        legend={legend}
                    />
                    }
                </Grid.Column>
            </Grid>
        );
    }
}

SuitabilityResults.propTypes = {
    mcda: PropTypes.instanceOf(MCDA).isRequired
};

export default SuitabilityResults;
