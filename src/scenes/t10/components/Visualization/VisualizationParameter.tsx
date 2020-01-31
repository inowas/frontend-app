import {LTOB} from 'downsample';
import {XYDataPoint} from 'downsample/dist/types';
import {LatLngExpression} from 'leaflet';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import React, {MouseEvent, useEffect, useRef, useState} from 'react';
import {CircleMarker, Map, Tooltip} from 'react-leaflet';
import {ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {
    Button,
    ButtonProps,
    Dimmer,
    Grid, Input,
    Loader, Popup,
    Segment
} from 'semantic-ui-react';
import {BoundingBox} from '../../../../core/model/geometry';
import {DataSourceCollection, Rtm} from '../../../../core/model/rtm';
import {ProcessingCollection} from '../../../../core/model/rtm/processing';
import {ISensor} from '../../../../core/model/rtm/Sensor.type';
import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';
import {ColorLegend} from '../../../shared/rasterData';
import {rainbowFactory} from '../../../shared/rasterData/helpers';
import {heatMapColors} from '../../../t05/defaults/gis';
import {IParameterWithMetaData} from './types';

interface IProps {
    parameters: IParameterWithMetaData[];
    rtm: Rtm;
}

interface ITimeStamps {
    minT: number;
    maxT: number;
    minV: number;
    maxV: number;
    timestamps: number[];
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
    tsData: ITimeStamps = {minT: NaN, maxT: NaN, minV: NaN, maxV: NaN, timestamps: []},
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
                    if ((isNaN(tsData.minV) || row.value < tsData.minV) && row.value !== null) {
                        tsData.minV = row.value;
                    }
                    if ((isNaN(tsData.maxV) || row.value > tsData.maxV) && row.value !== null) {
                        tsData.maxV = row.value;
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

enum tools {
    DATETIME = 'datetime',
    DATETIME_MIN = 'datetimeMin',
    DATETIME_MAX = 'datetimeMax'
}

const visualizationParameter = (props: IProps) => {
    const [isAnimated, setIsAnimated] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(true);

    const [activeTool, setActiveTool] = useState<tools>(tools.DATETIME);
    const [withLines, setWithLines] = useState<boolean>(true);

    const [timestamp, setTimestamp] = useState<number>(0);
    const [intervalId, setIntervalId] = useState();

    const [data, setData] = useState<IParameterWithMetaData[]>([]);
    const [filteredData, setFilteredData] = useState<IParameterWithMetaData[]>([]);

    const [showScale, setShowScale] = useState<boolean>(false);

    const [tsData, setTsData] = useState<ITimeStamps>({minT: 0, maxT: 0, minV: 0, maxV: 0, timestamps: []});
    const [filteredTsData, setFilteredTsData] = useState<ITimeStamps>(
        {minT: 0, maxT: 0, minV: 0, maxV: 0, timestamps: []}
    );

    const timeRef = useRef<number>(0);

    const rainbow = rainbowFactory({
        min: tsData.minV,
        max: tsData.maxV
    }, heatMapColors.default);

    useEffect(() => {
        if (props.parameters.length > 0) {
            getData(cloneDeep(props.parameters), (rData, rTsData) => {
                setTsData(rTsData);
                setFilteredTsData(cloneDeep(rTsData));
                setData(rData);
                setFilteredData(cloneDeep(rData));
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

    if (isFetching) {
        return (
            <Dimmer active={true} inverted={true}>
                <Loader inverted={true}>Loading</Loader>
            </Dimmer>
        );
    }

    const handleClickReset = () => {
        setTimestamp(tsData.timestamps[0]);
        setFilteredTsData(cloneDeep(tsData));
    };

    const handleClickLines = () => {
        setWithLines(!withLines);
    };

    const handleClickChart = (e: any) => {
        if (activeTool === tools.DATETIME && e && e.xValue && typeof e.xValue === 'number') {
            return setTimestamp(getClosestValue(filteredTsData.timestamps, e.xValue));
        }
        if (activeTool === tools.DATETIME_MIN) {
            const datetime = Math.floor(e.xValue);
            if (timestamp < datetime) {
                setTimestamp(getClosestValue(filteredTsData.timestamps, datetime));
            }
            return setFilteredTsData({
                ...filteredTsData,
                minT: datetime
            });
        }
        if (activeTool === tools.DATETIME_MAX) {
            const datetime = Math.floor(e.xValue);
            if (timestamp > datetime) {
                setTimestamp(getClosestValue(filteredTsData.timestamps, datetime));
            }
            return setFilteredTsData({
                ...filteredTsData,
                maxT: datetime
            });
        }
    };

    const handleSelectTool = (e: MouseEvent, {name}: ButtonProps) => setActiveTool(name);

    const handleTogglePlay = () => setIsAnimated(!isAnimated);

    const handleToggleScale = () => setShowScale(!showScale);

    const calculateBoundingBox = () => {
        return BoundingBox.fromPoints(
            props.rtm.sensors.all.filter(
                (s) => props.parameters.filter((p) => p.sensor.id === s.id).length > 0
            ).map((s) => {
                return {
                    type: 'Point',
                    coordinates: [s.geolocation.coordinates[0], s.geolocation.coordinates[1]]
                };
            })
        );
    };

    const renderLegend = () => {
        const gradients = rainbow.gradients.slice().reverse();
        const lastGradient = gradients[gradients.length - 1];
        const legend = gradients.map((gradient) => ({
            color: '#' + gradient.endColor,
            value: Number(gradient.maxNum).toFixed(2)
        }));

        legend.push({
            color: '#' + lastGradient.startColor,
            value: Number(lastGradient.minNum).toFixed(2)
        });
        return <ColorLegend legend={legend} unit={''}/>;
    };

    const renderMarker = (key: number, sensor: ISensor) => {
        const parameter = data.filter((p) => p.sensor.id === sensor.id);
        if (parameter.length > 0) {
            let fillColor = parameter[0].meta.color;
            let fillOpacity = 0.8;
            let value = null;

            if (showScale && tsData) {
                const row = parameter[0].data.filter((r) => r.x === (isAnimated ? tsData.timestamps[
                    timeRef.current] : timestamp));
                if (row.length > 0) {
                    value = row[0].y;
                    fillColor = `#${rainbow.colorAt(row[0].y)}`;
                } else {
                    fillColor = `#000`;
                    fillOpacity = 0.3;
                }
            }

            return (
                <CircleMarker
                    center={
                        [
                            sensor.geolocation.coordinates[1],
                            sensor.geolocation.coordinates[0]
                        ] as LatLngExpression
                    }
                    fillColor={fillColor}
                    fillOpacity={fillOpacity}
                    key={key}
                    radius={10}
                    stroke={false}
                >
                    <Tooltip direction="top">
                        {sensor.name} {value ? `(${value})` : null}
                    </Tooltip>
                </CircleMarker>
            );
        }
        return null;
    };

    return (
        <div>
            <Segment color={'grey'} raised={true}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Button.Group>
                                <Popup
                                    content="Reset"
                                    trigger={
                                        <Button
                                            onClick={handleClickReset}
                                            icon="undo"
                                        />
                                    }
                                />
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
                            <Button.Group>
                                <Popup
                                    content="Select time"
                                    trigger={
                                        <Button
                                            onClick={handleSelectTool}
                                            name={tools.DATETIME}
                                            primary={activeTool === tools.DATETIME}
                                            icon="mouse pointer"
                                        />
                                    }
                                />
                                <Popup
                                    content="Select lower time limit"
                                    trigger={
                                        <Button
                                            onClick={handleSelectTool}
                                            name={tools.DATETIME_MIN}
                                            primary={activeTool === tools.DATETIME_MIN}
                                            icon="arrow alternate circle right"
                                        />
                                    }
                                />
                                <Popup
                                    content="Select upper time limit"
                                    trigger={
                                        <Button
                                            onClick={handleSelectTool}
                                            name={tools.DATETIME_MAX}
                                            primary={activeTool === tools.DATETIME_MAX}
                                            icon="arrow alternate circle left"
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
                                <ScatterChart onClick={handleClickChart}>
                                    <XAxis
                                        dataKey={'x'}
                                        domain={[filteredTsData.minT, filteredTsData.maxT]}
                                        name={'Date Time'}
                                        tickFormatter={(dt) => moment.unix(dt).utc().format('YYYY/MM/DD')}
                                        type={'number'}
                                    />
                                    <YAxis dataKey={'y'} name={''} domain={[filteredTsData.minV, filteredTsData.maxV]}/>
                                    {filteredData.filter((r) => r.meta.active).map((row, idx) => {
                                        return (
                                            <Scatter
                                                key={idx}
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
                                    />
                                </ScatterChart>
                            </ResponsiveContainer>
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
                            <Map
                                maxZoom={19}
                                bounds={calculateBoundingBox().getBoundsLatLng()}
                                style={{
                                    height: '400px',
                                    width: '100%'
                                }}
                            >
                                <BasicTileLayer/>
                                {props.rtm.sensors.all.filter(
                                    (s) => props.parameters.filter(
                                        (p) => p.meta.active && p.sensor.id === s.id
                                    ).length > 0
                                ).map((s, sKey) => {
                                    return renderMarker(sKey, s.toObject());
                                })}
                                {showScale && renderLegend()}
                            </Map>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </div>
    );
};

export default visualizationParameter;
