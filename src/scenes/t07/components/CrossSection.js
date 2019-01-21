import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Grid, Header, Segment} from 'semantic-ui-react';
import {BoundaryCollection, ModflowModel} from 'core/model/modflow';
import {fetchUrl} from 'services/api';
import {ScenarioAnalysis} from 'core/model/scenarioAnalysis';
import ResultsSelector from '../../shared/complexTools/ResultsSelector';
import ResultsMap from '../../shared/complexTools/ResultsMap';
import ResultsChart from '../../shared/complexTools/ResultsChart';

class CrossSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            results: null,
            soilmodel: null,
            stressperiods: null,

            selectedModels: [],

            isLoading: false,
            selectedCol: null,
            selectedLay: null,
            selectedRow: null,
            selectedTotim: null,
            selectedType: 'head',
        }
    }

    componentDidMount() {
        const {scenarioAnalysis} = this.props;
        const selectedModels = scenarioAnalysis.models.filter(m => this.props.selected.indexOf(m.id) > -1);
        const {gridSize, results, soilmodel, stressperiods} = scenarioAnalysis;

        const selectedLay = 0;
        const selectedCol = Math.floor(gridSize.nX / 2);
        const selectedRow = Math.floor(gridSize.nY / 2);
        const selectedTotim = results.totalTimes[0];

        return this.setState({
                results,
                soilmodel,
                stressperiods,
                selectedCol,
                selectedLay,
                selectedRow,
                selectedTotim,
                selectedModels
            },
            () => this.fetchData());
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.selected.length !== this.state.selectedModels.length) {
            const selectedModels = nextProps.scenarioAnalysis.models
                .filter(m => nextProps.selected.indexOf(m.id) > -1);
            return this.setState({selectedModels}, () => this.fetchData());
        }
    }

    fetchData = () => {
        const {selectedType, selectedLay, selectedTotim, selectedModels} = this.state;
        if (selectedType === null || selectedLay === null || selectedTotim === null) {
            return null;
        }

        const models = selectedModels.map(m => {
            m.loading = true;
            return m;
        });

        return this.setState({models, fetching: true},
            () => models.forEach(m => {
                if (this.props.selected.indexOf(m.id) >= 0) {
                    fetchUrl(`calculations/${m.calculation_id}/results/types/${selectedType}/layers/${selectedLay}/totims/${selectedTotim}`,
                        data => this.setState((prevState) => {
                            const models = prevState.selectedModels.map(sm => {
                                if (m.id === sm.id) {
                                    sm.data = data;
                                    sm.loading = false;
                                    return sm;
                                }
                                return sm;
                            });
                            return {selectedModels: models};
                        }),
                        (e) => this.setState({isError: e}));
                }
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

    renderMap = (id, length) => {

        if (!this.props.models[id] || !this.props.boundaries[id]) {
            return null;
        }

        const model = ModflowModel.fromObject(this.props.models[id]);
        const boundaries = BoundaryCollection.fromObject(this.props.boundaries[id]);
        const data = this.state.selectedModels.filter(m => m.id === id)[0].data;

        if (!model || !boundaries || !data) {
            return <Segment loading/>;
        }

        return (
            <Segment>
                <Header as={'h4'}>{model.name}</Header>
                <ResultsMap
                    key={id + '-' + length}
                    activeCell={[this.state.selectedCol, this.state.selectedRow]}
                    boundaries={boundaries}
                    data={data}
                    model={model}
                    onClick={colRow => {
                        this.setState({
                            selectedCol: colRow[0],
                            selectedRow: colRow[1]
                        })
                    }}
                />
            </Segment>
        )
    };

    render() {
        const {results, soilmodel, stressperiods, selectedType, selectedCol, selectedLay, selectedModels, selectedRow, selectedTotim} = this.state;
        if (results === null || soilmodel === null ||
            stressperiods === null || selectedLay === null || selectedTotim === null) {
            return null;
        }

        const {layerValues, totalTimes} = results;

        if (selectedModels.length === 0) {
            return null;
        }

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

                <Segment color={'grey'} loading={this.state.isLoading}>
                    <Grid>
                        <Grid.Row columns={this.props.selected.length}>
                            {this.state.selectedModels.map(m => (
                                <Grid.Column key={m.id}>{this.renderMap(m.id, this.props.selected.length)}</Grid.Column>
                            ))}
                        </Grid.Row>
                    </Grid>
                </Segment>

                <Segment color={'grey'} loading={this.state.isLoading}>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Segment>
                                    <Header textAlign={'center'} as={'h4'}>Horizontal cross section</Header>
                                    <ResultsChart selectedModels={selectedModels} col={selectedCol} row={selectedRow} show={'row'}/>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment>
                                    <Header textAlign={'center'} as={'h4'}>Vertical cross section</Header>
                                    <ResultsChart selectedModels={selectedModels} col={selectedCol} row={selectedRow} show={'col'}/>
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

CrossSection.proptypes = {
    models: PropTypes.array.isRequired,
    scenarioAnalysis: PropTypes.instanceOf(ScenarioAnalysis).isRequired,
    selected: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(CrossSection);
