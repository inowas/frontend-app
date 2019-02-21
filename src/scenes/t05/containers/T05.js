import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';
import {includes} from 'lodash';
import {Divider, Grid, Icon, Segment} from 'semantic-ui-react';

import {fetchTool, sendCommand} from 'services/api';

import {MCDA} from 'core/model/mcda';
import {Criterion, CriteriaCollection, WeightAssignment, WeightAssignmentsCollection} from 'core/model/mcda/criteria';
import {GisMap} from 'core/model/mcda/gis';

import {defaultsT05, getMenuItems} from '../defaults';
import {heatMapColors} from '../defaults/gis';

import McdaCommand from '../commands/mcdaCommand';

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

    buildPayload = tool => ({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        public: tool.public,
        tool: tool.tool,
        data: MCDA.fromObject(this.state.tool.data).toObject()
    });

    handleChange = ({name, value}) => {
        let mcda = MCDA.fromObject(this.state.tool.data);

        if (name === 'weights') {
            if (value instanceof WeightAssignmentsCollection) {
                mcda.weightAssignmentsCollection = value;
            }
            if (value instanceof WeightAssignment) {
                mcda.weightAssignmentsCollection.update(value);
            }
        }

        if (name === 'constraints' && value instanceof GisMap) {
            mcda.constraints = value;
        }

        if (name === 'mcda' && value instanceof MCDA) {
            mcda = value;
        }

        this.handleUpdateProject(mcda);
    };

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

    handleDeleteCriterion = id => {
        const criteriaCollection = CriteriaCollection.fromArray(this.state.tool.data.criteria);
        criteriaCollection.remove(id);

        this.setState({isDirty: true}, sendCommand(
            McdaCommand.deleteCriterion({
                id: this.state.tool.id,
                criterion_id: id
            }),
            () => this.setState(prevState => ({
                isDirty: false,
                isLoading: false,
                tool: {
                    ...prevState.tool,
                    data: {
                        ...prevState.tool.data,
                        criteria: criteriaCollection.toArray()
                    }
                }
            })),
            () => this.setState({
                isDirty: false,
                isError: true,
                isLoading: false
            })
        ));
    };

    handleUpdateCriterion = criterion => {
        if (!(criterion instanceof Criterion)) {
            throw new Error('Criterion expected to be instance of Criterion.');
        }

        const criteriaCollection = CriteriaCollection.fromArray(this.state.tool.data.criteria);
        criteriaCollection.update(criterion);

        this.setState({isDirty: true}, sendCommand(
            McdaCommand.updateCriterion({
                id: this.state.tool.id,
                criterion: criterion.toObject()
            }),
            () => this.setState(prevState => ({
                isDirty: false,
                isLoading: false,
                tool: {
                    ...prevState.tool,
                    data: {
                        ...prevState.tool.data,
                        criteria: criteriaCollection.toArray()
                    }
                }
            })),
            () => this.setState({
                isDirty: false,
                isError: true,
                isLoading: false
            })
        ));
    };

    handleUpdateProject = mcda => {
        if (!(mcda instanceof MCDA)) {
            throw new Error('MCDA expected to be instance of MCDA.');
        }

        this.setState({isDirty: true}, sendCommand(
            McdaCommand.updateProject({
                id: this.state.tool.id,
                data: mcda.toProject()
            }),
            () => this.setState(prevState => ({
                isDirty: false,
                isLoading: false,
                tool: {
                    ...prevState.tool,
                    data: mcda.toObject()
                }
            })),
            () => this.setState({
                isDirty: false,
                isError: true,
                isLoading: false
            })
        ));
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
                        handleDeleteCriterion={this.handleDeleteCriterion}
                        handleUpdateCriterion={this.handleUpdateCriterion}
                        handleUpdateProject={this.handleUpdateProject}
                    />);
            case 'cm':
                const constraints = mcda.constraints;

                if (mcda.criteriaCollection.length > 0 && !constraints.boundingBox) {
                    constraints.boundingBox = mcda.criteriaCollection.getBoundingBox();
                }

                return (
                    <ConstraintsEditor
                        readOnly={readOnly}
                        constraints={constraints}
                        handleChange={this.handleChange}
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
                        handleChange={this.handleChange}
                        routeTo={this.routeTo}
                    />
                );
            case 'cd':
                const criterion = cid ? mcda.criteriaCollection.findById(cid) : null;

                return (
                    <CriteriaDataEditor
                        activeTool={tool}
                        criterion={criterion}
                        handleChange={this.handleUpdateCriterion}
                        mcda={mcda}
                        onClickTool={this.handleClickCriteriaTool}
                    />
                );
            case 'su':
                return (
                    <SuitabilityEditor
                        activeTool={cid}
                        handleChange={this.handleChange}
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
                                onSave={this.handleSaveMetadata}
                                saveButton={false}
                                isDirty={isDirty}
                            />
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
                                    isDirty={isDirty}
                                    saveButton={false}
                                />
                                <Divider />
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