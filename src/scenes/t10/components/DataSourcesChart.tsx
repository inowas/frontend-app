import {cloneDeep} from 'lodash';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {IDataSource, IDateTimeValue} from '../../../core/model/rtm/Sensor.type';
import {fetchUrl} from '../../../services/api';
import {colors} from '../defaults';

interface IProps {
    dataSources: IDataSource[];
}

interface IEnhancedDataSource extends IDataSource {
    data?: IDateTimeValue[];
    fetching: boolean;
    fetchingError: boolean;
}

const dataSourcesChart = (props: IProps) => {

    const [dataSources, setDataSources] = useState<IEnhancedDataSource[]>([]);

    useEffect(() => {
        const dss = props.dataSources.map((ds: IDataSource) => ({
            ...ds,
            data: undefined,
            fetching: false,
            fetchingError: false
        }));

        setDataSources(dss);

        dss.forEach((ds) => fetchData(ds));
    }, [props.dataSources]);

    useEffect(() => {
        dataSources.forEach((ds) => {
            if (!ds.data && !ds.fetching) {
                fetchData(ds);
            }
        });
    }, [dataSources]);

    const updateDs = (uDs: IEnhancedDataSource) => {
        setDataSources(dataSources.map((ds) => {
            if (ds.url === uDs.url) {
                return uDs;
            }

            return ds;
        }));
    };

    const fetchData = (ds: IEnhancedDataSource) => {
        ds = cloneDeep(ds);
        if (!ds.url) {
            return;
        }

        fetchUrl(
            ds.url,
            (response: any) => {
                ds.data = response.map((dtv: any) => {
                    const [dateTime, value] = Object.values(dtv);
                    return {
                        timeStamp: moment.utc(dateTime).unix(),
                        value
                    };
                });
                ds.fetching = false;
                ds.fetchingError = false;
                updateDs(ds);
            },

            () => {
                ds.data = undefined;
                ds.fetching = false;
                ds.fetchingError = true;
                updateDs(ds);
            });
    };

    const formatDateTimeTicks = (dt: number) => {
        return moment.unix(dt).format('YYYY/MM/DD');
    };

    // tslint:disable-next-line:variable-name
    const RenderNoShape = () => null;

    const renderReferenceArea = (ds: IEnhancedDataSource, idx: number) => {
        if (!ds.data) {
            return;
        }

        const begin = ds.timeRange[0] ? ds.timeRange[0] : ds.data[0].timeStamp;
        const end = ds.timeRange[1] ? ds.timeRange[0] : ds.data[ds.data.length - 1].timeStamp;

        if (begin === null || end === null) {
            return;
        }

        return (
            <ReferenceLine key={idx} x={begin} stroke={colors[idx]} strokeWidth={3}/>
        );
    };

    console.log(dataSources);

    return (
        <ResponsiveContainer height={300}>
            <ScatterChart>
                <XAxis
                    dataKey={'timeStamp'}
                    domain={['auto', 'auto']}
                    name={'Date Time'}
                    tickFormatter={formatDateTimeTicks}
                    type={'number'}
                />
                <YAxis dataKey={'value'} name={''} domain={['auto', 'auto']}/>
                {dataSources.map((ds, idx) => (renderReferenceArea(ds, idx)))}
                {dataSources.map((ds, idx) => {
                    if (ds.data) {
                        return (
                            <Scatter
                                key={idx}
                                data={ds.data}
                                line={{stroke: colors[idx], strokeWidth: 2}}
                                lineType={'joint'}
                                name={'p'}
                                shape={<RenderNoShape/>}
                            />);
                    }
                })}
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default dataSourcesChart;
