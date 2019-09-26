import React, {useEffect, useState} from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router-dom';

import {Grid, Icon, Message} from 'semantic-ui-react';
import {Rtm} from '../../../core/model/rtm';
import {IRtm} from '../../../core/model/rtm/Rtm.type';
import {IMetaData} from '../../../core/model/types';
import {fetchUrl, sendCommand} from '../../../services/api';
import AppContainer from '../../shared/AppContainer';
import ToolNavigation from '../../shared/complexTools/toolNavigation';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import {SensorProcessing, SensorSetup} from '../components/index';

export interface IProps extends RouteComponentProps<{ id: string, property: string, pid: string }> {
}

const menuItems = [{
    header: 'Sensors',
    items: [
        {
            name: 'Setup',
            property: 'sensor-setup',
            icon: <Icon name="calendar alternate outline"/>
        },
        {
            name: 'Processing',
            property: 'sensor-processing',
            icon: <Icon name="cube"/>
        },
        {
            name: 'Visualization',
            property: 'sensor-visualization',
            icon: <Icon name="expand"/>
        }
    ]
}];

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools',
    icon: <Icon name="file"/>
}];

const tool = 'T10';

const RTM = (props: IProps) => {

    const {id} = props.match.params;

    const [isDirty, setDirty] = useState<boolean>(false);
    const [isError, setError] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);
    const [rtm, setRtm] = useState<IRtm | null>(null);

    useEffect(() => {
        setFetching(true);
        fetchUrl(`tools/${tool}/${id}`,
            (m: IRtm) => {
                setRtm(m);
                setFetching(false);
                setDirty(false);
            },
            () => {
                setFetching(false);
                setError(false);
            }
        );
    }, []);

    useEffect(() => {
        setDirty(true);
    }, [rtm]);

    const onchangeMetaData = (metaData: IMetaData) => {
        if (rtm) {
            setRtm({
                    ...rtm,
                    name: metaData.name, description: metaData.description, public: metaData.public
                }
            );
        }
    };

    const onchange = (r: Rtm) => {
        return setRtm(r.toObject());
    };

    const onSave = (r: Rtm | any) => {
        if (!(r instanceof Rtm) && rtm) {
            r = Rtm.fromObject(rtm);
        }

        sendCommand(
            SimpleToolsCommand.updateToolInstance(r.toObject()),
            () => setDirty(false)
        );
    };

    const renderContent = (property: string) => {
        if (!rtm) {
            return null;
        }

        switch (property) {
            case 'sensor-setup':
                return (
                    <SensorSetup
                        rtm={Rtm.fromObject(rtm)}
                        isDirty={isDirty}
                        isError={isError}
                        onChange={onchange}
                        onSave={onSave}
                    />
                );
            case 'sensor-processing':
                return (
                    <SensorProcessing
                        rtm={Rtm.fromObject(rtm)}
                        isDirty={isDirty}
                        isError={isError}
                        onChange={onchange}
                        onSave={onSave}
                    />
                );

            case 'sensor-visualization':
                return <h1>sensor-visualization</h1>;
            default:
                const path = props.match.path;
                const basePath = path.split(':')[0];
                return (
                    <Redirect
                        to={basePath + props.match.params.id + '/sensor-setup' + props.location.search}
                    />
                );
        }
    };

    if (fetching) {
        return (
            <AppContainer navbarItems={navigation}>
                <Message icon={true}>
                    <Icon name={'circle notched'} loading={true}/>
                </Message>
            </AppContainer>
        );
    }

    if (isError || !rtm) {
        return (
            <AppContainer navbarItems={navigation}>
                <Message icon={true}>
                    ERROR!
                </Message>
            </AppContainer>
        );
    }

    return (
        <AppContainer navbarItems={navigation}>
            <ToolMetaData
                isDirty={isDirty}
                onChange={onchangeMetaData}
                readOnly={false}
                tool={{
                    tool: 'T10',
                    name: rtm.name,
                    description: rtm.description,
                    public: rtm.public
                }}
                defaultButton={false}
                saveButton={false}
                onSave={onSave}
            />
            <Grid padded={true}>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <ToolNavigation navigationItems={menuItems}/>
                    </Grid.Column>
                    <Grid.Column width={13}>
                        {renderContent(props.match.params.property)}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </AppContainer>
    );
};

export default withRouter<IProps>(RTM);
