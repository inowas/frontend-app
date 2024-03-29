import { Button, Dropdown, Grid, Header, Icon, Label, Message, Popup, Segment, Table } from 'semantic-ui-react';
import { DataSourceCollection, Rtm } from '../../../../core/model/rtm/monitoring';
import { ECutRule, IProcessing } from '../../../../core/model/rtm/processing/Processing.type';
import { ISensorParameter } from '../../../../core/model/rtm/monitoring/Sensor.type';
import {
  ProcessingCollection,
  ProcessingFactory,
  TimeProcessing,
  ValueProcessing,
} from '../../../../core/model/rtm/processing';
import { processingList } from '../../defaults';
import { useState } from 'react';
import DataSourcesChart from '../shared/dataChart';
import ProcessingTimeRange from './processingTimeRange';
import TimeProcessingEditor from './timeProcessingEditor';
import ValueProcessingEditor from './valueProcessingEditor';

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

const Processing = (props: IProps) => {
  const [addProcessing, setAddProcessing] = useState<string | null>(null);
  const [editProcessing, setEditProcessing] = useState<ValueProcessing | TimeProcessing | null>(null);

  const handleAddProcessing = (p: ValueProcessing | TimeProcessing) => {
    const { parameter } = props;
    if (!parameter) {
      return;
    }

    if (!parameter.processings) {
      parameter.processings = [];
    }

    parameter.processings.push(p.toObject());
    setAddProcessing(null);
    props.onChange(parameter);
  };

  const handleUpdateProcessing = (pInst: ValueProcessing | TimeProcessing) => {
    const { parameter } = props;
    if (!parameter) {
      return;
    }

    parameter.processings = parameter.processings.map((p) => {
      if (p.id === pInst.id) {
        return pInst.toObject();
      }

      return p;
    });

    setEditProcessing(null);
    props.onChange(parameter);
  };

  const handleAddProcessingClick = (dsType: string) => () => {
    setAddProcessing(dsType);
  };

  const handleCancelProcessingClick = () => {
    setAddProcessing(null);
    setEditProcessing(null);
  };

  const handleDeleteProcessingClick = (id: string) => () => {
    const { parameter } = props;
    if (!parameter) {
      return;
    }

    parameter.processings = parameter.processings.filter((p: IProcessing) => p.id !== id);
    props.onChange(parameter);
  };

  const handleEditProcessingClick = (id: string) => () => {
    const { parameter } = props;
    if (!parameter) {
      return;
    }

    const filteredP = parameter.processings.filter((p: IProcessing) => p.id === id);
    if (filteredP.length === 0) {
      return;
    }

    setEditProcessing(ProcessingFactory.fromObject(filteredP[0]));
  };

  const handleMoveProcessingClick = (from: number, to: number) => () => {
    const { parameter } = props;
    parameter.processings = arrayMoveItems(parameter.processings, from, to);
    props.onChange(parameter);
  };

  const renderProcessingEditor = () => {
    if (addProcessing && addProcessing === 'time') {
      return (
        <TimeProcessingEditor
          dsc={dataSourceCollection}
          onCancel={handleCancelProcessingClick}
          onSave={handleAddProcessing}
        />
      );
    }

    if (addProcessing && addProcessing === 'value') {
      return (
        <ValueProcessingEditor
          dsc={dataSourceCollection}
          onCancel={handleCancelProcessingClick}
          onSave={handleAddProcessing}
        />
      );
    }

    if (editProcessing && editProcessing instanceof TimeProcessing) {
      return (
        <TimeProcessingEditor
          dsc={dataSourceCollection}
          processing={editProcessing as TimeProcessing}
          onCancel={handleCancelProcessingClick}
          onSave={handleUpdateProcessing}
        />
      );
    }

    if (editProcessing && editProcessing instanceof ValueProcessing) {
      return (
        <ValueProcessingEditor
          dsc={dataSourceCollection}
          processing={editProcessing as ValueProcessing}
          onCancel={handleCancelProcessingClick}
          onSave={handleUpdateProcessing}
        />
      );
    }

    return null;
  };

  if (!props.parameter) {
    return null;
  }

  const dataSourceCollection = DataSourceCollection.fromObject(props.parameter.dataSources);
  const processingCollection = ProcessingCollection.fromObject(props.parameter.processings);

  const renderMethod = (pInst: ValueProcessing | TimeProcessing) => {
    if (pInst instanceof ValueProcessing) {
      return pInst.operator;
    }
    return pInst.cut || '';
  };

  const renderValue = (pInst: any) => {
    if (pInst instanceof ValueProcessing) {
      return pInst.value;
    }
    return pInst.rule || '';
  };
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Segment color={'red'} raised={true}>
            <Header as={'h2'} dividing={true}>
              {props.parameter.description}
            </Header>
            <Label color={'blue'} ribbon={true} size={'large'}>
              Processings
            </Label>
            {processingCollection.all.filter((p) => {
              const pInst = ProcessingFactory.fromObject(p);
              return pInst instanceof TimeProcessing && pInst.cut !== ECutRule.NONE;
            }).length > 1 && (
              <Message warning={true}>
                <Message.Header>Warning</Message.Header>
                <p>There should only be one time processing with cut method. Only the first in order is applied.</p>
              </Message>
            )}
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Time range</Table.HeaderCell>
                  <Table.HeaderCell />
                  <Table.HeaderCell textAlign={'center'}>Method</Table.HeaderCell>
                  <Table.HeaderCell textAlign={'center'}>Value</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {processingCollection.all.map((p, key) => {
                  const pInst = ProcessingFactory.fromObject(p);
                  if (pInst === null) {
                    return null;
                  }

                  return (
                    <Table.Row key={key}>
                      <Table.Cell>{pInst.type}</Table.Cell>
                      <Table.Cell>
                        <ProcessingTimeRange processing={pInst} />
                      </Table.Cell>
                      <Table.Cell>
                        {!pInst.end && (
                          <Popup content={'Automatic update'} trigger={<Icon name={'circle'} color={'red'} />} />
                        )}
                      </Table.Cell>
                      <Table.Cell textAlign={'center'}>{renderMethod(pInst)}</Table.Cell>
                      <Table.Cell textAlign={'center'}>{renderValue(pInst)}</Table.Cell>
                      <Table.Cell textAlign={'right'}>
                        {!props.rtm.readOnly && (
                          <div>
                            <Button.Group>
                              <Button
                                icon={true}
                                onClick={handleMoveProcessingClick(key, key - 1)}
                                disabled={key === 0}
                              >
                                <Icon name={'arrow up'} />
                              </Button>
                              <Button
                                icon={true}
                                onClick={handleMoveProcessingClick(key, key + 1)}
                                disabled={key === processingCollection.length - 1}
                              >
                                <Icon name={'arrow down'} />
                              </Button>
                            </Button.Group>{' '}
                            <Button.Group>
                              <Button icon={true} onClick={handleEditProcessingClick(pInst.id)}>
                                <Icon name={'edit'} />
                              </Button>
                              <Button icon={true} onClick={handleDeleteProcessingClick(pInst.id)}>
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

              {!props.rtm.readOnly && (
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan={6}>
                      <Button as="div" labelPosition="left" floated={'right'}>
                        <Dropdown
                          text="Add"
                          icon="add"
                          labeled={true}
                          button={true}
                          className="icon blue"
                          disabled={props.rtm.readOnly}
                        >
                          <Dropdown.Menu>
                            <Dropdown.Header>Choose type</Dropdown.Header>
                            {processingList.map((p) => (
                              <Dropdown.Item key={p} text={p} onClick={handleAddProcessingClick(p)} />
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

          {props.parameter.dataSources.length > 0 && (
            <Segment color={'grey'} raised={true}>
              <Label color={'blue'} ribbon={true} size={'large'}>
                Chart
              </Label>
              <DataSourcesChart
                dataSources={dataSourceCollection}
                processings={processingCollection}
                unit={props.parameter.unit !== '' ? props.parameter.unit : undefined}
              />
            </Segment>
          )}
        </Grid.Column>
      </Grid.Row>
      {renderProcessingEditor()}
    </Grid>
  );
};

export default Processing;
