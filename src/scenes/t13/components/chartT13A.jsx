import {Button, Grid, Icon, Segment} from 'semantic-ui-react';
import {
    CartesianGrid, Label,
    Line, LineChart,
    ResponsiveContainer, XAxis, YAxis,
} from 'recharts';
import {calculateTravelTimeT13A} from '../calculations';
import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import React from 'react';

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
        right: 20,
        left: 20,
        bottom: 0
    },
    diagramErrorLabel: {
        position: 'absolute',
        top: '60px',
        left: '200px',
        background: '#EFF3F6',
        opacity: 0.9
    }
};

let currentChart;

const renderLabels = (xe, xi, L, data) => {
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
                <p>Arrival location, x<sub>e</sub>, can not be bigger than the Aquifer length, L<sup>&apos;</sup>.</p>
            </Segment>
        );
    }

    if (xi > L) {
        return (
            <Segment raised style={styles.diagramErrorLabel}>
                <p>Initial location, x<sub>i</sub>, can not be bigger than the Aquifer length, L<sup>&apos;</sup>.</p>
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

const Chart = ({parameters}) => {
    const {W, K, ne, L, hL, xi, xe} = getParameterValues(parameters);
    const data = calculateDiagramData(W, K, ne, L, hL, xi, xe, 10);

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
                            <XAxis
                                type="number"
                                dataKey="x"
                                allowDecimals={false}
                                tickLine={false}
                            >
                                <Label
                                    value={'x [m]'}
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
                                    value={'t [d]'}
                                    fill={'#4C4C4C'}
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
