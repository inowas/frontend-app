import React from 'react';
import {connect} from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';

import PropTypes from 'prop-types';

import AppContainer from '../../shared/AppContainer';
import {Grid, Icon, Message} from 'semantic-ui-react';
import ToolNavigation from '../../shared/complexTools/toolNavigation';
import menuItems from '../defaults/menuItems';
import * as Content from '../components/content/index';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import {fetchUrl, sendCommand} from 'services/api';

import {
    clear,
    updateCalculation,
    updateBoundaries,
    updateModel,
    updateOptimization,
    updateSoilmodel
} from '../actions/actions';

import {
    BoundaryCollection,
    BoundaryFactory,
    Calculation,
    ModflowModel,
    Soilmodel,
} from 'core/model/modflow';
import ModflowModelCommand from '../commands/modflowModelCommand';
import CalculationProgressBar from '../components/content/run/calculationProgressBar';
import OptimizationProgressBar from '../components/content/optimization/optimizationProgressBar';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t03-modflow-model-setup-and-editor/',
    icon: <Icon name="file"/>
}];

class T03 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            isLoading: false
        }
    }

    componentDidMount() {
        const {id} = this.props.match.params;

        return this.setState({isLoading: true},
            () => this.fetchModel(id)
        )
    };

    componentWillReceiveProps(nextProps, nextContext) {
        const {id} = nextProps.match.params;
        if (!this.props.model || this.props.model.id !== id) {
            if (!this.state.isLoading) {
                return this.setState({isLoading: true},
                    () => this.fetchModel(id)
                )
            }
        }

        this.setState({
            model: nextProps.model
        })
    }

    fetchModel(id) {
        if (this.props.model && this.props.model.id !== id) {
            this.props.clear();
        }
        fetchUrl(
            `modflowmodels/${id}`,
            data => {
                this.props.updateModel(ModflowModel.fromQuery(data));
                this.setState({isLoading: false}, () => {
                    this.fetchBoundaries(id);
                    this.fetchCalculation(id);
                    this.fetchSoilmodel(id);
                });
            },
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );
    };

    fetchBoundaries(id) {
        fetchUrl(`modflowmodels/${id}/boundaries`,
            data => this.props.updateBoundaries(BoundaryCollection.fromQuery(data)),
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );
    };

    fetchCalculation(id) {
        fetchUrl(`modflowmodels/${id}/calculation`,
            data => this.props.updateCalculation(Calculation.fromQuery(data)),
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );
    };

    fetchSoilmodel(id) {
        fetchUrl(`modflowmodels/${id}/soilmodel`,
            data => this.props.updateSoilmodel(Soilmodel.fromObject(data)),
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );
    };

    handleError = error => {
        console.log(error);
        const {response} = error;
        const {status} = response;
        if (status === 422) {
            this.props.history.push('/tools');
        }
    };

    renderContent(id, property, type) {
        switch (property) {
            case 'discretization':
                return (<Content.Discretization/>);
            case 'soilmodel':
                return (<Content.SoilmodelEditor/>);
            case 'boundaries':
                if (BoundaryFactory.availableTypes.indexOf(type) > -1) {
                    return (<Content.CreateBoundary/>);
                }
                return (<Content.Boundaries/>);
            case 'observations':
                return (<Content.Observations/>);
            case 'transport':
                return (<Content.Transport/>);
            case 'run':
                return (<Content.Run/>);
            case 'results':
                return (<Content.Results/>);
            case 'optimization':
                return (<Content.Optimization/>);
            default:
                const path = this.props.match.path;
                const basePath = path.split(':')[0];
                return (
                    <Redirect to={basePath + id + '/discretization'}/>
                );
        }
    }

    onChangeMetaData = (metaData) => {
        const model = this.props.model;
        model.name = metaData.name;
        model.description = metaData.description;
        model.public = metaData.public;
        model.isDirty = true;
        this.props.updateModel(model);
    };

    saveMetaData = () => {
        return sendCommand(
            ModflowModelCommand.updateModflowModel(this.props.model.toPayload()),
            (e) => this.setState({error: e})
        );
    };

    render() {
        if (!this.props.model) {
            return (
                <AppContainer navbarItems={navigation}>
                    <Message icon>
                        <Icon name='circle notched' loading />
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
                                    type: 'T03',
                                    name: this.props.model.name,
                                    description: this.props.model.description,
                                    public: this.props.model.public
                                }}
                                saveButton={false}
                                onSave={this.saveMetaData}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <ToolNavigation navigationItems={menuItems}/>
                            <CalculationProgressBar/>
                            <OptimizationProgressBar/>
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

const mapStateToProps = state => ({
    model: state.T03.model && ModflowModel.fromObject(state.T03.model),
    boundaries: state.T03.boundaries
});

const mapDispatchToProps = {
    clear, updateBoundaries, updateCalculation, updateModel, updateOptimization, updateSoilmodel
};


T03.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    boundaries: PropTypes.array.isRequired,
    model: PropTypes.object.isRequired,
    clear: PropTypes.func.isRequired,
    updateModel: PropTypes.func.isRequired,
    updateCalculation: PropTypes.func.isRequired,
    updateBoundaries: PropTypes.func.isRequired,
    updateOptimization: PropTypes.func.isRequired,
    updateSoilmodel: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(T03));
