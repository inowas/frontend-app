import React from 'react';
import Uuid from 'uuid';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Accordion, Button, Grid, Header, Icon, Segment} from 'semantic-ui-react';
import {BoundaryCollection, Calculation, ModflowModel, Soilmodel, Transport} from 'core/model/modflow';
import ResultsMap from '../../maps/resultsMap';
import ResultsChart from '../../../../shared/complexTools/ResultsChart';
import {fetchCalculationResultsTransport, sendCommand} from 'services/api';
import ScenarioAnalysisCommand from '../../../../t07/commands/scenarioAnalysisCommand';
import {withRouter} from 'react-router-dom';
import ResultsSelectorTransport from '../../../../shared/complexTools/ResultsSelectorTransport';

class TransportResults extends React.Component {

    constructor(props) {
        super(props);
        const {model} = this.props;
        const {gridSize} = model;

        this.state = {
            isLoading: false,
            selectedLay: 0,
            selectedRow: Math.floor(gridSize.nY / 2),
            selectedCol: Math.floor(gridSize.nX / 2),
            selectedTotim: 0,
            selectedSubstance: 0,
            layerValues: null,
            totalTimes: null,
            fetching: false,
            activeIndex: 0
        };

        if (props.calculation instanceof Calculation) {
            const totalTimes = props.calculation.times.total_times;
            this.state.layerValues = props.calculation.layer_values;
            this.state.selectedTotim = totalTimes.slice(-1)[0];
            this.state.totalTimes = totalTimes;
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!(nextProps.calculation instanceof Calculation)) {
            return null;
        }

        if (!this.state.totalTimes) {
            const {calculation} = nextProps;
            const totalTimes = calculation.times.total_times;

            return this.setState({
                layerValues: calculation.layer_values,
                selectedTotim: totalTimes.slice(-1)[0],
                totalTimes
            })
        }
    }

    componentDidMount() {
        if (!(this.props.calculation instanceof Calculation)) {
            return null;
        }

        this.fetchData({
            substance: this.state.selectedSubstance,
            layer: this.state.selectedLay,
            totim: this.state.selectedTotim,
        })
    }

    fetchData({substance, layer, totim}) {
        const calculationId = this.props.calculation.id;

        this.setState({fetching: true}, () =>
            fetchCalculationResultsTransport({calculationId, substance, layer, totim}, data => {
                return this.setState({
                    selectedLay: layer,
                    selectedTotim: totim,
                    selectedSubstance: substance,
                    data,
                    fetching: false
                });
            }, (e) => this.setState({isError: e}))
        );
    }

    handleClickAccordion = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({
            activeIndex: newIndex
        });
    };

    onCreateScenarioAnalysisClick = () => {
        const scenarioAnalysisId = Uuid.v4();
        sendCommand(ScenarioAnalysisCommand.createScenarioAnalysis(
            scenarioAnalysisId,
            this.props.model.id,
            'New scenario analysis ' + this.props.model.name,
            '',
            this.props.model.isPublic
            ),
            () => this.props.history.push('/tools/T07/' + scenarioAnalysisId),
            () => this.setState({error: true})
        )
    };

    render() {
        const {calculation} = this.props;

        if (!(calculation instanceof Calculation)) {
            return (
                <Segment color={'grey'} loading={this.state.isLoading}>
                    <Header as={'h2'}>
                        No result data found. <br/>
                        Have you started the calculation?
                    </Header>
                </Segment>
            )
        }

        const {data, selectedCol, selectedRow, selectedSubstance, selectedLay, selectedTotim, layerValues, totalTimes} = this.state;
        const {model, boundaries, soilmodel, transport} = this.props;
        const {activeIndex} = this.state;

        return (
            <Segment color={'grey'} loading={this.state.isLoading}>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column>
                            <ResultsSelectorTransport
                                data={{
                                    substance: selectedSubstance,
                                    layer: selectedLay,
                                    totim: selectedTotim,
                                }}
                                onChange={({substance, layer, totim}) => {
                                    return this.setState({
                                        selectedSubstance: substance,
                                        selectedLay: layer,
                                        selectedTotim: totim
                                    }, () => this.fetchData({substance, layer, totim}));
                                }}
                                layerValues={layerValues}
                                soilmodel={soilmodel}
                                stressperiods={model.stressperiods}
                                totalTimes={totalTimes}
                                transport={transport}
                            />

                            <Segment color={'grey'} loading={this.state.fetching}>
                                <Accordion>
                                    <Accordion.Title active={activeIndex === 0} index={0}
                                                     onClick={this.handleClickAccordion}>
                                        <Icon name='dropdown'/>
                                        Results Map
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 0}>
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
                                            colors={['#0000F0', '#016CFD', '#5FFF97', '#FDCC01', '#E20000']}
                                            opacity={0.75}
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
                            {!model.readOnly &&
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Button
                                            onClick={this.onCreateScenarioAnalysisClick}
                                        >
                                            Create Scenario Analysis
                                        </Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}


const mapStateToProps = state => {
    return {
        boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
        calculation: state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null,
        model: ModflowModel.fromObject(state.T03.model),
        soilmodel: Soilmodel.fromObject(state.T03.soilmodel),
        transport: Transport.fromObject(state.T03.transport)
    };
};

TransportResults.propTypes = {
    history: PropTypes.object.isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    calculation: PropTypes.instanceOf(Calculation).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
};

export default withRouter(connect(mapStateToProps)(TransportResults));
