import { Button, Grid, Modal } from 'semantic-ui-react';
import { IDateTimeValue } from '../../../core/model/rtm/monitoring/Sensor.type';
import { ITimeSeries } from './visualization.type';
import { useState } from 'react';
import TimeSeriesForm from './timeSeriesForm';

interface IProps {
  data: IDateTimeValue[];
  simData?: IDateTimeValue[];
}

const TimeSeriesModal = (props: IProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleChangeSettings = (settings: ITimeSeries) => {
    // TODO: Send Request
    console.log({
      settings,
      data: props.data,
      simData: props.simData,
    });
  };

  return (
    <Modal
      onClose={() => setShowModal(false)}
      onOpen={() => setShowModal(true)}
      open={showModal}
      trigger={<Button>Export Graphic</Button>}
    >
      <Modal.Header>Export Graphic</Modal.Header>
      <Modal.Content>
        <Grid>
          <Grid.Column width={8}>
            <TimeSeriesForm onChange={handleChangeSettings} simData={props.simData !== undefined} />
          </Grid.Column>
          <Grid.Column width={8}></Grid.Column>
        </Grid>
      </Modal.Content>
    </Modal>
  );
};

export default TimeSeriesModal;
