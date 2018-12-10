import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';

import {CartesianGrid, Legend, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis} from 'recharts';
import {Grid, Header} from "semantic-ui-react";

const cbPalette = ['#999999', '#ED8D05', '#1EB1ED', '#009E73', '#F0E442', '#0A75A0', '#CC6C00', '#FF5B4D'];

const styles = {
    diagram: {
        position: 'relative'
    },
    diagramXLabels: {
        //display: 'flex',
        //justifyContent: 'center',
        //alignItems: 'center',
        fontSize:   'small'
    },
    diagramYLabels: {
        position: 'absolute',
        bottom: '50%',
        transform: 'rotate(-90deg)',
        fontSize:   'small'
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
                                <XAxis type={'number'} dataKey={'x'} name={'Specific volume'} tick={{fill: '#B5B5B5', fontSize: 'small', transform: 'translate(0, 5)'}} />
                                <YAxis type={'number'} dataKey={'y'} name={'v50/v50o'} tick={{fill: '#B5B5B5', fontSize: 'small', transform: 'translate(-3, 0)'}}/>
                                <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                                <Legend layout={'vertical'} align={'right'} verticalAlign={'top'}
                                        wrapperStyle={{right: 10, fontSize: '13px'}}/>
                                {scatterLines}
                            </ScatterChart>
                        </ResponsiveContainer>
                        <div style={styles.diagramYLabels}>V<sub>50</sub>/V<sub>50o</sub></div>
                        <div style={styles.diagramXLabels} align='center'>Specific volume (L/m<sup>2</sup>)</div>
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
