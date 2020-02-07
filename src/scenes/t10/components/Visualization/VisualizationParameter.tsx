import {LTOB} from 'downsample';
import {XYDataPoint} from 'downsample/dist/types';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
    ReferenceArea,
    ReferenceLine,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    XAxis,
    YAxis,
} from 'recharts';
import {
    Button,
    Dimmer,
    Grid, Input,
    Loader, Popup,
    Segment
} from 'semantic-ui-react';
import Uuid from 'uuid';
import {DataSourceCollection, Rtm} from '../../../../core/model/rtm';
import {ProcessingCollection} from '../../../../core/model/rtm/processing';
import TimeSlider from './TimeSlider';
import {IParameterWithMetaData, ITimeStamps} from './types';
import VisualizationMap from './VisualizationMap';

interface IProps {
    parameters: IParameterWithMetaData[];
    rtm: Rtm;
}

const getClosestValue = (array: number[], value: number) => {
    if (array.length > 0) {
        return array.reduce((prev, curr) => {
            return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
        });
    }
    return NaN;
};

const getData = (
    parameters: IParameterWithMetaData[],
    onFinished: (data: IParameterWithMetaData[], tsData: ITimeStamps) => any,
    data: IParameterWithMetaData[] = [],
    tsData: ITimeStamps = {
        minT: NaN, maxT: NaN, left: {min: NaN, max: NaN}, right: {min: NaN, max: NaN}, timestamps: []
    },
    key: number = 0
) => {
    const parameter = parameters.shift();
    if (parameter) {
        data.push(parameter);
        const dataSourceCollection = DataSourceCollection.fromObject(parameter.parameter.dataSources);
        dataSourceCollection.mergedData().then((res) => {
            const processed = ProcessingCollection.fromObject(parameter.parameter.processings);
            processed.apply(res).then((r) => {
                data[key].data = r.map((row) => {
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
                    return {
                        x: row.timeStamp,
                        y: row.value
                    };
                });
                key++;
                getData(parameters, onFinished, data, tsData, key);
                return;
            });
        });
        return;
    }
    tsData.timestamps = tsData.timestamps.sort((a, b) => a - b);
    return onFinished(data, tsData);
};

const processData = (data: IParameterWithMetaData[], tsData: ITimeStamps) => {
    return data.map((sensorData) => {
        const d: XYDataPoint[] = [];
        sensorData.data.forEach((row) => {
            if (row.x >= tsData.minT && row.x <= tsData.maxT) {
                d.push(row);
            }
        });
        sensorData.data = d;
        return sensorData;
    });
};

