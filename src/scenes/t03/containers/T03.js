import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import PropTypes from 'prop-types';

import AppContainer from '../../shared/AppContainer';
import {Grid, Icon, Message} from 'semantic-ui-react';
import ToolNavigation from '../../shared/complexTools/toolNavigation';
import menuItems from '../defaults/menuItems';
import * as Content from '../components/content/index';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import {fetchUrl} from 'services/api';
import ModflowModel from 'core/model/modflow/ModflowModel';
import {updateBoundaries, updateModel, updateSoilmodel} from '../actions/actions';
import {BoundaryCollection} from 'core/model/modflow/boundaries';
import {Soilmodel} from '../../../core/model/modflow/soilmodel';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t02-groundwater-mounding-hantush/',
    icon: <Icon name="file"/>
}];

class T03 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            model: props.model,
            isLoading: true,
            error: false
        }
    }

    componentDidMount() {
        const {id} = this.props.match.params;
        if (!id) {
            return this.setState({isLoading: false})
        }

        this.fetchModel(id);
    };

    fetchModel(id) {
        fetchUrl(
            `modflowmodels/${id}`,
            data => {
                this.props.updateModel(ModflowModel.fromQuery(data));
                this.setState({isLoading: false});
            },
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );

        fetchUrl(`modflowmodels/${id}/boundaries`,
            data => this.props.updateBoundaries(BoundaryCollection.fromQuery(data)),
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );

        fetchUrl(`modflowmodels/${id}/soilmodel`,
            data => this.props.updateSoilmodel(Soilmodel.fromObject(data)),
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        );
    };

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            model: nextProps.model
        })
    }

    handleError = error => {
        console.log(error);
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

        const model = ModflowModel.fromObject(this.state.model);
        return (<ToolMetaData
            isDirty={false}
            onChange={this.onChangeMetaData}
            readOnly={false}
            tool={{
                type: 'T03',
                name: model.name,
                description: model.description,
                public: model.public
            }}
            save={false}
            onSave={this.saveMetaData}
        />)

    };

    renderContent(id, property) {
        if (!this.props.model) {
            return null;
        }

        switch (property) {
            case 'discretization':
                return (<Content.Discretization/>);
            case 'soilmodel':
                return (<Content.Soilmodel/>);
            case 'boundaries':
                return (<Content.Boundaries/>);
            case 'observations':
                return (<Content.Observations/>);
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
                    this.props.history.push(
                        basePath + id + '/discretization'
                    )
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
        if (!this.props.match.params.id) {
            return (
                <AppContainer navbarItems={navigation}>
                    <Content.CreateModel/>
                </AppContainer>
            );
        }

        if (this.state.isLoading) {
            return (
                <Message>LOADING</Message>
            )
        }

        const {id, property} = this.props.match.params;
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
                            {this.renderContent(id, property)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </AppContainer>
        )
    }
}

const mapStateToProps = state => ({
    model: state.T03.model,
    boundaries: state.T03.boundaries
});

const mapDispatchToProps = {
    updateBoundaries, updateModel, updateSoilmodel
};


T03.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    boundaries: PropTypes.array.isRequired,
    model: PropTypes.object.isRequired,
    updateModel: PropTypes.func.isRequired,
    updateBoundaries: PropTypes.func.isRequired,
    updateSoilmodel: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(T03));
