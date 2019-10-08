import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';

import {
    CartesianGrid,
    Label,
    Legend,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {Button, Grid, Icon} from 'semantic-ui-react';
import {exportChartData, exportChartImage} from '../../shared/simpleTools/helpers';

const cbPalette = ['#999999' /* grey */, '#ED8D05' /* orange */, '#1EB1ED' /* blue */, '#009E73' /* green */, '#F0E442' /* yellow */, '#0A75A0' /* navy */, '#CC6C00' /* brown */, '#FF5B4D' /* red */];

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
    },
    chart: {
        top: 20,
        right: 20,
        left: 20,
        bottom: 0
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

    let currentChart;

    return (
        <div>
            <Grid>
                <Grid.Column>
                    <ResponsiveContainer width={'100%'} aspect={2.5}>
                        <ScatterChart data={data} margin={styles.chart}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis
                                type={'number'}
                                dataKey={'x'}
                                name={'Specific volume'}
                                tick={{fill: '#B5B5B5', fontSize: 'small', transform: 'translate(0, 5)'}}
                                tickLine={false}>
                                <Label
                                    fill={'#4C4C4C'}
                                    offset={0}
                                    position='bottom'
                                    style={{fontSize: '13px'}}
                                    value={'Specific volume (L/m²)'}
                                />
                            </XAxis>
                            <YAxis
                                type={'number'}
                                dataKey={'y'}
                                name={'v50/v50o'}
                                tick={{fill: '#B5B5B5', fontSize: 'small', transform: 'translate(-3, 0)'}}
                                tickLine={false}>
                                <Label
                                    angle={270}
                                    fill={'#4C4C4C'}
                                    position='left'
                                    style={{textAnchor: 'center', fontSize: '13px'}}
                                    value={'v50/v50o'}
                                />
                            </YAxis>
                            <Tooltip
                                cursor={{strokeDasharray: '3 3'}}
                            />
                            <Legend layout={'vertical'} align={'right'} verticalAlign={'top'}
                                    wrapperStyle={{right: 10, fontSize: '13px'}}/>
                            {scatterLines}
                        </ScatterChart>
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
    data: PropTypes.array.isRequired
};

export default pure(Chart);
