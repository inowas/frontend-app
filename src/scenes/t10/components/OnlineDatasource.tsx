import {cloneDeep} from 'lodash';
import moment from 'moment';
import React, {useState} from 'react';
import {ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis} from 'recharts';
import {Form, Grid} from 'semantic-ui-react';
import {IDataSource, IDateTimeValue} from '../../../core/model/rtm/Sensor.type';
import {fetchSensorData} from '../../../services/api';

interface IProps {
    datasource: IDataSource;
    onChange: (ds: IDataSource) => void;
}

const onlineDataSource = (props: IProps) => {

    const [data, setData] = useState<IDateTimeValue[] | null>(null);

    const handleChangeDataSource = (type: string) => (e: any, d: any) => {
        const ds = cloneDeep(props.datasource);

        switch (type) {
            case 'type':
                ds.type = d.value;
                break;
            case 'query':
                ds.query = d.value;
                break;
            case 'server':
                ds.server = d.value;
                break;
        }

        props.onChange(ds);
    };

    const executeQuery = () => {
        const {server, query} = props.datasource;
        if (!server || !query) {
            return;
        }

        fetchSensorData(
            {server, query},
            (response: any) => {
                const d: any = response.map((ds: any) => {
                    const timeStamp = moment.utc(ds.date_time).unix();
                    delete ds.date_time;
                    return {
                        ...ds, timeStamp
                    };
                });
                setData(d);
            },
            () => console.log('Error')
        );
    };

    const formatDateTimeTicks = (dt: number) => {
        return moment.unix(dt).format('YYYY/MM/DD');
    };

    const renderChart = () => {
        if (!data) {
            return null;
        }

        const property = 'ph';
        return (
            <ResponsiveContainer height={200}>
                <ScatterChart>
                    <XAxis
                        dataKey={'timeStamp'}
                        domain={['auto', 'auto']}
                        name={'Date Time'}
                        tickFormatter={formatDateTimeTicks}
                        type={'number'}
                    />
                    <YAxis dataKey={property} name={property}/>
                    <Scatter
                        data={data}
                        line={{stroke: '#eee'}}
                        lineJointType={'monotoneX'}
                        lineType={'joint'}
                        name={property}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        );
    };

    return (
        <Grid padded={true}>
            <Grid.Row>
                <Grid.Column width={8}>
                    <Form>
                        <Form.Input
                            label={'Server'}
                            name={'server'}
                            value={props.datasource.server || ''}
                            onChange={handleChangeDataSource('server')}
                        />
                        <Form.Input
                            label={'Query'}
                            name={'query'}
                            value={props.datasource.query || ''}
                            onChange={handleChangeDataSource('query')}
                        />
                        <Form.Button onClick={executeQuery}>Run</Form.Button>
                    </Form>
                </Grid.Column>
                <Grid.Column width={8}>
                    {renderChart()}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default onlineDataSource;
