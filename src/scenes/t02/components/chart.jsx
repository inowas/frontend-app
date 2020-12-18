import React from 'react';
import PropTypes from 'prop-types';
import {mounding} from 'gwflowjs/lib/library';

import {
    CartesianGrid, Label,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';
import {Button, Grid, Icon, Segment} from 'semantic-ui-react';
import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';

const styles = {
    diagram: {
        position: 'relative'
    },
    chart: {
        top: 20,
        right: 20,
        left: 20,
        bottom: 0
    }
};


const calculateDiagramData = (variable, w, L, W, hi, Sy, K, t, min, max, stepSize) => {
    const data = [];
    if (variable === 'x') {
        for (let x = min; x < max; x += stepSize) {
            data.push({x: x / 2, hhi: mounding.calculateHi(x, 0, w, L, W, hi, Sy, K, t)});
        }

        data.push({x: max / 2, hhi: mounding.calculateHi(max, 0, w, L, W, hi, Sy, K, t)});
    } else {
        for (let y = min; y < max; y += stepSize) {
            data.push({y: y / 2, hhi: mounding.calculateHi(0, y, w, L, W, hi, Sy, K, t)});
        }

        data.push({y: max / 2, hhi: mounding.calculateHi(0, max, w, L, W, hi, Sy, K, t)});
    }

    return data;
};

const calculateChartXMax = (variable, w, L, W, hi, Sy, K, t) => {
    if (variable === 'x') {
        for (let x = 0; x < 10000; x += 10) {
            const result = mounding.calculateHi(x, 0, w, L, W, hi, Sy, K, t);
            if (result <= 0.01) {
                return x;
            }
        }
        return 0;
    }

    for (let y = 0; y < 10000; y += 10) {
        const result = mounding.calculateHi(0, y, w, L, W, hi, Sy, K, t);
        if (result <= 0.01) {
            // noinspection JSSuspiciousNameCombination
            return y;
        }
    }

    return 0;
};

const Chart = ({settings, parameters}) => {
    const variable = settings.variable;
    const {L, W, w, hi, Sy, K, t} = getParameterValues(parameters);

    let chartXMaxFromBasin = 2 * L;
    if (variable === 'x') {
        chartXMaxFromBasin = 2 * W;
    }

    let chartXMax;
    const chartXMaxFromCurve = calculateChartXMax(variable, w, L, W, hi, Sy, K, t);
    if (chartXMaxFromCurve < chartXMaxFromBasin) {
        chartXMax = chartXMaxFromBasin;
    } else {
        chartXMax = chartXMaxFromCurve;
    }

    const data = calculateDiagramData(variable, w, L, W, hi, Sy, K, t, 0, chartXMax, Math.ceil(chartXMax / 10));
    const hMax = data[0].hhi + hi;

    let xAxis = (
        <XAxis type="number" dataKey="y">
            <Label
                fill={'#4C4C4C'}
                value='y [m]'
                offset={0}
                position="bottom"
            />
        </XAxis>
    );
    let rLabel = 'L/2';

    if (variable === 'x') {
        xAxis = (
            <XAxis type="number" dataKey="x" tick={{fontSize: 'small', transform: 'translate(0, 5)'}}>
                <Label
                    fill={'#4C4C4C'}
                    value='x [m]'
                    offset={0}
                    position="bottom"
                    style={{fontSize: '13px'}}
                />
            </XAxis>
        );
        rLabel = 'W/2';
    }

    let currentChart;

    return (
        <div>
            <Grid>
                <Grid.Column>
                    <ResponsiveContainer width={'100%'} aspect={2.5}>
                        <LineChart
                            data={data}
                            margin={styles.chart}
                            ref={(chart) => currentChart = chart}
                        >
                            {xAxis}
                            <YAxis type="number" tickLine={false} tick={{fontSize: 'small', transform: 'translate(-3, 0)'}}>
                                <Label
                                    angle={270}
                                    fill={'#4C4C4C'}
                                    position='left'
                                    style={{textAnchor: 'center', fontSize: '13px'}}
                                    value={'h-hᵢ [m]'}
                                />
                            </YAxis>
                            <CartesianGrid strokeDasharray="3 3"  />
                            <Line
                                isAnimationActive={false}
                                type="basis"
                                dataKey={'hhi'}
                                stroke="#1EB1ED"
                                strokeWidth="5" dot={false}
                            />
                            <ReferenceLine
                                x={chartXMaxFromBasin / 4}
                                stroke="black"
                                strokeWidth="3"
                                label={{position: 'top', value: rLabel}}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <Segment raised className={'diagramLabel topRight'}>
                        <p>h<sub>max</sub>&nbsp;=&nbsp;<strong>{hMax.toFixed(2)}</strong>&nbsp;m</p>
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
    settings: PropTypes.object.isRequired,
    parameters: PropTypes.array.isRequired
};

export default Chart;
