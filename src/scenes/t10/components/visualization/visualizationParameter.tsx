import { Button, Dimmer, Grid, Icon, Input, Loader, Popup, Segment } from 'semantic-ui-react';
import { DataSourceCollection, Rtm } from '../../../../core/model/rtm/monitoring';
import { ILegendRowProps, IParameterWithMetaData, ITimeStamps } from './types';
import { Line, LineChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ProcessingCollection } from '../../../../core/model/rtm/processing';
import { downloadFile, exportChartImage } from '../../../shared/simpleTools/helpers';
import { useEffect, useRef, useState } from 'react';
import CustomTooltip from './customTooltip';
import TimeSlider from './timeSlider';
import Uuid from 'uuid';
import VisualizationMap from './visualizationMap';
import _, { cloneDeep } from 'lodash';
import moment from 'moment';
import uuid from 'uuid';

interface IProps {
  parameters: IParameterWithMetaData[];
  rtm: Rtm;
}

const getClosestValue = (array: number[], value: number) => {
  if (array.length > 0) {
    return array.reduce((prev, curr) => {
      return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
    });
  }
  return NaN;
};

const getData = (
  parameters: IParameterWithMetaData[],
  onFinished: (data: { [key: string]: number }[], tsData: ITimeStamps) => any,
  data: { [key: string]: number }[] = [],
  tsData: ITimeStamps = {
    minT: NaN,
    maxT: NaN,
    left: { min: NaN, max: NaN },
    right: { min: NaN, max: NaN },
    timestamps: [],
  }
) => {
  const parameter = parameters.shift();
  if (parameter) {
    const dataSourceCollection = DataSourceCollection.fromObject(parameter.parameter.dataSources);
    dataSourceCollection.mergedData().then((res) => {
      const processed = ProcessingCollection.fromObject(parameter.parameter.processings);
      processed.apply(res).then((r) => {
        if (parameter.meta.active) {
          r.forEach((row) => {
            if (isNaN(tsData.minT) || row.timeStamp < tsData.minT) {
              tsData.minT = row.timeStamp;
            }
            if (isNaN(tsData.maxT) || row.timeStamp > tsData.maxT) {
              tsData.maxT = row.timeStamp;
            }
            if (parameter.meta.axis === 'left') {
              if ((isNaN(tsData.left.min) || row.value < tsData.left.min) && row.value !== null) {
                tsData.left.min = row.value;
              }
              if ((isNaN(tsData.left.max) || row.value > tsData.left.max) && row.value !== null) {
                tsData.left.max = row.value;
              }
            }
            if (parameter.meta.axis === 'right') {
              if ((isNaN(tsData.right.min) || row.value < tsData.right.min) && row.value !== null) {
                tsData.right.min = row.value;
              }
              if ((isNaN(tsData.right.max) || row.value > tsData.right.max) && row.value !== null) {
                tsData.right.max = row.value;
              }
            }
            if (!tsData.timestamps.includes(row.timeStamp)) {
              tsData.timestamps.push(row.timeStamp);
            }

            let dateDoesExist = false;
            data = data.map((r) => {
              if (r['date'] && r['date'] === row.timeStamp) {
                r[`${parameter.parameter.type}-${parameter.sensor.id}`] = row.value;
                dateDoesExist = true;
              }
              return r;
            });
            if (!dateDoesExist) {
              data.push({
                date: row.timeStamp,
                [`${parameter.parameter.type}-${parameter.sensor.id}`]: row.value,
              });
            }
          });
        }
        getData(parameters, onFinished, data, tsData);
        return;
      });
    });
    return;
  }
  tsData.timestamps = tsData.timestamps.sort((a, b) => a - b);
  data = _.orderBy(_.uniq(data), 'date');
  return onFinished(data, tsData);
};

const processData = (data: { [key: string]: number }[], tsData: ITimeStamps) =>
  data.filter((row) => row['date'] && row['date'] >= tsData.minT && row['date'] <= tsData.maxT);

