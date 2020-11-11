import {AppContainer} from '../../shared';
import {IRtModelling} from '../../../core/model/rtm/modelling/RTModelling.type';
import {Grid, Icon, Loader} from 'semantic-ui-react';
import {IModflowModel} from '../../../core/model/modflow/ModflowModel.type';
import {IToolInstance} from '../../dashboard/defaults/tools';
import {IToolMetaDataEdit} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import {ModflowModel} from '../../../core/model/modflow';
import {ToolMetaData} from '../../shared/simpleTools';
import {ToolNavigation} from '../../shared/complexTools';
import {fetchApiWithToken, fetchUrl, sendCommand} from '../../../services/api';
import {uniqBy} from 'lodash';
import {useHistory, useParams} from 'react-router-dom';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';
import RTModellingBoundaries from '../components/RTModellingBoundaries';
import RTModellingSetup from '../components/RTModellingSetup';
import React, {useEffect, useState} from 'react';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools',
    icon: <Icon name="file"/>
}];

const tool = 'T20';

const RealTimeModelling = () => {
    const [isDirty, setDirty] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [model, setModel] = useState<IModflowModel>();
    const [rtm, setRtm] = useState<IRtModelling>();
    const [t10Instances, setT10Instances] = useState<IToolInstance[]>([]);

    const history = useHistory();
    const {id, property} = useParams();


    useEffect(() => {
        const fetchInstances = async () => {
            try {
                setIsFetching(true);
                const privateT10Tools = (await fetchApiWithToken('tools/T10?public=false')).data;
                const publicT10Tools = (await fetchApiWithToken('tools/T10?public=true')).data;
                const tools = uniqBy(privateT10Tools.concat(publicT10Tools), (t: IToolInstance) => t.id);
                setT10Instances(tools);
            } catch (err) {
                setIsFetching(false);
            } finally {
                setIsFetching(false);
            }
        };

        fetchInstances();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (id) {
            setIsFetching(true);
            fetchUrl(`tools/${tool}/${id}`,
                (r: IRtModelling) => {
                    setRtm(r);
                    setIsFetching(false);
                    setDirty(false);
                }, () => {
                    setIsFetching(false);
                }
            );
        }
    }, [id]);

    useEffect(() => {
        if (rtm) {
            setIsFetching(true);
            fetchUrl(`modflowmodels/${rtm.data.model_id}`,
                (m: IModflowModel) => {
                    setModel(m);
                    setIsFetching(false);
                    setDirty(false);
                },
                () => {
                    setIsFetching(false);
                }
            );
        }
    }, [rtm]);

    useEffect(() => {
        if (!property && id) {
            history.push(`${id}/settings`);
        }
    }, [property]);

    const handleSaveMetaData = (tool: IToolMetaDataEdit) => {
        if (!rtm) {
            return;
        }
        const {name, description} = tool;
        const isPublic = tool.public;
        const cRtm = {...rtm, name, description, public: isPublic};
        setRtm(cRtm);
        handleSave(RTModelling.fromObject(cRtm));
    };

    const handleSave = (r: RTModelling) => {
        setIsFetching(true);
        sendCommand(
            SimpleToolsCommand.updateToolInstance(r.toObject()),
            () => {
                setIsFetching(false);
                setRtm(r.toObject());
            }
        );
    };

    if (!rtm || !model) {
        return (
            <AppContainer navbarItems={navigation} loading={isFetching}>
                <Loader active={true} inverted={true}>Loading</Loader>
            </AppContainer>
        );
    }

    const renderContent = () => {
        if (property === 'boundaries') {
            return (
                <RTModellingBoundaries
                    model={ModflowModel.fromObject(model)}
                    onChange={handleSave}
                    rtm={RTModelling.fromObject(rtm)}
                    t10Instances={t10Instances}
                />
            );
        }
        return (
            <RTModellingSetup
                model={ModflowModel.fromObject(model)}
                onChange={handleSave}
                rtm={RTModelling.fromObject(rtm)}
            />
        );
    };

    return (
        <AppContainer navbarItems={navigation}>
            <ToolMetaData
                isDirty={isDirty}
                readOnly={false}
                tool={{
                    tool: 'T20',
                    name: rtm.name,
                    description: rtm.description,
                    public: rtm.public
                }}
                onSave={handleSaveMetaData}
            />
            <Grid padded={true}>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <ToolNavigation
                            navigationItems={[
                                {
                                    header: 'Setup',
                                    items: [
                                        {
                                            name: 'Settings',
                                            property: 'settings',
                                            icon: <Icon name="map"/>
                                        },
                                        {
                                            name: 'Boundaries',
                                            property: 'boundaries',
                                            icon: <Icon name="map marker alternate"/>
                                        },
                                        {
                                            name: 'Head Observations',
                                            property: 'head_observations',
                                            icon: <Icon name="eye"/>
                                        },
                                        {
                                            name: 'Transport',
                                            property: 'transport',
                                            icon: <Icon name="cube"/>
                                        }
                                    ]
                                },
                                {
                                    header: 'Results',
                                    items: [
                                        {
                                            name: 'Flow',
                                            property: 'flow',
                                            icon: <Icon name="chart line"/>,
                                        },
                                        {
                                            name: 'Budget',
                                            property: 'budget',
                                            icon: <Icon name="chart bar outline"/>
                                        },
                                        {
                                            name: 'Concentration',
                                            property: 'concentration',
                                            icon: <Icon name="chart area"/>
                                        }
                                    ]
                                }
                            ]}
                        />
                    </Grid.Column>
                    <Grid.Column width={13}>
                        {renderContent()}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </AppContainer>
    );
};

export default RealTimeModelling;
