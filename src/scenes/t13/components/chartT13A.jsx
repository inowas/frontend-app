import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';

import {
    CartesianGrid, Label,
    Line, LineChart,
    ResponsiveContainer, XAxis, YAxis,
} from 'recharts';

import {Button, Grid, Header, Segment} from 'semantic-ui-react';
import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';
import {calculateTravelTimeT13A} from '../calculations';

const calculateDiagramData = (w, K, ne, L, hL, xMin, xMax, dX) => {
    const data = [];

    if (xMax < xMin) {
        // eslint-disable-next-line no-param-reassign
        xMax = xMin;
    }

    for (let x = xMin; x <= xMax; x += dX) {
        data.push({
            x,
            t: calculateTravelTimeT13A(x, w, K, ne, L, hL, xMin)
        });
    }
    return data;
};

const styles = {
    chart: {
        top: 20,
        right: 30,
        left: 20,
        bottom: 20
    },
    diagramLabel: {
        position: 'absolute',
        top: '85px',
        right: '60px',
        background: '#EFF3F6',
        opacity: 0.9
    },
    diagramErrorLabel: {
        position: 'absolute',
        top: '60px',
        left: '200px',
        background: '#EFF3F6',
        opacity: 0.9
    },
    downloadButtons: {
        position: 'absolute',
        top: '45px',
        right: '55px'
    }
};

let currentChart;

export const renderLabels = (xe, xi, L, data) => {
    if (xe < xi) {
        return (
            <Segment raised style={styles.diagramErrorLabel}>
                <p>Arrival location, x<sub>e</sub>, can not be smaller than initial position, x<sub>i</sub>.</p>
            </Segment>
        );
    }

    if (xe > L) {
        return (
            <Segment raised style={styles.diagramErrorLabel}>
                <p>Arrival location, x<sub>e</sub>, can not be bigger than the Aquifer length, L<sup>'</sup>.</p>
            </Segment>
        );
    }

    if (xi > L) {
        return (
            <Segment raised style={styles.diagramErrorLabel}>
                <p>Initial location, x<sub>i</sub>, can not be bigger than the Aquifer length, L<sup>'</sup>.</p>
            </Segment>
        );
    }

    return (
        <div>
            <Segment raised style={styles.diagramLabel}>
                <p>t&nbsp;=&nbsp;<strong>{data[data.length - 1].t.toFixed(1)}</strong>&nbsp;d</p>
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
        </div>
    );
};

const Chart = ({parameters}) => {
    const {W, K, ne, L, hL, xi, xe} = getParameterValues(parameters);
    const data = calculateDiagramData(W, K, ne, L, hL, xi, xe, 10);

    return (
        <div>
            <Header textAlign='center'>Calculation</Header>
            <Grid>
                <Grid.Column>
                    <ResponsiveContainer width="100%" aspect={2}>
                        <LineChart
                            data={data}
                            margin={styles.chart}
                            ref={(chart) => currentChart = chart}
                        >
                            <XAxis
                                type="number"
                                dataKey="x"
                                allowDecimals={false}
                                tickLine={false}
                            >
                                <Label value={'x [m]'} offset={0} position="bottom"/>
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
                    {renderLabels(xe, xi, L, data)}
                </Grid.Column>
            </Grid>
        </div>
    );
};

Chart.propTypes = {
    parameters: PropTypes.array.isRequired,
};

export default pure(Chart);
