import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';
import {calculateXwd, calculateTravelTimeT13C} from '../calculations';

import {
    ResponsiveContainer,
    Label,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

import {Button, Grid, Segment} from 'semantic-ui-react';
import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';

const calculateDiagramData = (w, K, ne, L, hL, xMin, xMax, dX) => {
    const data = [];
    if (xMax < xMin) {
        // eslint-disable-next-line no-param-reassign
        xMax = xMin;
    }

    for (let x = xMin; x <= xMax; x += dX) {
        data.push({
            x,
            t: calculateTravelTimeT13C(x, w, K, ne, L, hL, xMin)
        });
    }
    return data;
};

let currentChart;

const renderLabels = (xe, xi, L, data, xwd) => {
    if (xe < xi) {
        return (
            <Segment raised style={styles.diagramErrorLabel}>
                <p>Arrival location, x<sub>e</sub>, can not be smaller than initial position, x<sub>i</sub>.</p>
            </Segment>
        );
    }
    if (xe > L + Math.abs(xwd)) {
        return (
            <Segment raised style={styles.diagramErrorLabel}>
                <p>Arrival location, x<sub>e</sub>, can not be bigger than L<sup>'</sup>+|xwd|.</p>
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
                t&nbsp;=&nbsp;<strong>{data[data.length - 1].t.toFixed(1)}</strong>&nbsp;d
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
        top: '60px',
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

const Chart = ({parameters}) => {
    const {W, K, ne, L, hL, h0, xi, xe} = getParameterValues(parameters);
    const xwd = calculateXwd(L, K, W, hL, h0);
    const data = calculateDiagramData(W, K, ne, L + Math.abs(xwd), hL, xi, xe, 10);

    return (
        <div>
            <Grid>
                <Grid.Column>
                    <ResponsiveContainer width={'100%'} aspect={3}>
                        <LineChart
                            data={data}
                            margin={styles.chart}
                            ref={(chart) => currentChart = chart}
                        >
                            <XAxis type="number" domain={['auto', 'auto']} dataKey="x" allowDecimals={false}
                                   tickLine={false}>
                                <Label
                                    value={'x [m]'}
                                    offset={0}
                                    position="bottom"
                                    fill={'#4C4C4C'}
                                />
                            </XAxis>
                            <YAxis type="number" domain={[0, 'auto']} allowDecimals={false} tickLine={false}
                                   tickFormatter={(x) => x.toFixed(0)}>
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
                    {renderLabels(xe, xi, L, data, xwd)}
                </Grid.Column>
            </Grid>
        </div>
    );
};

Chart.propTypes = {
    parameters: PropTypes.array.isRequired,
};

export default pure(Chart);
