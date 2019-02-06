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

    handleChange = (e, {name, value}) => this.setState({[name]: value});

    handleToggleBasicLayer = () => this.setState(prevState => ({showBasicLayer: !prevState.showBasicLayer}));

    render() {
        const {colors, layer, showBasicLayer} = this.state;
        const {criterion} = this.props;
        const suitability = criterion.suitability;

        let legend = null;
        if (layer === 'criteria' && colors === 'classes') {
            legend = criterion.generateLegend('classified');
        }
        if (layer === 'criteria' && colors === 'default') {
            legend = criterion.generateLegend();
        }
        if (layer === 'suitability' && colors === 'default') {
            legend = suitability.generateRainbow(heatMapColors.default);
        }
        if (layer === 'suitability' && colors === 'colorBlind') {
            legend = suitability.generateRainbow(heatMapColors.colorBlind);
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
                        {layer === 'suitability' &&
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
                        raster={layer === 'suitability' ? criterion.suitability : criterion.tilesCollection.first}
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
