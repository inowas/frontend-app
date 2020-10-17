import React, {useEffect, useState} from 'react';
import {Dimmer, Grid, Icon, Loader} from "semantic-ui-react";
import AppContainer from "../../shared/AppContainer";
import ToolMetaData from "../../shared/simpleTools/ToolMetaData";
import HeatTransportController from "../components/heatTransportController";
import {useParams, useHistory} from "react-router-dom";
import {fetchUrl, sendCommand} from "../../../services/api";
import {IHtm} from '../../../core/model/htm/Htm.type';
import Htm from "../../../core/model/htm/Htm";
import SimpleToolsCommand from "../../shared/simpleTools/commands/SimpleToolsCommand";
import {IToolMetaDataEdit} from "../../shared/simpleTools/ToolMetaData/ToolMetaData.type";
import {createToolInstance} from "../../dashboard/commands";

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools',
    icon: <Icon name="file"/>
}];

const tool = 'T19';

const HeatTransport = () => {
    const [isDirty, setDirty] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [htm, setHtm] = useState<IHtm>();

    const history = useHistory();
    const {id} = useParams();

    useEffect(() => {
        if (id) {
            fetchToolInstance();
        }
        if (!id) {
            const newInstance = Htm.fromDefaults();
            sendCommand(createToolInstance('T19', newInstance.toObject()),
                () => history.push('/tools/T19/' + newInstance.id),
                () => console.log('ERROR')
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchToolInstance = () => {
        setIsFetching(true);
        fetchUrl(`tools/${tool}/${id}`,
            (m: IHtm) => {
                setHtm(m);
                setIsFetching(false);
                setDirty(false);
            },
            () => {
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

    const handleChange = (h: Htm) => {
        setHtm(h.toObject());
    };

    const handleSave = (h?: Htm) => {
        setIsFetching(true);
        if (!h) {
            if (!htm) {
                return null;
            }
            h = Htm.fromObject(htm);
        }
        sendCommand(
            SimpleToolsCommand.updateToolInstance(h.toObject()),
            () => {
                if (h) {
                    setHtm(h.toObject());
                    setIsFetching(false);
                }
            }
        );
    };

    if (!htm || isFetching) {
        return (
            <Dimmer active={true} inverted={true}>
                <Loader inverted={true}>Loading</Loader>
            </Dimmer>
        );
    }

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
                        <HeatTransportController
                            htm={Htm.fromObject(htm)}
                            onChange={handleChange}
                            onSave={handleSave}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </AppContainer>
    );
};

export default HeatTransport;
