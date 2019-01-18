import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Segment} from 'semantic-ui-react';
import {BoundaryCollection, Calculation, CalculationResults, ModflowModel, Soilmodel} from 'core/model/modflow';
import {fetchUrl} from 'services/api';
import {last} from 'lodash';
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

            models: [],

            isLoading: false,
            selectedCol: 0,
            selectedLay: 0,
            selectedRow: 0,
            selectedTotim: 0,
            selectedType: 'head'
        }
    }

    componentDidMount() {
        this.getMetaData();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.getMetaData();
    }

    getMetaData = () => {
        const baseModelId = this.props.scenarioAnalysis.baseModelId;
        const filtered = this.props.models.filter(m => m.id === baseModelId);
        if (filtered.length === 1) {
            const baseModel = filtered[0].model ? ModflowModel.fromObject(filtered[0].model) : null;
            const stressperiods = (baseModel instanceof ModflowModel) ? baseModel.stressperiods : null;
            const soilmodel = filtered[0].soilmodel ? Soilmodel.fromObject(filtered[0].soilmodel) : null;
            const results = filtered[0].results ? CalculationResults.fromObject(filtered[0].results) : null;

            const selectedCol = baseModel ? Math.floor(baseModel.gridSize.nX / 2) : 0;
            const selectedRow = baseModel ? Math.floor(baseModel.gridSize.nY / 2) : 0;
            const selectedTotim = results ? results.totalTimes[0] : 0;

            this.setState({results, soilmodel, stressperiods, selectedCol, selectedRow, selectedTotim});
        }
        const models = [this.props.scenarioAnalysis.baseModel]
            .concat(this.props.scenarioAnalysis.scenarios)
            .filter(m => this.props.selected.indexOf(m.id) > -1);

        this.setState({models});
    };

    fetchData(calculationId) {
        const {selectedType, selectedLay, selectedTotim} = this.state;
        const models = this.state.models.map(m => {
            m.data = null;
            m.loading = true;
            return m;
        });

        return this.setState({models},
            () => models.forEach(m => {
                console.log(m);
                if (this.props.selected.indexOf(m.id) >= 0) {
                    fetchUrl(`calculations/${m.calculation_id}/results/types/${selectedType}/layers/${selectedLay}/totims/${selectedTotim}`,
                        data => this.setState((prevState) => {
                            const models = prevState.models.map(sm => {
                                if (m.id === sm.id) {
                                    sm.data = data;
                                    return sm;
                                }
                                return sm;
                            });
                            return {models};
                        }),
                        (e) => this.setState({isError: e}));
                }
            })
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

    renderMap = (id) => {
        const filtered = this.props.models.filter(m => m.id);
        if (filtered.length !== 1) {
            return null;
        }

        const model = filtered[0].model ? ModflowModel.fromObject(filtered[0].model) : null;
        const boundaries = filtered[0].boundaries ? BoundaryCollection.fromObject(filtered[0].boundaries) : null;


        if (!model || !boundaries) {
            return null;
        }

        return (
            <ResultsMap
                activeCell={[this.state.selectedCol, this.state.selectedRow]}
                boundaries={boundaries}
                data={this.state.data}
                model={model}
                onClick={colRow => {
                    this.setState({
                        selectedCol: colRow[0],
                        selectedRow: colRow[1]
                    })
                }}
            />
        )
    };

    render() {

        console.log(this.state);

        const {results, soilmodel, stressperiods, selectedType, selectedLay, selectedTotim} = this.state;
        if (!results || !soilmodel || !stressperiods) {
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
                        onChange={({type, layer, totim}) => {
                            return this.setState({
                                selectedType: type,
                                selectedLay: layer,
                                selectedTotim: totim
                            }, () => this.fetchData({layer, totim, type}));
                        }}
                        layerValues={layerValues}
                        soilmodel={soilmodel}
                        stressperiods={stressperiods}
                        totalTimes={totalTimes}
                    />
                </Segment>

                <Segment color={'grey'} loading={this.state.isLoading}>
                    {this.renderMap(this.props.selected[0])}
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
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    calculation: PropTypes.instanceOf(Calculation).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    selected: PropTypes.array.isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
};

export default connect(mapStateToProps)(CrossSection);
