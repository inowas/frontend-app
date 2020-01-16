import {LatLngExpression} from 'leaflet';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {CircleMarker, Map, Tooltip} from 'react-leaflet';
import {ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {Dimmer, Divider, Label, Loader, Segment} from 'semantic-ui-react';
import {BoundingBox} from '../../../../core/model/geometry';
import {DataSourceCollection, Rtm} from '../../../../core/model/rtm';
import {ProcessingCollection} from '../../../../core/model/rtm/processing';
import {ISensor} from '../../../../core/model/rtm/Sensor.type';
import {BasicTileLayer} from '../../../../services/geoTools/tileLayers';
import {ColorLegend} from '../../../shared/rasterData';
import {rainbowFactory} from '../../../shared/rasterData/helpers';
import {heatMapColors} from '../../../t05/defaults/gis';
import {TimeSlider} from './index';
import {IParameterWithMetaData} from './types';

interface IProps {
    parameters: IParameterWithMetaData[];
    rtm: Rtm;
    showScale: boolean;
}

interface ITimeStamps {
    minT: number;
    maxT: number;
    minV: number;
    maxV: number;
    timestamps: number[];
}

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
            });
        });
        return;
    }
    tsData.timestamps = tsData.timestamps.sort((a, b) => a - b);
    return onFinished(data, tsData);
};

const visualizationParameter = (props: IProps) => {
    const [isAnimated, setIsAnimated] = useState<boolean>(false);
    const [data, setData] = useState<IParameterWithMetaData[]>([]);
    const [tsData, setTsData] = useState<ITimeStamps>({minT: 0, maxT: 0, minV: 0, maxV: 0, timestamps: []});
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [timestamp, setTimestamp] = useState<number>(0);
    const [intervalId, setIntervalId] = useState();

    const timeRef = useRef<number>(0);

    const rainbow = rainbowFactory({
        min: tsData.minV,
        max: tsData.maxV
    }, heatMapColors.default);

    useEffect(() => {
        getData(cloneDeep(props.parameters), (rData, rTsData) => {
            setTsData(rTsData);
            setData(rData);
            setIsFetching(false);
            setTimestamp(0);
        });
    }, [props.parameters]);

    useEffect(() => {
        if (isAnimated) {
            timeRef.current = timestamp;
            setIntervalId(setInterval(() => {
                if (timeRef.current === tsData.timestamps.length - 1) {
                    timeRef.current = 0;
                } else {
                    timeRef.current = timeRef.current + 1;
                }
                setTimestamp(timeRef.current);
            }, 1000));
        } else {
            clearTimeout(intervalId);
            setTimestamp(timeRef.current);
        }
    }, [isAnimated]);

    // tslint:disable-next-line:variable-name
    const RenderNoShape = () => null;

    if (isFetching) {
        return (
            <Dimmer active={true} inverted={true}>
                <Loader inverted={true}>Loading</Loader>
            </Dimmer>
        );
    }

    const handleChangeSlider = (ts: number) => {
        const index = tsData.timestamps.indexOf(ts);
        return setTimestamp(index);
    };

    const handleTogglePlay = () => setIsAnimated(!isAnimated);

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

            if (props.showScale && tsData) {
                const row = parameter[0].data.filter((r) => r.x === tsData.timestamps[
                    isAnimated ? timeRef.current : timestamp
                    ]);
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
            <TimeSlider
                onChange={handleChangeSlider}
                onTogglePlay={handleTogglePlay}
                activeTimestamp={isAnimated ? timeRef.current : timestamp}
                isAnimated={isAnimated}
                timestamps={tsData.timestamps}
            />
            <Divider/>
            <Map
                zoom={1}
                bounds={calculateBoundingBox().getBoundsLatLng()}
                style={{
                    height: '400px',
                    width: '100%'
                }}
            >
                <BasicTileLayer/>
                {props.rtm.sensors.all.filter(
                    (s) => props.parameters.filter((p) => p.meta.active && p.sensor.id === s.id).length > 0
                ).map((s, sKey) => {
                    return renderMarker(sKey, s.toObject());
                })}
                {props.showScale && renderLegend()}
            </Map>
            <Segment color={'grey'} raised={true}>
                <Label color={'blue'} ribbon={true} size={'large'}>
                    Chart
                </Label>
                <ResponsiveContainer height={300}>
                    <ScatterChart>
                        <XAxis
                            dataKey={'x'}
                            domain={[tsData.minT, tsData.maxT]}
                            name={'Date Time'}
                            tickFormatter={(dt) => moment.unix(dt).format('YYYY/MM/DD')}
                            type={'number'}
                        />
                        <YAxis dataKey={'y'} name={''} domain={['auto', 'auto']}/>
                        {data.filter((r) => r.meta.active).map((row, idx) => (
                            <Scatter
                                key={idx}
                                data={row.data}
                                line={{strokeWidth: 2, stroke: row.meta.color}}
                                lineType={'joint'}
                                name={'p'}
                                shape={<RenderNoShape/>}
                            />
                        ))}
                        <ReferenceLine
                            x={tsData.timestamps[isAnimated ? timeRef.current : timestamp]}
                            stroke="#000"
                            strokeDasharray="3 3"
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </Segment>
        </div>
    );
};

export default visualizationParameter;
