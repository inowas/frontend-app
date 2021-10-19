import { Button, Dropdown, Grid, Header, Icon, Label, Popup, Segment, Table } from 'semantic-ui-react';
import { DataSource, IDataSource, ISensorParameter } from '../../../../core/model/rtm/monitoring/Sensor.type';
import {
  DataSourceCollection,
  DataSourceFactory,
  FileDataSource,
  PrometheusDataSource,
  Rtm,
  SensorDataSource,
} from '../../../../core/model/rtm/monitoring';
import { FileDatasourceEditor, PrometheusDatasourceEditor, SensorDatasourceEditor } from './dataSources/index';
import { colors, dataSourceList } from '../../defaults';
import { useState } from 'react';
import DataSourceTimeRange from './dataSourceTimeRange';
import DataSourcesChart from '../shared/dataChart';
import TinyLineChart from '../shared/tineLineChart';

interface IProps {
  rtm: Rtm;
  parameter: ISensorParameter;
  onChange: (parameter: ISensorParameter) => void;
}

const arrayMoveItems = (arr: any[], from: number, to: number) => {
  if (from !== to && 0 <= from && from <= arr.length && 0 <= to && to <= arr.length) {
    const tmp = arr[from];
    if (from < to) {
      for (let i = from; i < to; i++) {
        arr[i] = arr[i + 1];
      }
    } else {
      for (let i = from; i > to; i--) {
        arr[i] = arr[i - 1];
      }
    }
    arr[to] = tmp;
  }

  return arr;
};

