import PropTypes from 'prop-types';
import React from 'react';
import {Criterion} from 'core/model/mcda/criteria';
import CriteriaRasterMap from './criteriaRasterMap';
import {heatMapColors} from '../../defaults/gis';
import {Checkbox, Form, Grid, Radio, Segment} from 'semantic-ui-react';

class CriteriaDataResults extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            colors: 'default',
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

    handleToggleBasicLayer = () => this.setState(prevState => ({showBasicLayer: !prevState.showBasicLayer}));

    render() {
        const {colors, layer, showBasicLayer} = this.state;
        const {criterion} = this.props;
        const suitability = criterion.suitability;

        let legend = null;
        if (layer === 'criteria') {
            if (colors === 'classes') {
                legend = criterion.generateLegend('classified');
            }
            if (colors === 'default') {
                legend = criterion.generateLegend();
            }
        }
        if (layer === 'suitability' || layer === 'constraints') {
            if (colors === 'default') {
                legend = suitability.generateRainbow(heatMapColors.default, [0, 1]);
            }
            if (colors === 'colorBlind') {
                legend = suitability.generateRainbow(heatMapColors.colorBlind, [0, 1]);
            }
        }

        let raster;
        switch (layer) {
            case 'suitability':
                raster = criterion.suitability;
                break;
            case 'constraints':
                raster = criterion.constraintRaster;
                break;
            default:
                raster = criterion.tilesCollection.first;
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
                            <Form.Field>
                                <Checkbox
                                    radio
                                    label='Criteria Data'
                                    name='layer'
                                    value='criteria'
                                    checked={layer === 'criteria'}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            {criterion.constraintRaster && criterion.constraintRaster.data.length > 0 &&
                            <Form.Field>
                                    <Checkbox
                                        radio
                                        label='Constraints'
                                        name='layer'
                                        value='constraints'
                                        checked={layer === 'constraints'}
                                        onChange={this.handleChange}
                                    />
                                </Form.Field>
                            }
                        </Form>
                    </Segment>
                    <Segment textAlign='center' inverted color='grey' secondary>
                        Color Scheme
                    </Segment>
                    <Segment>
                        {layer === 'criteria' &&
                        <Form>
                            <Form.Field>
                                <Checkbox
                                    radio
                                    label='Default'
                                    value='default'
                                    name='colors'
                                    checked={colors === 'default'}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox
                                    radio
                                    label='Reclassified'
                                    value='classes'
                                    name='colors'
                                    checked={colors === 'classes'}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                        }
                        {(layer === 'suitability' || layer === 'constraints') &&
                            <Form>
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
                </Grid.Column>
                <Grid.Column width={11}>
                {criterion.suitability.data.length > 0 && !!legend &&
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

CriteriaDataResults.propTypes = {
    criterion: PropTypes.instanceOf(Criterion).isRequired,
    onChange: PropTypes.func.isRequired
};

export default CriteriaDataResults;
