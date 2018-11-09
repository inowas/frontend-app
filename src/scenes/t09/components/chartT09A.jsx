import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';

import {
    Bar,
    BarChart,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {Grid, Header, Segment} from "semantic-ui-react";


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
        top: '40px',
        right: '70px',
        background: '#EFF3F6',
        opacity: 0.9
    }
};

const fetchParameters = (array) => {
    const parameters = {};

    array.forEach(item => {
        parameters[item.id] = item.value
    });

    return parameters;
};

const Chart = ({parameters}) => {
    const {h, df, ds} = fetchParameters(parameters);
    const data = calculateDiagramData(h, df, ds);
    const z = calculateZ(h, df, ds);

    return (
        <div>
            <Header textAlign='center'>Calculation</Header>
            <Grid>
                <Grid.Column>
                    <ResponsiveContainer width="100%" aspect={2.5}>
                        <BarChart data={data} barSize={50} margin={styles.chart}>
                            <Bar isAnimationActive={false} dataKey="h" stackId="a" fill="#1EB1ED"/>
                            <Bar isAnimationActive={false} dataKey="z" stackId="a" fill="#DBF3FD"/>
                            <Legend/>
                        </BarChart>
                    </ResponsiveContainer>

                    <Segment raised style={styles.diagramLabel}>
                        <p>h&nbsp;=&nbsp;<strong>{h.toFixed(1)}</strong>&nbsp;m</p>
                        <p>z&nbsp;=&nbsp;<strong>{z.toFixed(1)}</strong>&nbsp;m</p>
                    </Segment>
                </Grid.Column>
            </Grid>
        </div>
    );
};

Chart.propTypes = {
    parameters: PropTypes.array.isRequired,
};

export default pure(Chart);