const VisualizationParameter = (props: IProps) => {
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const [withLines, setWithLines] = useState<boolean>(true);

  const [timestamp, setTimestamp] = useState<number>(0);

  const [data, setData] = useState<{ [key: string]: number }[]>([]);
  const [filteredData, setFilteredData] = useState<{ [key: string]: number }[]>([]);

  const [legend, setLegend] = useState<{ [key: string]: ILegendRowProps }>();

  const [tsData, setTsData] = useState<ITimeStamps>({
    minT: 0,
    maxT: 0,
    left: { min: 0, max: 0 },
    right: { min: 0, max: 0 },
    timestamps: [],
  });
  const [filteredTsData, setFilteredTsData] = useState<ITimeStamps>({
    minT: 0,
    maxT: 0,
    left: { min: 0, max: 0 },
    right: { min: 0, max: 0 },
    timestamps: [],
  });

  const [leftAxis, setLeftAxis] = useState<string>('');
  const [rightAxis, setRightAxis] = useState<string>('');

  const [timeRange, setTimeRange] = useState<[number, number] | null>(null);
  const [timeSlideId, setTimeSliderId] = useState<string>(Uuid.v4());

  const chartRef = useRef(null);
  const timeRef = useRef<number>(0);

  const handleMoveTimeSlider = (result: [number, number]) =>
    setTimeRange([tsData.timestamps[result[0]], tsData.timestamps[result[1]]]);

  const setAxisLabel = (d: IParameterWithMetaData[]) => {
    const parametersLeft = d.filter((p) => p.meta.axis === 'left');
    const parametersRight = d.filter((p) => p.meta.axis === 'right');
    const unitsLeft: string[] = [];
    const unitsRight: string[] = [];

    parametersLeft.forEach((p) => {
      if (p.parameter.unit && !unitsLeft.includes(p.parameter.unit)) {
        unitsLeft.push(p.parameter.unit);
      }
    });
    parametersRight.forEach((p) => {
      if (p.parameter.unit && !unitsRight.includes(p.parameter.unit)) {
        unitsRight.push(p.parameter.unit);
      }
    });

    setLeftAxis(unitsLeft.join(', '));
    setRightAxis(unitsRight.join(', '));
  };

  useEffect(() => {
    if (props.parameters.length > 0) {
      setIsFetching(true);
      getData(_.cloneDeep(props.parameters), (rData, rTsData) => {
        setTsData(rTsData);
        setFilteredTsData(cloneDeep(rTsData));
        setData(rData);
        setFilteredData(cloneDeep(rData));
        setAxisLabel(cloneDeep(props.parameters));
        setIsFetching(false);
        setTimestamp(rTsData.timestamps[0]);
        setTimeSliderId(uuid.v4());

        const l: { [key: string]: ILegendRowProps } = {};
        props.parameters.forEach((p) => {
          l[`${p.parameter.type}-${p.sensor.id}`] = {
            color: p.meta.color,
            label: `${p.parameter.type}-${p.sensor.name}`,
            unit: p.parameter.unit || '',
          };
        });
        setLegend(l);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.parameters]);

  useEffect(() => {
    const indexOfStart = tsData.timestamps.indexOf(getClosestValue(filteredTsData.timestamps, filteredTsData.minT));
    const indexOfEnd = tsData.timestamps.indexOf(getClosestValue(filteredTsData.timestamps, filteredTsData.maxT));
    const filtered = cloneDeep(tsData.timestamps).slice(indexOfStart, indexOfEnd);
    setFilteredData(
      processData(cloneDeep(data), {
        ...filteredTsData,
        timestamps: filtered,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTsData.minT, filteredTsData.maxT]);

  const getTicks = () => {
    const domain = [filteredTsData.minT, filteredTsData.maxT];
    const dateStart = moment.unix(domain[0]);
    const dateEnd = moment.unix(domain[1]);
    const interim = dateStart.clone();
    const timeValues: number[] = [];

    while (dateEnd > interim || interim.format('M') === dateEnd.format('M')) {
      timeValues.push(moment(interim.format('YYYY-MM')).unix());
      interim.add(1, 'month');
    }
    return timeValues;
  };

  const handleClickReset = () => {
    setTimestamp(tsData.timestamps[0]);
    setFilteredTsData(cloneDeep(tsData));
    setTimeSliderId(Uuid.v4());
  };

  const handleClickLines = () => {
    setWithLines(!withLines);
  };

  const handleClickChart = (e: any) => {
    if (e && e.activeLabel) {
      return setTimestamp(e.activeLabel);
    }
  };

  const handleBlurRange = (range: [number, number]) => {
    const startTimeStamp = tsData.timestamps[range[0]];
    const endTimeStamp = tsData.timestamps[range[1]];
    if (timestamp < startTimeStamp) {
      setTimestamp(getClosestValue(filteredTsData.timestamps, startTimeStamp));
    }
    if (timestamp > endTimeStamp) {
      setTimestamp(getClosestValue(filteredTsData.timestamps, endTimeStamp));
    }
    setTimeRange(null);
    return setFilteredTsData({
      ...filteredTsData,
      minT: startTimeStamp,
      maxT: endTimeStamp,
    });
  };

  const handleExportChartImage = () => (chartRef.current ? exportChartImage(chartRef.current) : null);

  const handleExportChartData = () => {
    const keys: string[] = ['date'];
    const ids: string[] = ['date'];
    props.parameters.forEach((p) => {
      keys.push(`${p.parameter.type}-${p.sensor.name}`);
      ids.push(`${p.parameter.type}-${p.sensor.id}`);
    });
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += keys.join(',');
    csvContent += '\r\n';
    filteredData.forEach((row) => {
      csvContent += ids
        .map((k) => {
          if (k === 'date') {
            return moment.unix(row[k]).format('YYYY-MM-DD');
          }
          if (k in row) {
            return row[k];
          }
          return NaN;
        })
        .join(',');
      csvContent += '\r\n';
    });
    const encodedUri = encodeURI(csvContent);
    downloadFile('chart.csv', encodedUri);
  };

  return (
    <div>
      <Segment color={'grey'} raised={true}>
        {(filteredData.length === 0 || isFetching || props.parameters.length === 0) && (
          <Dimmer active={true} inverted={true}>
            <Loader inverted={true}>Loading</Loader>
          </Dimmer>
        )}
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Button.Group>
                <Popup
                  content="Interpolation"
                  trigger={<Button onClick={handleClickLines} icon="chart line" primary={withLines} />}
                />
              </Button.Group>
              &nbsp;
              <Popup
                content="Selected time"
                trigger={<Input value={moment.unix(timestamp).utc().format('YYYY-MM-DD HH:mm:ss')} readOnly={true} />}
              />
              <div className="downloadButtons">
                <Button compact={true} basic={true} icon={true} size={'small'} onClick={handleExportChartImage}>
                  <Icon name="download" /> JPG
                </Button>
                <Button compact={true} basic={true} icon={true} size={'small'} onClick={handleExportChartData}>
                  <Icon name="download" /> CSV
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
          {filteredData.length > 0 && (
            <Grid.Row>
              <Grid.Column>
                <ResponsiveContainer height={300}>
                  <LineChart data={filteredData} onClick={handleClickChart} ref={chartRef}>
                    <XAxis
                      dataKey="date"
                      domain={[filteredTsData.minT, filteredTsData.maxT]}
                      name={'Date Time'}
                      ticks={getTicks()}
                      tickFormatter={(dt) => moment.unix(dt).utc().format('YYYY/MM/DD')}
                      type={'number'}
                    />
                    {props.parameters.filter((p) => p.meta.axis === 'left').length > 0 && (
                      <YAxis
                        yAxisId="left"
                        domain={[filteredTsData.left.min, filteredTsData.left.max]}
                        label={{ value: leftAxis, angle: -90, position: 'left' }}
                        tickFormatter={(v) => v.toExponential(2)}
                      />
                    )}
                    {props.parameters.filter((p) => p.meta.axis === 'right').length > 0 && (
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{ value: rightAxis, angle: -90, position: 'right' }}
                        tickFormatter={(v) => v.toExponential(2)}
                      />
                    )}
                    {props.parameters.map((row, idx) => {
                      return (
                        <Line
                          key={idx}
                          dot={!withLines}
                          yAxisId={row.meta.axis}
                          stroke={row.meta.color}
                          type="monotone"
                          dataKey={`${row.parameter.type}-${row.sensor.id}`}
                          strokeDasharray={row.meta.strokeDasharray}
                        />
                      );
                    })}
                    {legend && <Tooltip content={<CustomTooltip legend={legend} dateTimeFormat={'YYYY-MM-DD'} />} />}
                    <ReferenceLine
                      x={timestamp}
                      stroke="#000"
                      strokeDasharray="3 3"
                      yAxisId={props.parameters.filter((p) => p.meta.axis === 'left').length > 0 ? 'left' : 'right'}
                    />
                    {!!timeRange && (
                      <ReferenceArea
                        x1={timeRange[0]}
                        x2={timeRange[1]}
                        stroke="#1eb1ed"
                        yAxisId={props.parameters.filter((p) => p.meta.axis === 'left').length > 0 ? 'left' : 'right'}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={1}>
                      <Popup content="Reset" trigger={<Button onClick={handleClickReset} icon="undo" size="tiny" />} />
                    </Grid.Column>
                    <Grid.Column key={timeSlideId} width={15}>
                      <TimeSlider
                        onChange={handleBlurRange}
                        onMove={handleMoveTimeSlider}
                        timeSteps={tsData.timestamps}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </Segment>
      {props.parameters.length > 0 && (
        <Segment color={'grey'} raised={true}>
          <VisualizationMap
            timestamp={timestamp}
            timeRef={timeRef.current}
            tsData={tsData}
            parameters={props.parameters}
            data={data}
          />
        </Segment>
      )}
    </div>
  );
};

export default VisualizationParameter;
