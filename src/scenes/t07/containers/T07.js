import React from 'react';
import {connect} from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';

import PropTypes from 'prop-types';

import AppContainer from '../../shared/AppContainer';
import {Button, Form, Grid, Header, Icon, Message, Segment} from 'semantic-ui-react';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import {fetchUrl, sendCommand} from 'services/api';

import {
    clear,
    updateBaseModel,
    updateBaseModelBoundaries,
    updateScenario,
    updateScenarioBoundaries,
    updateScenarioAnalysis
} from '../actions/actions';

import {ScenarioAnalysis} from 'core/model/scenarioAnalysis';
import {BoundaryCollection, ModflowModel, Soilmodel} from '../../../core/model/modflow';

import ResultsMap from '../../t03/components/content/results/results';

import Slider from 'rc-slider';
import {last} from 'lodash';

const SliderWithTooltip = Slider.createSliderWithTooltip(Slider);

const navigation = [
    {
        name: 'Documentation',
        path: 'https://inowas.com/tools/t07-application-specific-scenarios-analyzer/',
        icon: <Icon name="file"/>
    }
];

class T07 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isLoading: false,
            selectedModels: [],

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
        const {id} = this.props.match.params;
        return this.setState({isLoading: true},
            () => this.fetchScenarioAnalysis(id)
        )
    };

    componentWillReceiveProps(nextProps, nextContext) {
        const {id} = nextProps.match.params;
        if (!this.props.scenarioAnalysis || this.props.scenarioAnalysis.id !== id) {
            if (!this.state.isLoading) {
                return this.setState({isLoading: true},
                    () => this.fetchScenarioAnalysis(id)
                )
            }
        }

        this.setState({
            model: nextProps.model
        })
    }

    fetchScenarioAnalysis(id) {
        if (this.props.scenarioAnalysis && this.props.scenarioAnalysis.id !== id) {
            this.props.clear();
        }

        fetchUrl(
            `scenarioanalyses/${id}`,
            data => {
                const scenarioAnalysis = ScenarioAnalysis.fromQuery(data);
                this.props.updateScenarioAnalysis(scenarioAnalysis);
                this.setState({isLoading: false}, () => {
                    this.setState({selectedModels: [scenarioAnalysis.baseModel.id]});
                    this.fetchModel(scenarioAnalysis.baseModel.id);
                    scenarioAnalysis.scenarios.forEach(sc => this.fetchModel(sc.id));
                });
            },
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );
    };

    fetchModel(id) {
        fetchUrl(
            `modflowmodels/${id}`,
            data => {
                this.fetchBoundaries(id);
                if (id === this.props.scenarioAnalysis.baseModel.id) {
                    return this.props.updateBaseModel(ModflowModel.fromQuery(data));
                }

                return this.props.updateScenario(ModflowModel.fromQuery(data));

            },
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );
    };

    fetchBoundaries(id) {
        fetchUrl(`modflowmodels/${id}/boundaries`,
            data => {
                const boundaries = BoundaryCollection.fromQuery(data);
                if (id === this.props.scenarioAnalysis.baseModel.id) {
                    return this.props.updateBaseModelBoundaries(boundaries);
                }

                return this.props.updateScenarioBoundaries(boundaries, id);
            },
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );
    };

    fetchResults(id) {
        fetchUrl(`modflowmodels/${id}/results`,
            results => {
                const calculationId = results.calculation_id;
                const totalTimes = results.times.total_times;
                const layerValues = results.layer_values;
                this.setState({calculationId, layerValues, totalTimes, isLoading: false});
                this.onChangeTypeLayerOrTime({
                    type: this.state.selectedType,
                    totim: last(totalTimes),
                    layer: this.state.selectedLay
                });
            },
            (e) => this.setState({isError: e, isLoading: false}))
    }

    handleError = error => {
        console.error(error);
        const {response} = error;
        const {status} = response;
        if (status === 422) {
            this.props.history.push('/tools');
        }
    };

    onChangeMetaData = (metaData) => {
        const scenarioAnalysis = this.props.scenarioAnalysis;
        scenarioAnalysis.name = metaData.name;
        scenarioAnalysis.description = metaData.description;
        scenarioAnalysis.public = metaData.public;
        scenarioAnalysis.isDirty = true;
        this.props.updateScenarioAnalysis(scenarioAnalysis);
    };

    saveMetaData = () => {
        return sendCommand(
            //ModflowModelCommand.updateModflowModel(this.props.model.toPayload()),
            (e) => this.setState({error: e})
        );
    };

    handleScenarioClick = (id) => {
        const {selectedModels} = this.state;
        if (selectedModels.indexOf(id) >= 0) {
            return this.setState({selectedModels: selectedModels.filter(v => v !== id)})
        }

        selectedModels.push(id);
        return this.setState({
            selectedModels: selectedModels
        })
    };

    renderScenarioListItem = ({id, name, description, canBeDeleted = true}) => (
        <Grid.Column key={id}>
            <Segment
                style={{cursor: 'pointer'}}
                color={'blue'}
                inverted={this.state.selectedModels.indexOf(id) >= 0}
                onClick={() => this.handleScenarioClick(id)}
            >
                <Header as={'h2'}>{name}</Header>
                <p>{description}</p>

                <Button as={'div'} labelPosition={'left'} fluid>
                    <Button icon
                            onClick={() => this.setState({showObservationPointEditor: true})}>
                        <Icon name='edit'/>
                    </Button>
                    <Button icon onClick={this.handleCloneClick}><Icon name='clone'/></Button>
                    {canBeDeleted && <Button
                        icon
                        onClick={this.handleRemoveClick}
                    ><Icon name='trash'/></Button>
                    }
                </Button>
            </Segment>
        </Grid.Column>
    );

    renderScenarioList = () => {
        const {scenarioAnalysis} = this.props;
        const {baseModel, scenarios} = scenarioAnalysis;

        const elements = [];
        elements.push(this.renderScenarioListItem({
            id: baseModel.id,
            name: baseModel.name,
            description: baseModel.description,
            canBeDeleted: false
        }));

        scenarios.forEach(sc => {
            elements.push(this.renderScenarioListItem({
                id: sc.id,
                name: sc.name,
                description: sc.description
            }))
        });

        return (
            <Grid>
                <Grid.Row columns={4}>
                    {elements}
                </Grid.Row>
            </Grid>
        )
    };

    render() {
        if (!this.props.scenarioAnalysis) {
            return (
                <AppContainer navbarItems={navigation}>
                    <Message icon>
                        <Icon name='circle notched' loading/>
                    </Message>
                </AppContainer>
            )
        }

        const {id, property, type} = this.props.match.params;
        return (
            <AppContainer navbarItems={navigation}>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column>
                            <ToolMetaData
                                isDirty={false}
                                onChange={this.onChangeMetaData}
                                readOnly={false}
                                tool={{
                                    type: 'T07',
                                    name: this.props.scenarioAnalysis.name,
                                    description: this.props.scenarioAnalysis.description,
                                    public: this.props.scenarioAnalysis.public
                                }}
                                saveButton={false}
                                onSave={this.saveMetaData}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment>
                                <Header as={'h2'}>Select Scenarios to compare</Header>
                                {this.renderScenarioList()}
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </AppContainer>
        )
    }
}

const mapStateToProps = state => ({
    scenarioAnalysis: state.T07.scenarioAnalysis && ScenarioAnalysis.fromObject(state.T07.scenarioAnalysis)
});

const mapDispatchToProps = {
    clear,
    updateScenarioAnalysis,
    updateScenario,
    updateScenarioBoundaries,
    updateBaseModel,
    updateBaseModelBoundaries
};


T07.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    scenarioAnalysis: PropTypes.instanceOf(ScenarioAnalysis).isRequired,

    clear: PropTypes.func.isRequired,
    updateScenarioAnalysis: PropTypes.func.isRequired,
    updateBaseModel: PropTypes.func.isRequired,
    updateBaseModelBoundaries: PropTypes.func.isRequired,
    updateScenario: PropTypes.func.isRequired,
    updateScenarioBoundaries: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(T07));
