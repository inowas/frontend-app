import React from 'react';
import PropTypes from 'prop-types';

import {Grid, Header, Segment} from 'semantic-ui-react';
import {BoundaryCollection, Calculation, ModflowModel, Soilmodel} from 'core/model/modflow';
import {ScenarioAnalysis} from 'core/model/scenarioAnalysis';
import ResultsSelectorFlow from '../../shared/complexTools/ResultsSelectorFlow';
import ResultsMap from '../../shared/complexTools/ResultsMap';
import ResultsChart from '../../shared/complexTools/ResultsChart';
import {chunk, compact, flatten} from 'lodash';
import {fetchCalculationResultsFlow} from '../../../services/api';

class CrossSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            selectedModels: [],
            data: [],

            boundaries: [],
            calculations: [],
            models: [],

            isLoading: false,
            selectedCol: null,
            selectedLay: null,
            selectedRow: null,
            selectedTotim: null,
            selectedType: 'head',

            layerValues: null,
            totalTimes: null,

            commonViewPort: null
        }
    }

    componentDidMount() {

        const {basemodel, basemodelCalculation} = this.props;
        const selectedModels = this.props.selected.map(id => {
            if (this.props.models.hasOwnProperty(id)) {
                return ModflowModel.fromObject(this.props.models[id]);
            }

            return null;
        }).filter(e => e !== null);

        const {gridSize, stressperiods} = basemodel;

        const selectedLay = 0;
        const selectedCol = Math.floor(gridSize.nX / 2);
        const selectedRow = Math.floor(gridSize.nY / 2);
        const selectedTotim = basemodelCalculation.times.total_times[0];
        const totalTimes = basemodelCalculation.times.total_times;
        const layerValues = basemodelCalculation.layer_values;


        return this.setState({
                stressperiods,
                selectedCol,
                selectedLay,
                selectedRow,
                selectedTotim,
                selectedModels,
                totalTimes,
                layerValues
            },
            () => this.fetchData());
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.selected.length !== this.state.selectedModels.length) {
            const unsortedSelectedModels = Object.values(nextProps.models)
                .filter(m => nextProps.selected.indexOf(m.id) > -1)
                .map(m => ModflowModel.fromObject(m));

            const selectedModels = [];

            const modelIds = this.props.scenarioAnalysis.getModelIds();
            modelIds.forEach(id => {
                const filtered = unsortedSelectedModels.filter(m => m.id === id);
                if (filtered.length === 1) {
                    selectedModels.push(filtered[0])
                }
            });

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
                    fetchCalculationResultsFlow({
                        calculationId: m.calculationId,
                        type: selectedType,
                        totim: selectedTotim,
                        layer: selectedLay
                    }, data => {
                        this.setState({
                            data: {...this.state.data, [m.id]: data}
                        })
                    });
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

    renderMap = (id, length, globalMinMax) => {

        if (!this.props.models.hasOwnProperty(id) || !this.props.boundaries.hasOwnProperty(id) || !this.state.data.hasOwnProperty(id)) {
            return null;
        }

        const model = ModflowModel.fromObject(this.props.models[id]);
        const boundaries = BoundaryCollection.fromObject(this.props.boundaries[id]);
        const data = this.state.data[id];

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
                    globalMinMax={globalMinMax}
                    model={model}
                    onClick={colRow => {
                        this.setState({
                            selectedCol: colRow[0],
                            selectedRow: colRow[1]
                        })
                    }}
                    viewport={this.state.commonViewPort}
                    onViewPortChange={(viewPort) => this.setState({commonViewPort: viewPort})}
                />
            </Segment>
        )
    };

    renderMaps = (globalMinMax) => {

        let numberOfCols = 2;
        if (this.state.selectedModels.length === 1) {
            numberOfCols = 1;
        }

        const modelChunks = chunk(this.state.selectedModels, numberOfCols);

        return (
            <Grid>
                {modelChunks.map((chunk, cIdx) => (
                    <Grid.Row key={cIdx} columns={numberOfCols}>
                        {chunk.map(m => (
                            <Grid.Column
                                key={m.id}>{this.renderMap(m.id, this.props.selected.length, globalMinMax)}</Grid.Column>
                        ))}
                    </Grid.Row>
                ))}
            </Grid>
        );
    };

    calculateGlobalMinMax = () => {
        const sortedValues = compact(flatten(flatten(Object.values(this.state.data)))).sort();
        const min = Math.floor(sortedValues[0]);
        const max = Math.ceil(sortedValues[sortedValues.length - 1]);
        return [min, max];
    };

    render() {
        const {layerValues, totalTimes, soilmodel, stressperiods, selectedType, selectedCol, selectedLay, selectedModels, selectedRow, selectedTotim} = this.state;
        if (soilmodel === null ||
            stressperiods === null || selectedLay === null || selectedTotim === null) {
            return null;
        }


        if (selectedModels.length === 0) {
            return null;
        }

        const globalMinMax = this.calculateGlobalMinMax(selectedModels);

        const mappedModelsForResultChart = selectedModels.map(m => {
            const model = m.toObject();

            return {
                id: model.id,
                name: model.name,
                data: this.state.data[model.id]
            }
        });
        return (
            <div>
                <Segment color={'grey'} loading={this.state.isLoading}>
                    <ResultsSelectorFlow
                        data={{
                            type: selectedType,
                            layer: selectedLay,
                            totim: selectedTotim,
                        }}
                        onChange={this.onChangeTypeLayerOrTotim}
                        layerValues={layerValues}
                        soilmodel={this.props.basemodelSoilmodel}
                        stressperiods={stressperiods}
                        totalTimes={totalTimes}
                    />
                </Segment>

                <Segment color={'grey'} loading={this.state.isLoading}>
                    {this.renderMaps(globalMinMax)}
                </Segment>

                <Segment color={'grey'} loading={this.state.isLoading}>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Segment>
                                    <Header textAlign={'center'} as={'h4'}>Horizontal cross section</Header>
                                    <ResultsChart
                                        selectedModels={mappedModelsForResultChart}
                                        col={selectedCol}
                                        row={selectedRow}
                                        show={'row'}
                                        globalMinMax={globalMinMax}
                                    />
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment>
                                    <Header textAlign={'center'} as={'h4'}>Vertical cross section</Header>
                                    <ResultsChart
                                        selectedModels={mappedModelsForResultChart}
                                        col={selectedCol}
                                        row={selectedRow}
                                        show={'col'}
                                        globalMinMax={globalMinMax}
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

CrossSection.propTypes = {
    basemodel: PropTypes.instanceOf(ModflowModel).isRequired,
    basemodelCalculation: PropTypes.instanceOf(Calculation).isRequired,
    basemodelSoilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
    models: PropTypes.array.isRequired,
    boundaries: PropTypes.array.isRequired,
    calculations: PropTypes.array.isRequired,
    scenarioAnalysis: PropTypes.instanceOf(ScenarioAnalysis).isRequired,
    selected: PropTypes.array.isRequired,
};

export default CrossSection;
