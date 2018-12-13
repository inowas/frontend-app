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

import {Button, Grid, Segment} from 'semantic-ui-react';

import {calcLambda, calcMu, calculateQCrit, calculateDiagramData} from '../calculations/calculationT09D';
import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';

export function resultDiv(rhof, rhos, lambda, qCrit) {
    if (rhof >= rhos) {
        return (
            <Segment raised style={styles.diagramLabel}>
                <p>Saltwater density is lower than the density of freshwater.</p>
            </Segment>
        );
    }
    if (lambda > 2) {
        return (
            <Segment raised style={styles.diagramLabel}>
                <p>
                    The Stagnation point is located far from the coast. This will lead to the entrance of salt water
                    into the flow directly from the sea.
                </p>
            </Segment>
        );
    }
    return (
        <Segment raised style={styles.diagramLabel}>
            <p>Q<sub>crit</sub>&nbsp;=&nbsp;<strong>{qCrit.toFixed(0)}</strong>&nbsp;m<sup>3</sup>/d</p>
        </Segment>
    );
}

const styles = {
    chart: {
        top: 20,
        right: 30,
        left: 30,
        bottom: 20
    },
    diagramLabel: {
        position: 'absolute',
        top: '30px',
        left: '110px',
        background: '#EFF3F6',
        opacity: 0.9
    },
    downloadButtons: {
        position: 'absolute',
        top: '45px',
        right: '55px'
    }
};

const Chart = ({parameters}) => {
    const {k, b, q, xw, rhof, rhos, AqType} = getParameterValues(parameters);
    const lambda = calcLambda(k, b, q, xw, rhof, rhos, AqType);
    const mu = calcMu(lambda);
    const qCrit = calculateQCrit(q, mu, xw);
    const data = calculateDiagramData(q, mu, xw);

    let currentChart;

    return (
        <div>
            <Grid>
                <Grid.Column>
                    <ResponsiveContainer width={'100%'} aspect={2}>
                        <LineChart
                            data={data}
                            margin={styles.chart}
                            ref={(chart) => currentChart = chart}
                        >
                            <XAxis type="number" dataKey="xw">
                                <Label
                                    value={'xw [m]'}
                                    offset={0}
                                    position="bottom"
                                    fill={'#4C4C4C'}
                                />
                            </XAxis>
                            <YAxis
                                type="number"
                                allowDecimals={false}
                                tickLine={false}
                                tickFormatter={(x) => x.toFixed(1)}
                            >
                                <Label
                                    angle={270}
                                    position='left'
                                    style={{textAnchor: 'center'}}
                                    value={'Qcrit [m3/d]'}
                                    fill={'#4C4C4C'}
                                />
                            </YAxis>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <ReferenceLine
                                x={xw}
                                stroke="black"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                                label={{position: 'top', value: 'xw'}}
                                dot={false}
                            />
                            <Line
                                isAnimationActive={false}
                                type="basis"
                                dataKey={'Qcrit'}
                                stroke="black"
                                strokeWidth="3"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                    {resultDiv(rhof, rhos, lambda, qCrit)}

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
    parameters: PropTypes.array.isRequired
};

export default pure(Chart);
