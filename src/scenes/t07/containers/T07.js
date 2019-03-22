import React from 'react';
import Uuid from 'uuid';
import {connect} from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

import AppContainer from '../../shared/AppContainer';
import {Button, Grid, Header, Icon, Message, Popup, Segment} from 'semantic-ui-react';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import {fetchCalculationDetails, fetchUrl, sendCommand} from 'services/api';

import * as Content from '../components';

import {
    clear, updateModel, updateBoundaries, updateScenarioAnalysis
} from '../actions/actions';

import {ScenarioAnalysis} from 'core/model/scenarioAnalysis';
import {BoundaryCollection, Calculation, ModflowModel, Soilmodel} from 'core/model/modflow';
import ToolNavigation from '../../shared/complexTools/toolNavigation';
import {cloneDeep} from 'lodash';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';
import ScenarioAnalysisCommand from '../commands/scenarioAnalysisCommand';

const styles = {
    modelitem: {
        cursor: 'pointer'
    }
};

const navigation = [
    {
        name: 'Documentation',
        path: 'https://inowas.com/tools/t07-application-specific-scenarios-analyzer/',
        icon: <Icon name="file"/>
    }
];

const menuItems = [{
    header: 'Results',
    items: [
        {
            name: 'Cross Section',
            property: 'crosssection',
            icon: <Icon name="calendar alternate outline"/>
        },
        {
            name: 'Difference',
            property: 'difference',
            icon: <Icon name="expand"/>,
            disabled: true
        },
        {
            name: 'Time Series',
            property: 'timeseries',
            icon: <Icon name="map marker alternate"/>,
            disabled: true
        }
    ]
}];

