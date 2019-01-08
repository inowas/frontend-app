import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';

import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Line, Label
} from 'recharts'

import {SETTINGS_SELECTED_H0, SETTINGS_SELECTED_HL, SETTINGS_SELECTED_NOTHING} from '../defaults/T13B';
import {calculateTravelTimeT13B, calculateXwd} from '../calculations';
import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';
import {Button, Grid, Segment} from 'semantic-ui-react';

export function calculateDiagramData(w, K, ne, L1, h1, xMin, xMax, dX) {
    const data = [];
    if (xMax < xMin) {
        // eslint-disable-next-line no-param-reassign
        xMax = xMin;
    }

    for (let x = xMin; x <= xMax; x += dX) {
        data.push({
            x: x,
            t: calculateTravelTimeT13B(x, w, K, ne, L1, h1, xMin)
        });
    }
    return data;
}

let currentChart;

const renderLabels = (xe, xi, L, data) => {
    if (xe < xi) {
        return (
            <Segment raised style={styles.diagramErrorLabel}>
                <p>Arrival location x<sub>e</sub> can not be smaller than initial position x<sub>i</sub>.</p>
            </Segment>
        );
    }
    if (xe > L) {
        return (
            <Segment raised style={styles.diagramErrorLabel}>
                <p>Arrival location x<sub>e</sub> can not be bigger than the Aquifer length, L<sup>'</sup>.</p>
            </Segment>
        );
    }
    if (xi > L) {
        return (
            <Segment>
                <p>Initial location x<sub>i</sub> can not be bigger than the Aquifer length, L<sup>'</sup>.</p>
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
        </div>
    );
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
        top: '90px',
        right: '55px',
        background: '#EFF3F6',
        opacity: 0.9
    },
    diagramErrorLabel: {
        position: 'absolute',
        top: '70px',
        left: '200px',
        background: '#EFF3F6',
        opacity: 0.9
    },
    downloadButtons: {
        position: 'absolute',
        top: '0px',
        right: '50px'
    }
};

const Chart = ({parameters, settings}) => {
    const {W, K, L, hL, h0, ne, xi, xe} = getParameterValues(parameters);
    const {selected} = settings;

    let data = [];
    const xwd = calculateXwd(L, K, W, hL, h0).toFixed(1);

    if (selected === SETTINGS_SELECTED_H0) {
        data = calculateDiagramData(W, K, ne, (xwd * 1), h0, xi, xe, 10);
    }
    if (selected === SETTINGS_SELECTED_HL) {
        data = calculateDiagramData(W, K, ne, (L - xwd), hL, xi, xe, 10);
    }
    if (selected === SETTINGS_SELECTED_NOTHING) {
        data = [{x: 0, t: 0}];
    }

    return (
        <div>
            <Grid>
                <Grid.Column>
                    <ResponsiveContainer width="100%" aspect={3}>
                        <LineChart
                            data={data}
                            margin={styles.chart}
                            ref={(chart) => currentChart = chart}
                        >
                            <XAxis type="number" dataKey="x" allowDecimals={false} tickLine={false}>
                                <Label
                                    value={'x [m]'}
                                    offset={0}
                                    position="bottom"
                                    fill={'#4C4C4C'}
                                />
                            </XAxis>
                            <YAxis
                                type="number" domain={[0, 'auto']} allowDecimals={false} tickLine={false}
                                tickFormatter={(x) => x.toFixed(1)}
                            >
                                <Label
                                    angle={270}
                                    position='left'
                                    style={{textAnchor: 'center'}}
                                    value={'t [d]'}
                                    fill={'#4C4C4C'}
                                />
                            </YAxis>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Line isAnimationActive={false} type="basis" dataKey={'t'} stroke="#4C4C4C"
                                  strokeWidth="5" dot={false} fillOpacity={1}/>
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
    settings: PropTypes.object.isRequired,
};

export default pure(Chart);
