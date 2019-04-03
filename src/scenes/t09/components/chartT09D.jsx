import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';

import {
    ResponsiveContainer,
    Label,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine
} from 'recharts';

import {Button, Grid, Icon, Segment} from 'semantic-ui-react';

import {calcLambda, calcMu, calculateQCrit, calculateDiagramData} from '../calculations/calculationT09D';
import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';

export function resultDiv(rhof, rhos, lambda, qCrit) {
    if (rhof >= rhos) {
        return (
            <Segment inverted color='orange' secondary className={'diagramLabel topLeft'}>
                <p>Saltwater density is lower than the density of freshwater.</p>
            </Segment>
        );
    }
    if (lambda > 2) {
        return (
            <Segment inverted color='orange' secondary className={'diagramLabel topLeft'}>
                <p>
                    The Stagnation point is located far from the coast.<br/>
                    This will lead to the entrance of salt water<br/>
                    into the flow directly from the sea.
                </p>
            </Segment>
        );
    }
    return (
        <Segment raised className={'diagramLabel topLeft'}>
            <p>Q<sub>crit</sub>&nbsp;=&nbsp;<strong>{qCrit.toFixed(0)}</strong>&nbsp;m<sup>3</sup>/d</p>
        </Segment>
    );
}

const styles = {
    chart: {
        top: 20,
        right: 20,
        left: 20,
        bottom: 0
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
                    <ResponsiveContainer width={'100%'} aspect={2.5}>
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
                                    style={{fontSize: '13px'}}
                                />
                            </XAxis>
                            <YAxis
                                type="number"
                                allowDecimals={false}
                                tickLine={false}
                                tickFormatter={(x) => parseFloat(x).toFixed(1)}
                            >
                                <Label
                                    angle={270}
                                    position='left'
                                    style={{textAnchor: 'center', fontSize: '13px'}}
                                    value={'Qcrit [m³/d]'}
                                    fill={'#4C4C4C'}
                                />
                            </YAxis>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <ReferenceLine
                                x={xw}
                                stroke="black"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                                label={{position: 'insideTopRight', value: 'xw'}}
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

                </Grid.Column>
            </Grid>
        </div>
    );
};

Chart.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Chart);
