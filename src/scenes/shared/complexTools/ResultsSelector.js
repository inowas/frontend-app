import React from 'react';
import PropTypes from 'prop-types';
import {Form, Grid, Header, Segment} from 'semantic-ui-react';
import {Soilmodel, Stressperiods} from 'core/model/modflow';

import {flatten, uniq, upperFirst} from 'lodash';

import Moment from 'moment';
import Slider from 'rc-slider';

const SliderWithTooltip = Slider.createSliderWithTooltip(Slider);


const styles = {
    dot: {
        border: '1px solid #e9e9e9',
        borderRadius: 0,
        marginLeft: 0,
        width: '1px'
    },
    track: {
        backgroundColor: '#e9e9e9'
    }
};

class ResultsSelector extends React.Component {

    state = {
        temporaryTotim: null
    };

    componentDidMount() {
        this.setState({temporaryTotim: this.props.data.totim});
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({temporaryTotim: nextProps.data.totim});
    }

    sliderMarks = () => {
        const maxNumberOfMarks = 10;
        let {totalTimes} = this.props;

        if (totalTimes.length > maxNumberOfMarks) {
            const minTotim = totalTimes[0];
            const maxTotim = totalTimes[totalTimes.length - 1];
            const dTotim = Math.round((maxTotim - minTotim) / maxNumberOfMarks);

            totalTimes = new Array(maxNumberOfMarks).fill(0).map((value, key) => (minTotim + key * dTotim));
            totalTimes.push(maxTotim);
        }

        let marks = {};
        totalTimes.forEach((value) => {
            marks[value] = value;
        });
        return marks;
    };

    layerOptions = () => {
        if (!(this.props.soilmodel instanceof Soilmodel)) {
            return [];
        }

        return this.props.soilmodel.layersCollection.all.map(l => (
            {key: l.id, value: l.number, text: l.name}
        ))
    };

    typeOptions = () => {
        const {layerValues} = this.props;
        if (!layerValues) {
            return [];
        }

        const types = uniq(flatten(layerValues));
        return types.map((v, id) => (
            {key: id, value: v, text: upperFirst(v)}
        ))
    };

    formatTimestamp = (key) => {
        return Moment.utc(this.props.stressperiods.dateTimes[key]).format('L');
    };

    handleChangeType = (e, {value}) => {
        const {layer, totim} = this.props.data;
        return this.props.onChange({
            layer,
            totim,
            type: value
        });
    };

    handleChangeLayer = (e, {value}) => {
        const {totim, type} = this.props.data;
        return this.props.onChange({
            layer: value,
            totim,
            type
        });
    };

    handleChangeSlider = value => {
        const {totalTimes} = this.props;
        const differences = totalTimes.map((tt, idx) => ({id: idx, value: Math.abs(tt - value)}));
        differences.sort((a, b) => a.value - b.value);
        this.setState({temporaryTotim: totalTimes[differences[0].id]})
    };

    handleAfterChangeSlider = () => {
        const {layer, type} = this.props.data;
        const totim = this.state.temporaryTotim;
        return this.props.onChange({layer, totim, type});
    };

    render() {
        const {temporaryTotim} = this.state;
        const {data, totalTimes} = this.props;
        const {type, layer} = data;

        return (
            <Grid columns={2}>
                <Grid.Row stretched>
                    <Grid.Column width={6}>
                        <Segment color={'grey'}>
                            <Form>
                                <Form.Group inline>
                                    <label>Select type</label>
                                    <Form.Dropdown
                                        selection
                                        style={{zIndex: 1002, minWidth: '8em'}}
                                        options={this.typeOptions()}
                                        value={type}
                                        onChange={this.handleChangeType}
                                    />
                                </Form.Group>
                                    <Form.Select
                                        loading={!(this.props.soilmodel instanceof Soilmodel)}
                                        style={{zIndex: 1001}}
                                        fluid
                                        options={this.layerOptions()}
                                        value={layer}
                                        name={'affectedLayers'}
                                        onChange={this.handleChangeLayer}
                                    />
                            </Form>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Segment color={'grey'}>
                            <Header textAlign={'center'} as={'h4'}>Select total time [days]</Header>
                            <SliderWithTooltip
                                dots={totalTimes.length < 20}
                                dotStyle={styles.dot}
                                trackStyle={styles.track}
                                defaultValue={temporaryTotim}
                                min={totalTimes[0]}
                                max={totalTimes[totalTimes.length - 1]}
                                steps={null}
                                marks={this.sliderMarks()}
                                value={temporaryTotim}
                                onAfterChange={this.handleAfterChangeSlider}
                                onChange={this.handleChangeSlider}
                                tipFormatter={() => this.formatTimestamp(totalTimes.indexOf(temporaryTotim))}
                            />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

ResultsSelector.proptypes = {
    data: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    layerValues: PropTypes.object.isRequired,
    totalTimes: PropTypes.object.isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
    stressperiods: PropTypes.instanceOf(Stressperiods).isRequired
};

export default ResultsSelector;
