import {LTOB} from 'downsample';
// @ts-ignore todo
import {DataPoint} from 'downsample/dist/types';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {Button, Icon} from 'semantic-ui-react';
import {DataSourceCollection} from '../../../core/model/rtm';
import ProcessingCollection from '../../../core/model/rtm/processing/ProcessingCollection';
import {IDateTimeValue} from '../../../core/model/rtm/Sensor.type';
import {exportChartData, exportChartImage} from '../../shared/simpleTools/helpers';

interface IProps {
    dataSources: DataSourceCollection;
    processings?: ProcessingCollection;
    unit?: string;
}

const DataSourcesChart = (props: IProps) => {
    const [data, setData] = useState<IDateTimeValue[] | null>(null);
    const chartRef = useRef<ScatterChart>(null);

    useEffect(() => {
        async function f() {
            const mergedData = await props.dataSources.mergedData();

            if (props.processings instanceof ProcessingCollection) {
                return setData(await props.processings.apply(mergedData));
            }

            return setData(mergedData);
        }

        f();

    }, [props.dataSources, props.processings]);

    const formatDateTimeTicks = (dt: number) => {
        return moment.unix(dt).format('YYYY/MM/DD');
    };

    // tslint:disable-next-line:variable-name
    const RenderNoShape = () => null;

    if (!data || data.length === 0) {
        return null;
    }

    const downSampledDataLTOB: DataPoint[] = LTOB(data.map((ds) => ({
        x: ds.timeStamp,
        y: ds.value
    })), 500);

    const handleExportChartData = () => chartRef.current ? exportChartData(chartRef.current) : null;

    const handleExportChartImage = () => chartRef.current ? exportChartImage(chartRef.current) : null;

    return (
        <div>
            <ResponsiveContainer height={300}>
                <ScatterChart
                    data={data}
                    ref={chartRef}
                >
                    <XAxis
                        dataKey={'x'}
                        domain={[data[0].timeStamp, data[data.length - 1].timeStamp]}
                        name={'Date Time'}
                        tickFormatter={formatDateTimeTicks}
                        type={'number'}
                    />
                    <YAxis
                        label={props.unit ? {value: props.unit, angle: -90, position: 'insideLeft'} : undefined}
                        dataKey={'y'}
                        name={''}
                        domain={['auto', 'auto']}
                    />
                    <Scatter
                        data={downSampledDataLTOB}
                        line={{strokeWidth: 2, stroke: '#3498DB'}}
                        lineType={'joint'}
                        name={'p'}
                        shape={<RenderNoShape/>}
                    />);
                </ScatterChart>
            </ResponsiveContainer>
            <div className="downloadButtons">
                <Button
                    compact={true}
                    basic={true}
                    icon={true}
                    size={'small'}
                    onClick={handleExportChartImage}
                >
                    <Icon name="download"/> JPG
                </Button>
                <Button
                    compact={true}
                    basic={true}
                    icon={true}
                    size={'small'}
                    onClick={handleExportChartData}
                >
                    <Icon name="download"/> CSV
                </Button>
            </div>
        </div>
    );
};

export default DataSourcesChart;
