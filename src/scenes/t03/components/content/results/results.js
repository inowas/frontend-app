import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Accordion, Grid, Header, Icon, Segment} from 'semantic-ui-react';
import {BoundaryCollection, Calculation, CalculationResults, ModflowModel, Soilmodel} from 'core/model/modflow';
import {fetchUrl} from 'services/api';
import {last} from 'lodash';
import ResultsMap from '../../maps/resultsMap';
import ResultsChart from '../../../../shared/complexTools/ResultsChart';
import ResultsSelector from '../../../../shared/complexTools/ResultsSelector';

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
            fetching: false,
            activeIndex: 0
        }
    }

    componentDidMount() {
        const {calculation} = this.props;
        const {calculationId} = this.state;
        if ((calculation instanceof Calculation) && !calculationId) {
            this.fetchResults();
        }

        const {model} = this.props;
        const {gridSize} = model;

        return this.setState({
            selectedCol: Math.floor(gridSize.nX / 2),
            selectedRow: Math.floor(gridSize.nY / 2),
        })
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

    handleClickAccordion = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({
            activeIndex: newIndex
        });
    };

    render() {
        const {calculationId, data, selectedCol, selectedRow, selectedType, selectedLay, selectedTotim, layerValues, totalTimes} = this.state;
        const {model, boundaries, soilmodel} = this.props;
        const {activeIndex} = this.state;

        if (!calculationId || !data) {
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
                                stressperiods={model.stressperiods}
                                totalTimes={totalTimes}
                            />

                            <Segment color={'grey'} loading={this.state.fetching}>
                                <Accordion>
                                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClickAccordion}>
                                        <Icon name='dropdown'/>
                                        Results Map
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 0} >
                                            {data &&
                                            <ResultsMap
                                                activeCell={[selectedCol, selectedRow]}
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
                                            }
                                    </Accordion.Content>
                                </Accordion>
                            </Segment>
                            <Grid>
                                <Grid.Row columns={2}>
                                    <Grid.Column>
                                        <Segment loading={this.state.fetching} color={'blue'}>
                                            <Header textAlign={'center'} as={'h4'}>Horizontal cross section</Header>
                                            {data &&
                                            <ResultsChart data={data} col={selectedCol} row={selectedRow} show={'row'}/>
                                            }
                                        </Segment>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Segment loading={this.state.fetching} color={'blue'}>
                                            <Header textAlign={'center'} as={'h4'}>Vertical cross section</Header>
                                            {data &&
                                            <ResultsChart data={data} col={selectedCol} row={selectedRow} show={'col'}/>
                                            }
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
        calculation: state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null,
        boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
        model: ModflowModel.fromObject(state.T03.model),
        soilmodel: state.T03.soilmodel ? Soilmodel.fromObject(state.T03.soilmodel) : null
    };
};

Results.proptypes = {
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    calculation: PropTypes.instanceOf(Calculation).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
};

export default connect(mapStateToProps)(Results);
