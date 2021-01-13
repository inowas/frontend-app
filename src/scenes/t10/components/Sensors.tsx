import {AddSensor, SensorList} from './index';
import {Grid, Segment} from 'semantic-ui-react';
import {Rtm, Sensor} from '../../../core/model/rtm/monitoring';
import ContentToolBar from '../../shared/ContentToolbar';
import React, {ReactFragment, useEffect, useState} from 'react';

export interface IProps {
    rtm: Rtm;
    isDirty: boolean;
    isError: boolean;
    onChange: (rtm: Rtm) => void;
    onChangeSelectedSensorId: (id: string) => void;
    onSave: (rtm: Rtm) => void;
    children: ReactFragment;
}

const Sensors = (props: IProps) => {

    const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
    const [addSensor, setAddSensor] = useState<boolean>(false);

    useEffect(() => {
        setAddSensor(false);
    }, [selectedSensorId]);

    useEffect(() => {
            if (selectedSensorId === null && props.rtm.sensors.length > 0) {
                return setSelectedSensorId(props.rtm.sensors.first.id);
            }

            if (!props.rtm.sensors.findById(selectedSensorId as string) && props.rtm.sensors.length > 0) {
                return setSelectedSensorId(props.rtm.sensors.first.id);
            }

            if (props.rtm.sensors.length === 0) {
                return setSelectedSensorId(null);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.rtm.sensors]
    );

    useEffect(() => {
        if (selectedSensorId) {
            props.onChangeSelectedSensorId(selectedSensorId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setSelectedSensorId(sensor.id);
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

        if (rtm.sensors.length === 0) {
            setSelectedSensorId(null);
            return;
        }

        setSelectedSensorId(rtm.sensors.first.id);
    };

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
                                        buttonSave={!props.rtm.readOnly}
                                        buttonImport={false}
                                    />
                                    {props.children}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            {addSensor &&
            <AddSensor
                rtm={props.rtm}
                onCancel={onCancelAddNewSensor}
                onAdd={handleAddSensor}
            />}
        </Segment>
    );
};

export default Sensors;
