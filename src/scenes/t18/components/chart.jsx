import PropTypes from 'prop-types';
import React from 'react';

import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid, BarChart, Bar, Label
} from 'recharts';

import {calculateDiagramData} from '../calculations/calculationT18';
import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';
import {Button, Grid, Header} from 'semantic-ui-react';

const styles = {
    chart: {
        top: 10,
        right: 30,
        left: 0,
        bottom: 20
    },
    diagramLabel: {
        position: 'absolute',
        bottom: '90px',
        right: '65px',
        background: '#EFF3F6',
        opacity: 0.9
    },
    downloadButtons: {
        position: 'absolute',
        top: '45px',
        right: '60px'
    }
};

let currentChart;

const Chart = ({parameters, settings}) => {
    const {LLRN, LLRO, Q, IR, OD, Cn, Co} = getParameterValues(parameters);
    const {AF} = settings;
    const data = calculateDiagramData(LLRN, LLRO, AF, Q, IR, OD, Cn, Co);

    return (
        <div>
            <Header textAlign='center'>Calculation</Header>
            <Grid>
                <Grid.Row>
                    <ResponsiveContainer width="100%" aspect={2.0}>
                        <BarChart
                            layout="vertical"
                            data={data}
                            margin={styles.chart}
                            ref={(chart) => currentChart = chart}
                        >
                            <XAxis type="number">
                                <Label
                                    value={'Area [m²]'}
                                    offset={0}
                                    position="bottom"
                                />
                            </XAxis>
                            <YAxis type="category" dataKey="name"/>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Bar
                                isAnimationActive={false}
                                dataKey="value"
                                fill="#ED8D05"
                            />
                        </BarChart>
                    </ResponsiveContainer>

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
                </Grid.Row>
            </Grid>
        </div>
    );
};

Chart.propTypes = {
    parameters: PropTypes.array.isRequired,
    settings: PropTypes.object.isRequired
};

export default Chart;
