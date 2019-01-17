import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Grid, Header, Segment} from 'semantic-ui-react';
import {BoundaryCollection, Calculation, CalculationResults, ModflowModel, Soilmodel} from 'core/model/modflow';
import {fetchUrl} from 'services/api';
import {last} from 'lodash';
import {ScenarioAnalysis} from '../../../core/model/scenarioAnalysis';
import ResultsSelector from '../../shared/complexTools/ResultsSelector';

class CrossSection extends React.Component {

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
        const {calculation} = this.props;
        const {calculationId} = this.state;
        if ((calculation instanceof Calculation) && !calculationId) {
            this.fetchResults();
        }
    }

    componentWillReceiveProps(nextProps) {
        const {calculation} = nextProps;
        const {calculationId} = this.state;
        if ((calculation instanceof Calculation) && !calculationId) {
            this.fetchResults();
        }
    }

    fetchResults() {
        const {model} = this.props;
        this.setState({isLoading: true},
            () => fetchUrl(`modflowmodels/${model.id}/results`,
                data => {
                    const results = CalculationResults.fromQuery(data);
                    const calculationId = results.calculationId;
                    const totalTimes = results.totalTimes;
                    const layerValues = results.layerValues;
                    return this.setState({calculationId, layerValues, totalTimes, isLoading: false},
                        () => this.onChangeTypeLayerOrTime({
                            type: this.state.selectedType,
                            totim: last(totalTimes),
                            layer: this.state.selectedLay
                        })
                    );
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

    render() {
        const {calculationId, data, selectedCol, selectedRow, selectedType, selectedLay, selectedTotim, layerValues, totalTimes} = this.state;
        const {baseModel, results, soilmodel} = this.props;

        if (!baseModel || !results) {
            return null;
        }

        return (
            <Segment color={'grey'} loading={this.state.isLoading}>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column>
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
                                stressperiods={baseModel.stressperiods}
                                totalTimes={totalTimes}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}


const mapStateToProps = state => {
    return {
        baseModel: state.T07.baseModel.model ? ModflowModel.fromObject(state.T07.baseModel.model) : null,
        scenarios: state.T07.scenarios,
        results: state.T07.results ? CalculationResults.fromObject(state.T07.results) : null,
        scenarioAnalysis: state.T07.scenarioAnalysis ? ScenarioAnalysis.fromObject(state.T07.scenarioAnalysis) : null
    };
};

CrossSection.proptypes = {
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    calculation: PropTypes.instanceOf(Calculation).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
};

export default connect(mapStateToProps)(CrossSection);
