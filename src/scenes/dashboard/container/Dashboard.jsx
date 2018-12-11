import React from 'react';
import PropTypes from 'prop-types';

import {setActiveTool} from '../actions/actions';
import {cloneToolInstance, deleteToolInstance} from '../actions/commands';

import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Container, Grid, Header, Icon, Search} from 'semantic-ui-react';

import AppContainer from '../../shared/AppContainer';
import tools from '../defaults/tools';
import ToolsMenu from '../components/ToolsMenu';
import ToolsDataTable from '../components/ToolsDataTable';
import {fetchUrl, sendCommand} from 'services/api';

import uuid from 'uuid';


const styles = {
    actionWrapper: {
        position: 'absolute',
        right: 10,
    },
    wrapper: {
        padding: '0 40px 0 40px',
        width: '1280px'
    },
    columnPadding: {
        padding: '12px'
    },
    columnContainer: {
        background: '#FFFFFF',
        boxShadow: '0 0 3px 0px rgba(0, 0, 0, 0.3)',
        height: '100%',
    },
    menu: {
        width: '100%'
    },
    grid: {
        marginTop: '25px'
    }
};

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
        showPublicInstances: true,
        toolInstances: [],
        error: false
    };

    componentDidMount() {
        const {activeTool} = this.props;
        this.fetchInstances(activeTool.slug, this.state.showPublicInstances);
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
        }, () => this.fetchInstances(slug, this.state.showPublicInstances));

        return this.props.setActiveTool(slug);
    };

    setPublic = showPublicInstances => (
        this.setState({
            showPublicInstances,
            isLoading: true,
            toolInstances: []
        }, () => this.fetchInstances(this.props.activeTool.slug, this.state.showPublicInstances))
    );

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



    render() {
        const {activeTool, roles, history} = this.props;
        const {push} = history;

        return (
            <AppContainer navbarItems={navigation}>
                <Grid padded style={styles.grid}>
                    <Grid.Column width={6}>
                        <ToolsMenu
                            activeTool={activeTool.slug}
                            onClick={this.onToolClick}
                            roles={roles}
                            tools={tools}
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Container style={styles.columnContainer}>
                            <Grid padded>
                                <Grid.Row columns={1}>
                                    <Grid.Column>
                                        <Header as='h1' align={'center'} size={'medium'}>Instances
                                            of {activeTool.slug}: {activeTool.name}</Header>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={3}>
                                    <Grid.Column width={4} floated='left' textAlign='center'>
                                        <Button content='Add new' positive icon='plus' labelPosition='left' fluid
                                                style={styles.iconFix}
                                                onClick={() => push(activeTool.path + activeTool.slug)}
                                        >
                                        </Button>
                                    </Grid.Column>
                                    <Grid.Column width={6}>
                                        <Search/>
                                    </Grid.Column>
                                    <Grid.Column width={4} floated='right' textAlign='right'>
                                        <Button.Group fluid size='tiny'>
                                            <Button
                                                onClick={() => this.setPublic(false)}
                                                primary={!this.state.showPublicInstances}
                                            >
                                                Private
                                            </Button>
                                            <Button.Or/>
                                            <Button
                                                onClick={() => this.setPublic(true)}
                                                primary={this.state.showPublicInstances}
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
                                            showPublicInstances={this.state.showPublicInstances}
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
        activeTool: tools.filter(t => t.slug === state.dashboard.activeTool)[0]
    };
};

const mapDispatchToProps = {
    setActiveTool: setActiveTool
};

Dashboard.propTypes = {
    roles: PropTypes.array,
    activeTool: PropTypes.object,
    setActiveTool: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