const visualizationParameter = (props: IProps) => {
    const [isAnimated, setIsAnimated] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(true);

    const [withLines, setWithLines] = useState<boolean>(true);

    const [timestamp, setTimestamp] = useState<number>(0);
    const [intervalId, setIntervalId] = useState();

    const [data, setData] = useState<IParameterWithMetaData[]>([]);
    const [filteredData, setFilteredData] = useState<IParameterWithMetaData[]>([]);

    const [showScale, setShowScale] = useState<boolean>(false);

    const [tsData, setTsData] = useState<ITimeStamps>({
        minT: 0, maxT: 0, left: {min: 0, max: 0}, right: {min: 0, max: 0}, timestamps: []
    });
    const [filteredTsData, setFilteredTsData] = useState<ITimeStamps>(
        {minT: 0, maxT: 0, left: {min: 0, max: 0}, right: {min: 0, max: 0}, timestamps: []}
    );

    const [leftAxis, setLeftAxis] = useState<string>('');
    const [rightAxis, setRightAxis] = useState<string>('');

    const [timeRange, setTimeRange] = useState<[number, number] | null>(null);
    const [timeSlideId, setTimeSliderId] = useState<string>(Uuid.v4());

    const timeRef = useRef<number>(0);

    const handleMoveTimeSlider = (result: [number, number]) => setTimeRange(
        [tsData.timestamps[result[0]], tsData.timestamps[result[1]]]
    );

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
            getData(cloneDeep(props.parameters), (rData, rTsData) => {
                setTsData(rTsData);
                setFilteredTsData(cloneDeep(rTsData));
                setData(rData);
                setFilteredData(cloneDeep(rData));
                setAxisLabel(cloneDeep(rData));
                setIsFetching(false);
                setTimestamp(rTsData.timestamps[0]);
            });
        }
    }, [props.parameters]);

    useEffect(() => {
        if (isAnimated) {
            timeRef.current = filteredTsData.timestamps.indexOf(timestamp);
            setIntervalId(setInterval(() => {
                if (timeRef.current === filteredTsData.timestamps.length - 1) {
                    timeRef.current = 0;
                } else {
                    timeRef.current = timeRef.current + 1;
                }
                setTimestamp(filteredTsData.timestamps[timeRef.current]);
            }, 1000));
        } else {
            clearTimeout(intervalId);
            setTimestamp(filteredTsData.timestamps[timeRef.current]);
        }
    }, [isAnimated]);

    useEffect(() => {
        const indexOfStart = tsData.timestamps.indexOf(getClosestValue(filteredTsData.timestamps, filteredTsData.minT));
        const indexOfEnd = tsData.timestamps.indexOf(getClosestValue(filteredTsData.timestamps, filteredTsData.maxT));
        const filtered = cloneDeep(tsData.timestamps).slice(indexOfStart, indexOfEnd);
        setFilteredTsData({
            ...filteredTsData,
            timestamps: filtered
        });
        setFilteredData(processData(cloneDeep(data), {
            ...filteredTsData,
            timestamps: filtered
        }));
    }, [filteredTsData.minT, filteredTsData.maxT]);

    // tslint:disable-next-line:variable-name
    const RenderNoShape = () => null;

    if (isFetching || props.parameters.length === 0) {
        return (
            <Dimmer active={true} inverted={true}>
                <Loader inverted={true}>Loading</Loader>
            </Dimmer>
        );
    }

    const handleClickReset = () => {
        setTimestamp(tsData.timestamps[0]);
        setFilteredTsData(cloneDeep(tsData));
        setTimeSliderId(Uuid.v4());
    };

    const handleClickLines = () => {
        setWithLines(!withLines);
    };

    const handleClickChart = (e: any) => {
        return setTimestamp(getClosestValue(filteredTsData.timestamps, e.xValue));
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
            maxT: endTimeStamp
        });
    };

    const handleTogglePlay = () => setIsAnimated(!isAnimated);

    const handleToggleScale = () => setShowScale(!showScale);

    if (filteredData.length === 0) {
        return (
            <Segment color={'grey'} raised={true}>
                Select at least one parameter!
            </Segment>
        );
    }

    return (
        <div>
            <Segment color={'grey'} raised={true}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Button.Group>
                                <Popup
                                    content="Interpolation"
                                    trigger={
                                        <Button
                                            onClick={handleClickLines}
                                            icon="chart line"
                                            primary={withLines}
                                        />
                                    }
                                />
                                <Popup
                                    content="Play Animation"
                                    trigger={
                                        <Button
                                            onClick={handleTogglePlay}
                                            primary={isAnimated}
                                            icon={isAnimated ? 'pause' : 'play'}
                                        />
                                    }
                                />
                            </Button.Group>
                            &nbsp;
                            <Popup
                                content="Selected time"
                                trigger={
                                    <Input
                                        value={moment.unix(timestamp).utc().format('YYYY-MM-DD HH:mm:ss')}
                                        readOnly={true}
                                    />
                                }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <ResponsiveContainer height={300}>
                                <ScatterChart
                                    data={tsData.timestamps.map((ts) => ({x: ts}))}
                                    onClick={handleClickChart}
                                >
                                    <XAxis
                                        dataKey="x"
                                        domain={[filteredTsData.minT, filteredTsData.maxT]}
                                        name={'Date Time'}
                                        tickFormatter={(dt) => moment.unix(dt).utc().format('YYYY/MM/DD')}
                                        type={'number'}
                                    />
                                    {filteredData.filter((p) => p.meta.axis === 'left').length > 0 &&
                                    <YAxis
                                        yAxisId="left"
                                        dataKey="y"
                                        name=""
                                        domain={[filteredTsData.left.min, filteredTsData.left.max]}
                                        label={{value: leftAxis, angle: -90, position: 'insideLeft'}}
                                    />
                                    }
                                    {filteredData.filter((p) => p.meta.axis === 'right').length > 0 &&
                                    <YAxis
                                        yAxisId="right"
                                        dataKey="y"
                                        name=""
                                        orientation="right"
                                        domain={[filteredTsData.right.min, filteredTsData.right.max]}
                                        label={{value: rightAxis, angle: -90, position: 'insideRight'}}
                                    />
                                    }
                                    {filteredData.filter((r) => r.meta.active).map((row, idx) => {
                                        return (
                                            <Scatter
                                                key={idx}
                                                yAxisId={row.meta.axis}
                                                data={LTOB(row.data, 100)}
                                                fill={row.meta.color}
                                                line={withLines ? {strokeWidth: 2, stroke: row.meta.color} : false}
                                                lineType={'joint'}
                                                name={'p'}
                                                shape={withLines ? <RenderNoShape/> : 'cross'}
                                            />
                                        );
                                    })}
                                    <ReferenceLine
                                        x={isAnimated ? filteredTsData.timestamps[timeRef.current] : timestamp}
                                        stroke="#000"
                                        strokeDasharray="3 3"
                                        yAxisId={
                                            filteredData.filter((p) => p.meta.axis === 'left').length > 0 ?
                                                'left' : 'right'
                                        }
                                    />
                                    {!!timeRange &&
                                    <ReferenceArea
                                        x1={timeRange[0]}
                                        x2={timeRange[1]}
                                        stroke="#1eb1ed"
                                        yAxisId={
                                            filteredData.filter((p) => p.meta.axis === 'left').length > 0 ?
                                                'left' : 'right'
                                        }
                                    />
                                    }
                                </ScatterChart>
                            </ResponsiveContainer>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={1}>
                                        <Popup
                                            content="Reset"
                                            trigger={
                                                <Button
                                                    onClick={handleClickReset}
                                                    icon="undo"
                                                    size="tiny"
                                                />
                                            }
                                        />
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
                </Grid>
            </Segment>
            <Segment color={'grey'} raised={true}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Button.Group>
                                <Popup
                                    content="Show color scale"
                                    trigger={
                                        <Button
                                            onClick={handleToggleScale}
                                            icon="chart pie"
                                            primary={showScale}
                                        />
                                    }
                                />
                            </Button.Group>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <VisualizationMap
                                showScale={showScale}
                                timestamp={timestamp}
                                timeRef={timeRef.current}
                                tsData={tsData}
                                parameters={props.parameters}
                                data={data}
                                rtm={props.rtm}
                                isAnimated={isAnimated}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </div>
    );
};

export default visualizationParameter;
