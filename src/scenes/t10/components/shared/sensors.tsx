import { Grid, Segment } from 'semantic-ui-react';
import { ReactNode, useState } from 'react';
import { Rtm, Sensor } from '../../../../core/model/rtm/monitoring';
import AddSensor from '../setup/addSensor';
import SensorsList from './sensorsList';

export interface IProps {
  rtm: Rtm;
  isDirty: boolean;
  isError: boolean;
  onChangeSelectedSensor: (sensor: Sensor | null) => void;
  onSave: (rtm: Rtm) => void;
  children: ReactNode;
  selectedSensor: Sensor | null;
}

const Sensors = (props: IProps) => {
  const [addSensor, setAddSensor] = useState<boolean>(false);

  const onAddNewSensor = () => {
    setAddSensor(true);
  };

  const onCancelAddNewSensor = () => {
    setAddSensor(false);
  };

  const handleAddSensor = (sensor: Sensor) => {
    const rtm = Rtm.fromObject(props.rtm.toObject());
    rtm.addSensor(sensor);
    props.onSave(rtm);
    setAddSensor(false);
    props.onChangeSelectedSensor(sensor);
  };

  const handleCloneSensor = (id: string) => {
    const rtm = Rtm.fromObject(props.rtm.toObject());
    rtm.cloneSensor(id);
    props.onSave(rtm);
  };

  const handleRemoveSensor = (id: string) => {
    const rtm = Rtm.fromObject(props.rtm.toObject());
    rtm.removeSensor(id);
    props.onSave(rtm);

    if (rtm.sensors.length === 0) {
      props.onChangeSelectedSensor(null);
      return;
    }

    props.onChangeSelectedSensor(rtm.sensors.first);
  };

  return (
    <Segment color={'grey'}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <SensorsList
              sensors={props.rtm.sensors.all}
              selectedSensor={props.selectedSensor}
              onChangeSelectedSensor={props.onChangeSelectedSensor}
              onAdd={onAddNewSensor}
              onClone={handleCloneSensor}
              onRemove={handleRemoveSensor}
              readOnly={props.rtm.readOnly}
            />
          </Grid.Column>
          <Grid.Column width={12}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>{props.children}</Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {addSensor && <AddSensor rtm={props.rtm} onCancel={onCancelAddNewSensor} onAdd={handleAddSensor} />}
    </Segment>
  );
};

export default Sensors;
