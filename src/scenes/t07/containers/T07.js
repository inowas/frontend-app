import React from 'react';
import {connect} from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

import AppContainer from '../../shared/AppContainer';
import {Grid, Header, Icon, Message, Segment} from 'semantic-ui-react';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import {fetchUrl, sendCommand} from 'services/api';

import {
    clear,
    updateBaseModel,
    updateBaseModelBoundaries,
    updateScenario,
    updateScenarioBoundaries,
    updateScenarioAnalysis, updateResults
} from '../actions/actions';

import {ScenarioAnalysis} from 'core/model/scenarioAnalysis';
import {BoundaryCollection, CalculationResults, ModflowModel} from 'core/model/modflow';
import ToolNavigation from '../../shared/complexTools/toolNavigation';

const navigation = [
    {
        name: 'Documentation',
        path: 'https://inowas.com/tools/t07-application-specific-scenarios-analyzer/',
        icon: <Icon name="file"/>
    }
];

const menuItems = [
    {
        name: 'Cross Section',
        property: 'crosssection',
        icon: <Icon name="calendar alternate outline"/>
    },
    {
        name: 'Head Difference',
        property: 'difference',
        icon: <Icon name="expand"/>
    },
    {
        name: 'Time Series',
        property: 'timeseries',
        icon: <Icon name="map marker alternate"/>
    }
];

class T07 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isLoading: false,
            selected: []
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
                    this.setState({selected: [scenarioAnalysis.baseModel.id]});
                    this.fetchModel(scenarioAnalysis.baseModel.id);
                    this.fetchResults(scenarioAnalysis.baseModel.id);
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
        this.setState({isLoading: true},
            () => fetchUrl(`modflowmodels/${id}/results`,
                data => this.props.updateResults(CalculationResults.fromQuery(data)),
                (e) => this.setState({isError: e, isLoading: false}))
        );
    }

    handleError = error => {
        console.error(error);
        const {response} = error;
        const {status} = response;
        if (status === 422) {
            this.props.history.push('/tools');
        }
    };

    renderContent(id, property, type) {
        switch (property) {
            case 'crosssection':
                return ('CROSSSECTION');
            case 'difference':
                return ('DIFFERENCE');
            case 'timeseries':
                return ('TIMESERIES');
            default:
                const basePath = this.props.match.path.split(':')[0];
                return (
                    <Redirect to={basePath + id + '/crosssection'}/>
                );
        }
    }

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
        const {selected} = this.state;
        if (selected.indexOf(id) >= 0) {
            return this.setState({selected: selected.filter(v => v !== id)})
        }

        selected.push(id);
        return this.setState({
            selected: selected
        })
    };

    renderModelListItem = ({id, name, description, canBeDeleted = true}) => (
        <Grid.Column key={id}>
            <Segment
                style={{cursor: 'pointer'}}
                color={'blue'}
                inverted={this.state.selected.indexOf(id) >= 0}
                onClick={() => this.handleScenarioClick(id)}
            >
                <Header as={'a'}>{name}</Header>
            </Segment>
        </Grid.Column>
    );

    renderModelList = () => {
        const {scenarioAnalysis} = this.props;
        const {baseModel, scenarios} = scenarioAnalysis;

        const elements = [];
        elements.push(this.renderModelListItem({
            id: baseModel.id,
            name: baseModel.name,
            description: baseModel.description,
            canBeDeleted: false
        }));

        scenarios.forEach(sc => {
            elements.push(this.renderModelListItem({
                id: sc.id,
                name: sc.name,
                description: sc.description
            }))
        });

        return (elements);
    };

    render() {
        const {scenarioAnalysis} = this.props;
        if (!scenarioAnalysis) {
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
                        <Grid.Column width={3}/>
                        <Grid.Column width={13}>
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
                        <Grid.Column width={3}>
                            <ToolNavigation navigationItems={menuItems}/>
                            {this.renderModelList()}
                        </Grid.Column>
                        <Grid.Column width={13}>
                            {this.renderContent(id, property, type)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </AppContainer>
        )
    }
}

const mapStateToProps = state => {
    return {
        results: state.T07.results ? CalculationResults.fromObject(state.T07.results) : null,
        scenarioAnalysis: state.T07.scenarioAnalysis ? ScenarioAnalysis.fromObject(state.T07.scenarioAnalysis) : null
    }
};

const mapDispatchToProps = {
    clear,
    updateBaseModel,
    updateBaseModelBoundaries,
    updateResults,
    updateScenarioAnalysis,
    updateScenario,
    updateScenarioBoundaries
};


T07.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    scenarioAnalysis: PropTypes.instanceOf(ScenarioAnalysis).isRequired,

    clear: PropTypes.func.isRequired,
    updateBaseModel: PropTypes.func.isRequired,
    updateBaseModelBoundaries: PropTypes.func.isRequired,
    updateResults: PropTypes.func.isRequired,
    updateScenario: PropTypes.func.isRequired,
    updateScenarioAnalysis: PropTypes.func.isRequired,
    updateScenarioBoundaries: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(T07));
