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
                model: ModflowModel.fromDefaults().toObject(),
                isLoading: false
            })
        }

        fetchUrl(
            `modflowmodels/${id}`,
            query => this.setState({
                model: ModflowModel.fromQuery(query).toObject(),
                isLoading: false
            }),
            error => this.setState({error, isLoading: false})
        )
    }


    static renderContent(id, property, model) {

        if (!id) {
            return (<Content.CreateModel/>)
        }

        if (!model instanceof ModflowModel) {
            return null;
        }

        switch (property) {
            case 'discretization':
                return (<Content.Discretization/>);
            case 'soilmodel':
                return (<Content.Soilmodel/>);
            case 'boundaries':
                return (<Content.Boundaries model={model}/>);
            case 'observations':
                return (<Content.Observations/>);
            case 'run':
                return (<Content.Run/>);
            case 'results':
                return (<Content.Results/>);
            case 'optimization':
                return (<Content.Optimization/>);
            default:
                return null;
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

    render() {
        if (this.state.isLoading) {
            return (
                <Message>LOADING</Message>
            )
        }

        const model = ModflowModel.fromObject(this.state.model);
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
                                    tool: 'T03',
                                    name: model.name,
                                    description: model.description,
                                    public: model.public
                                }}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <ToolNavigation navigationItems={menuItems}/>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            {T03.renderContent(id, property, model)}
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
