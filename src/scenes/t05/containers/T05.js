import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';
import {includes} from 'lodash';

import {fetchTool, sendCommand} from 'services/api';
import Command from '../../shared/simpleTools/commands/command';
import {deepMerge} from '../../shared/simpleTools/helpers';

import {Divider, Grid, Icon, Message, Segment} from 'semantic-ui-react';
import AppContainer from '../../shared/AppContainer';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import {
    CriteriaEditor,
    CriteriaDataEditor,
    CriteriaNavigation,
    ConstraintsEditor,
    ToolNavigation,
    WeightAssignmentEditor
} from '../components';

import {defaultsT05} from '../defaults';
import getMenuItems from '../defaults/menuItems';

import {MCDA} from 'core/model/mcda';
import ContentToolBar from '../../shared/ContentToolbar';
import {WeightAssignment, WeightAssignmentsCollection} from 'core/model/mcda/criteria';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t05-mar-mcda/',
    icon: <Icon name="file"/>
}];

class T05 extends React.Component {
    constructor() {
        super();

        this.state = {
            isDirty: false,
            isError: false,
            isLoading: true,
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
                error => {
                    console.log('ERROR', error);
                    this.setState({isError: true, isLoading: false})
                }
            );
        } else {
            this.handleSave()
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

    handleChange = ({name, value}) => {
        let mcda = MCDA.fromObject(this.state.tool.data.mcda);

        if (name === 'criteria') {
            mcda.updateCriteria(value);
        }

        if (name === 'weights') {
            if (value instanceof WeightAssignmentsCollection) {
                mcda.weightAssignmentsCollection = value;
            }
            if (value instanceof WeightAssignment) {
                mcda.weightAssignmentsCollection.update(value);
            }
        }

        if (name === 'constraints') {
            mcda.constraints = value;
        }

        if (name === 'mcda') {
            mcda = value;
        }

        return this.setState({
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

    handleSave = () => {
        const {id} = this.props.match.params;
        const {tool} = this.state;

        if (id) {
            this.setState({isLoading: true});
            sendCommand(
                Command.updateToolInstance(this.buildPayload(tool)),
                () => this.setState({
                    isDirty: false,
                    isLoading: false
                }),
                () => this.setState({
                    isError: true,
                    isLoading: false
                })
            );
            return;
        }

        sendCommand(
            Command.createToolInstance(this.buildPayload(tool)),
            () => {
                const path = this.props.match.path;
                const basePath = path.split(':')[0];
                this.setState({isLoading: false});
                this.props.history.push(basePath + tool.id + '/criteria');
            },
            () => this.setState({isError: true})
        );
    };

    handleUpdateMetaData = (tool) => this.setState({
        tool: {
            ...tool
        }
    });

    handleClickCriteriaNavigation = (e, {name}) => this.routeTo(name);

    handleClickCriteriaTool = (cid, name) => this.routeTo(cid, name);

    routeTo = (nCid = null, nTool = null) => {
        const {id, property} = this.props.match.params;
        const cid = nCid || null;
        const tool = nTool || this.props.match.params.tool || null;
        const path = this.props.match.path;
        const basePath = path.split(':')[0];
        if (!!cid && !!tool) {
            return this.props.history.push(basePath + id + '/' + property + '/' + cid + '/' + tool);
        }
        if (!!cid) {
            if (property === 'cd') {
                return this.props.history.push(basePath + id + '/' + property + '/' + cid + '/upload');
            }
            return this.props.history.push(basePath + id + '/' + property + '/' + cid);
        }
        return this.props.history.push(basePath + id + '/' + property);
    };

    renderContent() {
        const {id, property} = this.props.match.params;
        const cid = this.props.match.params.cid || null;
        const tool = this.props.match.params.tool || null;
        const mcda = MCDA.fromObject(this.state.tool.data.mcda);

        const {permissions} = this.state.tool;
        const readOnly = !includes(permissions, 'w');

        switch (property) {
            case 'criteria':
                return (
                    <CriteriaEditor
                        toolName={this.state.tool.name}
                        readOnly={readOnly || mcda.weightAssignmentsCollection.length > 0}
                        mcda={mcda}
                        handleChange={this.handleChange}
                    />);
            case 'cm':
                return (
                    <ConstraintsEditor
                        readOnly={readOnly}
                        mcda={mcda}
                        handleChange={this.handleChange}
                    />
                );
            case 'wa':
                const weightAssignment = cid ? mcda.weightAssignmentsCollection.findById(cid) : null;

                return (
                    <WeightAssignmentEditor
                        readOnly={readOnly}
                        mcda={mcda}
                        selectedWeightAssignment={weightAssignment}
                        handleChange={this.handleChange}
                        routeTo={this.routeTo}
                    />
                );
            case 'cd':
                const criterion = cid ? mcda.criteriaCollection.findById(cid) : null;

                if (!criterion || (mcda.withAhp && !criterion.parentId)) {
                    return (
                        <Message warning>
                            <Message.Header>Criterion not found or not eligible</Message.Header>
                            <p>The requested criterion id couldn't be found or the related criterion is not eligible for raster data.</p>
                        </Message>
                    );
                }

                return (
                    <CriteriaDataEditor
                        activeTool={tool}
                        criterion={criterion}
                        handleChange={this.handleChange}
                        mcda={mcda}
                        onClickTool={this.handleClickCriteriaTool}
                    />
                );
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

        const {cid, property} = this.props.match.params;

        const {permissions} = tool;
        const readOnly = !includes(permissions, 'w');

        const menuItems = getMenuItems(mcda);

        return (
            <AppContainer navbarItems={navigation}>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column width={4}/>
                        <Grid.Column width={12}>
                            <ToolMetaData
                                tool={tool} readOnly={readOnly} onChange={this.handleUpdateMetaData}
                                onSave={this.handleSave}
                                saveButton={false}
                                isDirty={isDirty}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <ToolNavigation navigationItems={menuItems}/>
                            {property === 'cd' &&
                            <CriteriaNavigation
                                activeCriterion={cid}
                                mcda={mcda}
                                onClick={this.handleClickCriteriaNavigation}
                            />
                            }
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Segment color={'grey'} loading={isLoading}>
                                <ContentToolBar
                                    backButton={!!cid && property !== 'cd'}
                                    onBack={this.routeTo}
                                    isDirty={isDirty} save
                                    onSave={this.handleSave}
                                />
                                <Divider/>
                                {this.renderContent()}
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