class T07 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scenarioAnalysis: null,
            models: [],
            boundaries: [],
            calculations: [],
            soilmodels: [],
            selected: [],
            error: false,
            isLoading: false
        }
    }

    componentDidMount() {
        const {id} = this.props.match.params;
        return this.setState({isLoading: true},
            () => this.fetchScenarioAnalysis(id)
        )
    };


    fetchScenarioAnalysis(id) {
        if (this.props.scenarioAnalysis && this.props.scenarioAnalysis.id !== id) {
            this.props.clear();
        }

        fetchUrl(
            `tools/T07/${id}`,
            data => {
                const scenarioAnalysis = ScenarioAnalysis.fromQuery(data);
                this.setState({
                    isLoading: true,
                    scenarioAnalysis: scenarioAnalysis.toObject(),
                    selected: [scenarioAnalysis.basemodelId]
                }, () => {
                    this.fetchModel(scenarioAnalysis.basemodelId);
                    scenarioAnalysis.scenarioIds.forEach(id => this.fetchModel(id));
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
                const modflow = ModflowModel.fromQuery(data);
                this.setState({
                    models: {
                        ...this.state.models, [id]: modflow.toObject()
                    }
                }, () => {
                    this.fetchBoundaries(id);
                    this.fetchSoilmodel(id);
                    if (modflow.calculationId) {
                        this.fetchCalculationDetails(id, modflow.calculationId);
                    }
                });
            },
            error => console.log(error)
        );
    };

    fetchBoundaries(id) {
        fetchUrl(`modflowmodels/${id}/boundaries`,
            data => {
                const boundaries = BoundaryCollection.fromQuery(data);
                this.setState({
                    boundaries: {
                        isLoading: true,
                        ...this.state.boundaries, [id]: boundaries.toObject()
                    }
                });
            },
            error => console.log(error)
        );
    };

    fetchSoilmodel(id) {
        fetchUrl(`modflowmodels/${id}/soilmodel`,
            data => {
                const soilmodel = Soilmodel.fromObject(data);
                this.setState({
                    soilmodels: {
                        ...this.state.soilmodels, [id]: soilmodel.toObject()
                    }
                });
            },
            error => console.log(error)
        );
    };

    fetchCalculationDetails(id, calculationId) {
        fetchCalculationDetails(calculationId,
            data => {
                const calculation = Calculation.fromQuery(data);
                this.setState({
                    calculations: {
                        ...this.state.calculations, [id]: calculation.toObject()
                    }
                });
            },
            error => console.log(error)
        )
    }

    handleError = error => {
        console.error(error);
        const {response} = error;
        const {status} = response;
        if (status === 422) {
            this.props.history.push('/tools');
        }
    };

    renderContent(id, property) {
        const scenarioAnalysis = ScenarioAnalysis.fromObject(this.state.scenarioAnalysis);
        const {models, boundaries, calculations, soilmodels} = this.state;

        let basemodel = null;
        if (models.hasOwnProperty(scenarioAnalysis.basemodelId)) {
            basemodel = ModflowModel.fromObject(models[scenarioAnalysis.basemodelId])
        }

        if (!basemodel) {
            return;
        }

        let basemodelCalculation = null;
        if (calculations.hasOwnProperty(scenarioAnalysis.basemodelId)) {
            basemodelCalculation = Calculation.fromObject(calculations[scenarioAnalysis.basemodelId])
        }

        if (!basemodelCalculation) {
            return;
        }

        let basemodelSoilmodel = null;
        if (soilmodels.hasOwnProperty(scenarioAnalysis.basemodelId)) {
            basemodelSoilmodel = Soilmodel.fromObject(soilmodels[scenarioAnalysis.basemodelId])
        }

        if (!basemodelSoilmodel) {
            return;
        }

        switch (property) {
            case 'crosssection':
                return (
                    <Content.CrossSection
                        boundaries={boundaries}
                        calculations={calculations}
                        models={models}
                        scenarioAnalysis={scenarioAnalysis}
                        basemodel={basemodel}
                        basemodelCalculation={basemodelCalculation}
                        basemodelSoilmodel={basemodelSoilmodel}
                        selected={this.state.selected}
                    />);
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
        const scenarioAnalysis = ScenarioAnalysis.fromObject(this.state.scenarioAnalysis);
        scenarioAnalysis.name = metaData.name;
        scenarioAnalysis.description = metaData.description;
        scenarioAnalysis.public = metaData.public;
        this.setState({scenarioAnalysis: scenarioAnalysis.toObject()});
    };

    saveMetaData = () => {
        const scenarioAnalysis = ScenarioAnalysis.fromObject(this.state.scenarioAnalysis);
        this.setState({isLoading: true},
            () => sendCommand(SimpleToolsCommand.updateToolInstanceMetadata(
                scenarioAnalysis.id,
                scenarioAnalysis.name,
                scenarioAnalysis.description,
                scenarioAnalysis.public
                ),
                () => this.setState({isLoading: false}),
                (e) => this.setState({isLoading: false, error: e})
            ))
    };

    handleScenarioClick = (id) => {
        const selected = cloneDeep(this.state.selected);

        if (selected.indexOf(id) >= 0) {
            return this.setState({selected: selected.filter(v => v !== id)})
        }

        selected.push(id);
        return this.setState({
            selected
        })
    };

    renderModelListItem = ({id, name, description, canBeDeleted = true}) => {
        return (
            <Grid.Column key={id}>
                <Segment
                    className='modelitem'
                    style={styles.modelitem}
                    color={'blue'}
                    inverted={this.state.selected.indexOf(id) >= 0}
                >
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={14} onClick={() => this.handleScenarioClick(id)}>
                                <Header as={'a'} size='tiny'>{name}</Header>
                            </Grid.Column>
                            <Grid.Column width={2} style={{padding: '0'}}>
                                <Popup
                                    trigger={<Icon name='ellipsis vertical'/>}
                                    content={
                                        <Button.Group size='small'>
                                            <Popup
                                                trigger={<Button icon={'edit'} onClick={() => this.editScenario(id)}/>}
                                                content='Edit'
                                                position='top center'
                                                size='mini'
                                                inverted
                                            />
                                            <Popup
                                                trigger={<Button icon={'clone'}
                                                                 onClick={() => this.cloneScenario(id)}/>}
                                                content='Clone'
                                                position='top center'
                                                size='mini'
                                                inverted
                                            />
                                            {canBeDeleted &&
                                            <Popup
                                                trigger={<Button icon={'trash'}
                                                                 onClick={() => this.deleteScenario(id)}/>}
                                                content='Delete'
                                                position='top center'
                                                size='mini'
                                                inverted
                                            />
                                            }
                                        </Button.Group>
                                    }
                                    on={'click'}
                                    position={'right center'}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Grid.Column>
        );
    };

    cloneScenario = (id) => {
        const scenarioAnalysis = ScenarioAnalysis.fromObject(this.state.scenarioAnalysis);
        const newId = Uuid.v4();
        sendCommand(ScenarioAnalysisCommand.createScenario(scenarioAnalysis.id, id, newId), () => this.fetchScenarioAnalysis(scenarioAnalysis.id))
    };

    deleteScenario = (id) => {
        const scenarioAnalysis = ScenarioAnalysis.fromObject(this.state.scenarioAnalysis);
        sendCommand(ScenarioAnalysisCommand.deleteScenario(scenarioAnalysis.id, id), () => this.fetchScenarioAnalysis(scenarioAnalysis.id))
    };

    editScenario = (id) => {
        const scenarioAnalysis = ScenarioAnalysis.fromObject(this.state.scenarioAnalysis);
        return this.props.history.push(`/tools/T03/${id}?sid=${scenarioAnalysis.id}`)
    };

    renderModelList = () => {

        const scenarioAnalysis = ScenarioAnalysis.fromObject(this.state.scenarioAnalysis);

        return scenarioAnalysis.getModelIds().map((id, idx) => {
            if (this.state.models.hasOwnProperty(id)) {
                const model = ModflowModel.fromObject(this.state.models[id]);
                return this.renderModelListItem({
                    id: model.id,
                    name: model.name,
                    description: model.description,
                    canBeDeleted: idx !== 0
                })
            }

            return null;
        });
    };

    render() {
        if (!this.state.scenarioAnalysis) {
            return null;
        }

        const scenarioAnalysis = ScenarioAnalysis.fromObject(this.state.scenarioAnalysis);

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

        const {id, property} = this.props.match.params;
        return (
            <AppContainer navbarItems={navigation}>
                <ToolMetaData
                    isDirty={false}
                    onChange={this.onChangeMetaData}
                    readOnly={false}
                    tool={{
                        tool: 'T07',
                        name: scenarioAnalysis.name,
                        description: scenarioAnalysis.description,
                        public: scenarioAnalysis.public
                    }}
                    defaultButton={false}
                    saveButton={false}
                    onSave={this.saveMetaData}
                />
                <Grid padded>
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
