import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';
import {includes} from 'lodash';

import {fetchTool, sendCommand} from 'services/api';
import Command from '../../shared/simpleTools/commands/command';
import {deepMerge} from '../../shared/simpleTools/helpers';

import {Grid, Icon} from 'semantic-ui-react';
import AppContainer from '../../shared/AppContainer';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import {CriteriaEditor, ToolNavigation, WeightAssignment} from '../components';

import {defaultsT05} from '../defaults';
import getMenuItems from '../defaults/menuItems';

import {MCDA} from 'core/mcda';
import {WeightsCollection} from 'core/mcda/criteria';
import ContentToolBar from '../components/shared/contentToolbar';

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
            this.onSave()
        }
    }

    buildPayload = (tool) => ({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        public: tool.public,
        type: tool.type,
        data: {
            mcda: MCDA.fromObject(this.state.tool.data.mcda).toObject()
        }
    });

    onSave = () => {
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
                    mcda: mcda.toObject()
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

    routeTo(type) {
        const {id, property} = this.props.match.params;
        const path = this.props.match.path;
        const basePath = path.split(':')[0];
        this.props.history.push(basePath + id + '/' + property + '/' + type);
    }

    renderContent() {
        const {id, property} = this.props.match.params;
        const mcda = MCDA.fromObject(this.state.tool.data.mcda);

        const {permissions} = this.state.tool;
        const readOnly = !includes(permissions, 'w');

        switch (property) {
            case 'criteria':
                return <CriteriaEditor readOnly={readOnly} mcda={mcda} handleChange={this.onChange}/>;
            case 'wa':
                return (<WeightAssignment readOnly={readOnly} mcda={mcda} handleChange={this.onChange} routeTo={this.routeTo}/>);
            default:
                const path = this.props.match.path;
                const basePath = path.split(':')[0];
                return (
                    this.props.history.push(
                        basePath + id + '/criteria'
                    )
                );
        }
    }

    render() {
        const mcda = MCDA.fromObject(this.state.tool.data.mcda);
        const {tool, isDirty, isLoading} = this.state;

        console.log('TOOL', tool);
        console.log('MCDA', mcda);

        if (isLoading) {
            return (
                <AppContainer navBarItems={navigation} loader/>
            );
        }

        const {permissions} = tool;
        const readOnly = !includes(permissions, 'w');

        const menuItems = getMenuItems(mcda);

        return (
            <AppContainer navbarItems={navigation}>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column width={4}/>
                        <Grid.Column width={12}>
                            <ToolMetaData tool={tool} readOnly={readOnly} onChange={this.update} onSave={this.onSave}
                                          isDirty={isDirty}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <ToolNavigation navigationItems={menuItems}/>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <ContentToolBar isDirty={isDirty} save onSave={this.onSave}/>
                            {this.renderContent()}
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