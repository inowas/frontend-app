import React from 'react';
import PropTypes from 'prop-types';

import {setActiveTool, setPublic} from '../actions';
import {cloneToolInstance, deleteToolInstance} from '../commands';

import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Container, Grid, Header, Icon, Search} from 'semantic-ui-react';

import AppContainer from '../../shared/AppContainer';
import tools from '../defaults/tools';
import ToolsMenu from '../components/ToolsMenu';
import ToolsDataTable from '../components/ToolsDataTable';
import {fetchUrl, sendCommand} from 'services/api';

import uuid from 'uuid';
import ModflowModelImport from '../components/ModflowModelImport';

const navigation = [
    {
        name: 'Documentation',
        path: 'https://inowas.hydro.tu-dresden.de/',
        icon: <Icon name="file alternate"/>
    },
    {
        name: 'Datasets',
        path: 'https://kb.inowas.hydro.tu-dresden.de',
        icon: <Icon name="database"/>
    }
];

class Dashboard extends React.Component {
    state = {
        hoveredInstance: null,
        isLoading: true,
        toolInstances: [],
        error: false,
        import: false
    };

    componentDidMount() {
        const {activeTool, showPublicInstances} = this.props;
        this.fetchInstances(activeTool.slug, showPublicInstances);
    }

    fetchInstances = (tool, showPublicInstances) => {
        fetchUrl(`tools/${tool}` + (showPublicInstances ? '?public=true' : ''),
            data => this.setState({toolInstances: data, isLoading: false}),
            error => this.handleError(error)
        );
    };

    handleError = error => {
        const {response} = error;
        const {status} = response;
        this.setState({error, isLoading: false});

        if (status === 422) {
            this.props.history.push('/tools');
        }
    };

    onToolClick = slug => {
        if (slug === 'T01' || slug === 'T04' || slug === 'T06' || slug === 'T11') {
            return this.props.history.push('/tools/' + slug);
        }

        if (slug === 'T17') {
            return window.open('http://marportal.un-igrac.org', '_blank');
        }

        this.setState({
            isLoading: true,
            toolInstances: []
        }, () => this.fetchInstances(slug, this.props.showPublicInstances));

        return this.props.setActiveTool(slug);
    };

    setPublic = showPublicInstances => {
        this.props.setPublic(showPublicInstances);
        return this.setState({
            isLoading: true,
            toolInstances: []
        }, () => this.fetchInstances(this.props.activeTool.slug, showPublicInstances))
    };

    handleCloneInstance = (tool, id) => {
        const newId = uuid.v4();
        sendCommand(cloneToolInstance(tool, id, newId),
            () => this.setPublic(false)
        )
    };


    handleDeleteInstance = (tool, id) => {
        sendCommand(deleteToolInstance(tool, id),
            () => this.setPublic(false)
        )
    };

    renderImportOrSearch = (tool) => {
        if (tool.slug === 'T03') {
            return (
                <ModflowModelImport />
            )
        }

        return (
            <Search input={{ fluid: true }} />
        )
    };

    render() {
        const {activeTool, roles, history, showPublicInstances} = this.props;
        const {push} = history;

        return (
            <AppContainer navbarItems={navigation}>
                <Grid padded>
                    <Grid.Column width={6}>
                        <ToolsMenu
                            activeTool={activeTool.slug}
                            onClick={this.onToolClick}
                            roles={roles}
                            tools={tools}
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Container className='columnContainer'>
                            <Grid padded>
                                <Grid.Row columns={1}>
                                    <Grid.Column>
                                        <Header as='h1' align='center' size='medium'>Instances
                                            of {activeTool.slug}: {activeTool.name}</Header>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={3}>
                                    <Grid.Column width={4} align='left'>
                                        <Button
                                            content='Create new'
                                            positive
                                            icon='plus'
                                            labelPosition='left'
                                            fluid
                                            onClick={() => push(activeTool.path + activeTool.slug)}
                                        >
                                        </Button>
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        {this.renderImportOrSearch(activeTool)}
                                    </Grid.Column>
                                    <Grid.Column width={4} align='right'>
                                        <Button.Group size='tiny'>
                                            <Button
                                                onClick={() => this.setPublic(false)}
                                                primary={!showPublicInstances}
                                            >
                                                Private
                                            </Button>
                                            <Button.Or/>
                                            <Button
                                                onClick={() => this.setPublic(true)}
                                                primary={showPublicInstances}
                                            >
                                                Public
                                            </Button>
                                        </Button.Group>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={1}>
                                    <Grid.Column>
                                        <ToolsDataTable
                                            activeTool={activeTool}
                                            cloneToolInstance={this.handleCloneInstance}
                                            deleteToolInstance={this.handleDeleteInstance}
                                            loading={this.state.isLoading}
                                            showPublicInstances={showPublicInstances}
                                            toolInstances={this.state.toolInstances}
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Container>
                    </Grid.Column>
                </Grid>
            </AppContainer>
        );
    }
}

const mapStateToProps = state => {
    return {
        roles: state.user.roles,
        activeTool: tools.filter(t => t.slug === state.dashboard.activeTool)[0],
        showPublicInstances: state.dashboard.showPublicInstances
    };
};

const mapDispatchToProps = {
    setActiveTool, setPublic
};

Dashboard.propTypes = {
    activeTool: PropTypes.object.isRequired,
    roles: PropTypes.array.isRequired,
    setActiveTool: PropTypes.func.isRequired,
    showPublicInstances: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
