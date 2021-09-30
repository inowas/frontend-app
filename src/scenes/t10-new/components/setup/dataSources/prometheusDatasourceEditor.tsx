import {
  Button,
  DropdownProps,
  Form,
  Grid,
  InputProps,
  Label,
  Modal,
  Segment,
  TextArea,
  TextAreaProps,
} from 'semantic-ui-react';
import { DatePicker } from '../../../../shared/uiComponents';
import { IDatePickerProps } from '../../../../shared/uiComponents/DatePicker';
import { PrometheusDataSource } from '../../../../../core/model/rtm/monitoring';
import { SyntheticEvent, useState } from 'react';
import { parseDate } from './helpers';
import { usePrometheusDatasource } from '../../hooks/usePrometheusDatasource';
import DataSourceChart from './dataSourceChart';

interface IProps {
  dataSource?: PrometheusDataSource;
  onSave: (ds: PrometheusDataSource) => void;
  onCancel: () => void;
}

export const servers = [
  {
    protocol: 'https',
    url: 'prometheus.inowas.com',
  },
];

const PrometheusDatasourceEditor = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');

  const { autoUpdate, dataSource, isFetching, toggleAutoUpdate, updateDataSource } = usePrometheusDatasource(
    props.dataSource || null
  );

  const handleBlur = () => {
    if (!dataSource) {
      return;
    }

    const cDataSource = dataSource.getClone();

    if (activeInput === 'step') {
      cDataSource.step = parseFloat(activeValue);
    }

    if (activeInput === 'query') {
      cDataSource.query = activeValue;
    }

    updateDataSource(cDataSource);
    setActiveInput(null);
  };

  const handleChange = (e: SyntheticEvent<Element>, { name, value }: InputProps | TextAreaProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleChangeDate = (e: SyntheticEvent<Element>, { name, value }: IDatePickerProps) => {
    if (!dataSource) {
      return;
    }

    if (name === 'start' && value) {
      dataSource.start = value.valueOf() / 1000;
    }

    if (name === 'end' && value) {
      dataSource.end = value.valueOf() / 1000;
    }

    updateDataSource(dataSource);
  };

  const handleSave = () => {
    if (dataSource) {
      props.onSave(dataSource);
    }
  };

  const handleChangeServer = (e: SyntheticEvent<Element>, { value }: DropdownProps) => {
    if (!dataSource || typeof value !== 'string') {
      return;
    }

    dataSource.hostname = value;
    updateDataSource(dataSource);
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
                <Segment raised={true} loading={isFetching}>
                  <Label as={'div'} color={'blue'} ribbon={true}>
                    Server
                  </Label>
                  <Form.Dropdown
                    width={6}
                    name={'server'}
                    selection={true}
                    value={dataSource ? dataSource.hostname : undefined}
                    onChange={handleChangeServer}
                    options={servers.map((s) => ({ key: s.url, value: s.url, text: s.url }))}
                  />
                </Segment>
              </Form>
            </Grid.Column>
          </Grid.Row>

          {dataSource && (
            <Grid.Row>
              <Grid.Column width={8}>
                <Segment raised={true}>
                  <Label as={'div'} color={'blue'} ribbon={true}>
                    Time range
                  </Label>
                  <Form>
                    <DatePicker
                      label="Start"
                      name="start"
                      value={parseDate(dataSource.start)}
                      onChange={handleChangeDate}
                      size="small"
                    />
                    <Form.Input
                      label={'Step size'}
                      name="step"
                      type={'number'}
                      value={activeInput === 'step' ? activeValue : dataSource.step}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Form.Group>
                      <DatePicker
                        disabled={autoUpdate}
                        label="End"
                        name="end"
                        value={parseDate(dataSource.end || null)}
                        onChange={handleChangeDate}
                        size="small"
                      />
                      <Form.Group grouped={true}>
                        <label>Auto update</label>
                        <Form.Checkbox checked={autoUpdate} onChange={toggleAutoUpdate} />
                      </Form.Group>
                    </Form.Group>
                  </Form>
                </Segment>
              </Grid.Column>
              <Grid.Column width={8}>
                <Segment raised={true}>
                  <Label as={'div'} color={'blue'} ribbon={true}>
                    Query
                  </Label>
                  <Form>
                    <TextArea
                      label="Query"
                      name="query"
                      value={activeInput === 'query' ? activeValue : dataSource.query}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          )}

          {dataSource && !dataSource.error && (
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

          {dataSource && dataSource.error && (
            <Grid.Row>
              <Grid.Column>
                <Segment raised={true}>
                  <Label as={'div'} color={'red'} ribbon={true}>
                    Error
                  </Label>
                  {dataSource.error}
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
        <Button positive={true} onClick={handleSave} disabled={!dataSource || (dataSource && !!dataSource.error)}>
          Apply
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default PrometheusDatasourceEditor;
