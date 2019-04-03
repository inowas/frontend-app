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
import {Button, Grid, Icon, Segment} from 'semantic-ui-react';

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

const renderLabels = (x, xi, tMax) => {
    if (x >= xi) {
        return (
            <Segment inverted color='orange' secondary style={styles.diagramErrorLabel}>
                <p>Initial position <strong>x<sub>i</sub></strong> can not be smaller than location of well <strong>x</strong>.</p>
            </Segment>
        );
    }
    return (
        <div>
            <Segment raised className='diagramLabel topLeft' style={{left: '50px'}}>
                <p>t&nbsp;=&nbsp;<strong>{tMax.toFixed(1)}</strong>&nbsp;days</p>
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
        right: 30,
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

    const {Qw, ne, hL, h0, xi, x} = getParameterValues(parameters);
    const data = calculateDiagramData(Qw, ne, hL, h0, x, xi);
    const tMax = calculateTravelTimeT13E(xi, h0, hL, x, ne, Qw);

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
                            <XAxis type="number"
                                   domain={['auto', 'auto']}
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
                            <YAxis type="number"
                                   domain={[0, 'auto']}
                                   allowDecimals={false}
                                   tickLine={false}
                                   orientation={'right'}
                                   tickFormatter={(t) => t.toFixed(0)}>
                                <Label
                                    angle={90}
                                    position='right'
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
                    {renderLabels(x, xi, tMax)}

                </Grid.Column>
            </Grid>
        </div>
    );
};

Chart.propTypes = {
    parameters: PropTypes.array.isRequired,
};

export default pure(Chart);
