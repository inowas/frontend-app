import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Label
} from 'recharts';

import {calculateTravelTimeT13E} from '../calculations';

import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';
import {Button, Grid, Header, Segment} from 'semantic-ui-react';

const calculateDiagramData = (Qw, ne, hL, h0, x, xi) => {
    const data = [];
    for (let i = x; i <= xi; i += 10) {
        data.push({
            x: i,
            t: calculateTravelTimeT13E(i, h0, hL, x, ne, Qw)
        });
    }
    return data;
};

let currentChart;

const styles = {
    chart: {
        top: 20,
        right: 20,
        left: 30,
        bottom: 20
    },
    diagramLabel: {
        position: 'absolute',
        top: '75px',
        left: '55px',
        background: '#EFF3F6',
        opacity: 0.9
    },
    downloadButtons: {
        position: 'absolute',
        top: '45px',
        left: '55px'
    }
};

const Chart = ({parameters}) => {

    const {Qw, ne, hL, h0, xi, x} = getParameterValues(parameters);
    const data = calculateDiagramData(Qw, ne, hL, h0, x, xi);
    const tMax = calculateTravelTimeT13E(xi, h0, hL, x, ne, Qw);

    return (
        <div>
            <Header as={'h3'} textAlign='center'>Calculation</Header>
            <Grid>
                <Grid.Column>
                    <ResponsiveContainer width={'100%'} aspect={2}>
                        <LineChart
                            data={data}
                            margin={styles.chart}
                            ref={(chart) => currentChart = chart}
                        >
                            <XAxis type="number"
                                   domain={['auto', 'auto']}
                                   dataKey="x"
                                   allowDecimals={false}
                                   tickLine={false}
                            >
                                <Label value={'x [m]'} offset={0} position="bottom"/>
                            </XAxis>
                            <YAxis type="number"
                                   domain={[0, 'auto']}
                                   allowDecimals={false}
                                   tickLine={false}
                                   orientation={'right'}
                                   tickFormatter={(t) => t.toFixed(0)}>
                                <Label
                                    angle={90}
                                    position='right'
                                    style={{textAnchor: 'center'}}
                                    value={'t [d]'}
                                />
                            </YAxis>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Line
                                isAnimationActive={false}
                                type="basis"
                                dataKey={'t'}
                                stroke="#4C4C4C"
                                strokeWidth="5"
                                dot={false}
                                fillOpacity={1}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                    <Segment raised style={styles.diagramLabel}>
                        <p>t&nbsp;=&nbsp;<strong>{tMax.toFixed(1)}</strong>&nbsp;days</p>
                    </Segment>

                    <div style={styles.downloadButtons}>
                        <Button
                            size={'tiny'}
                            color={'orange'}
                            content='JPG'
                            onClick={() => exportChartImage(currentChart)}
                        />
                        <Button
                            size={'tiny'}
                            color={'orange'}
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
