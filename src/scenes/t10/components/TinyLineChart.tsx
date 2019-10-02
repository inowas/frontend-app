import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Line, LineChart, YAxis} from 'recharts';
import {fetchUrl} from '../../../services/api';

interface IProps {
    url?: string;
}

const tinyLineChart = (props: IProps) => {

    const [data, setData] = useState<any | null>(null);
    const [fetching, setFetching] = useState<boolean>(false);
    const [fetchingError, setFetchingError] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
    }, [props.url]);

    const fetchData = () => {
        fetchUrl(
            props.url + '&timeResolution=1D',
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
        return (
            <LineChart width={100} height={30} data={data}>
                <YAxis dataKey={'value'} domain={['auto', 'auto']} hide={true}/>
                <Line type="monotone" dataKey="value" dot={false}/>
            </LineChart>
        );
    }

    return null;
};

export default tinyLineChart;
