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

const cbPalette = [
    '#808080' /* grey */,
    '#bf6c00' /* orange */,
    '#2e9935' /* green */,
    '#FFAA34' /* yellow */,
    '#0a678c' /* navy */,
    '#00b5ad' /* cyan */,
    '#9b3fcc' /* brown */,
    '#FF4434' /* red */];

const styles = {
    diagram: {
        position: 'relative'
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
                <Scatter key={row.id} name={row.name} data={scatterData} fill={color} line strokeWidth={"2"}/>
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
                                tick={{fontSize: 'small', transform: 'translate(0, 5)'}}
                                tickLine={false}>
                                <Label
                                    fill={'#4C4C4C'}
                                    offset={10}
                                    position='bottom'
                                    style={{fontSize: '13px'}}
                                    value={'Specific volume (L/m²)'}
                                />
                            </XAxis>
                            <YAxis
                                type={'number'}
                                dataKey={'y'}
                                name={'v50/v50o'}
                                tick={{fontSize: 'small', transform: 'translate(-3, 0)'}}
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
                            <Legend
                                layout={'vertical'}
                                align={'right'}
                                verticalAlign={'top'}
                                wrapperStyle={{right: 10, fontSize: '13px'}}
                            />
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
