import PropTypes from 'prop-types';
import React from 'react';
import {Criterion} from 'core/model/mcda/criteria';
import CriteriaRasterMap from './criteriaRasterMap';
import {Raster} from 'core/model/mcda/gis';
import {heatMapColors} from '../../defaults/gis';
import {Checkbox, Form, Grid, Radio, Segment} from 'semantic-ui-react';

class CriteriaDataResults extends React.Component {

    constructor(props) {
        super(props);

        const criterion = this.props.criterion;

        this.state = {
            colors: 'default',
            criterion: criterion.toObject(),
            layer: 'suitability',
            showBasicLayer: false
        }
    }

    handleChange = (e, {name, value}) => this.setState({[name]: value});

    handleToggleBasicLayer = () => this.setState(prevState => ({showBasicLayer: !prevState.showBasicLayer}));

    render() {
        const {colors, criterion, layer, showBasicLayer} = this.state;
        const raster = this.props.criterion.tilesCollection.first;

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
                                    checked={true}
                                    readOnly
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
                {criterion.suitability.data.length > 0 &&
                    <CriteriaRasterMap
                        colors={layer === 'suitability' ? heatMapColors[colors] : heatMapColors.terrain}
                        raster={layer === 'suitability' ? Raster.fromObject(criterion.suitability) : raster}
                        showBasicLayer={showBasicLayer}
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
