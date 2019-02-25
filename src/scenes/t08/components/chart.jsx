import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid, Label
} from 'recharts';

import {Button, Grid, Icon, Segment} from 'semantic-ui-react';

import {
    calcC,
    calcCTau,
    calculateDiagramData,
    calculateDL,
    calculateR,
    calculateVx
} from '../calculations/calculationT08';

import {SETTINGS_CASE_FIXED_TIME, SETTINGS_CASE_VARIABLE_TIME, SETTINGS_INFILTRATION_ONE_TIME} from '../defaults';
import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';

const styles = {
    chart: {
        top: 20,
        right: 20,
        left: 20,
        bottom: 0
    }
};

const Chart = ({settings, parameters}) => {
    const {C0, K, Kd, I, ne, x, t, alphaL, tau} = getParameterValues(parameters);

    let label = '';
    let dataKey = '';
    let variable = '';
    let unit = '';
    let val0 = 0;
    let val50 = 0;
    let valmax = 0;

    const vx = calculateVx(K, ne, I);
    const DL = calculateDL(alphaL, vx);
    const R = calculateR(ne, Kd);
    const C = (settings.infiltration === SETTINGS_INFILTRATION_ONE_TIME && t > tau) ? calcCTau(t, x, vx, R, DL, tau) : calcC(t, x, vx, R, DL);
    const data = calculateDiagramData(settings, vx, DL, R, C0, x, t, tau);

    let dataMax = 0;
    for (let i = 0; i < data.length; i += 1) {
        dataMax = (data[i].C > dataMax) ? data[i].C : dataMax;
    }

    dataMax = (settings.infiltration !== SETTINGS_INFILTRATION_ONE_TIME) ? 1 : dataMax;

    if (settings.case === SETTINGS_CASE_VARIABLE_TIME) {
        label = 't (d)';
        dataKey = 't';
        variable = 'T';
        unit = 'days';

        for (let i = 1; i < data.length; i += 1) {
            if (data[i].C > 0.00001 * dataMax && data[i - 1].C < 0.00001 * dataMax) {
                val0 = data[i].t;
            }
            if (data[i].C > 0.50001 * dataMax && data[i - 1].C < 0.50001 * dataMax) {
                val50 = data[i].t;
            }
            if (// (data[i].C > 0.9999*DataMax && data[i-1].C < 0.9999*DataMax) ||
                (data[i].C > 0.9999 * dataMax)) {
                valmax = data[i].t;
            }
        }
    }

    if (settings.case === SETTINGS_CASE_FIXED_TIME) {
        label = 'x (m)';
        dataKey = 'x';
        variable = 'X';
        unit = 'm';

        valmax = (0).toFixed(2);
        for (let i = 1; i < data.length; i += 1) {
            if (data[i].C < 0.0001 * dataMax && data[i - 1].C > 0.0001 * dataMax) {
                val0 = data[i].x.toFixed(2);
            }
            if (data[i].C < 0.5001 * dataMax && data[i - 1].C > 0.5001 * dataMax) {
                val50 = data[i].x.toFixed(2);
            }
            if (// (data[i].C > 0.9999*DataMax && data[i-1].C < 0.9999*DataMax) ||
                (data[i].C > 0.9999 * dataMax)) {
                valmax = data[i].x.toFixed(2);
            }
        }
    }

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
                            <XAxis type="number" dataKey={dataKey}>
                                <Label
                                    value={label}
                                    offset={0}
                                    position="bottom"
                                    fill={'#4C4C4C'}
                                    style={{textAnchor: 'center', fontSize: '13px'}}
                                />
                            </XAxis>
                            <YAxis type="number" domain={[0, 'auto']}>
                                <Label
                                    angle={270}
                                    position='left'
                                    fill={'#4C4C4C'}
                                    style={{textAnchor: 'center', fontSize: '13px'}}
                                    value={'C/C0 [-]'}
                                />
                            </YAxis>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Line
                                isAnimationActive={false}
                                type="basis"
                                dataKey={'C'}
                                stroke="#4C4C4C"
                                strokeWidth="5"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                    <Segment raised className={'diagramLabel topRight'}>
                        <p>C&nbsp;=&nbsp;<strong>{(C * C0).toFixed(2)}</strong>&nbsp;mg/L</p>
                        <p>{variable}<sub>0</sub>&nbsp;=&nbsp;<strong>{val0}</strong>&nbsp;{unit}</p>
                        <p>{variable}<sub>50</sub>&nbsp;=&nbsp;<strong>{val50}</strong>&nbsp;{unit}</p>
                        <p>{variable}<sub>max</sub>&nbsp;=&nbsp;<strong>{valmax}</strong>&nbsp;{unit}</p>
                    </Segment>

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
    settings: PropTypes.object.isRequired,
    parameters: PropTypes.array.isRequired
};

export default pure(Chart);
