import React, {useState} from 'react';
import {Grid, Icon} from "semantic-ui-react";
import {IProps} from "../../t10/containers/RTM";
import AppContainer from "../../shared/AppContainer";
import ToolMetaData from "../../shared/simpleTools/ToolMetaData";
import HeatTransportData from "../components/heatTransport";
import {Rtm} from "../../../core/model/rtm";
import {IRtm} from '../../../core/model/rtm/Rtm.type';
import {IToolMetaData} from "../../shared/simpleTools/ToolMetaData/ToolMetaData.type";

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools',
    icon: <Icon name="file"/>
}];

const tool = 'T19';

const HeatTransport = (props: IProps) => {
    const [isDirty, setDirty] = useState<boolean>(false);
    const [rtm, setRtm] = useState<IRtm>();
    const [tool, setTool] = useState<IToolMetaData>();

    const handleSaveMetaData = () => {
        return null;
    };

    return (
        <AppContainer navbarItems={navigation}>
            {tool &&
            <ToolMetaData
                isDirty={isDirty}
                readOnly={false}
                tool={{
                    tool: 'T19',
                    name: tool.name,
                    description: tool.description,
                    public: tool.public
                }}
                onSave={handleSaveMetaData}
            />
            }
            <Grid>
                <Grid.Row>
                    <Grid.Column width={5}>

                    </Grid.Column>
                    <Grid.Column width={11}>
                        {rtm &&
                        <HeatTransportData rtm={Rtm.fromObject(rtm)}/>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </AppContainer>
    );
}