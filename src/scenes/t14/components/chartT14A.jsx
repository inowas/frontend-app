import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';
import {calculateDiagramData, calcDQ} from '../calculations/calculationT14A';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid, Label
} from 'recharts';

import {exportChartData, exportChartImage, getParameterValues} from "../../shared/simpleTools/helpers";
import {Button, Grid, Header, Segment} from 'semantic-ui-react';

const styles = {
    chart: {
        top: 20,
        right: 20,
        left: 20,
        bottom: 20
    },
    diagramLabel: {
        position: 'absolute',
        top: '220px',
        right: '35px',
        background: '#EFF3F6',
        opacity: 0.9
    },
    downloadButtons: {
        position: 'absolute',
        top: '170px',
        right: '35px'
    }
};

let currentChart;

const renderLabels = (dQ) => {
    return (
        <div>
            <Segment raised style={styles.diagramLabel}>
                <p>&#916;Q&nbsp;=&nbsp;<strong>{dQ.toFixed(1)}</strong>&nbsp;m³/d</p>
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
    const {Qw, t, S, T, d} = getParameterValues(parameters);
    const data = calculateDiagramData(Qw, S, T, d, 0, t, 1);
    const dQ = calcDQ(Qw, d, S, T, t);

    return (
        <div>
            <Header textAlign='center'>Calculation</Header>
            <Grid>
                <Grid.Row>
                    <ResponsiveContainer width={'100%'} aspect={2}>
                        <LineChart
                            data={data}
                            margin={styles.chart}
                            ref={(chart) => currentChart = chart}
                        >
                            <XAxis
                                type="number"
                                dataKey="t"
                                allowDecimals={false}
                                tickLine={false}
                            >
                                <Label value={'T [d]'} offset={0} position="bottom"/>
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
                                    value={'dQ [m³/d]'}
                                />
                            </YAxis>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Line
                                isAnimationActive={false}
                                type="basis"
                                dataKey={'dQ'}
                                stroke="#4C4C4C"
                                strokeWidth="5"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Grid.Row>
            </Grid>
            {renderLabels(dQ)}
        </div>
    )
};

Chart.propTypes = {
    parameters: PropTypes.array.isRequired
};

export default pure(Chart);
