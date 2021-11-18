import {
  Boundary,
  BoundaryFactory,
  HeadObservationWell,
  WellBoundary,
} from '../../../../../core/model/modflow/boundaries';
import { Button, DropdownProps, Form, Icon, Message, Modal, Segment } from 'semantic-ui-react';
import { DataSourceCollection, Rtm } from '../../../../../core/model/rtm/monitoring';
import { IDateTimeValue, ISensor, ISensorParameter } from '../../../../../core/model/rtm/monitoring/Sensor.type';
import { IRtm } from '../../../../../core/model/rtm/monitoring/Rtm.type';
import { IToolInstance } from '../../../../types';
import { IValueProperty } from '../../../../../core/model/modflow/boundaries/Boundary.type';
import { ProcessingCollection } from '../../../../../core/model/rtm/processing';
import { Stressperiods } from '../../../../../core/model/modflow';
import { SyntheticEvent, useEffect, useState } from 'react';
import { fetchApiWithToken } from '../../../../../services/api';
import { uniqBy } from 'lodash';
import BoundaryDateTimeValuesPreviewChart from './boundaryDateTimeValuesPreviewChart';
import DatePicker, { IDatePickerProps } from '../../../../shared/uiComponents/DatePicker';
import moment from 'moment';
import uuid from 'uuid';

interface IProps {
  boundary: Boundary;
  onChange: (b: Boundary) => any;
  selectedOP?: string;
  stressPeriods: Stressperiods;
}

