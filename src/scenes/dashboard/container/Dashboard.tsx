import React, {MouseEvent, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {
    Button,
    Container,
    Dimmer,
    Grid,
    Header,
    Icon,
    Loader,
    Search,
    SearchProps, SearchResultData
} from 'semantic-ui-react';
import uuid from 'uuid';
import {IRootReducer} from '../../../reducers';
import {fetchUrl, sendCommand} from '../../../services/api';
import AppContainer from '../../shared/AppContainer';
import {setActiveTool, setPublic} from '../actions';
import {cloneToolInstance, deleteToolInstance} from '../commands';
import ModflowModelImport from '../components/ModflowModelImport';
import ToolsDataTable from '../components/ToolsDataTable';
import ToolsMenu from '../components/ToolsMenu';
import tools, {ITool, IToolInstance} from '../defaults/tools';
import availableTools from '../defaults/tools';

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
    const [toolInstances, setToolInstances] = useState<IToolInstance[]>([]);
    const [search, setSearch] = useState<string>();

    const dispatch = useDispatch();
    const activeTool = useSelector((state: IRootReducer) => state.dashboard.activeTool);
    const roles = useSelector((state: IRootReducer) => state.user.roles);
    const showPublicInstances = useSelector((state: IRootReducer) => state.dashboard.showPublicInstances);

    const fetchingAttempts = useRef<number>(0);

    useEffect(() => {
        fetchInstances(activeTool.slug, showPublicInstances);
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
                if (fetchingAttempts.current < 5) {
                    fetchInstances(tool, cShowPublicInstances);
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

        const tool = availableTools.filter((t) => t.slug === slug);
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

    const handleChangeSearch = (e: MouseEvent, {value}: SearchProps) => {
        return setSearch(value);
    };

    const handleClickSearch = (e: MouseEvent, {result}: SearchResultData) => {
        const {path, subPath, slug} = activeTool;
        return props.history.push(path + slug + '/' + result.value + subPath);
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

    const renderImportOrSearch = (tool: ITool) => {
        if (tool.slug === 'T03') {
            return (
                <ModflowModelImport/>
            );
        }

        const filteredInstances = search ? toolInstances.filter(
            (t) => JSON.stringify(t).toLowerCase().includes(search.toLowerCase())
        ) : toolInstances;

        return (
            <Search
                onResultSelect={handleClickSearch}
                onSearchChange={handleChangeSearch}
                input={{fluid: true}}
                results={filteredInstances.map((t) => {
                    return {
                        key: t.id,
                        title: t.name,
                        value: t.id
                    };
                })}
                value={search}
            />
        );
    };

    const {history} = props;
    const {push} = history;

    return (
        <AppContainer navbarItems={navigation}>
            {isLoading &&
            <Dimmer active={true} inverted={true}>
                <Loader>Loading</Loader>
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
                                    <Header as="h1" align="center" size="medium">Instances
                                        of {activeTool.slug}: {activeTool.name}</Header>
                                </Grid.Column>
                            </Grid.Row>
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
                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    <ToolsDataTable
                                        activeTool={activeTool}
                                        cloneToolInstance={handleCloneInstance}
                                        deleteToolInstance={handleDeleteInstance}
                                        showPublicInstances={showPublicInstances}
                                        toolInstances={toolInstances}
                                    />
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
