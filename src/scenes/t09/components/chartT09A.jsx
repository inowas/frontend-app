import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';

import {
    Bar,
    BarChart,
    Legend,
    ResponsiveContainer,
} from 'recharts';

import {Button, Grid, Header, Segment} from 'semantic-ui-react';
import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';


const calculateZ = (h, df, ds) => {
    return (df * h) / (ds - df);
};

const calculateDiagramData = (h, df, ds) => {
    const z = calculateZ(h, df, ds);
    return [{name: '', h, z}];
};

const styles = {
    chart: {
        top: 15,
        right: 30,
        left: 20,
        bottom: 15
    },
    diagramLabel: {
        position: 'absolute',
        top: '60px',
        right: '75px',
        background: '#EFF3F6',
        opacity: 0.9
    },
    downloadButtons: {
        position: 'absolute',
        top: '30px',
        right: '60px'
    }
};

const Chart = ({parameters}) => {
    const {h, df, ds} = getParameterValues(parameters);
    const data = calculateDiagramData(h, df, ds);
    const z = calculateZ(h, df, ds);

    let currentChart;

    return (
        <div>
            <Header textAlign='center'>Calculation</Header>
            <Grid>
                <Grid.Column>
                    <ResponsiveContainer width="100%" aspect={2.5}>
                        <BarChart
                            data={data}
                            barSize={50}
                            margin={styles.chart}
                            ref={(chart) => currentChart = chart}
                        >
                            <Bar isAnimationActive={false} dataKey="h" stackId="a" fill="#1EB1ED"/>
                            <Bar isAnimationActive={false} dataKey="z" stackId="a" fill="#DBF3FD"/>
                            <Legend/>
                        </BarChart>
                    </ResponsiveContainer>

                    <Segment raised style={styles.diagramLabel}>
                        <p>h&nbsp;=&nbsp;<strong>{h.toFixed(1)}</strong>&nbsp;m</p>
                        <p>z&nbsp;=&nbsp;<strong>{z.toFixed(1)}</strong>&nbsp;m</p>
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
                </Grid.Column>
            </Grid>
        </div>
    );
};

Chart.propTypes = {
    parameters: PropTypes.array.isRequired,
};

export default pure(Chart);
