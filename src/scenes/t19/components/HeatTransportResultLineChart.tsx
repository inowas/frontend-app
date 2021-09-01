import {
    CartesianGrid,
    Label, Line, LineChart,
    ReferenceDot,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {IHeatTransportResults} from '../../../core/model/htm/Htm.type';
import {SemanticCOLORS} from 'semantic-ui-react/dist/commonjs/generic';
import {calculateDomain, formatLabel} from './helpers';
import CustomTooltip from './CustomTooltip';
import React, {useEffect, useState} from 'react';
import moment from 'moment';

interface IReferencePoint {
    fill: SemanticCOLORS;
    x: number;
    y: number;
    type: string;
}

interface IProps {
    data: Array<{
        x: number;
        obs: number;
        sim: number
    }>;
    dateTimeFormat: string;
    results: IHeatTransportResults;
    timesteps?: [number, number];
    type: string;
    useSameTimes?: boolean;
}

const HeatTransportResultChart = (props: IProps) => {
    const updateDomain = (p: IReferencePoint[]): [number, number] => {
        if (props.timesteps && props.useSameTimes) {
            return props.timesteps;
        }
        return calculateDomain(props.data, p);
    };

    const [domain, setDomain] = useState<[number, number]>();
    const [points, setPoints] = useState<IReferencePoint[]>()

    useEffect(() => {
        const p = props.results.points.filter((point) => point.label.includes(props.type)).map((point) => ({
            fill: point.point_type === 'max' ? 'red' : (point.point_type === 'min' ? 'green' : 'blue'),
            x: moment(point.date).unix(),
            y: point.simulated,
            type: point.point_type
        } as IReferencePoint));
        setPoints(p);
        setDomain(updateDomain(p));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data, props.results, props.timesteps]);

    const formatDateTimeTicks = (dt: number) => {
        return moment.unix(dt).format(props.dateTimeFormat);
    };

    const formatTemperatureTicks = (t: number) => {
        return t.toFixed(2);
    };

    const getTicks = () => {
        if (domain) {
            const dateStart = moment.unix(domain[0]);
            const dateEnd = moment.unix(domain[1]);
            const interim = dateStart.clone();
            const timeValues: number[] = [];

            while (dateEnd > interim || interim.format('M') === dateEnd.format('M')) {
                timeValues.push(moment(interim.format('YYYY-MM')).unix());
                interim.add(1, 'month');
            }
            return timeValues;
        }
        return undefined;
    };

    if (!points || !domain) {
        return null;
    }

    return (
        <ResponsiveContainer height={300}>
            <LineChart
              data={props.data}
              syncId={props.useSameTimes ? 'syncedChart' : undefined}
              syncMethod="value"
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis
                    dataKey={'x'}
                    domain={domain}
                    tickFormatter={formatDateTimeTicks}
                    ticks={getTicks()}
                    type={'number'}
                />
                <YAxis
                    label={{value: 'T [°C]', angle: -90, position: 'insideLeft'}}
                    tickFormatter={formatTemperatureTicks}
                />
                <Line dot={false} type="monotone" dataKey="obs" stroke="#3498DB" strokeWidth={2}/>
                <Line dot={false} type="monotone" dataKey="sim" stroke="#db3434" strokeWidth={2}/>
                <Tooltip content={
                    <CustomTooltip
                        colors={{obs: '#3498DB', sim: '#db3434'}}
                        dateTimeFormat={props.dateTimeFormat}
                    />
                }
                />
                {points.map((point, key) => (
                    <ReferenceDot
                        key={key}
                        label={
                            <Label
                                fill={point.fill}
                                fontSize={12}
                                offset={5}
                                position="top"
                                value={formatLabel(point.type)}
                            />
                        }
                        x={point.x}
                        y={point.y}
                        r={10}
                        fill={point.fill}
                        fillOpacity={0.4}
                        stroke="none"
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default HeatTransportResultChart;
