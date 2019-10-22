import React from 'react';
import Uuid from 'uuid';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Accordion, Button, Grid, Header, Icon, Segment} from 'semantic-ui-react';
import {Calculation, ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import ResultsMap from '../../maps/resultsMap';
import ResultsChart from '../../../../shared/complexTools/ResultsChart';
import ResultsSelectorFlow from '../../../../shared/complexTools/ResultsSelectorFlow';
import {fetchCalculationResultsFlow, sendCommand} from '../../../../../services/api';
import ScenarioAnalysisCommand from '../../../../t07/commands/scenarioAnalysisCommand';
import {withRouter} from 'react-router-dom';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';

class FlowResults extends React.Component {

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
            selectedType: 'head',
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
            layer: this.state.selectedLay,
            totim: this.state.selectedTotim,
            type: this.state.selectedType,
        })
    }

    fetchData({layer, totim, type}) {
        const calculationId = this.props.calculation.id;

        this.setState({fetching: true}, () =>
            fetchCalculationResultsFlow({calculationId, layer, totim, type}, data =>
                    this.setState({
                        selectedLay: layer,
                        selectedTotim: totim,
                        selectedType: type,
                        data,
                        fetching: false
                    }),
                (e) => this.setState({isError: e})
            )
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


        const {data, selectedCol, selectedRow, selectedType, selectedLay, selectedTotim, layerValues, totalTimes} = this.state;
        const {model, boundaries, soilmodel} = this.props;
        const {activeIndex} = this.state;

        return (
            <Segment color={'grey'} loading={this.state.isLoading}>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column>
                            <ResultsSelectorFlow
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
        soilmodel: Soilmodel.fromObject(state.T03.soilmodel)
    };
};

FlowResults.propTypes = {
    history: PropTypes.object.isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    calculation: PropTypes.instanceOf(Calculation).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
};

export default withRouter(connect(mapStateToProps)(FlowResults));
