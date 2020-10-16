import React, {useEffect, useState} from 'react';
import {Button, Grid, Icon, Segment} from "semantic-ui-react";
import AppContainer from "../../shared/AppContainer";
import ToolMetaData from "../../shared/simpleTools/ToolMetaData";
import HeatTransportData from "../components/heatTransportData";
import {IRtm} from '../../../core/model/rtm/Rtm.type';
import {useParams, useHistory} from "react-router-dom";
import uuid from "uuid";
import {fetchUrl, sendCommand} from "../../../services/api";
import {IHeatTransportInput, IHtm} from '../../../core/model/htm/Htm.type';
import Htm from "../../../core/model/htm/Htm";
import SimpleToolsCommand from "../../shared/simpleTools/commands/SimpleToolsCommand";
import {IToolMetaDataEdit} from "../../shared/simpleTools/ToolMetaData/ToolMetaData.type";
import {createToolInstance} from "../../dashboard/commands";
import ContentToolBar from "../../shared/ContentToolbar2";
import {useDispatch} from "react-redux";
import {addMessage} from "../../t03/actions/actions";
import {messageError} from "../../t03/defaults/messages";

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools',
    icon: <Icon name="file"/>
}];

const tool = 'T19';

const HeatTransport = () => {
    const [isDirty, setDirty] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [rtm, setRtm] = useState<IRtm>();
    const [htm, setHtm] = useState<IHtm>();

    const dispatch = useDispatch();
    const history = useHistory();
    const {id, property} = useParams();

    useEffect(() => {
        if (id) {
            fetchToolInstance();
        }
        if (!id) {
            const newId = uuid.v4();
            const newInstance = Htm.fromObject({
                id: newId,
                name: 'New Heat Transport Model',
                data: {
                    input: [] as IHeatTransportInput[],
                    options: {
                        retardation_factor: 1.8,
                        sw_monitoring_id: 'TEGsee-mikrosieb',
                        gw_monitoring_id: 'TEG343',
                        limits: [100, 500],
                        tolerance: 0.001,
                        debug: false
                    }
                },
                description: '',
                permissions: 'rwx',
                public: true,
                tool: 'T19'
            }).toObject();
            sendCommand(createToolInstance('T19', newInstance),
                () => history.push('/tools/T19/' + newInstance.id),
                () => console.log('ERROR')
            );
        }
    }, [id]);

    const fetchToolInstance = () => {
        setIsFetching(true);
        fetchUrl(`tools/${tool}/${id}`,
            (m: IHtm) => {
                dispatch(addMessage(messageError('/', 'TEST')));
                setHtm(m);
                setIsFetching(false);
                setDirty(false);
            },
            (e) => {
                dispatch(addMessage(messageError('/', e)));
                setIsFetching(false);
            }
        );
    };

    const handleSaveMetaData = (tool: IToolMetaDataEdit) => {
        const {name, description} = tool;
        const isPublic = tool.public;

        if (htm) {
            const cHtm = Htm.fromObject(htm);
            cHtm.name = name;
            cHtm.description = description;
            cHtm.public = isPublic;
            handleSave(cHtm);
        }
    };

    const handleSave = (h?: Htm) => {
        if (!h) {
            if (!htm) {
                return null;
            }
            h = Htm.fromObject(htm);
        }
        sendCommand(
            SimpleToolsCommand.updateToolInstance(h.toObject()),
            () => setDirty(false)
        );
    };

    return (
        <AppContainer navbarItems={navigation}>
            {htm &&
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
            }
            <Grid padded={true}>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <HeatTransportData/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </AppContainer>
    );
};

export default HeatTransport;
