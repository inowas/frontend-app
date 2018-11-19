import React from 'react';
import PropTypes from 'prop-types';

import {setActiveTool, setPublic, cloneToolInstance, deleteToolInstance} from '../actions/actions';
import {loadInstances} from '../actions/queries';
import {getTool, getTools} from '../selectors/tool';
import {getActiveToolSlug, getPublic} from '../selectors/ui';

import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Button, Container, Grid, Header, Icon, Menu, Popup, Table, Search} from 'semantic-ui-react';
import * as Formatter from '../../../services/formatter';

import {includes} from 'lodash';
import AppContainer from '../../shared/AppContainer';

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

class Dashboard
    extends React.Component {
    state = {
        hoveredInstance: null
    };

    componentDidMount() {
        const {activeTool, fetchInstances, publicInstances} = this.props;
        fetchInstances(activeTool.slug, publicInstances);
    }

    componentDidUpdate(prevProps) {
        const {activeTool, publicInstances, fetchInstances} = this.props;

        if (
            activeTool.slug !== prevProps.activeTool.slug ||
            publicInstances !== prevProps.publicInstances
        ) {
            fetchInstances(activeTool.slug, publicInstances);
        }
    }

    onToolClick = slug => {
        if (slug === 'T01' || slug === 'T04' || slug === 'T06' || slug === 'T11') {
            return () => this.props.history.push('/tools/' + slug);
        }

        if (slug === 'T17') {
            return () => window.open('http://marportal.un-igrac.org', '_blank');
        }

        return () => {
            this.props.setActiveTool(slug);
        };
    };

    renderTableRows(basePath, subPath, instances) {
        const {publicInstances, cloneToolInstance, deleteToolInstance} = this.props;
        const {push} = this.props.history;

        return instances.map((i, index) => {
            return (
                <Table.Row
                    key={index}
                    onMouseEnter={() => this.setState({hoveredInstance: index})}
                    onMouseLeave={() => this.setState({hoveredInstance: null})}
                >
                    <Table.Cell textAlign='right'>
                        {index + 1}
                    </Table.Cell>
                    <Table.Cell>
                        <Button
                            basic
                            onClick={() => push(basePath + i.tool + '/' + i.id + subPath)}
                            size='small'
                        >
                            {i.name}
                        </Button>
                    </Table.Cell>
                    <Table.Cell>
                        {i.tool}
                    </Table.Cell>
                    <Table.Cell>
                        {Formatter.dateToDatetime(new Date(i.created_at))}
                    </Table.Cell>
                    <Table.Cell>
                        {i.user_name}
                    </Table.Cell>
                    <Table.Cell style={styles.actionWrapper}>
                        {(() => {
                            if (this.state.hoveredInstance === index) {
                                return (
                                    <Button.Group size='small'>
                                        {!i.fake &&
                                        <Popup
                                            trigger={
                                                <Button
                                                    onClick={() => cloneToolInstance(i.id)}
                                                    icon
                                                >
                                                    <Icon name='clone'/>
                                                </Button>
                                            }
                                            content='Clone'
                                        />
                                        }
                                        {!i.fake &&
                                        !publicInstances &&
                                        <Popup
                                            trigger={
                                                <Button
                                                    onClick={() => deleteToolInstance(i.id)}
                                                    icon
                                                >
                                                    <Icon name='trash'/>
                                                </Button>
                                            }
                                            content='Delete'
                                        />
                                        }
                                    </Button.Group>
                                );
                            }
                            return null;
                        })()}
                    </Table.Cell>
                </Table.Row>
            );
        });
    }

    renderDataTable() {
        // eslint-disable-next-line no-shadow
        const {activeTool, setPublic, publicInstances} = this.props;
        const {push} = this.props.history;

        return (
            <Grid padded>
                <Grid.Row columns={1}>
                    <Grid.Column>
                        <Header as='h2'>Instances of {activeTool.slug}</Header>
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
                        <Search
                            {...this.props}
                        />
                    </Grid.Column>
                    <Grid.Column width={4} floated='right' textAlign='right'>
                        <Button.Group fluid size='tiny'>
                            <Button
                                onClick={() => setPublic(false)}
                                primary={!publicInstances}
                            >
                                Private
                            </Button>
                            <Button.Or/>
                            <Button
                                onClick={() => setPublic(true)}
                                primary={publicInstances}
                            >
                                Public
                            </Button>
                        </Button.Group>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1}>
                    <Grid.Column>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>No.</Table.HeaderCell>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Tool</Table.HeaderCell>
                                    <Table.HeaderCell>Date created</Table.HeaderCell>
                                    <Table.HeaderCell>Created by</Table.HeaderCell>
                                    <Table.HeaderCell/>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.renderTableRows(
                                    activeTool.path,
                                    activeTool.subPath,
                                    activeTool.instances
                                )}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    render() {
        const {tools, roles, activeTool} = this.props;

        const menuItems = [
            {
                name: 'Tools',
                icon: <Icon name="horizontal sliders"/>,
                items: tools.filter(t => includes(roles, t.role))
                    .map(t => {
                        return {
                            name: t.slug + ': ' + t.name,
                            onClick: this.onToolClick(t.slug),
                            active: (activeTool.slug === t.slug)
                        };
                    })
            }
        ];

        return (
            <AppContainer navbarItems={navigation}>
                <Grid padded style={styles.grid}>
                    <Grid.Column width={6}>
                        <Menu vertical style={styles.menu} size='small'>
                            {menuItems.map((category, key) =>
                                <div key={key}>
                                    <Menu.Item header icon >{category.icon}{category.name}</Menu.Item>
                                    {category.items.map((item, key) =>
                                        <Menu.Item
                                            key={key}
                                            onClick={item.onClick}
                                            active={item.active}
                                        >
                                            {item.name}
                                        </Menu.Item>
                                    )}
                                </div>
                            )}
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Container style={styles.columnContainer}>
                            {this.renderDataTable()}
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
        tools: getTools(state.dashboard.tools),
        activeTool: getTool(
            state.dashboard.tools,
            getActiveToolSlug(state.dashboard.ui)
        ),
        publicInstances: getPublic(state.dashboard.ui)
    };
};

const mapDispatchToProps = {
    setActiveTool: setActiveTool,
    fetchInstances: loadInstances,
    setPublic: setPublic,
    cloneToolInstance: cloneToolInstance,
    deleteToolInstance: deleteToolInstance
};

Dashboard.propTypes = {
    roles: PropTypes.array,
    tools: PropTypes.array,
    activeTool: PropTypes.object,
    publicInstances: PropTypes.bool,
    setActiveTool: PropTypes.func.isRequired,
    fetchInstances: PropTypes.func.isRequired,
    setPublic: PropTypes.func.isRequired,
    cloneToolInstance: PropTypes.func.isRequired,
    deleteToolInstance: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
