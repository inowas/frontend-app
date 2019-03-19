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
import {Button, Grid, Icon, Segment} from 'semantic-ui-react';

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
            <Segment inverted color='orange' secondary style={styles.diagramErrorLabel}>
                <p>Arrival location x<sub>e</sub> can not be smaller than initial position x<sub>i</sub>.</p>
            </Segment>
        );
    }
    if (xe > L) {
        return (
            <Segment inverted color='orange' secondary style={styles.diagramErrorLabel}>
                <p>Arrival location x<sub>e</sub> can not be bigger than the aquifer's length, L<sup>'</sup>.</p>
            </Segment>
        );
    }
    if (xi > L) {
        return (
            <Segment inverted color='orange' secondary >
                <p>Initial location x<sub>i</sub> can not be bigger than the aquifer's length, L<sup>'</sup>.</p>
            </Segment>
        );
    }
    return (
        <div>
            <Segment raised className='diagramLabel topLeft'>
                <p>t&nbsp;=&nbsp;<strong>{data[data.length - 1].t.toFixed(1)}</strong>&nbsp;d</p>
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

const styles = {
    chart: {
        top: 20,
        right: 20,
        left: 20,
        bottom: 0
    },
    diagramErrorLabel: {
        position: 'absolute',
        top: '70px',
        left: '200px'
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
                    <ResponsiveContainer width="100%" aspect={2.5}>
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
                                    style={{fontSize: '13px'}}
                                />
                            </XAxis>
                            <YAxis
                                type="number" domain={[0, 'auto']} allowDecimals={false} tickLine={false}
                                tickFormatter={(x) => x.toFixed(1)}
                            >
                                <Label
                                    angle={270}
                                    position='left'
                                    style={{textAnchor: 'center', fontSize: '13px'}}
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
