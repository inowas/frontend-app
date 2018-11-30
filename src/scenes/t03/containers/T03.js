import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import AppContainer from '../../shared/AppContainer';
import {Grid, Icon, Message} from 'semantic-ui-react';
import ToolNavigation from '../../shared/complexTools/toolNavigation';
import menuItems from '../defaults/menuItems';
import * as Content from '../components/content/index';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import {fetchUrl} from 'services/api';
import ModflowModel from 'core/model/modflow/ModflowModel';

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
            isLoading: true,
            error: false
        }
    }

    componentDidMount() {
        const {id} = this.props.match.params;
        if (!id) {
            return this.setState({
                model: null,
                isLoading: false
            })
        }

        fetchUrl(
            `modflowmodels/${id}`,
            query => this.setState({
                model: ModflowModel.fromQuery(query).toObject(),
                isLoading: false
            }),
            error => this.setState(
                {error, isLoading: false},
                () => this.handleError(error)
            )
        )
    }

    handleError = error => {
        const {response} = error;
        const {status} = response;

        if (status === 422) {
            this.props.history.push('/tools');
        }
    };

    renderToolMetaData = () => {
        if (!this.state.model) {
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
        if (!id) {
            return (<Content.CreateModel defaultModel={ModflowModel.fromDefaults()}/>)
        }

        if (!this.state.model) {
            return null;
        }

        const model = ModflowModel.fromObject(this.state.model);
        switch (property) {
            case 'discretization':
                return (<Content.Discretization model={model}/>);
            case 'soilmodel':
                return (<Content.Soilmodel model={model}/>);
            case 'boundaries':
                return (<Content.Boundaries model={model}/>);
            case 'observations':
                return (<Content.Observations model={model}/>);
            case 'run':
                return (<Content.Run model={model}/>);
            case 'results':
                return (<Content.Results model={model}/>);
            case 'optimization':
                return (<Content.Optimization model={model}/>);
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

T03.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(T03);
