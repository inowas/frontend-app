import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';
import {calculateDiagramData, calcDQ} from '../calculations/calculationT14A';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid, Label
} from 'recharts';

import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';
import {Button, Grid, Icon, Segment} from 'semantic-ui-react';

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
            <Segment padded className='diagramLabel bottomRight'>
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
    const {Qw, t, S, T, d} = getParameterValues(parameters);
    const data = calculateDiagramData(Qw, S, T, d, 0, t, 1);
    const dQ = calcDQ(Qw, d, S, T, t);

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
                </Grid.Column>
            </Grid>
            {renderLabels(dQ)}
        </div>
    )
};

Chart.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Chart);
