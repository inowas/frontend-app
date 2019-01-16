import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Form, Grid, Header, Segment} from 'semantic-ui-react';
import {BoundaryCollection, Calculation, ModflowModel, Soilmodel} from 'core/model/modflow';
import {fetchUrl} from 'services/api';
import {last, uniq, upperFirst} from 'lodash';
import ResultsMap from '../../maps/resultsMap';
import ResultsChart from './resultsChart';
import Slider from 'rc-slider';

import {flatten} from 'lodash';
import Moment from 'moment';

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

class Results extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            calculationId: null,
            layerValues: null,
            totalTimes: null,
            selectedCol: 0,
            selectedLay: 0,
            selectedRow: 0,
            selectedTotim: 0,
            selectedType: 'head',
            data: null,
            fetching: false
        }
    }

    componentDidMount() {
        this.fetchResults();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!this.state.calculationId) {
            this.fetchResults();
        }
    }

    fetchResults() {
        const {model} = this.props;
        const {calculation} = model;

        if (!calculation) {
            return null;
        }

        this.setState({isLoading: true},
            () => fetchUrl(`modflowmodels/${model.id}/results`,
                metaData => {
                    const calculationId = metaData.calculation_id;
                    const totalTimes = metaData.times.total_times;
                    const layerValues = metaData.layer_values;
                    this.setState({calculationId, layerValues, totalTimes, isLoading: false});
                    this.onChangeTypeLayerOrTime({
                        type: this.state.selectedType,
                        totim: last(totalTimes),
                        layer: this.state.selectedLay
                    });
                },
                (e) => this.setState({isError: e, isLoading: false}))
        );
    }

    fetchData({layer, totim, type}) {
        const {calculationId} = this.state;
        this.setState({fetching: true},
            () => fetchUrl(`calculations/${calculationId}/results/types/${type}/layers/${layer}/totims/${totim}`,
                data => this.setState({
                    selectedLay: layer,
                    selectedTotim: totim,
                    selectedType: type,
                    data,
                    fetching: false
                }),
                (e) => this.setState({isError: e})
            )
        )
    }

    onChangeTypeLayerOrTime = ({type = null, layer = null, totim = null}) => {
        const {selectedLay, selectedType, selectedTotim} = this.state;
        type = type || selectedType;
        layer = layer || selectedLay;
        totim = totim || selectedTotim;

        if (totim === selectedTotim && type === selectedType && layer === selectedLay) {
            return;
        }

        this.fetchData({layer, totim, type});
    };

    sliderMarks = () => {
        const {totalTimes} = this.state;
        let marks = {};
        totalTimes.forEach((value) => {
            marks[value] = value;
        });
        return marks;
    };

    formatTimestamp = (key) => {
        return Moment.utc(this.props.model.stressperiods.dateTimes[key]).format('L');
    };

    handleAfterChangeSlider = () => {
        const layer = this.state.selectedLay;
        const totim = this.state.selectedTotim;
        const type = this.state.selectedType;
        return this.fetchData({layer, totim, type});
    };

    handleChangeSlider = value => {
        const {totalTimes} = this.state;
        const differences = totalTimes.map((tt, idx) => ({id: idx, value: Math.abs(tt - value)}));
        differences.sort((a, b) => a.value - b.value);
        this.setState({selectedTotim: totalTimes[differences[0].id]})
    };

    handleChangeLayer = (e, {value}) => {
        this.setState({selectedLay: value});
        const totim = this.state.selectedTotim;
        const type = this.state.selectedType;
        return this.fetchData({layer: value, totim, type});
    };

    layerOptions = () => {
        if (!(this.props.soilmodel instanceof Soilmodel)) {
            return [];
        }

        return this.props.soilmodel.layersCollection.all.map(l => (
            {key: l.id, value: l.number, text: l.name}
        ))
    };

    handleChangeType = (e, {value}) => {
        this.setState({selectedType: value});
        const totim = this.state.selectedTotim;
        const layer = this.state.selectedLay;
        return this.fetchData({layer, totim, type: value});
    };

    typeOptions = () => {
        const {layerValues} = this.state;
        if (!layerValues) {
            return [];
        }

        const types = uniq(flatten(layerValues));
        return types.map((v, id) => (
            {key: id, value: v, text: upperFirst(v)}
        ))
    };

    render() {
        const {calculationId, data, selectedCol, selectedRow, selectedTotim, totalTimes} = this.state;
        const {model, boundaries} = this.props;

        if (!calculationId) {
            return null;
        }

        return (
            <Segment color={'grey'} loading={this.state.isLoading}>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={3}>
                                        <Segment color={'grey'}>
                                            <Header textAlign={'center'} as={'h4'}>Select type</Header>
                                            <Form.Dropdown
                                                style={{zIndex: 1000}}
                                                selection
                                                fluid
                                                options={this.typeOptions()}
                                                value={this.state.selectedType}
                                                name={'affectedLayers'}
                                                onChange={this.handleChangeType}
                                            />
                                        </Segment>
                                    </Grid.Column>
                                    <Grid.Column width={3}>
                                        <Segment color={'grey'}>
                                            <Header textAlign={'center'} as={'h4'}>Select layer</Header>
                                            <Form.Dropdown
                                                loading={!(this.props.soilmodel instanceof Soilmodel)}
                                                style={{zIndex: 1000}}
                                                selection
                                                fluid
                                                options={this.layerOptions()}
                                                value={this.state.selectedLay}
                                                name={'affectedLayers'}
                                                onChange={this.handleChangeLayer}
                                            />
                                        </Segment>
                                    </Grid.Column>
                                    <Grid.Column width={10}>
                                        <Segment color={'grey'} style={{paddingBottom: 40}}>
                                            <Header textAlign={'center'} as={'h4'}>Select total time [days]</Header>
                                            <SliderWithTooltip
                                                dots
                                                dotStyle={styles.dot}
                                                trackStyle={styles.track}
                                                defaultValue={selectedTotim}
                                                min={totalTimes[0]}
                                                max={totalTimes[totalTimes.length - 1]}
                                                steps={null}
                                                marks={this.sliderMarks()}
                                                value={selectedTotim}
                                                onAfterChange={this.handleAfterChangeSlider}
                                                onChange={this.handleChangeSlider}
                                                tipFormatter={() => this.formatTimestamp(totalTimes.indexOf(selectedTotim))}
                                            />
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>

                            <Segment loading={this.state.fetching} color={'grey'}>
                                {data &&
                                <ResultsMap
                                    boundaries={boundaries}
                                    data={data}
                                    model={model}
                                    onClick={colRow => {
                                        this.setState({
                                            selectedRow: colRow[1],
                                            selectedCol: colRow[0]
                                        })
                                    }}
                                />
                                }
                            </Segment>

                            <Grid>
                                <Grid.Row columns={2}>
                                    <Grid.Column>
                                        <Segment loading={this.state.fetching} color={'blue'}>
                                            <Header textAlign={'center'} as={'h4'}>Horizontal cross section</Header>
                                            {data && <ResultsChart data={data} row={selectedRow} col={selectedCol}
                                                                   show={'row'}/>}
                                        </Segment>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Segment loading={this.state.fetching} color={'blue'}>
                                            <Header textAlign={'center'} as={'h4'}>Vertical cross section</Header>
                                            {data && <ResultsChart data={data} col={selectedCol} row={selectedRow}
                                                                   show={'col'}/>}
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}


const mapStateToProps = state => {
    return {
        model: ModflowModel.fromObject(state.T03.model),
        boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
        soilmodel: state.T03.soilmodel ? Soilmodel.fromObject(state.T03.soilmodel) : null
    };
};

Results.proptypes = {
    calculation: PropTypes.instanceOf(Calculation).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
};

export default connect(mapStateToProps)(Results);
