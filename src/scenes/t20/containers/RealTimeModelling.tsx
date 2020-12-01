import {AppContainer} from '../../shared';
import {Grid, Icon, Loader} from 'semantic-ui-react';
import { IRootReducer } from '../../../reducers';
import {IRtModelling} from '../../../core/model/rtm/modelling/RTModelling.type';
import {IToolInstance} from '../../dashboard/defaults/tools';
import {IToolMetaDataEdit} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import {ModflowModel} from '../../../core/model/modflow';
import {ToolMetaData} from '../../shared/simpleTools';
import {ToolNavigation} from '../../shared/complexTools';
import {clear, updateModel, updateRTModelling, updateT10Instances} from '../actions/actions';
import {fetchApiWithToken, sendCommand} from '../../../services/api';
import {uniqBy} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';
import RTModellingBoundaries from '../components/RTModellingBoundaries';
import RTModellingSetup from '../components/RTModellingSetup';
import React, {useEffect, useState} from 'react';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';
import uuid from 'uuid';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools',
    icon: <Icon name="file"/>
}];

const tool = 'T20';

interface IError {
    id: string;
    message: string;
}

const RealTimeModelling = () => {
    const [errors, setErrors] = useState<IError[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const dispatch = useDispatch();
    const history = useHistory();
    const {id, property} = useParams();

    const T20 = useSelector((state: IRootReducer) => state.T20);
    const model = T20.model ? ModflowModel.fromObject(T20.model) : null;
    const rtm = T20.rtmodelling ? RTModelling.fromObject(T20.rtmodelling) : null;

    const fetchInstances = async () => {
        try {
            setIsFetching(true);
            const privateT10Tools = (await fetchApiWithToken('tools/T10?public=false')).data;
            const publicT10Tools = (await fetchApiWithToken('tools/T10?public=true')).data;
            const tools = uniqBy(privateT10Tools.concat(publicT10Tools), (t: IToolInstance) => t.id);
            dispatch(updateT10Instances(tools));
        } catch (err) {
            setErrors(errors.concat([{id: uuid.v4(), message: 'Fetching t10 instances failed.'}]));
        } finally {
            setIsFetching(false);
        }
    };

    const fetchModflowModel = async (r: IRtModelling) => {
        try {
            const m = (await fetchApiWithToken(`modflowmodels/${r.data.model_id}`)).data
            dispatch(updateModel(ModflowModel.fromObject(m)));
        } catch (err) {
            setErrors(errors.concat([{id: uuid.v4(), message: 'Fetching Modflow model failed.'}]));
        }
    };

    const fetchRTModelling = async (i: string) => {
        try {
            const r = (await fetchApiWithToken(`tools/${tool}/${i}`)).data
            dispatch(updateRTModelling(RTModelling.fromObject(r)));
            fetchModflowModel(r);
        } catch (err) {
            setErrors(errors.concat([{id: uuid.v4(), message: 'Fetching Modflow model failed.'}]));
        }
    };

    useEffect(() => {
        fetchInstances();

        return function() {
            dispatch(clear());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (id) {
            setIsFetching(true);
            fetchRTModelling(id).then(() => setIsFetching(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (!property && id) {
            history.push(`${id}/settings`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [property]);

    const handleSaveMetaData = (tool: IToolMetaDataEdit) => {
        if (!rtm) {
            return;
        }
        const {name, description} = tool;
        const isPublic = tool.public;
        const cRtm: IRtModelling = {...rtm.toObject(), name, description, public: isPublic};
        dispatch(updateRTModelling(RTModelling.fromObject(cRtm)));
    };

    const handleSave = (r: RTModelling) => {
        setIsFetching(true);
        sendCommand(
            SimpleToolsCommand.updateToolInstance(r.toObject()),
            () => {
                setIsFetching(false);
                dispatch(updateRTModelling(r));
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
                    onChange={handleSave}
                />
            );
        }
        return (
            <RTModellingSetup
                onChange={handleSave}
            />
        );
    };

    return (
        <AppContainer navbarItems={navigation}>
            <ToolMetaData
                isDirty={false}
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
