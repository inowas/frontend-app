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
import {fetchUrl} from 'services/api';
import ModflowModel from 'core/model/modflow/ModflowModel';
import {clear, updateBoundaries, updateModel, updateSoilmodel} from '../actions/actions';
import {BoundaryCollection, BoundaryFactory} from 'core/model/modflow/boundaries';
import {Soilmodel} from 'core/model/modflow/soilmodel';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t02-groundwater-mounding-hantush/',
    icon: <Icon name="file"/>
}];

class T03 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            model: null,
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
        const {response} = error;
        const {status} = response;

        if (status === 422) {
            this.props.history.push('/tools');
        }
    };

    renderToolMetaData = () => {
        if (!this.props.model) {
            return null;
        }

        return (<ToolMetaData
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
        />)

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
        const model = ModflowModel.fromObject(this.state.model);
        model.name = metaData.name;
        model.description = metaData.description;
        model.public = metaData.public;
        model.isDirty = true;

        this.setState({
            model: model.toObject()
        })
    };

    saveMetaData = () => {
    };

    render() {
        if (!this.props.model) {
            return (
                <AppContainer navbarItems={navigation}>
                    <Message>LOADING</Message>
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
                            {this.renderToolMetaData()}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <ToolNavigation navigationItems={menuItems}/>
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
    clear, updateBoundaries, updateModel, updateOptimization, updateSoilmodel
};


T03.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    boundaries: PropTypes.array.isRequired,
    model: PropTypes.object.isRequired,
    clear: PropTypes.func.isRequired,
    updateModel: PropTypes.func.isRequired,
    updateBoundaries: PropTypes.func.isRequired,
    updateOptimization: PropTypes.func.isRequired,
    updateSoilmodel: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(T03));
