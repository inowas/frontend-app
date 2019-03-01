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
    ReferenceLine, Label
} from 'recharts';

import {calcXtQ0Flux, calcXtQ0Head, dRho, calculateDiagramData} from '../calculations/calculationT09E';
import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';
import {Button, Grid, Icon, Segment} from 'semantic-ui-react';

const calculationErrorOverlay = (maxIter, valid, dxt) => {
    if (!valid) {
        return (
            <div className="diagram-labels-left">
                <div className="diagram-label">
                    <p>Invalid values: square root gets minus.</p>
                    <p>Offshore discharge rate is less than minimum discharge rate</p>
                </div>
            </div>
        );
    }

    if (maxIter) {
        return (
            <div className="diagram-labels-left">
                <div className="diagram-label">
                    <p>Maximum number of iterations are conducted.</p>
                    <p>Change in x <sub>t</sub>&nbsp;=&nbsp;<strong>{dxt.toFixed(1)}</strong>&nbsp;m</p>
                </div>
            </div>
        );
    }

    return null;
};

const styles = {
    chart: {
        top: 20,
        right: 10,
        left: 30,
        bottom: 0
    }
};

const Chart = ({parameters, settings}) => {

    const {k, z0, l, w, dz, hi, i, df, ds} = getParameterValues(parameters);
    const {method} = settings;


    let data;
    let dxt;
    let maxIter = false;
    let isValid = true;
    const alpha = dRho(df, ds);
    if (method === 'constHead') {
        const xtQ0Head1 = calcXtQ0Head(k, z0, 0, l, w, hi, alpha);
        const xt = xtQ0Head1[0];
        maxIter = xtQ0Head1[2];
        isValid = xtQ0Head1[3];

        const xtQ0Head2 = calcXtQ0Head(k, z0, dz, l, w, hi - dz, alpha);
        const xtSlr = xtQ0Head2[0]; // slr: after sea level rise
        if (maxIter === false) {
            maxIter = xtQ0Head2[2];
        }

        if (isValid) {
            isValid = xtQ0Head2[3];
        }

        dxt = xtSlr - xt;
        data = calculateDiagramData(xt, z0, xtSlr, dz, isValid);
    }

    if (method === 'constFlux') {
        const [xt, xtSlr] = calcXtQ0Flux(k, z0, dz, l, w, i, alpha);
        dxt = xtSlr - xt;
        data = calculateDiagramData(xt, z0, xtSlr, dz, isValid);
    }

    let currentChart;

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
                            <XAxis type="number" dataKey="xt">
                                <Label
                                    value={'xw [m]'}
                                    offset={0}
                                    position="bottom"
                                    fill={'#4C4C4C'}
                                    style={{fontSize: '13px'}}
                                />
                            </XAxis>
                            <YAxis
                                type="number"
                                allowDecimals={false}
                                tickLine={false}
                                tickFormatter={(x) => x.toFixed(1)}
                                orientation="right"
                            >
                                <Label
                                    angle={90}
                                    position='right'
                                    style={{textAnchor: 'center', fontSize: '13px'}}
                                    value={'z0 [m]'}
                                    fill={'#4C4C4C'}
                                />
                            </YAxis>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Line
                                isAnimationActive={false}
                                type="basis"
                                dataKey={'z0'}
                                stroke="#ED8D05"
                                strokeWidth="5"
                                dot={false}
                            />
                            <Line
                                isAnimationActive={false}
                                type="basis"
                                dataKey={'z0_new'}
                                stroke="#ED8D05"
                                strokeWidth="5"
                                dot={false}
                                strokeDasharray="15 15"
                            />
                            <ReferenceLine
                                y={data[1].z0}
                                stroke="black"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                                label={{position: 'left', value: 'z₀'}}
                                dot={false}
                            />
                            <ReferenceLine
                                x={data[1].xt}
                                stroke="black"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                                label={{position: 'top', value: 'xt'}}
                                dot={false}
                            />
                            <ReferenceLine
                                x={data[2].xt}
                                stroke="black"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                                label={{position: 'top', value: 'xt\''}}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                    <Segment raised className='diagramLabel topLeft'>
                        <p>Change in x<sub>t</sub>&nbsp;=&nbsp;<strong>{dxt.toFixed(1)}</strong>&nbsp;m</p>
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

                    {calculationErrorOverlay(maxIter, isValid, dxt)}
                </Grid.Column>
            </Grid>
        </div>
    );
};

Chart.propTypes = {
    settings: PropTypes.object.isRequired,
    parameters: PropTypes.array.isRequired,
};

export default pure(Chart);
