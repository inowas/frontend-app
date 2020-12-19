import {
    Button,
    Container,
    Dimmer,
    Grid,
    Header,
    Icon,
    Loader
} from 'semantic-ui-react';
import {IRootReducer} from '../../../reducers';
import {IToolInstance} from '../../types';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {cloneToolInstance, deleteToolInstance, updateToolInstanceMetadata} from '../commands';
import {fetchUrl, sendCommand, sendCommandAsync} from '../../../services/api';
import {setActiveTool, setPublic} from '../actions';
import {useDispatch, useSelector} from 'react-redux';
import AdminToolsDataTable from '../../admin/components/ToolsDataTable';
import AppContainer from '../../shared/AppContainer';
import ModflowModelImport from '../components/ModflowModelImport';
import React, {useEffect, useRef, useState} from 'react';
import ToolsDataTable from '../components/ToolsDataTable';
import ToolsMenu from '../components/ToolsMenu';
import availableTools, {myTools} from '../defaults/tools';
import tools, {IToolMenuItem} from '../defaults/tools';
import uuid from 'uuid';

const navigation = [
    {
        name: 'Documentation',
        path: 'https://inowas.com/tools',
        icon: <Icon name="file alternate"/>
    }
];

type IProps = RouteComponentProps;

const Dashboard = (props: IProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorLoading, setErrorLoading] = useState<boolean>(false);
    const [toolInstances, setToolInstances] = useState<IToolInstance[]>([]);

    const dispatch = useDispatch();
    const activeTool = useSelector((state: IRootReducer) => state.dashboard.activeTool);
    const roles = useSelector((state: IRootReducer) => state.user.roles);
    const showPublicInstances = useSelector((state: IRootReducer) => state.dashboard.showPublicInstances);

    const fetchingAttempts = useRef<number>(0);

    useEffect(() => {
        fetchInstances(activeTool.slug, showPublicInstances);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!activeTool) {
        return <div>No active tool!</div>;
    }

    const fetchInstances = (tool: string, cShowPublicInstances: boolean) => {
        fetchUrl(`tools/${tool}` + (cShowPublicInstances ? '?public=true' : ''),
            (data) => {
                setToolInstances(data);
                setIsLoading(false);
            },
            () => {
                // TODO: not pretty but works for now
                fetchingAttempts.current = fetchingAttempts.current + 1;
                if (fetchingAttempts.current <= 5) {
                    fetchInstances(tool, cShowPublicInstances);
                }

                if (fetchingAttempts.current > 5) {
                    setErrorLoading(true);
                }
            }
        );
    };

    const handleToolClick = (slug: string) => {
        if (slug === 'T01' || slug === 'T04' || slug === 'T06' || slug === 'T11') {
            return props.history.push('/tools/' + slug);
        }

        if (slug === 'T17') {
            return window.open('http://marportal.un-igrac.org', '_blank');
        }

        const tool = myTools.concat(availableTools).filter((t) => t.slug === slug);
        if (tool.length > 0) {
            setIsLoading(true);
            setToolInstances([]);
            fetchInstances(slug, showPublicInstances);
            return dispatch(setActiveTool(tool[0]));
        }
    };

    const setToPublic = (cShowPublicInstances: boolean) => {
        dispatch(setPublic(cShowPublicInstances));
        setIsLoading(true);
        setToolInstances([]);
        return fetchInstances(activeTool.slug, cShowPublicInstances);
    };

    const handleCloneInstance = (tool: string, id: string) => {
        const newId = uuid.v4();
        setIsLoading(true);
        return sendCommand(cloneToolInstance(tool, id, newId),
            () => {
                dispatch(setPublic(false));
                fetchInstances(tool, false);
            }, () => {
                setIsLoading(false);
            }
        );
    };

    const handleDeleteInstance = (tool: string, id: string) => {
        setIsLoading(true);
        return sendCommand(deleteToolInstance(tool, id),
            () => {
                dispatch(setPublic(false));
                fetchInstances(tool, false);
            }, () => {
                setIsLoading(false);
            }
        );
    };

    const renderImportOrSearch = (tool: IToolMenuItem) => {
        if (tool.slug === 'T03') {
            return (
                <ModflowModelImport/>
            );
        }

        return null;
    };

    const handleChangeMetadata = (tool: string, id: string, name: string, description: string, isPublic: boolean) => {
        const sc = async () => {
            setIsLoading(true);
            setErrorLoading(false);
            try {
                await sendCommandAsync(updateToolInstanceMetadata(tool, {id, name, description, isPublic}));
                setToolInstances(toolInstances.map((t) => {
                    if (t.id === id) {
                        t.name = name;
                        t.description = description;
                        t.public = !isPublic;
                    }
                    return t;
                }));
            } catch (e) {
                setErrorLoading(true);
            } finally {
                setIsLoading(false);
            }
        };

        sc();
    };

    const {history} = props;
    const {push} = history;
    const showMyTools = activeTool.slug === 'myTools';

    return (
        <AppContainer navbarItems={navigation}>
            {isLoading &&
            <Dimmer active={true} inverted={true}>
                <Loader>Loading</Loader>
            </Dimmer>
            }
            {errorLoading &&
            <Dimmer active={true} inverted={true}>
                <Loader>Error loading</Loader>
            </Dimmer>
            }
            <Grid padded={true}>
                <Grid.Column width={6}>
                    <ToolsMenu
                        activeTool={activeTool}
                        onClick={handleToolClick}
                        roles={roles}
                        tools={tools}
                    />
                </Grid.Column>
                <Grid.Column width={10}>
                    <Container className="columnContainer">
                        <Grid padded={true}>
                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    <Header as="h1" align="center" size="medium">
                                        {showMyTools ? 'Instances of My Tools' : `Instances of ${activeTool.slug}: ${activeTool.name}`}
                                    </Header>
                                </Grid.Column>
                            </Grid.Row>

                            {!showMyTools &&
                            <Grid.Row columns={3}>
                                <Grid.Column width={4} align="left">
                                    <Button
                                        content="Create new"
                                        positive={true}
                                        icon="plus"
                                        labelPosition="left"
                                        fluid={true}
                                        onClick={() => push(activeTool.path + activeTool.slug)}
                                    />
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    {renderImportOrSearch(activeTool)}
                                </Grid.Column>
                                <Grid.Column width={4} align="right">
                                    <Button.Group size="tiny">
                                        <Button
                                            onClick={() => setToPublic(false)}
                                            primary={!showPublicInstances}
                                        >
                                            Private
                                        </Button>
                                        <Button.Or/>
                                        <Button
                                            onClick={() => setToPublic(true)}
                                            primary={showPublicInstances}
                                        >
                                            Public
                                        </Button>
                                    </Button.Group>
                                </Grid.Column>
                            </Grid.Row>
                            }
                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    {showMyTools ?
                                        <AdminToolsDataTable
                                            tools={toolInstances as any}
                                            onChangeMetadata={handleChangeMetadata}
                                            onDelete={handleDeleteInstance}
                                        /> :
                                        <ToolsDataTable
                                            activeTool={activeTool}
                                            cloneToolInstance={handleCloneInstance}
                                            deleteToolInstance={handleDeleteInstance}
                                            showPublicInstances={showPublicInstances}
                                            toolInstances={toolInstances}
                                        />
                                    }

                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </Grid.Column>
            </Grid>
        </AppContainer>
    );
};

export default withRouter(Dashboard);
