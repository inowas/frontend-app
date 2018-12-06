import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';
import {includes} from 'lodash';

import {fetchTool, sendCommand} from 'services/api';
import Command from '../../shared/simpleTools/commands/command';
import {deepMerge} from '../../shared/simpleTools/helpers';

import {Grid, Icon, Segment} from 'semantic-ui-react';
import AppContainer from '../../shared/AppContainer';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import {CriteriaEditor, ToolNavigation} from '../components';
import ContentToolBar from '../components/shared/contentToolbar';
import Ranking from '../components/weightAssignment/ranking';
import MultiInfluence from '../components/weightAssignment/multiInfluence';

import {defaultsT05} from '../defaults';
import getMenuItems from '../defaults/menuItems';

import {MCDA} from 'core/mcda';
import {WeightsCollection} from 'core/mcda/criteria';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t05-mar-mcda/',
    icon: <Icon name="file"/>
}];

class T05 extends React.Component {
    constructor() {
        super();

        this.state = {
            editState: '',
            isDirty: true,
            isLoading: false,
            selectedTool: 'criteria',
            tool: defaultsT05()
        };
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.setState({isLoading: true});
            fetchTool(
                this.state.tool.type,
                this.props.match.params.id,
                tool => this.setState({
                    tool: deepMerge(this.state.tool, tool),
                    isDirty: false,
                    isLoading: false
                }),
                error => this.setState({error, isLoading: false})
            );
        } else {
            this.save()
        }
    }

    buildPayload = (tool) => ({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        public: tool.public,
        type: tool.type,
        data: {
            mcda: MCDA.fromObject(this.state.tool.data.mcda).toObject
        }
    });

    save = () => {
        const {id} = this.props.match.params;
        const {tool} = this.state;

        if (id) {
            sendCommand(
                Command.updateToolInstance(this.buildPayload(tool)),
                () => this.setState({
                    editState: 'saved',
                    isDirty: false
                }),
                () => this.setState({error: true})
            );
            return;
        }

        sendCommand(
            Command.createToolInstance(this.buildPayload(tool)),
            () => this.props.history.push(`${this.props.location.pathname}/${tool.id}`),
            () => this.setState({error: true})
        );
    };

    onChange = ({name, value}) => {
        const mcda = MCDA.fromObject(this.state.tool.data.mcda);

        if (name === 'criteria') {
            mcda.updateCriteria(value);
        }

        if (name === 'weights') {
            mcda.weights = WeightsCollection.fromObject(value);
        }

        return this.setState({
            editState: 'notSaved',
            tool: {
                ...this.state.tool,
                data: {
                    ...this.state.tool.data,
                    mcda: mcda.toObject
                }
            },
            isDirty: true
        });
    };

    update = (tool) => this.setState({
        tool: {
            ...tool
        }
    });

    render() {
        const mcda = MCDA.fromObject(this.state.tool.data.mcda);
        const {editState, tool, isDirty, isLoading} = this.state;

        if (isLoading) {
            return (
                <AppContainer navBarItems={navigation} loader/>
            );
        }

        const {permissions} = tool;
        const readOnly = !includes(permissions, 'w');

        const menuItems = getMenuItems(mcda);

        let component;

        switch (this.props.match.params.property) {
            case 'wa':
                switch (this.props.match.params.type) {
                    case 'mif':
                        component = <MultiInfluence readOnly={readOnly} mcda={mcda} handleChange={this.onChange}/>;
                        break;
                    default:
                        component = <Ranking readOnly={readOnly} mcda={mcda} handleChange={this.onChange}/>;
                        break;
                }
                break;
            default:
                component = <CriteriaEditor readOnly={readOnly} mcda={mcda} handleChange={this.onChange}/>;
                break;
        }

        return (
            <AppContainer navbarItems={navigation}>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column width={4}/>
                        <Grid.Column width={12}>
                            <ToolMetaData tool={tool} readOnly={readOnly} onChange={this.update} onSave={this.save}
                                          isDirty={isDirty}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <ToolNavigation navigationItems={menuItems}/>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Segment color='grey'>
                                <ContentToolBar state={editState} save onSave={this.save}/>
                                {component}
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </AppContainer>
        );
    }
}

T05.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(T05);