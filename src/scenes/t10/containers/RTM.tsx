import {DataSources, Processing, SensorMetaData, Sensors, Visualization} from '../components/index';
import {Grid, Icon, Message} from 'semantic-ui-react';
import {IRtm} from '../../../core/model/rtm/monitoring/Rtm.type';
import {ISensorParameter} from '../../../core/model/rtm/monitoring/Sensor.type';
import {IToolMetaDataEdit} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import {Redirect, useLocation, useParams, useRouteMatch} from 'react-router-dom';
import {Rtm, Sensor} from '../../../core/model/rtm/monitoring';
import {fetchUrl, sendCommand} from '../../../services/api';
import AppContainer from '../../shared/AppContainer';
import React, {useEffect, useState} from 'react';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';
import ToolMetaData from '../../shared/simpleTools/ToolMetaData';
import ToolNavigation from '../../shared/complexTools/toolNavigation';

interface IRouterProps {
    id: string;
    property: string;
    type?: string;
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
    }
];

const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.com/tools',
    icon: <Icon name="file"/>
}];

const tool = 'T10';

const RTM = () => {

    const params: IRouterProps = useParams();

    const {id} = params;
    const match = useRouteMatch();
    const location = useLocation();

    const [isDirty, setDirty] = useState<boolean>(false);
    const [isError, setError] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);
    const [rtm, setRtm] = useState<IRtm | null>(null);
    const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
    const [selectedParameterId, setSelectedParameterId] = useState<string | null>(null);

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
    }, [id]);

    useEffect(() => {
        setDirty(true);
    }, [rtm]);

    useEffect(() => {
        if (rtm === null || selectedSensorId === null) {
            return setSelectedParameterId(null);
        }

        const sensor = Rtm.fromObject(rtm).sensors.findById(selectedSensorId);
        if (sensor === null) {
            return setSelectedParameterId(null);
        }

        if (sensor.parameters.length === 0) {
            return setSelectedParameterId(null);
        }

        setSelectedParameterId(sensor.parameters.first.id);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSensorId]);

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

    const handleSaveMetaData = (metaData: IToolMetaDataEdit) => {
        if (rtm) {
            const cRtm = Rtm.fromObject({
                ...rtm,
                name: metaData.name, description: metaData.description, public: metaData.public
            });
            setRtm(cRtm.toObject());
            onSave(cRtm);
        }
    };

    const onchange = (r: Rtm) => {
        setSelectedParameterId(null);
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

        if (sensor && !selectedParameterId) {
            if (sensor.parameters.length > 0) {
                parameter = sensor.parameters.first;
                setSelectedParameterId(parameter.id);
            }
        }

        if (property === 'sensor-visualization') {
            return (
                <Visualization
                    rtm={Rtm.fromObject(rtm)}
                />
            );
        }

        if (!['sensor-parameters', 'sensor-setup', 'sensor-processing'].includes(property)) {
            const path = match.path;
            const basePath = path.split(':')[0];
            return (
                <Redirect
                    to={basePath + params.id + '/sensor-setup' + location.search}
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
                    selectedParameterId={selectedParameterId}
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
                readOnly={false}
                tool={{
                    tool: 'T10',
                    name: rtm.name,
                    description: rtm.description,
                    public: rtm.public
                }}
                onSave={handleSaveMetaData}
            />
            <Grid padded={true}>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <ToolNavigation navigationItems={menuItems}/>
                    </Grid.Column>
                    <Grid.Column width={13}>
                        {renderContent(params.property)}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </AppContainer>
    );
};

export default RTM;
