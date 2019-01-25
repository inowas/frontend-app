import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Form, Grid, Header, Segment} from 'semantic-ui-react';
import {BoundaryCollection, ModflowModel} from 'core/model/modflow';
import {fetchUrl} from 'services/api';
import {ScenarioAnalysis} from 'core/model/scenarioAnalysis';
import ResultsSelector from '../../shared/complexTools/ResultsSelector';
import ResultsMap from '../../shared/complexTools/ResultsMap';
import ResultsChart from '../../shared/complexTools/ResultsChart';
import {cloneDeep} from 'lodash';

class Difference extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            results: null,
            soilmodel: null,
            stressperiods: null,

            models: [],
            selected: [],

            isLoading: false,
            selectedCol: null,
            selectedLay: null,
            selectedRow: null,
            selectedTotim: null,
            selectedType: 'head',

            commonViewPort: null
        }
    }

    componentDidMount() {
        const {scenarioAnalysis} = this.props;
        const {gridSize, results, soilmodel, stressperiods} = scenarioAnalysis;

        const models = scenarioAnalysis.models;
        const selected = [models[0].id, models[1].id];
        const selectedLay = 0;
        const selectedCol = Math.floor(gridSize.nX / 2);
        const selectedRow = Math.floor(gridSize.nY / 2);
        const selectedTotim = results.totalTimes[0];

        return this.setState({
                models,
                results,
                selected,
                soilmodel,
                stressperiods,
                selectedCol,
                selectedLay,
                selectedRow,
                selectedTotim
            },
            () => this.fetchData());
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.models.length !== this.state.models.length) {
            this.fetchData();
        }
    }

    fetchData = () => {
        const {selectedType, selectedLay, selectedTotim} = this.state;
        if (selectedType === null || selectedLay === null || selectedTotim === null) {
            return null;
        }

        const models = this.state.models.map(m => {
            m.loading = true;
            return m;
        });

        return this.setState({models, fetching: true},
            () => models.forEach(m => {
                fetchUrl(`calculations/${m.calculation_id}/results/types/${selectedType}/layers/${selectedLay}/totims/${selectedTotim}`,
                    data => this.setState((prevState) => {
                        const models = prevState.models.map(sm => {
                            if (m.id === sm.id) {
                                sm.data = data;
                                sm.loading = false;
                                return sm;
                            }
                            return sm;
                        });
                        return {models};
                    }),
                    (e) => this.setState({isError: e}));
            })
        )
    };

    onChangeTypeLayerOrTotim = ({type, layer, totim}) => {
        const {selectedType, selectedLay, selectedTotim} = this.state;
        if (type === selectedType && layer === selectedLay && totim === selectedTotim) {
            return;
        }

        return this.setState({
            selectedType: type,
            selectedLay: layer,
            selectedTotim: totim
        }, () => this.fetchData({layer, totim, type}));
    };

    diff2DArrays = (a1, a2) => {
        const res = cloneDeep(a2);
        a1.map(((r, rId) => r.map((v, cId) => res[rId][cId] = a1[rId][cId] - a2[rId][cId])));
        return res;
    };

    handleSelect = (e, {id, value}) => {
        this.setState((prevState) => {
            const selected = cloneDeep(prevState.selected);
            selected[id] = value;
            return {selected};
        });
    };

    modelOptions = () => {
        const {models} = this.state;
        if (!models) {
            return [];
        }

        return models.map(m => (
            {key: m.id, value: m.id, text: m.name}
        ))
    };

    render() {
        const {results, soilmodel, stressperiods, selectedType, selected, selectedCol, selectedLay, selectedRow, selectedTotim} = this.state;
        if (results === null || soilmodel === null ||
            stressperiods === null || selectedLay === null || selectedTotim === null) {
            return null;
        }

        const {layerValues, totalTimes} = results;

        if (selected.length !== 2) {
            return;
        }

        const [mId1, mId2] = this.state.selected;
        if (!this.props.models[mId1]) {
            return null;
        }

        const m1 = ModflowModel.fromObject(this.props.models[mId1]);
        const d1 = this.state.models.filter(m => m.id === mId1)[0].data;
        const d2 = this.state.models.filter(m => m.id === mId2)[0].data;

        if (!d1 || !d2) {
            return null;
        }

        const diff = this.diff2DArrays(d1, d2);

        return (
            <div>
                <Segment color={'grey'} loading={this.state.isLoading}>
                    <ResultsSelector
                        data={{
                            type: selectedType,
                            layer: selectedLay,
                            totim: selectedTotim,
                        }}
                        onChange={this.onChangeTypeLayerOrTotim}
                        layerValues={layerValues}
                        soilmodel={soilmodel}
                        stressperiods={stressperiods}
                        totalTimes={totalTimes}
                    />
                </Segment>

                <Segment color={'grey'}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={7}>
                                <Form.Dropdown
                                    style={{zIndex: 1000}}
                                    selection
                                    fluid
                                    id={0}
                                    options={this.modelOptions()}
                                    value={this.state.selected[0]}
                                    onChange={this.handleSelect}
                                />
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Header as={'h4'}>compare with</Header>
                            </Grid.Column>
                            <Grid.Column width={7}>
                                <Form.Dropdown
                                    style={{zIndex: 1000}}
                                    selection
                                    fluid
                                    id={1}
                                    options={this.modelOptions()}
                                    value={this.state.selected[1]}
                                    onChange={this.handleSelect}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment color={'grey'} loading={this.state.isLoading}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <Segment>
                                    <ResultsMap
                                        key={mId1}
                                        activeCell={[this.state.selectedCol, this.state.selectedRow]}
                                        boundaries={BoundaryCollection.fromObject([])}
                                        data={diff}
                                        model={m1}
                                        onClick={colRow => {
                                            this.setState({
                                                selectedCol: colRow[0],
                                                selectedRow: colRow[1]
                                            })
                                        }}
                                    />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment color={'grey'} loading={this.state.isLoading}>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Segment>
                                    <Header textAlign={'center'} as={'h4'}>Horizontal cross section</Header>
                                    <ResultsChart
                                        data={diff}
                                        col={selectedCol}
                                        row={selectedRow}
                                        show={'row'}
                                    />
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment>
                                    <Header textAlign={'center'} as={'h4'}>Vertical cross section</Header>
                                    <ResultsChart
                                        data={diff}
                                        col={selectedCol}
                                        row={selectedRow}
                                        show={'col'}
                                    />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        boundaries: state.T07.boundaries,
        models: state.T07.models,
        scenarioAnalysis: state.T07.scenarioAnalysis ? ScenarioAnalysis.fromObject(state.T07.scenarioAnalysis) : null
    };
};

Difference.proptypes = {
    models: PropTypes.array.isRequired,
    scenarioAnalysis: PropTypes.instanceOf(ScenarioAnalysis).isRequired,
};

export default connect(mapStateToProps)(Difference);
