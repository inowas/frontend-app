import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';

import {CartesianGrid, Legend, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis} from 'recharts';
import {Grid, Header} from "semantic-ui-react";

const cbPalette = ['#999999', '#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7'];

const styles = {
    diagram: {
        position: 'relative'
    },
    diagramXLabels: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    diagramYLabels: {
        position: 'absolute',
        bottom: '170px',
        left: '5px',
        transform: 'rotate(-90deg)'
    }
};

const Chart = ({data}) => {
    const scatterLines = data.map(row => {
        if (row.selected) {
            const scatterData = [];
            const xArr = row.x;
            const yArr = row.y;

            if (xArr.length > 0 && xArr.length === yArr.length) {
                for (let i = 0; i < xArr.length; i++) {
                    scatterData.push({x: xArr[i], y: yArr[i]});
                }
            }
            const color = cbPalette[row.id % cbPalette.length];
            return (
                <Scatter key={row.id} name={row.name} data={scatterData} fill={color} line/>
            );
        }

        return null;
    });

    return (
        <div>
            <Header textAlign='center'>Infiltration capacity decline</Header>
            <Grid>
                <Grid.Column>
                    <div style={styles.diagram}>
                        <ResponsiveContainer width={'100%'} aspect={2}>
                            <ScatterChart data={data} margin={{top: 20, right: 30, left: 20, bottom: 0}}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis type="number" dataKey={'x'} name={'Specific volume'} unit={'L/m²'}/>
                                <YAxis type="number" dataKey={'y'} name={'v50/v50o'}/>
                                <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                                <Legend layout={'vertical'} align={'right'} verticalAlign={'top'}
                                        wrapperStyle={{right: 10}}/>
                                {scatterLines}
                            </ScatterChart>
                        </ResponsiveContainer>
                        <div style={styles.diagramYLabels}><strong>V<sub>50</sub>/V<sub>50o</sub></strong></div>
                        <div style={styles.diagramXLabels}><strong>Specific volume (L/m<sup>2</sup>)</strong></div>
                    </div>
                </Grid.Column>
            </Grid>
        </div>
    );
};

Chart.propTypes = {
    data: PropTypes.array.isRequired
};

export default pure(Chart);
