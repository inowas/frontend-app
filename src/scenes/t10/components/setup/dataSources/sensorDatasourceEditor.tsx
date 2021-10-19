import {
  Button,
  ButtonProps,
  DropdownProps,
  Form,
  Grid,
  Icon,
  InputProps,
  Label,
  Modal,
  Segment,
} from 'semantic-ui-react';
import { DatePicker } from '../../../../shared/uiComponents';
import { IDatePickerProps } from '../../../../shared/uiComponents/DatePicker';
import { ISensorMetaData, useSensorDatasource } from '../../hooks/useSensorDatasource';
import { MouseEvent, SyntheticEvent, useState } from 'react';
import { SensorDataSource } from '../../../../../core/model/rtm/monitoring';
import { parseDate } from './helpers';
import { servers } from '../../../defaults';
import { uniqBy } from 'lodash';
import DataSourceChart from './dataSourceChart';
import uuid from 'uuid';

interface IProps {
  dataSource?: SensorDataSource;
  onSave: (ds: SensorDataSource) => void;
  onCancel: () => void;
}

const SensorDatasourceEditor = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');

  const { dataSource, isFetching, metaData, updateDataSource, updateServer } = useSensorDatasource(
    props.dataSource || null
  );

  const handleBlur = () => {
    if (!(dataSource instanceof SensorDataSource)) {
      return;
    }

    if (activeInput === 'min') {
      dataSource.min = parseFloat(activeValue);
    }

    if (activeInput === 'max') {
      dataSource.max = parseFloat(activeValue);
    }
    updateDataSource(dataSource);
    setActiveInput(null);
  };

  const handleChangeDate = (e: SyntheticEvent<Element>, { name, value }: IDatePickerProps) => {
    if (!dataSource) {
      return;
    }

    if (name === 'begin') {
      dataSource.begin = value ? value.valueOf() / 1000 : null;
    }

    if (name === 'end') {
      dataSource.end = value ? value.valueOf() / 1000 : null;
    }

    updateDataSource(dataSource);
  };

  const handleChange = (e: SyntheticEvent<Element>, { name, value }: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleChangeDropdown = (e: SyntheticEvent<Element>, { name, value }: DropdownProps) => {
    if (!dataSource || typeof value !== 'string') {
      return;
    }

    if (name === 'server') {
      return updateServer(value);
    }

    if (name === 'project') {
      dataSource.project = value;

      const projectSensors = metaData.filter((smd: ISensorMetaData) => smd.project === value);
      if (projectSensors.length > 0) {
        const projectSensor = projectSensors[0];
        dataSource.sensor = projectSensor.name;
        const parameters = projectSensor.properties || projectSensor.parameters;
        if (parameters && parameters.length > 0) {
          dataSource.parameter = parameters[0];
        }
      }
    }

    if (name === 'sensor') {
      dataSource.sensor = value;
    }

    if (name === 'parameter') {
      dataSource.parameter = value;
    }

    if (name === 'timeResolution') {
      dataSource.timeResolution = value;
    }
    updateDataSource(dataSource);
  };

  const handleReset = (e: MouseEvent, { name }: ButtonProps) => {
    if (!dataSource) {
      return;
    }

    if (name === 'begin') {
      dataSource.begin = null;
    }

    if (name === 'end') {
      dataSource.end = null;
    }

    if (name === 'max') {
      dataSource.max = null;
    }

    if (name === 'min') {
      dataSource.min = null;
    }

    updateDataSource(dataSource);
  };

  const handleSave = () => {
    if (!dataSource) {
      return;
    }
    props.onSave(dataSource);
  };

  const getParametersFromMetadata = (ds: SensorDataSource, smd: ISensorMetaData[]) => {
    if (!ds) {
      return [];
    }

    if (smd.filter((s) => s.project === ds.project).filter((s) => s.name === ds.sensor).length === 0) {
      return [];
    }

    const sensorMetaData = smd.filter((s) => s.project === ds.project).filter((s) => s.name === ds.sensor)[0];

    if (sensorMetaData.parameters) {
      return sensorMetaData.parameters.map((p, idx) => ({ key: idx, value: p, text: p }));
    }

    if (sensorMetaData.properties) {
      return sensorMetaData.properties.map((p, idx) => ({ key: idx, value: p, text: p }));
    }
  };

  const getTimeResolutions = (ds: SensorDataSource) => {
    if (ds.server === 'uit-sensors.inowas.com') {
      return ['RAW', '1h', '1d'].map((v) => ({ key: v, value: v, text: v }));
    }
    return ['RAW', '6h', '12h', '1d', '2d', '1w'].map((v) => ({ key: v, value: v, text: v }));
  };

  return (
    <Modal centered={false} open={true} dimmer={'blurring'}>
      {!dataSource && <Modal.Header>Add Datasource</Modal.Header>}
      {dataSource && <Modal.Header>Edit Datasource</Modal.Header>}
      <Modal.Content>
        <Grid padded={true}>
          <Grid.Row>
            <Grid.Column>
              <Form>
                <Segment raised={true}>
                  <Label as={'div'} color={'blue'} ribbon={true}>
                    Server
                  </Label>
                  <Form.Dropdown
                    loading={isFetching}
                    disabled={isFetching}
                    width={6}
                    name={'server'}
                    selection={true}
                    value={dataSource ? dataSource.server : servers[0].url}
                    onChange={handleChangeDropdown}
                    options={servers.map((s) => ({ key: uuid.v4(), value: s.url, text: s.url }))}
                  />
                </Segment>
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Segment raised={true} loading={isFetching}>
                <Label as={'div'} color={'blue'} ribbon={true}>
                  Metadata
                </Label>
                <Form>
                  <Form.Group widths={'equal'}>
                    <Form.Dropdown
                      fluid={true}
                      label={'Project'}
                      name={'project'}
                      selection={true}
                      value={dataSource ? dataSource.project : undefined}
                      onChange={handleChangeDropdown}
                      options={uniqBy(metaData, 'project').map((s, idx) => ({
                        key: idx,
                        value: s.project,
                        text: s.project,
                      }))}
                    />

                    {dataSource && (
                      <Form.Dropdown
                        fluid={true}
                        label={'Sensor'}
                        name={'sensor'}
                        selection={true}
                        value={dataSource.sensor}
                        onChange={handleChangeDropdown}
                        options={metaData
                          .filter((s) => s.project === dataSource.project)
                          .map((s, idx) => ({
                            key: idx,
                            value: s.name,
                            text: s.name,
                          }))}
                        disabled={!dataSource.project}
                      />
                    )}

                    {dataSource && (
                      <Form.Dropdown
                        fluid={true}
                        label={'Parameter'}
                        name={'parameter'}
                        selection={true}
                        value={dataSource.parameter}
                        onChange={handleChangeDropdown}
                        options={getParametersFromMetadata(dataSource, metaData)}
                        disabled={!dataSource.sensor}
                      />
                    )}

                    {dataSource && (
                      <Form.Dropdown
                        fluid={true}
                        label={'Time resolution'}
                        name={'timeResolution'}
                        selection={true}
                        value={dataSource.timeResolution || '1d'}
                        onChange={handleChangeDropdown}
                        options={getTimeResolutions(dataSource)}
                        disabled={!dataSource.sensor}
                      />
                    )}
                  </Form.Group>
                </Form>
              </Segment>
            </Grid.Column>
          </Grid.Row>

          {dataSource && (
            <Grid.Row>
              <Grid.Column width={8}>
                <Segment raised={true} loading={isFetching}>
                  <Label as={'div'} color={'blue'} ribbon={true}>
                    Time range
                  </Label>
                  <Form>
                    <Form.Group>
                      <Form.Field>
                        <Button icon onClick={handleReset} size="small" name="begin" style={{ marginTop: '22px' }}>
                          <Icon name="refresh" />
                        </Button>
                      </Form.Field>
                      <DatePicker
                        clearable={false}
                        label={'Begin'}
                        name={'begin'}
                        value={parseDate(dataSource.begin)}
                        onChange={handleChangeDate}
                        size={'small'}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Field>
                        <Button icon onClick={handleReset} size="small" name="end" style={{ marginTop: '22px' }}>
                          <Icon name="refresh" />
                        </Button>
                      </Form.Field>
                      <DatePicker
                        clearable={false}
                        label={'End'}
                        name={'end'}
                        value={parseDate(dataSource.end)}
                        onChange={handleChangeDate}
                        size={'small'}
                      />
                    </Form.Group>
                  </Form>
                </Segment>
              </Grid.Column>
              <Grid.Column width={8}>
                <Segment raised={true} loading={isFetching}>
                  <Label as={'div'} color={'blue'} ribbon={true}>
                    Value range
                  </Label>
                  <Form>
                    <Form.Group>
                      <Form.Field>
                        <Button icon onClick={handleReset} size="small" name="max" style={{ marginTop: '22px' }}>
                          <Icon name="refresh" />
                        </Button>
                      </Form.Field>
                      <Form.Input
                        label={'Upper limit'}
                        name={'max'}
                        type={'number'}
                        value={activeInput === 'max' ? activeValue : dataSource.max || undefined}
                        disabled={dataSource.max === null}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Field>
                        <Button icon onClick={handleReset} size="small" name="min" style={{ marginTop: '22px' }}>
                          <Icon name="refresh" />
                        </Button>
                      </Form.Field>
                      <Form.Input
                        label={'Lower limit'}
                        name={'min'}
                        type={'number'}
                        value={activeInput === 'min' ? activeValue : dataSource.min || undefined}
                        disabled={dataSource.min === null}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                  </Form>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          )}

          {dataSource && (
            <Grid.Row>
              <Grid.Column>
                <Segment loading={!dataSource.data} raised={true}>
                  <Label as={'div'} color={'red'} ribbon={true}>
                    Data
                  </Label>
                  <DataSourceChart dataSource={dataSource} />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button negative={true} onClick={props.onCancel}>
          Cancel
        </Button>
        <Button positive={true} onClick={handleSave}>
          Apply
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default SensorDatasourceEditor;
