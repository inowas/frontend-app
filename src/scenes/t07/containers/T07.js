import React from 'react';
import {connect} from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

import AppContainer from '../../shared/AppContainer';
import {Grid, Header, Icon, Message, Segment} from 'semantic-ui-react';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import {fetchUrl, sendCommand} from 'services/api';

import * as Content from '../components';

import {
    clear, updateModel, updateBoundaries, updateScenarioAnalysis
} from '../actions/actions';

import {ScenarioAnalysis} from 'core/model/scenarioAnalysis';
import {BoundaryCollection, CalculationResults, ModflowModel, Soilmodel} from 'core/model/modflow';
import ToolNavigation from '../../shared/complexTools/toolNavigation';
import {cloneDeep} from 'lodash';

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
    // {
    //     name: 'Time Series',
    //     property: 'timeseries',
    //     icon: <Icon name="map marker alternate"/>
    // }
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
                this.setState({
                    isLoading: false,
                    selected: [scenarioAnalysis.baseModel.id]
                }, () => {

                    // Fetch soilmodel, stressperiods and results from basemodel
                    this.fetchResults(scenarioAnalysis.baseModel.id);
                    this.fetchSoilmodel(scenarioAnalysis.baseModel.id);
                    this.fetchStressPeriods(scenarioAnalysis.baseModel.id);

                    // Fetch Boundaries from all models
                    const modelIds = [scenarioAnalysis.baseModel.id].concat(scenarioAnalysis.scenarios.map(sc => sc.id));
                    modelIds.forEach(id => {
                        this.fetchModel(id);
                        this.fetchBoundaries(id);
                    });
                    this.setState({isLoading: false})
                });
            },
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );
    };

    fetchResults(id) {
        fetchUrl(`modflowmodels/${id}/results`,
            data => {
                const {scenarioAnalysis} = this.props;
                scenarioAnalysis.results = CalculationResults.fromQuery(data);
                this.props.updateScenarioAnalysis(scenarioAnalysis);
            },
            (e) => this.setState({isError: e, isLoading: false})
        );
    }

    fetchSoilmodel(id) {
        fetchUrl(`modflowmodels/${id}/soilmodel`,
            data => {
                const {scenarioAnalysis} = this.props;
                scenarioAnalysis.soilmodel = Soilmodel.fromObject(data);
                this.props.updateScenarioAnalysis(scenarioAnalysis);
            },
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );
    };

    fetchStressPeriods(id) {
        fetchUrl(
            `modflowmodels/${id}`,
            data => {
                this.setState({isLoading: false});
                const model = ModflowModel.fromQuery(data);
                const {scenarioAnalysis} = this.props;
                scenarioAnalysis.stressperiods = model.stressperiods;
                this.props.updateScenarioAnalysis(scenarioAnalysis);
            },
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );
    };

    fetchBoundaries(id) {
        fetchUrl(`modflowmodels/${id}/boundaries`,
            data => this.props.updateBoundaries(BoundaryCollection.fromQuery(data), id),
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );
    };

    fetchModel(id) {
        fetchUrl(`modflowmodels/${id}`,
            data => this.props.updateModel(ModflowModel.fromQuery(data)),
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );
    };

    handleError = error => {
        console.error(error);
        const {response} = error;
        const {status} = response;
        if (status === 422) {
            this.props.history.push('/tools');
        }
    };

    renderContent(id, property) {
        switch (property) {
            case 'crosssection':
                return (<Content.CrossSection selected={this.state.selected}/>);
            case 'difference':
                return (<Content.Difference/>);
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
            selected: cloneDeep(selected)
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
                        Loading ScenarioAnalysis
                    </Message>
                </AppContainer>
            )
        }

        const {results, soilmodel, stressperiods} = scenarioAnalysis;
        if (!results || !soilmodel || !stressperiods) {
            return (
                <AppContainer navbarItems={navigation}>
                    <Message icon>
                        <Icon name='circle notched' loading/>
                        Loading BaseModel
                    </Message>
                </AppContainer>
            )
        }

        const {id, property} = this.props.match.params;
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
                            {this.renderContent(id, property)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </AppContainer>
        )
    }
}

const mapStateToProps = state => {
    return {
        scenarioAnalysis: state.T07.scenarioAnalysis ? ScenarioAnalysis.fromObject(state.T07.scenarioAnalysis) : null
    }
};

const mapDispatchToProps = {clear, updateModel, updateBoundaries, updateScenarioAnalysis};

T07.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    scenarioAnalysis: PropTypes.instanceOf(ScenarioAnalysis).isRequired,

    clear: PropTypes.func.isRequired,
    updateModel: PropTypes.func.isRequired,
    updateBoundaries: PropTypes.func.isRequired,
    updateSoilmodel: PropTypes.func.isRequired,
    updateCalculation: PropTypes.func.isRequired,
    updateResults: PropTypes.func.isRequired,
    updateScenarioAnalysis: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(T07));
