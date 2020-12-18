import {calcDQ, calculateDiagramData} from '../calculations/calculationT14B';

import PropTypes from 'prop-types';
import React from 'react';

import {
    CartesianGrid,
    Label,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis, YAxis
} from 'recharts';

import {Button, Grid, Icon, Segment} from 'semantic-ui-react';
import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers/index';

const styles = {
    chart: {
        top: 20,
        right: 20,
        left: 20,
        bottom: 0
    }
};

let currentChart;

const renderLabels = (dQ) => {
    return (
        <div>
            <Segment raised className='diagramLabel bottomRight'>
                <p>&#916;Q&nbsp;=&nbsp;<strong>{dQ.toFixed(1)}</strong>&nbsp;m³/d</p>
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
        </div>
    );
};

const Chart = ({parameters}) => {
    const {Qw, t, S, T, d, K, Kdash, bdash} = getParameterValues(parameters);
    const L = K * bdash / Kdash;
    const data = calculateDiagramData(Qw, S, T, d, 0, t, L, 1);
    const dQ = calcDQ(d, S, T, t, L, Qw);

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
                            <XAxis
                                type="number"
                                dataKey="t"
                                allowDecimals={false}
                                tickLine={false}
                            >
                                <Label
                                    value={'T [d]'}
                                    offset={0}
                                    position="bottom"
                                    fill={'#4C4C4C'}
                                    style={{fontSize: '13px'}}
                                />
                            </XAxis>
                            <YAxis
                                type="number"
                                domain={[0, 'auto']}
                                allowDecimals={false}
                                tickLine={false}
                                tickFormatter={(x) => x.toFixed(1)}
                            >
                                <Label
                                    angle={270}
                                    position='left'
                                    style={{textAnchor: 'center', fontSize: '13px'}}
                                    value={'dQ [m³/d]'}
                                    fill={'#4C4C4C'}
                                />
                            </YAxis>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Line
                                isAnimationActive={false}
                                type="basis"
                                dataKey={'dQ'}
                                stroke="#4C4C4C"
                                strokeWidth="5"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    {renderLabels(dQ)}
                </Grid.Column>
            </Grid>
        </div>
    );
};

Chart.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default Chart;
