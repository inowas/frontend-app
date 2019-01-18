import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Grid, Segment} from 'semantic-ui-react';
import {BoundaryCollection, CalculationResults, ModflowModel, Soilmodel} from 'core/model/modflow';
import {fetchUrl} from 'services/api';
import {ScenarioAnalysis} from 'core/model/scenarioAnalysis';
import ResultsSelector from '../../shared/complexTools/ResultsSelector';
import ResultsMap from '../../shared/complexTools/ResultsMap';

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
        const selectedModels = this.props.scenarioAnalysis.models.filter(m => this.props.selected.indexOf(m.id) > -1);
        const baseModelId = this.props.scenarioAnalysis.baseModelId;
        const filtered = this.props.models.filter(m => m.id === baseModelId);
        if (filtered.length === 1) {
            const baseModel = filtered[0].model ? ModflowModel.fromObject(filtered[0].model) : null;
            const stressperiods = (baseModel instanceof ModflowModel) ? baseModel.stressperiods : null;
            const soilmodel = filtered[0].soilmodel ? Soilmodel.fromObject(filtered[0].soilmodel) : null;
            const results = filtered[0].results ? CalculationResults.fromObject(filtered[0].results) : null;


            const selectedLay = 0;
            const selectedCol = baseModel ? Math.floor(baseModel.gridSize.nX / 2) : 0;
            const selectedRow = baseModel ? Math.floor(baseModel.gridSize.nY / 2) : 0;
            const selectedTotim = results ? results.totalTimes[0] : null;

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
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.selected.length !== this.state.selectedModels.length) {
            const selectedModels = nextProps.scenarioAnalysis.models
                .filter(m => nextProps.selected.indexOf(m.id) > -1)
            ;
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
        let filtered = this.props.models.filter(m => m.id === id);
        if (filtered.length !== 1) {
            return null;
        }

        const model = filtered[0].model ? ModflowModel.fromObject(filtered[0].model) : null;
        const boundaries = filtered[0].boundaries ? BoundaryCollection.fromObject(filtered[0].boundaries) : null;

        filtered = this.state.selectedModels.filter(m => m.id === id);
        if (filtered.length !== 1) {
            return null;
        }
        const data = filtered[0].data;

        if (!model || !boundaries || !data) {
            return <Segment loading/>;
        }

        return (
            <Segment>
                <ResultsMap
                    key={id+'-'+length}
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
        const {results, soilmodel, stressperiods, selectedType, selectedLay, selectedTotim} = this.state;
        if (results === null || soilmodel === null ||
            stressperiods === null || selectedLay === null || selectedTotim === null) {
            return null;
        }

        const {layerValues, totalTimes} = results;

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
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
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
