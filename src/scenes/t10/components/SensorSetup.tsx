import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import {Grid, Segment} from 'semantic-ui-react';
import {Rtm, Sensor} from '../../../core/model/rtm';
import ContentToolBar from '../../shared/ContentToolbar';
import {IProps as BaseIProps} from '../containers/RTM';
import {SensorList, SensorSetupDetails, SensorSetupDetailsCreateNew} from './index';

interface IProps extends BaseIProps {
    rtm: Rtm;
    isDirty: boolean;
    isError: boolean;
    onChange: (rtm: Rtm) => void;
    onSave: (rtm: Rtm) => void;
}

const sensorSetup = (props: IProps) => {

    const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
    const [addSensor, setAddSensor] = useState<boolean>(false);

    useEffect(() => {
        setAddSensor(false);
    }, [selectedSensorId]);

    const onAddNewSensor = () => {
        setAddSensor(true);
    };

    const onCancelAddNewSensor = () => {
        setAddSensor(false);
    };

    const handleAddSensor = (sensor: Sensor) => {
        const rtm = Rtm.fromObject(props.rtm.toObject());
        rtm.addSensor(sensor);
        props.onChange(rtm);
        props.onSave(rtm);
        setAddSensor(false);
    };

    const handleCloneSensor = (id: string) => {
        const rtm = Rtm.fromObject(props.rtm.toObject());
        rtm.cloneSensor(id);
        props.onChange(rtm);
    };

    const handleRemoveSensor = (id: string) => {
        const rtm = Rtm.fromObject(props.rtm.toObject());
        rtm.removeSensor(id);
        props.onChange(rtm);
        props.onSave(rtm);
    };

    const handleUpdateSensor = (sensor: Sensor) => {
        const rtm = Rtm.fromObject(props.rtm.toObject());
        rtm.updateSensor(sensor);
        return props.onChange(rtm);
    };

    const renderDetails = () => {
        if (!selectedSensorId) {
            return <h1>Please Select or add a Sensor</h1>;
        }

        const sensor = props.rtm.findSensor(selectedSensorId);

        if (!(sensor instanceof Sensor)) {
            return <h1>Error selecting a sensor</h1>;
        }

        return (
            <SensorSetupDetails
                rtm={props.rtm}
                sensor={sensor}
                onChange={handleUpdateSensor}
            />
        );
    };

    if (!props.rtm) {
        return null;
    }

    if (addSensor) {
        return (
            <SensorSetupDetailsCreateNew
                rtm={props.rtm}
                onCancel={onCancelAddNewSensor}
                onAdd={handleAddSensor}
            />
        );
    }

    return (
        <Segment color={'grey'}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <SensorList
                            sensors={props.rtm.sensors.all}
                            selectedSensor={selectedSensorId}
                            onChangeSelectedSensor={setSelectedSensorId}
                            onAdd={onAddNewSensor}
                            onClone={handleCloneSensor}
                            onRemove={handleRemoveSensor}
                            readOnly={props.rtm.readOnly}
                        />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <ContentToolBar
                                        onSave={props.onSave}
                                        isDirty={props.isDirty}
                                        isError={props.isError}
                                        saveButton={!props.rtm.readOnly}
                                        importButton={false}
                                    />
                                    {renderDetails()}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

export default withRouter<IProps>(sensorSetup);
