import {AppContainer} from '../../shared';
import {Grid, Icon, Loader} from 'semantic-ui-react';
import {HeatTransportController} from '../components';
import {IHtm} from '../../../core/model/htm/Htm.type';
import {IToolMetaDataEdit} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import {ToolMetaData} from '../../shared/simpleTools';
import {createToolInstance} from '../../dashboard/commands';
import {fetchUrl, sendCommand} from '../../../services/api';
import {useHistory, useParams} from 'react-router-dom';
import Htm from '../../../core/model/htm/Htm';
import React, {useEffect, useState} from 'react';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools',
    icon: <Icon name="file"/>
}];

const tool = 'T19';

const HeatTransport = () => {
    const [isDirty, setDirty] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [htm, setHtm] = useState<IHtm>();

    const history = useHistory();
    const {id} = useParams();

    useEffect(() => {
        if (id) {
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
            return;
        }

        if (!id) {
            const newInstance = Htm.fromDefaults();
            sendCommand(createToolInstance(newInstance.tool, newInstance.toObject()),
                () => history.push(`/tools/${newInstance.tool}/${newInstance.id}`),
                () => console.log('ERROR')
            );
        }
    }, [history, id]);

    const handleSaveMetaData = (tool: IToolMetaDataEdit) => {
        if (!htm) {
            return;
        }
        const {name, description} = tool;
        const isPublic = tool.public;
        setHtm({...htm, name, description, public: isPublic});
        handleSave(htm);
    };

    const handleChange = (h: Htm) => {
        setHtm(h.toObject());
    };

    const handleSave = (htm: IHtm) => {
        setIsFetching(true);
        sendCommand(
            SimpleToolsCommand.updateToolInstance(htm),
            () => setIsFetching(false)
        );
    };

    if (!htm) {
        return (
            <AppContainer navbarItems={navigation} loading={isFetching}>
                <Loader inverted={true}>Loading</Loader>
            </AppContainer>
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
                            key={htm.id}
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
