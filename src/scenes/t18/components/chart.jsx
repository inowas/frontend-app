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
import {Button, Grid, Icon} from 'semantic-ui-react';

const styles = {
    chart: {
        top: 20,
        right: 20,
        left: 0,
        bottom: 0
    },
    diagramLabel: {
        position: 'absolute',
        bottom: '90px',
        right: '65px',
        background: '#EFF3F6',
        opacity: 0.9
    }
};

let currentChart;

const Chart = ({parameters, settings}) => {
    const {LLRN, LLRO, Q, IR, OD, Cn, Co} = getParameterValues(parameters);
    const {AF} = settings;
    const data = calculateDiagramData(LLRN, LLRO, AF, Q, IR, OD, Cn, Co);

    return (
        <div>
            <Grid>
                <Grid.Column>
                    <ResponsiveContainer width="100%" aspect={2.5}>
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
                                    fill={'#4C4C4C'}
                                    style={{fontSize: '13px'}}
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
    parameters: PropTypes.array.isRequired,
    settings: PropTypes.object.isRequired
};

export default Chart;
