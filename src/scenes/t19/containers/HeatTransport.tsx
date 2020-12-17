import {AppContainer} from '../../shared';
import {Grid, Icon, Loader, Message} from 'semantic-ui-react';
import {HeatTransportController} from '../components';
import {IHtm} from '../../../core/model/htm/Htm.type';
import {IRootReducer} from '../../../reducers';
import {IToolInstance} from '../../types';
import {IToolMetaDataEdit} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import {ToolMetaData} from '../../shared/simpleTools';
import {clear, updateHtm, updateT10Instances} from '../actions/actions';
import {createToolInstance} from '../../dashboard/commands';
import {fetchApiWithToken, fetchUrl, sendCommand} from '../../../services/api';
import {uniqBy} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';
import Htm from '../../../core/model/htm/Htm';
import React, {useEffect, useState} from 'react';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';
import uuid from 'uuid';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools',
    icon: <Icon name="file"/>
}];

const tool = 'T19';

interface IError {
    id: string;
    message: string;
}

const HeatTransport = () => {
    const [errors, setErrors] = useState<IError[]>([]);
    const [isDirty, setDirty] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const dispatch = useDispatch();
    const history = useHistory();
    const {id} = useParams();

    const T19 = useSelector((state: IRootReducer) => state.T19);
    const htm = T19.htm ? Htm.fromObject(T19.htm) : null;

    useEffect(() => {
        const fetchInstances = async () => {
            try {
                setIsFetching(true);
                const privateT10Tools = (await fetchApiWithToken('tools/T10?public=false')).data;
                const publicT10Tools = (await fetchApiWithToken('tools/T10?public=true')).data;

                // Lets show an ordered List with the private projects first
                const tools = uniqBy(privateT10Tools.concat(publicT10Tools), (t: IToolInstance) => t.id);
                dispatch(updateT10Instances(tools));
            } catch (err) {
                setErrors([{id: uuid.v4(), message: 'Fetching t10 instances failed.'}]);
            } finally {
                setIsFetching(false);
            }
        };

        fetchInstances();

        return function() {
            dispatch(clear());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (id) {
            setIsFetching(true);
            fetchUrl(`tools/${tool}/${id}`,
                (m: IHtm) => {
                    dispatch(updateHtm(Htm.fromObject(m)));
                    setIsFetching(false);
                    setDirty(false);
                },
                () => {
                    setIsFetching(false);
                }
            );
            return;
        }

        if (!id) {
            const newInstance = Htm.fromDefaults();
            sendCommand(createToolInstance(newInstance.tool, newInstance.toObject()),
                () => history.push(`/tools/${newInstance.tool}/${newInstance.id}`),
                (e) => setErrors([{id: uuid.v4(), message: `Creating new instance failed: ${e}`}])
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleSaveMetaData = (tool: IToolMetaDataEdit) => {
        if (!htm) {
            return;
        }
        const {name, description} = tool;
        const cHtm = htm.toObject();
        cHtm.public = tool.public;
        cHtm.name = name;
        cHtm.description = description;
        handleSave(Htm.fromObject(cHtm));
    };

    const handleSave = (h: Htm) => {
        setIsFetching(true);
        sendCommand(
            SimpleToolsCommand.updateToolInstance(h.toObject()),
            () => {
                dispatch(updateHtm(h));
                setIsFetching(false);
            }
        );
    };

    if (!htm) {
        return (
            <AppContainer navbarItems={navigation} loading={isFetching}>
                <Loader inverted={true}>Loading</Loader>
            </AppContainer>
        );
    }

    const handleDismissError = (id: string) => () => setErrors(errors.filter((e) => e.id !== id));

    return (
        <AppContainer navbarItems={navigation}>
            <ToolMetaData
                isDirty={isDirty}
                readOnly={false}
                tool={{
                    tool: 'T19',
                    name: htm.name,
                    description: htm.description,
                    public: htm.public
                }}
                onSave={handleSaveMetaData}
            />
            <Grid padded={true}>
                <Grid.Row>
                    <Grid.Column width={16}>
                        {errors.map((error, key) => (
                            <Message key={key} negative={true} onDismiss={handleDismissError(error.id)}>
                                <Message.Header>Error</Message.Header>
                                <p>{error.message}</p>
                            </Message>
                        ))}
                        <HeatTransportController/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </AppContainer>
    );
};

export default HeatTransport;