const DataSources = ({ rtm, parameter, onChange }: IProps) => {
  const [addDatasource, setAddDatasource] = useState<string | null>(null);
  const [editDatasource, setEditDatasource] = useState<DataSource | null>(null);

  const getDsType = (ds: DataSource) => {
    if (ds instanceof FileDataSource) {
      return 'file';
    }

    if (ds instanceof PrometheusDataSource) {
      return 'prometheus';
    }

    return 'online';
  };

  const handleAddDataSource = (ds: DataSource) => {
    if (!parameter) {
      return;
    }

    parameter.dataSources.push(ds.toObject());
    setAddDatasource(null);
    onChange(parameter);
  };

  const handleUpdateDataSource = (ds: DataSource) => {
    if (!parameter) {
      return;
    }

    parameter.dataSources = parameter.dataSources.map((d) => {
      if (d.id === ds.id) {
        return ds.toObject();
      }

      return d;
    });

    setEditDatasource(null);
    onChange(parameter);
  };

  const handleAddDataSourceClick = (dsType: string) => () => {
    setAddDatasource(dsType);
  };

  const handleCancelDataSourceClick = () => {
    setAddDatasource(null);
    setEditDatasource(null);
  };

  const handleDeleteDataSourceClick = (id: string) => () => {
    if (!parameter) {
      return;
    }

    parameter.dataSources = parameter.dataSources.filter((ds: IDataSource) => ds.id !== id);
    onChange(parameter);
  };

  const handleEditDataSourceClick = (id: string) => () => {
    if (!parameter) {
      return;
    }

    const filteredDs = parameter.dataSources.filter((ds: IDataSource) => ds.id === id);
    if (filteredDs.length === 0) {
      return;
    }

    setEditDatasource(DataSourceFactory.fromObject(filteredDs[0]));
  };

  const handleMoveDataSourceClick = (from: number, to: number) => () => {
    parameter.dataSources = arrayMoveItems(parameter.dataSources, from, to);
    onChange(parameter);
  };

  const renderDatasourceDetails = () => {
    if (addDatasource) {
      switch (addDatasource) {
        case 'online':
          return <SensorDatasourceEditor onCancel={handleCancelDataSourceClick} onSave={handleAddDataSource} />;
        case 'prometheus':
          return <PrometheusDatasourceEditor onCancel={handleCancelDataSourceClick} onSave={handleAddDataSource} />;
        case 'file':
          return <FileDatasourceEditor onCancel={handleCancelDataSourceClick} onSave={handleAddDataSource} />;
      }
    }

    if (editDatasource) {
      if (editDatasource instanceof SensorDataSource) {
        return (
          <SensorDatasourceEditor
            dataSource={editDatasource as SensorDataSource}
            onCancel={handleCancelDataSourceClick}
            onSave={handleUpdateDataSource}
          />
        );
      }

      if (editDatasource instanceof PrometheusDataSource) {
        return (
          <PrometheusDatasourceEditor
            dataSource={editDatasource as PrometheusDataSource}
            onCancel={handleCancelDataSourceClick}
            onSave={handleUpdateDataSource}
          />
        );
      }

      return (
        <FileDatasourceEditor
          dataSource={editDatasource as FileDataSource}
          onCancel={handleCancelDataSourceClick}
          onSave={handleUpdateDataSource}
        />
      );
    }

    return null;
  };

  if (!parameter) {
    return null;
  }

  const dataSourceCollection = DataSourceCollection.fromObject(parameter.dataSources);

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Segment color={'red'} raised={true}>
            <Header as={'h2'} dividing={true}>
              {parameter.description}
            </Header>
            <Label color={'blue'} ribbon={true} size={'large'}>
              Data sources
            </Label>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Time range</Table.HeaderCell>
                  <Table.HeaderCell />
                  <Table.HeaderCell />
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {dataSourceCollection.all.map((ds, key) => {
                  const dsInst = DataSourceFactory.fromObject(ds);
                  if (dsInst === null) {
                    return null;
                  }

                  return (
                    <Table.Row key={key}>
                      <Table.Cell>{getDsType(dsInst)}</Table.Cell>
                      <Table.Cell>
                        <DataSourceTimeRange datasource={dsInst} />
                      </Table.Cell>
                      <Table.Cell>
                        <TinyLineChart
                          datasource={dsInst}
                          color={colors[key]}
                          begin={dataSourceCollection.globalBegin()}
                          end={dataSourceCollection.globalEnd()}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        {((dsInst instanceof PrometheusDataSource && !dsInst.end) ||
                          (dsInst instanceof SensorDataSource && !dsInst.end)) && (
                          <Popup content={'Automatic update'} trigger={<Icon name={'circle'} color={'red'} />} />
                        )}
                      </Table.Cell>
                      <Table.Cell textAlign={'right'}>
                        {!rtm.readOnly && (
                          <div>
                            <Button.Group>
                              <Button
                                icon={true}
                                onClick={handleMoveDataSourceClick(key, key - 1)}
                                disabled={key === 0}
                              >
                                <Icon name={'arrow up'} />
                              </Button>
                              <Button
                                icon={true}
                                onClick={handleMoveDataSourceClick(key, key + 1)}
                                disabled={key === dataSourceCollection.length - 1}
                              >
                                <Icon name={'arrow down'} />
                              </Button>
                            </Button.Group>{' '}
                            <Button.Group>
                              <Button icon={true} onClick={handleEditDataSourceClick(dsInst.id)}>
                                <Icon name={'edit'} />
                              </Button>
                              <Button icon={true} onClick={handleDeleteDataSourceClick(dsInst.id)}>
                                <Icon name={'trash'} />
                              </Button>
                            </Button.Group>
                          </div>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>

              {!rtm.readOnly && (
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan={5}>
                      <Button as="div" labelPosition="left" floated={'right'}>
                        <Dropdown
                          text="Add"
                          icon="add"
                          labeled={true}
                          button={true}
                          className="icon blue"
                          disabled={rtm.readOnly}
                        >
                          <Dropdown.Menu>
                            <Dropdown.Header>Choose type</Dropdown.Header>
                            {dataSourceList.map((ds) => (
                              <Dropdown.Item key={ds} text={ds} onClick={handleAddDataSourceClick(ds)} />
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Button>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              )}
            </Table>
          </Segment>

          {parameter.dataSources.length > 0 && (
            <Segment color={'grey'} raised={true}>
              <Label color={'blue'} ribbon={true} size={'large'}>
                Chart
              </Label>
              <DataSourcesChart
                dataSources={dataSourceCollection}
                unit={parameter.unit !== '' ? parameter.unit : undefined}
              />
            </Segment>
          )}
        </Grid.Column>
      </Grid.Row>
      {renderDatasourceDetails()}
    </Grid>
  );
};

export default DataSources;
