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

import {Button, Grid, Icon, Segment} from 'semantic-ui-react';
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
            <Segment inverted color='orange' secondary style={styles.diagramErrorLabel}>
                <p>Arrival location, x<sub>e</sub>, can not be smaller than initial position, x<sub>i</sub>.</p>
            </Segment>
        );
    }
    if (xe > L + Math.abs(xwd)) {
        return (
            <Segment inverted color='orange' secondary style={styles.diagramErrorLabel}>
                <p>Arrival location, x<sub>e</sub>, can not be bigger than L<sup>'</sup>+|xwd|.</p>
            </Segment>
        );
    }
    if (xi > L) {
        return (
            <Segment inverted color='orange' secondary style={styles.diagramErrorLabel}>
                <p>Initial location, x<sub>i</sub>, can not be bigger than the Aquifer length, L<sup>'</sup>.</p>
            </Segment>
        );
    }
    return (

        <div>
            <Segment raised className='diagramLabel topLeft'>
                t&nbsp;=&nbsp;<strong>{data[data.length - 1].t.toFixed(1)}</strong>&nbsp;d
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
        top: '60px',
        left: '200px'
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
                    <ResponsiveContainer width={'100%'} aspect={2.5}>
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
                                    style={{fontSize: '13px'}}
                                />
                            </XAxis>
                            <YAxis type="number" domain={[0, 'auto']} allowDecimals={false} tickLine={false}
                                   tickFormatter={(x) => x.toFixed(0)}>
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
