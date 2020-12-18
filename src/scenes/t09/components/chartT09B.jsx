import React from 'react';
import PropTypes from 'prop-types';
import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Line, Label
} from 'recharts'

import {Button, Grid, Icon, Segment} from 'semantic-ui-react';
import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';

function range(start, stop, step) {
    let a = [start], b = start;
    while (b < stop) {
        b += step;
        a.push(b)
    }
    return a;
}

export function calculateDiagramData(i, b, df, ds, start, stop, step) {

    const xRange = range(start, stop, step);
    let data = [];

    for (let ni = 0; ni < xRange.length; ni++) {
        let dataSet = {};
        const x = xRange[ni];
        const z = calculateZofX(x, i, b, df, ds);

        dataSet['x'] = -x;
        if (z <= b) {
            dataSet['z'] = -z;
        }
        dataSet['b'] = -b;
        data.unshift(dataSet);
    }

    return data;
}

export function calculateZ(i, b, df, ds) {
    return (i * b * df) / (ds - df);
}

export function calculateZofX(x, i, b, df, ds) {
    return Math.sqrt(
        ((2 * i * b * x) / (ds - df)) + (Math.pow((i * b * df) / (ds - df), 2))
    );
}

export function calculateL(i, b, df, ds) {
    return (i * b * df) / (2 * (ds - df));
}

export function calculateXT(i, b, rho_f, rho_s) {
    const frac1 = (i * b * rho_f) / (rho_s - rho_f);
    return ((b * b - frac1 * frac1) * (rho_s - rho_f)) / (2 * i * b);
}

const styles = {
    chart: {
        top: 20,
        right: 20,
        left: 20,
        bottom: 0
    }
};

const Chart = ({parameters}) => {
    const {b, i, df, ds} = getParameterValues(parameters);

    const yDomain = [-b, 0];
    const z = calculateZ(i, b, df, ds);
    const L = calculateL(i, b, df, ds);
    const xT = calculateXT(i, b, df, ds);
    const xDomain = [(Math.round(xT / 50) + 1) * 50, 0];
    const data = calculateDiagramData(i, b, df, ds, 0, (Math.round(xT / 50) + 1) * 50, 1);

    let currentChart;

    return (
        <div>
            <Grid>
                <Grid.Column>
                    <ResponsiveContainer width="100%" aspect={2.5}>
                    <LineChart
                        data={data}
                        margin={styles.chart}
                        ref={(chart) => currentChart = chart}
                    >
                        <XAxis
                            type="number"
                            domain={xDomain}
                            dataKey="x"
                            allowDecimals={false}
                            tickLine={false}
                        >
                            <Label value={'x [m]'} offset={0} position="bottom" fill={'#4C4C4C'} style={{fontSize: '13px'}}/>
                        </XAxis>
                        <YAxis
                            type="number"
                            domain={yDomain}
                            allowDecimals={false}
                            tickLine={false}
                            tickFormatter={(x) => x.toFixed(1)}
                        >
                            <Label
                                angle={270}
                                position='left'
                                style={{textAnchor: 'center', fontSize: '13px'}}
                                value={'z [m]'}
                                fill={'#4C4C4C'}
                            />
                        </YAxis>
                        <CartesianGrid strokeDasharray="3 3"/>
                        {/*<Line
                            dot={false}
                            isAnimationActive={false}
                            type="basis"
                            dataKey="b"
                            stroke="#000000"
                            strokeWidth="5"
                            fillOpacity={1}
                        />*/}
                        <Line
                            dot={false}
                            isAnimationActive={false}
                            type="basis"
                            dataKey="z"
                            stroke="#ED8D05"
                            strokeWidth="5"
                            fillOpacity={1}
                        />
                    </LineChart>
                </ResponsiveContainer>

                <Segment raised className={'diagramLabel topLeft'}>
                    <p>z<sub>0</sub>&nbsp;=&nbsp;<strong>{z.toFixed(1)}</strong>&nbsp;m</p>
                    <p>L&nbsp;=&nbsp;<strong>{L.toFixed(1)}</strong>&nbsp;m</p>
                    <p>x<sub>T</sub>&nbsp;=&nbsp;<strong>{xT.toFixed(1)}</strong>&nbsp;m</p>
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
    parameters: PropTypes.array.isRequired
};

export default Chart;
