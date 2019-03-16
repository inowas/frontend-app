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
    updateBoundaries,
    updateCalculation,
    updateModel,
    updateOptimization,
    updatePackages,
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
import CalculationProgressBar from '../components/content/calculation/calculationProgressBar';
import OptimizationProgressBar from '../components/content/optimization/optimizationProgressBar';
import {CALCULATION_STATE_FINISHED} from '../components/content/calculation/CalculationStatus';
import FlopyPackages from 'core/model/flopy/packages/FlopyPackages';
import {FlopyModflow} from 'core/model/flopy/packages/mf';
import {Mt3dms} from 'core/model/flopy/packages/mt';
import {fetchCalculationDetails} from '../../../services/api';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t03-modflow-model-setup-and-editor/',
    icon: <Icon name="file"/>
}];

class T03 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menuItems: menuItems,
            error: false,
            isLoading: false,
            calculatePackages: false
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

        if (nextProps.calculation) {
            const calculationState = nextProps.calculation.state;
            this.setState({
                menuItems: menuItems.map(mi => {
                    if (mi.property === 'results' || mi.property === 'optimization') {
                        mi.disabled = calculationState !== CALCULATION_STATE_FINISHED;
                        return mi;
                    }

                    return mi;
                })
            })
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
                const modflowModel = ModflowModel.fromQuery(data);
                this.props.updateModel(modflowModel);
                this.setState({isLoading: false}, () => {
                    this.fetchBoundaries(id);
                    this.fetchPackages(id);
                    this.fetchSoilmodel(id);

                    if (modflowModel.calculationId) {
                        fetchCalculationDetails(modflowModel.calculationId,
                            data => this.props.updateCalculation(Calculation.fromQuery(data)),
                            error => console.log(error)
                        )
                    }
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

    fetchPackages(id) {
        fetchUrl(`modflowmodels/${id}/packages`,
            data => {
                if (Array.isArray(data) && data.length === 0) {
                    return this.setState({calculatePackages: true})
                }
                return this.props.updatePackages(FlopyPackages.fromQuery(data));
            },
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

    calculatePackages = () => {
        return new Promise((resolve, reject) => {
            this.setState({calculatePackages: 'calculation'});
            const mf = FlopyModflow.createFromModel(this.props.model, this.props.soilmodel, this.props.boundaries);
            const mt = Mt3dms.fromDefaults();
            const modelId = this.props.model.id;

            const flopyPackages = FlopyPackages.create(modelId, mf, mt);
            if (flopyPackages instanceof FlopyPackages) {
                this.setState({calculatePackages: false});
                resolve(flopyPackages);
            }

            this.setState({calculatePackages: 'error'});
            reject('Error creating instance of FlopyPackages.');
        })
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
            case 'flow':
                return (<Content.Flow/>);
            case 'transport':
                return (<Content.Transport/>);
            case 'calculation':
                return (<Content.Calculation/>);
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
        const {id, name, description, isPublic} = this.props.model;
        return sendCommand(
            ModflowModelCommand.updateModflowModelMetadata(id, name, description, isPublic),
            (e) => this.setState({error: e})
        );
    };

    render() {
        if (!(this.props.model instanceof ModflowModel) ||
            !(this.props.boundaries instanceof BoundaryCollection) ||
            !(this.props.soilmodel instanceof Soilmodel)
        ) {
            return (
                <AppContainer navbarItems={navigation}>
                    <Message icon>
                        <Icon name='circle notched' loading/>
                    </Message>
                </AppContainer>
            )
        }

        if (this.state.calculatePackages === true) {
            this.calculatePackages().then(packages => {
                this.props.updatePackages(packages);
                return sendCommand(
                    ModflowModelCommand.updateFlopyPackages(this.props.model.id, packages),
                    (e) => this.setState({error: e})
                );
            });
        }

        if (!(this.props.packages instanceof FlopyPackages)) {
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
                <ToolMetaData
                    isDirty={false}
                    onChange={this.onChangeMetaData}
                    readOnly={false}
                    tool={{
                        tool: 'T03',
                        name: this.props.model.name,
                        description: this.props.model.description,
                        public: this.props.model.public
                    }}
                    defaultButton={false}
                    saveButton={false}
                    onSave={this.saveMetaData}
                />
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <ToolNavigation navigationItems={this.state.menuItems}/>
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
    model: state.T03.model ? ModflowModel.fromObject(state.T03.model) : null,
    boundaries: state.T03.boundaries ? BoundaryCollection.fromObject(state.T03.boundaries) : null,
    calculation: state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null,
    packages: state.T03.packages ? FlopyPackages.fromObject(state.T03.packages) : null,
    soilmodel: state.T03.soilmodel ? Soilmodel.fromObject(state.T03.soilmodel) : null
});

const mapDispatchToProps = {
    clear, updateCalculation, updateBoundaries, updatePackages, updateModel, updateOptimization, updateSoilmodel
};


T03.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    calculation: PropTypes.instanceOf(Calculation).isRequired,
    packages: PropTypes.instanceOf(FlopyPackages).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
    clear: PropTypes.func.isRequired,
    updateModel: PropTypes.func.isRequired,
    updatePackages: PropTypes.func.isRequired,
    updateBoundaries: PropTypes.func.isRequired,
    updateOptimization: PropTypes.func.isRequired,
    updateSoilmodel: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(T03));
