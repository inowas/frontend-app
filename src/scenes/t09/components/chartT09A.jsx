import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';

import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer,
} from 'recharts';

import {Button, Grid, Icon, Segment} from 'semantic-ui-react';
import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';


const calculateZ = (h, df, ds) => {
    return (df * h) / (ds - df);
};

const calculateDiagramData = (h, df, ds) => {
    const z = calculateZ(h, df, ds);
    return [{name: '', h, z}];
};

const styles = {
    chart: {
        top: 20,
        right: 20,
        left: 20,
        bottom: 0
    }
};

const Chart = ({parameters}) => {
    const {h, df, ds} = getParameterValues(parameters);
    const data = calculateDiagramData(h, df, ds);
    const z = calculateZ(h, df, ds);

    let currentChart;

    return (
        <div>
            <Grid>
                <Grid.Column>
                    <ResponsiveContainer width="100%" aspect={2.5}>
                        <BarChart
                            data={data}
                            barSize={100}
                            margin={styles.chart}
                            ref={(chart) => currentChart = chart}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis tick={false} orientation='top' />
                            <YAxis reversed/>
                            <Bar isAnimationActive={false} dataKey="h" stackId="a" name="Freshwater thickness above sea level, h" fill="#1EB1ED"/>
                            <Bar isAnimationActive={false} dataKey="z" stackId="a" name="Freshwater thickness below sea level, z" fill="#DBF3FD"/>
                            <Legend layout="vertical" height={28}/>
                        </BarChart>
                    </ResponsiveContainer>

                    <Segment raised className='diagramLabel bottomRight'>
                        <p>h&nbsp;=&nbsp;<strong>{h.toFixed(1)}</strong>&nbsp;m</p>
                        <p>z&nbsp;=&nbsp;<strong>{z.toFixed(1)}</strong>&nbsp;m</p>
                    </Segment>

                    <div className='downloadButtons'>
                        <Button compact basic icon
                                size={'small'}
                                onClick={() => exportChartImage(currentChart)}
                        >
                            <Icon name='download' /> JPG
                        </Button>
                        <Button compact basic icon
                                size={'small'}
                                onClick={() => exportChartData(currentChart)}
                        >
                            <Icon name='download' /> CSV
                        </Button>
                    </div>
                </Grid.Column>
            </Grid>
        </div>
    );
};

Chart.propTypes = {
    parameters: PropTypes.array.isRequired,
};

export default pure(Chart);
