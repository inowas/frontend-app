import React, {useEffect, useState} from 'react';
import {Redirect, RouteComponentProps, withRouter} from 'react-router-dom';
import {Grid, Icon, Message} from 'semantic-ui-react';
import {Rtm, Sensor} from '../../../core/model/rtm';
import {IRtm} from '../../../core/model/rtm/Rtm.type';
import {ISensorParameter} from '../../../core/model/rtm/Sensor.type';
import {fetchUrl, sendCommand} from '../../../services/api';
import AppContainer from '../../shared/AppContainer';
import ToolNavigation from '../../shared/complexTools/toolNavigation';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import {IToolMetaDataEdit} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import {HeatTransport} from '../components/heatTransport';
import {DataSources, Processing, SensorMetaData, Sensors, Visualization} from '../components/index';

export interface IProps extends RouteComponentProps<{ id: string, property: string, pid: string }> {
}

const menuItems = [
    {
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
    },
    {
        header: 'Computation',
        items: [
            {
                name: 'Heat Transport',
                property: 'heat-transport',
                icon: <Icon name="thermometer half"/>
            }
        ]
    }
];

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
    const [selectedParameterId, setSelectedParameterId] = useState<string | null>(null);
    const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

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

    const handleUpdateSensor = (sensor: Sensor) => {
        if (!rtm) {
            return;
        }

        const lRtm = Rtm.fromObject(rtm);
        lRtm.updateSensor(sensor);
        setRtm(lRtm.toObject());
        onSave(lRtm);
    };

    const handleUpdateParameter = (parameter: ISensorParameter) => {
        if (!rtm) {
            return;
        }

        if (!selectedSensorId) {
            return;
        }

        const sensor = Rtm.fromObject(rtm).sensors.findById(selectedSensorId);

        if (!sensor) {
            return;
        }

        sensor.parameters = sensor.parameters.update(parameter, false);

        const lRtm = Rtm.fromObject(rtm);
        lRtm.updateSensor(sensor);
        setRtm(lRtm.toObject());
        onSave(lRtm);
    };

    const onchangeMetaData = (metaData: IToolMetaDataEdit) => {
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
            SimpleToolsCommand.updateToolInstance(r.toObjectWithoutData()),
            () => setDirty(false)
        );
    };

    const renderContent = (property: string) => {
        if (!rtm) {
            return null;
        }

        const sensor = selectedSensorId ? Rtm.fromObject(rtm).sensors.findById(selectedSensorId) : null;
        let parameter = null;
        if (sensor && selectedParameterId) {
            parameter = sensor.parameters.findById(selectedParameterId);
        }

        if (property === 'sensor-visualization') {
            return (
                <Visualization
                    rtm={Rtm.fromObject(rtm)}
                />
            );
        }

        if (property === 'heat-transport') {
            return (
                <HeatTransport
                    rtm={Rtm.fromObject(rtm)}
                />
            );
        }

        if (!['sensor-parameters', 'sensor-setup', 'sensor-processing'].includes(property)) {
            const path = props.match.path;
            const basePath = path.split(':')[0];
            return (
                <Redirect
                    to={basePath + props.match.params.id + '/sensor-setup' + props.location.search}
                />
            );
        }

        return (
            <Sensors
                rtm={Rtm.fromObject(rtm)}
                isDirty={isDirty}
                isError={isError}
                onChange={onchange}
                onChangeSelectedSensorId={setSelectedSensorId}
                onSave={onSave}
            >
                <SensorMetaData
                    rtm={Rtm.fromObject(rtm)}
                    sensor={sensor}
                    onChange={handleUpdateSensor}
                    onChangeSelectedParameterId={setSelectedParameterId}
                />
                {parameter && property === 'sensor-processing' &&
                <Processing
                    rtm={Rtm.fromObject(rtm)}
                    parameter={parameter}
                    onChange={handleUpdateParameter}
                />
                }
                {parameter && property === 'sensor-setup' &&
                <DataSources
                    rtm={Rtm.fromObject(rtm)}
                    parameter={parameter}
                    onChange={handleUpdateParameter}
                />
                }
            </Sensors>
        );
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
