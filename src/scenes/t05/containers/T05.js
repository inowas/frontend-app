import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';
import {includes} from 'lodash';
import {Divider, Grid, Icon, Segment} from 'semantic-ui-react';

import {fetchTool, sendCommand} from 'services/api';

import {MCDA} from 'core/model/mcda';

import {defaultsT05, getMenuItems} from '../defaults';
import {heatMapColors} from '../defaults/gis';

import Command from '../../shared/simpleTools/commands/command';
import {deepMerge} from '../../shared/simpleTools/helpers';
import AppContainer from '../../shared/AppContainer';
import ContentToolBar from '../../shared/ContentToolbar';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import {
    CriteriaEditor,
    CriteriaDataEditor,
    CriteriaNavigation,
    CriteriaRasterMap,
    ConstraintsEditor,
    SuitabilityEditor,
    ToolNavigation,
    WeightAssignmentEditor
} from '../components';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t05-mar-mcda/',
    icon: <Icon name="file"/>
}];

class T05 extends React.Component {
    constructor(props) {
        super(props);

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
                this.state.tool.tool,
                this.props.match.params.id,
                tool => {
                    this.setState({
                        tool: deepMerge(this.state.tool, tool),
                        isDirty: false,
                        isLoading: false
                    });
                },
                error => {
                    console.log('ERROR', error);
                    this.setState({isError: true, isLoading: false})
                }
            );
        } else {
            this.handleSave()
        }
    }

    buildPayload = tool => {
        const data = MCDA.fromObject(this.state.tool.data);

        return ({
            id: tool.id,
            name: tool.name,
            description: tool.description,
            public: tool.public,
            tool: tool.tool,
            data: data.toPayload()
        });
    };

    handleChange = mcda => this.setState(prevState => ({
        isDirty: true,
        tool: {
            ...prevState.tool,
            data: mcda.toObject()
        }
    }));

    handleSaveMetadata = () => {
        sendCommand(
            Command.updateToolInstanceMetadata({
                id: this.state.tool.id,
                name: this.state.tool.name,
                description: this.state.tool.description,
                public: this.state.tool.public
            }),
            () => this.setState({
                isDirty: false,
                isLoading: false
            }),
            () => this.setState({
                isError: true,
                isLoading: false
            })
        );
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

    handleUpdateMetaData = tool => this.setState({
        tool: {
            ...tool
        }
    });

    handleClickCriteriaNavigation = (e, {name}) => this.routeTo(name);

    handleClickCriteriaTool = (cid, name) => this.routeTo(cid, name);

    handleClickSuitabilityTool = (name) => this.routeTo(name);

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
        const mcda = MCDA.fromObject(this.state.tool.data);

        const {permissions} = this.state.tool;
        const readOnly = !includes(permissions, 'w');

        switch (property) {
            case 'criteria':
                return (
                    <CriteriaEditor
                        toolName={this.state.tool.name}
                        readOnly={readOnly || mcda.weightAssignmentsCollection.length > 0}
                        routeTo={() => {
                            this.props.history.push('/tools/t04')
                        }}
                        mcda={mcda}
                        onChange={this.handleChange}
                    />);
            case 'cm':

                if (mcda.criteriaCollection.length > 0 && !mcda.constraints.boundingBox) {
                    mcda.constraints.boundingBox = mcda.criteriaCollection.getBoundingBox(mcda.withAhp);
                }

                return (
                    <ConstraintsEditor
                        readOnly={readOnly}
                        mcda={mcda}
                        onChange={this.handleChange}
                    />
                );
            case 'wa':
                const weightAssignment = cid ? mcda.weightAssignmentsCollection.findById(cid) : null;

                return (
                    <WeightAssignmentEditor
                        toolName={this.state.tool.name}
                        readOnly={readOnly}
                        mcda={mcda}
                        selectedWeightAssignment={weightAssignment}
                        onChange={this.handleChange}
                        routeTo={this.routeTo}
                    />
                );
            case 'cd':
                const criterion = cid ? mcda.criteriaCollection.findById(cid) : null;

                return (
                    <CriteriaDataEditor
                        activeTool={tool}
                        criterion={criterion}
                        onChange={this.handleChange}
                        mcda={mcda}
                        onClickTool={this.handleClickCriteriaTool}
                    />
                );
            case 'su':
                return (
                    <SuitabilityEditor
                        activeTool={cid}
                        onChange={this.handleChange}
                        mcda={mcda}
                        onClickTool={this.handleClickSuitabilityTool}
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
        const mcda = MCDA.fromObject(this.state.tool.data);

        const {tool, isDirty, isError, isLoading} = this.state;

        const {cid, property} = this.props.match.params;

        const {permissions} = tool;
        const readOnly = !includes(permissions, 'w');

        const menuItems = getMenuItems(mcda);

        return (
            <AppContainer navbarItems={navigation}>
                <ToolMetaData
                    tool={tool} readOnly={readOnly} onChange={this.handleUpdateMetaData}
                    onSave={this.handleSaveMetadata}
                    defaultButton={false}
                    saveButton={false}
                    isDirty={isDirty}
                />
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <ToolNavigation navigationItems={menuItems}/>
                            {property === 'cd' &&
                            <CriteriaNavigation
                                activeCriterion={cid}
                                mcda={mcda}
                                onClick={this.handleClickCriteriaNavigation}
                                handleChange={this.handleChange}
                            />
                            }
                            {property === 'su' && (!cid || cid === 'weightAssignment' || cid === 'classes') && mcda.suitability && mcda.suitability.raster.data.length > 0 &&
                            <Segment color='blue'>
                                <p>Overview</p>
                                <CriteriaRasterMap
                                    raster={mcda.suitability.raster}
                                    showBasicLayer={false}
                                    showLegend={cid !== 'classes'}
                                    legend={!cid || cid === 'weightAssignment' ?
                                        mcda.suitability.raster.generateRainbow(heatMapColors.default, [0, 1])
                                        :
                                        mcda.suitability.generateLegend()
                                    }
                                    mapHeight='200px'
                                />
                            </Segment>
                            }
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Segment color={'grey'} loading={isLoading}>
                                <ContentToolBar
                                    backButton={!!cid && property !== 'cd'}
                                    onBack={this.routeTo}
                                    onSave={this.handleSave}
                                    isDirty={isDirty}
                                    isError={isError}
                                    saveButton
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
    mcda: PropTypes.object
};

export default withRouter(T05);