const BoundaryDateTimeImporter = (props: IProps) => {
  const [data, setData] = useState<IDateTimeValue[] | null>(null);
  const [domain, setDomain] = useState<[number, number]>();
  const [errors, setErrors] = useState<Array<{ id: string; message: string }>>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [parameter, setParameter] = useState<IValueProperty>(props.boundary.valueProperties[0]);
  const [showModal, setShowModal] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<IRtm | null>(null);
  const [selectedParameter, setSelectedParameter] = useState<ISensorParameter | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<ISensor | null>(null);
  const [t10Instances, setT10Instances] = useState<IToolInstance[]>([]);

  useEffect(() => {
    const fetchInstances = async () => {
      setIsFetching(true);
      try {
        const privateT10Tools = (await fetchApiWithToken('tools/T10?public=false')).data;
        const publicT10Tools = (await fetchApiWithToken('tools/T10?public=true')).data;

        const tools = uniqBy(privateT10Tools.concat(publicT10Tools), (t: IToolInstance) => t.id);
        setT10Instances(tools);
      } catch (err) {
        setErrors([{ id: uuid.v4(), message: 'Fetching t10 instances failed.' }]);
      } finally {
        setIsFetching(false);
      }
    };

    fetchInstances();
  }, []);

  const handleChangeInstance = async (e: SyntheticEvent<HTMLElement>, { value }: DropdownProps) => {
    setIsFetching(true);
    try {
      const i: IRtm = (await fetchApiWithToken(`tools/T10/${value}`)).data;
      setSelectedSensor(null);
      setSelectedParameter(null);
      setData(null);
      setSelectedInstance(Rtm.fromObject(i).toObject());
    } catch (err) {
      setErrors([{ id: uuid.v4(), message: 'Fetching t10 instances failed.' }]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChangeDate = (e: SyntheticEvent<Element>, { name, value }: IDatePickerProps) => {
    if (!domain || !value) {
      return null;
    }
    if (name === 'begin') {
      setDomain([value.valueOf() / 1000, domain[1]]);
    }

    if (name === 'end') {
      setDomain([domain[0], value.valueOf() / 1000]);
    }
  };

  const handleChangeParameter = async (e: SyntheticEvent<HTMLElement>, { value }: DropdownProps) => {
    const f = selectedSensor?.parameters.filter((p) => p.id === value);
    if (selectedInstance && selectedSensor && f && f.length > 0) {
      setSelectedParameter(f[0]);
      setIsFetching(true);

      const mergedData = await DataSourceCollection.fromObject(f[0].dataSources).mergedData();
      const processings = ProcessingCollection.fromObject(f[0].processings);
      const processedData = await processings.apply(mergedData);

      setData(processedData);
      resetDomain(processedData);
      setIsFetching(false);
    }
  };

  const handleChangeBoundaryParameter = (e: SyntheticEvent<HTMLElement>, { value }: DropdownProps) => {
    const p = props.boundary.valueProperties.filter((p) => p.name === value);
    if (p.length > 0) {
      setParameter(p[0]);
    }
  };

  const handleChangeSensor = (e: SyntheticEvent<HTMLElement>, { value }: DropdownProps) => {
    const f = selectedInstance?.data.sensors.filter((s) => s.id === value);
    if (f && f.length > 0) {
      setSelectedSensor(f[0]);
      setSelectedParameter(null);
      setData(null);
    }
  };

  const handleClickApply = () => {
    if (!data) {
      return null;
    }
    const cBoundary = BoundaryFactory.fromObject(props.boundary.toObject());

    if (cBoundary instanceof HeadObservationWell) {
      cBoundary.dateTimes = data.map((row) => moment.unix(row.timeStamp));
      cBoundary.setSpValues(data.map((row) => [row.value]));
    }

    props.onChange(cBoundary);
    setShowModal(false);
  };

  const handleResetDomain = () => (data ? resetDomain(data) : null);

  const resetDomain = (d: IDateTimeValue[]) => {
    if (!d) {
      return null;
    }
    const min = d.reduce((prev, curr) => {
      return prev.timeStamp < curr.timeStamp ? prev : curr;
    });
    const max = d.reduce((prev, curr) => {
      return prev.timeStamp > curr.timeStamp ? prev : curr;
    });
    setDomain([min.timeStamp, max.timeStamp]);
  };

  return (
    <Modal
      onClose={() => setShowModal(false)}
      onOpen={() => setShowModal(true)}
      open={showModal}
      trigger={
        <Button icon={true} labelPosition="left" primary={true}>
          <Icon name="wifi" />
          Sensor
        </Button>
      }
    >
      <Modal.Header>Import data from sensor</Modal.Header>
      <Modal.Content>
        {errors.map((error) => (
          <Message negative={true} key={`error_${error.id}`}>
            <Message.Header>Error</Message.Header>
            <p>{error.message}</p>
          </Message>
        ))}
        <Form>
          {t10Instances && (
            <Form.Select
              fluid
              label="T10 Instance"
              selection
              options={t10Instances.map((i, key) => {
                return {
                  key,
                  value: i.id,
                  text: i.name,
                };
              })}
              onChange={handleChangeInstance}
              placeholder="Select T10 Instance"
              value={selectedInstance ? selectedInstance.id : undefined}
            />
          )}
          {selectedInstance && (
            <Form.Select
              fluid
              label="Sensor"
              selection
              options={selectedInstance.data.sensors.map((s, key) => {
                return {
                  key,
                  value: s.id,
                  text: s.name,
                };
              })}
              onChange={handleChangeSensor}
              placeholder="Select Sensor"
              value={selectedSensor ? selectedSensor.id : undefined}
            />
          )}
          {selectedSensor && (
            <Form.Select
              fluid
              label="Parameter"
              selection
              options={selectedSensor.parameters.map((p, key) => {
                return {
                  key,
                  value: p.id,
                  text: p.unit ? `${p.description} [${p.unit}]` : p.description,
                };
              })}
              onChange={handleChangeParameter}
              placeholder="Select Parameter"
              value={selectedParameter ? selectedParameter.id : undefined}
            />
          )}
          {data && domain && (
            <Form.Group>
              <Form.Field>
                <Button icon onClick={handleResetDomain} size="small" name="begin" style={{ marginTop: '22px' }}>
                  <Icon name="refresh" />
                </Button>
              </Form.Field>
              <DatePicker
                clearable={false}
                label={'Begin'}
                name={'begin'}
                value={new Date(domain[0] * 1000)}
                onChange={handleChangeDate}
                size={'small'}
              />
              <DatePicker
                clearable={false}
                label={'End'}
                name={'end'}
                value={new Date(domain[1] * 1000)}
                onChange={handleChangeDate}
                size={'small'}
              />
              <Form.Select
                label="Apply to Parameter"
                options={props.boundary.valueProperties.map((p) => {
                  return { key: p.name, value: p.name, text: `${p.name} [${p.unit}]` };
                })}
                onChange={handleChangeBoundaryParameter}
                selection
                disabled={props.boundary.valueProperties.length <= 1}
                value={parameter.name}
              />
            </Form.Group>
          )}
        </Form>
        {data && (
          <Segment>
            <BoundaryDateTimeValuesPreviewChart
              data={data}
              domain={domain}
              type={props.boundary instanceof WellBoundary ? 'bar' : 'line'}
            />
          </Segment>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setShowModal(false)}>Cancel</Button>
        <Button onClick={handleClickApply} positive>
          Apply
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default BoundaryDateTimeImporter;
