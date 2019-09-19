import {includes} from 'lodash';
import React, {MouseEvent, useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Divider, Grid, Icon, MenuItemProps, Segment} from 'semantic-ui-react';
import {MCDA} from '../../../core/model/mcda';
import Criterion from '../../../core/model/mcda/criteria/Criterion';
import {fetchTool, sendCommand} from '../../../services/api';
import {RainbowOrLegend} from '../../../services/rainbowvis/types';
import AppContainer from '../../shared/AppContainer';
import ContentToolBar from '../../shared/ContentToolbar';
import Command from '../../shared/simpleTools/commands/command';
import {deepMerge} from '../../shared/simpleTools/helpers';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import {IToolMetaData} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import {
    ConstraintsEditor,
    CriteriaDataEditor,
    CriteriaEditor,
    CriteriaNavigation,
    CriteriaRasterMap,
    SuitabilityEditor,
    ToolNavigation,
    WeightAssignmentEditor
} from '../components';
import {defaultsT05, getMenuItems} from '../defaults';
import {heatMapColors} from '../defaults/gis';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools/t05-gis-mcda/',
    icon: <Icon name="file"/>
}];

interface IProps extends RouteComponentProps<any> {
    mcda?: MCDA;
}

const t05 = (props: IProps) => {
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tool, setTool] = useState<IToolMetaData>(defaultsT05());

    const {id, cid, property} = props.match.params;
    const mcda = MCDA.fromObject(tool.data);
    const {permissions} = tool;
    const readOnly = !includes(permissions, 'w');
    const menuItems = getMenuItems(mcda);

    useEffect(() => {
        if (props.match.params.id) {
            setIsLoading(true);
            fetchTool(
                tool.tool,
                props.match.params.id,
                (cTool) => {
                    setTool(deepMerge(tool, cTool));
                    setIsDirty(false);
                    setIsLoading(false);
                },
                () => {
                    setIsError(true);
                    setIsLoading(false);
                }
            );
        } else {
            handleSave();
        }
    }, []);

    const buildPayload = (cTool: IToolMetaData) => {
        const data = MCDA.fromObject(cTool.data);

        return ({
            id: cTool.id,
            name: cTool.name,
            description: cTool.description,
            public: cTool.public,
            tool: cTool.tool,
            data: data.toPayload()
        });
    };

    const handleChange = (cMcda: MCDA) => {
        setIsDirty(true);
        setTool({
            ...tool,
            data: cMcda.toObject()
        });
    };

    const handleSaveMetadata = () => {
        sendCommand(
            Command.updateToolInstanceMetadata({
                id: tool.id,
                name: tool.name,
                description: tool.description,
                public: tool.public
            }),
            () => {
                setIsDirty(false);
                setIsLoading(false);
            },
            () => {
                setIsError(true);
                setIsLoading(false);
            }
        );
    };

    const handleSave = () => {
        if (id) {
            setIsLoading(true);
            sendCommand(
                Command.updateToolInstance(buildPayload(tool)),
                () => {
                    setIsDirty(false);
                    setIsLoading(false);
                },
                () => {
                    setIsError(true);
                    setIsLoading(false);
                }
            );
            return;
        }

        sendCommand(
            Command.createToolInstance(buildPayload(tool)),
            () => {
                const path = props.match.path;
                const basePath = path.split(':')[0];
                setIsLoading(false);
                props.history.push(basePath + tool.id + '/criteria');
            },
            () => setIsError(true)
        );
    };

    const handleUpdateMetaData = (cTool: IToolMetaData) => {
        setTool(cTool);
    };

    const handleClickCriteriaNavigation = (e: MouseEvent<HTMLAnchorElement>, {name}: MenuItemProps) => {
        if (name && typeof name === 'string') {
            routeTo(name);
        }
    };

    const handleClickCriteriaTool = (rid: string, name: string) => routeTo(rid, name);

    const handleClickSuitabilityTool = (name: string) => routeTo(name);

    const routeTo = (nCid: string | null = null, nTool: string | null = null) => {
        const cCid = nCid || null;
        const cTool = nTool || props.match.params.tool || null;
        const path = props.match.path;
        const basePath = path.split(':')[0];
        if (!!cCid && !!tool) {
            return props.history.push(basePath + id + '/' + property + '/' + cCid + '/' + cTool);
        }
        if (!!cCid) {
            if (property === 'cd') {
                return props.history.push(basePath + id + '/' + property + '/' + cCid + '/upload');
            }
            return props.history.push(basePath + id + '/' + property + '/' + cCid);
        }
        return props.history.push(basePath + id + '/' + property);
    };

    const handleRouteTo = (route: string) => {
        return props.history.push(route);
    };

    const renderContent = () => {
        const cCid = props.match.params.cid || null;
        const cTool = props.match.params.tool || null;

        switch (property) {
            case 'criteria':
                return (
                    <CriteriaEditor
                        toolName={cTool.name}
                        readOnly={readOnly || mcda.weightAssignmentsCollection.length > 0}
                        routeTo={handleRouteTo('/tools/t04')}
                        mcda={mcda}
                        onChange={handleChange}
                    />
                );
            case 'cm':
                if (mcda.criteriaCollection.length > 0 && (mcda.constraints && !mcda.constraints.boundingBox)) {
                    mcda.constraints.boundingBox = mcda.criteriaCollection.getBoundingBox(mcda.withAhp);
                }
                return (
                    <ConstraintsEditor
                        readOnly={readOnly}
                        mcda={mcda}
                        onChange={handleChange}
                    />
                );
            case 'wa':
                const weightAssignment = cCid ? mcda.weightAssignmentsCollection.findById(cCid) : null;
                return (
                    <WeightAssignmentEditor
                        toolName={cTool.name}
                        readOnly={readOnly}
                        mcda={mcda}
                        selectedWeightAssignment={weightAssignment}
                        onChange={handleChange}
                        routeTo={routeTo}
                    />
                );
            case 'cd':
                const criterion = cCid ? mcda.criteriaCollection.findById(cCid) : null;

                if (criterion) {
                    return (
                        <CriteriaDataEditor
                            activeTool={cTool}
                            criterion={Criterion.fromObject(criterion)}
                            onChange={handleChange}
                            mcda={mcda}
                            onClickTool={handleClickCriteriaTool}
                            readOnly={readOnly}
                        />
                    );
                }
                break;
            case 'su':
                return (
                    <SuitabilityEditor
                        activeTool={cid}
                        onChange={handleChange}
                        mcda={mcda}
                        onClickTool={handleClickSuitabilityTool}
                        readOnly={readOnly}
                    />
                );
            default:
                const path = props.match.path;
                const basePath = path.split(':')[0];
                return (
                    props.history.push(
                        basePath + id + '/criteria'
                    )
                );
        }
    };

    const generateLegend = () => {
        let legend: RainbowOrLegend | null | undefined;
        if (mcda.suitability.raster && (!cid || cid === 'weightAssignment')) {
            legend = mcda.suitability.raster.generateRainbow(heatMapColors.default, [0, 1]);
        } else {
            legend = mcda.suitability.generateLegend();
        }
        return legend || undefined;
    };

    return (
        <AppContainer navbarItems={navigation}>
            <ToolMetaData
                tool={tool}
                readOnly={readOnly}
                onChange={handleUpdateMetaData}
                onSave={handleSaveMetadata}
                defaultButton={false}
                saveButton={false}
                isDirty={isDirty}
            />
            <Grid padded={true}>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <ToolNavigation navigationItems={menuItems}/>
                        {property === 'cd' &&
                        <CriteriaNavigation
                            activeCriterion={cid}
                            mcda={mcda}
                            onClick={handleClickCriteriaNavigation}
                            handleChange={handleChange}
                            readOnly={readOnly}
                        />
                        }
                        {property === 'su' && (!cid || cid === 'weightAssignment' || cid === 'classes') &&
                        mcda.suitability && mcda.suitability.raster && mcda.suitability.raster.data.length > 0 &&
                        <Segment color="blue">
                            <p>Overview</p>
                            <CriteriaRasterMap
                                raster={mcda.suitability.raster}
                                showBasicLayer={false}
                                showButton={false}
                                showLegend={cid !== 'classes'}
                                legend={generateLegend()}
                                mapHeight="200px"
                            />
                        </Segment>
                        }
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Segment color={'grey'} loading={isLoading}>
                            <ContentToolBar
                                backButton={!!cid && property !== 'cd'}
                                onBack={routeTo}
                                onSave={handleSave}
                                isDirty={isDirty}
                                isError={isError}
                                saveButton={true}
                            />
                            <Divider/>
                            {renderContent()}
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </AppContainer>
    );
};

export default withRouter(t05);
