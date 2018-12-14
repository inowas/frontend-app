import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';

import {
    ResponsiveContainer,
    Label,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine
} from 'recharts';

import {Button, Grid, Segment} from 'semantic-ui-react';
import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';

function range(start, stop, step) {
    let a = [start], b = start;
    while (b < stop) {
        b += step;
        a.push(b)
    }
    return a;
}

export function calculateDiagramData(q, k, d, df, ds, start, stop, step) {

    const xRange = range(start, stop, step);
    let data = [];
    for (let i = 0; i < xRange.length; i++) {
        let dataSet = {};
        const x = xRange[i];

        // eslint-disable-next-line no-unused-vars
        const h = calculateZ(q, k, d, df, ds);
        dataSet['x'] = Number(x);
        dataSet['h'] = calculateZofX(x, q, d, k, ds, df);
        data.push(dataSet);
    }
    return data;
}

export function calculateZCrit(d) {
    return 0.3 * d;
}

export function calculateZ(q, k, d, df, ds) {
    return (q / (2 * Math.PI * d * k * dRo(df, ds)));
}

export function dRo(df, ds) {
    return ((ds - df) / df);
}

export function calculateR(x, d) {
    return x / d;
}

export function calculateT(df, ds, k, d) {
    const t = 1000000000;
    const n = 0.25;
    const deltaS = dRo(df, ds);
    return (deltaS * k * t) / (n * d * (2 + deltaS));
}

export function calculateZofX(x, q, d, k, ds, df) {
    return (1 / (Math.sqrt(Math.pow(calculateR(x, d), 2) + 1)) - (1 / (Math.sqrt(Math.pow(calculateR(x, d), 2) + Math.pow(1 + calculateT(df, ds, k, d), 2))))) * calculateZ(q, k, d, df, ds);
}

export function calculateQ(k, d, df, ds) {
    return (0.6 * Math.PI * d * d * k * dRo(df, ds));
}

const styles = {
    chart: {
        top: 15,
        right: 30,
        left: 20,
        bottom: 15
    },
    diagramLabel: {
        position: 'absolute',
        top: '65px',
        right: '60px',
        background: '#EFF3F6',
        opacity: 0.9
    },
    downloadButtons: {
        position: 'absolute',
        top: '40px',
        right: '55px'
    }
};

const Chart = ({parameters}) => {
    const {q, k, d, df, ds} = getParameterValues(parameters);
    const data = calculateDiagramData(q, k, d, df, ds, 0, 1000, 1);
    const yDomain = [0, 2 * calculateZCrit(d)];
    const z = calculateZ(q, k, d, df, ds);
    const qmax = calculateQ(k, d, df, ds);
    const zCrit = calculateZCrit(d);

    let currentChart;

    return (
        <div>
            <Grid>
                <Grid.Column>
                    <ResponsiveContainer width={'100%'} aspect={2}>
                        <LineChart
                            data={data}
                            margin={styles.chart}
                            ref={(chart) => currentChart = chart}
                        >
                            <XAxis type="number" dataKey="x">
                                <Label
                                    value={'x [m]'}
                                    offset={0}
                                    position="bottom"
                                    fill={'#4C4C4C'}
                                />
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
                                    style={{textAnchor: 'center'}}
                                    value={'d [m]'}
                                    fill={'#4C4C4C'}
                                />
                            </YAxis>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Line
                                isAnimationActive={false}
                                type="basis"
                                dataKey={'h'}
                                stroke="#ED8D05"
                                strokeWidth="5"
                                dot={false}
                            />
                            <ReferenceLine y={zCrit} stroke="#ED8D05" strokeWidth="5" strokeDasharray="20 20"/>
                        </LineChart>
                    </ResponsiveContainer>

                    <Segment raised style={styles.diagramLabel}>
                        <p>z&nbsp;=&nbsp;<strong>{z.toFixed(1)}</strong>&nbsp;m</p>
                        Q<sub>max</sub>&nbsp;=&nbsp;<strong>{qmax.toFixed(1)}</strong>&nbsp;m<sup>3</sup>/d
                    </Segment>

                    <div style={styles.downloadButtons}>
                        <Button
                            size={'tiny'}
                            color={'grey'}
                            content='JPG'
                            onClick={() => exportChartImage(currentChart)}
                        />
                        <Button
                            size={'tiny'}
                            color={'grey'}
                            content='CSV'
                            onClick={() => exportChartData(currentChart)}
                        />
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
