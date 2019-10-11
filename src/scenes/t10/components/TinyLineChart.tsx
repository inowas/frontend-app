import {LTOB} from 'downsample';
import {DataPoint} from 'downsample/dist/types';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Line, LineChart, YAxis} from 'recharts';
import {IDateTimeValue} from '../../../core/model/rtm/Sensor.type';
import {fetchUrl} from '../../../services/api';

interface IProps {
    url?: string;
    color?: string;
}

const tinyLineChart = (props: IProps) => {

    const [data, setData] = useState<any | null>(null);
    const [fetching, setFetching] = useState<boolean>(false);
    const [fetchingError, setFetchingError] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
    }, [props.url]);

    const fetchData = () => {
        if (!props.url) {
            return;
        }

        fetchUrl(
            props.url,
            (response: any) => {
                const r = response.map((ds: any) => {
                    const [dateTime, value] = Object.values(ds);
                    return {
                        timeStamp: moment.utc(dateTime).unix(),
                        value
                    };
                });

                setData(r);
                setFetching(false);
                setFetchingError(false);
            },

            () => {
                setData(null);
                setFetching(false);
                setFetchingError(true);
            });
    };

    if (fetching) {
        return (
            <span>LOADING</span>
        );
    }

    if (fetchingError) {
        return (
            <span>Fetching error</span>
        );
    }

    if (data) {

        const downSampledDataLTOB: DataPoint[] = LTOB(data.map((ds: IDateTimeValue) => ({
            x: ds.timeStamp,
            y: ds.value
        })), 100);

        return (
            <LineChart width={100} height={30} data={downSampledDataLTOB}>
                <YAxis dataKey={'y'} domain={['auto', 'auto']} hide={true}/>
                <Line type="monotone" dataKey="y" dot={false} stroke={props.color ? props.color : 'purple'}/>
            </LineChart>
        );
    }

    return null;
};

export default tinyLineChart;
