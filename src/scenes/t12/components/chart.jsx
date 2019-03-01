import React from 'react';
import PropTypes from 'prop-types';
import {
    calcMFI,
    calculateDiagramData,
    calculateMFIcor1,
    calculateMFIcor2, calculateR2,
    calculateVC
} from '../calculations/calculationT12';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid, Label
} from 'recharts';

import {exportChartData, exportChartImage, getParameterValues} from '../../shared/simpleTools/helpers';
import {pure} from 'recompose';

import {Button, Grid, Icon, Segment} from 'semantic-ui-react';

const styles = {
    chart: {
        top: 20,
        right: 20,
        left: 20,
        bottom: 20
    },
    diagramLabel: {
        position: 'absolute',
        bottom: '90px',
        right: '70px',
        background: '#EEEEEE',
        opacity: 0.9
    }
};

const Chart = ({mfi, parameters, corrections}) => {
    const {ueq, IR, K} = getParameterValues(parameters);
    const {P, Af, T, D} = getParameterValues(corrections);
    const {MFI, a} = calcMFI(mfi);
    const diagramData = calculateDiagramData(mfi, MFI, a);
    const rSquared = calculateR2(diagramData);

    const MFIcor1 = calculateMFIcor1(T, MFI, P, Af);
    const MFIcor2 = calculateMFIcor2(MFIcor1, D, K);
    const vc = calculateVC(MFIcor2, ueq, IR, K);

    let currentChart;

    return (
        <div>
            <Grid>
                <Grid.Row>
                    <ResponsiveContainer width={'100%'} aspect={2.5}>
                        <LineChart
                            data={diagramData}
                            margin={styles.chart}
                            ref={(chart) => currentChart = chart}
                        >
                            <XAxis tickCount={6} type="number" dataKey="V">
                                <Label
                                    value={'V [l]'}
                                    offset={0}
                                    position="bottom"
                                    fill={'#4C4C4C'}
                                />
                            </XAxis>
                            <YAxis type="number" domain={['auto', 'auto']}>
                                <Label
                                    angle={270}
                                    position='left'
                                    style={{textAnchor: 'center'}}
                                    value={'t/V [s/l]'}
                                    fill={'#4C4C4C'}
                                />
                            </YAxis>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Line
                                isAnimationActive={false}
                                type="basis"
                                dataKey={'tV'}
                                stroke="none"
                                dot={{stroke: 'black'}}
                                strokeWidth="5"
                                legendType="none"
                            />
                            <Line
                                dataKey={'mfi'}
                                strokeDasharray="3 3"
                                stroke="#4C4C4C"
                                strokeWidth="2"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                    {rSquared >= 0.90 &&
                    <Segment raised style={styles.diagramLabel}>
                        <p>MFi&nbsp;=&nbsp;<strong>{MFI.toFixed(2)}</strong>&nbsp;s/l<sup>2</sup></p>
                        <p>V<sub>c</sub>&nbsp;=&nbsp;<strong>{vc.toFixed(2)}</strong>&nbsp;m/year</p>
                    </Segment>
                    }

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

                </Grid.Row>
            </Grid>
        </div>
    );
};

Chart.propTypes = {
    corrections: PropTypes.array.isRequired,
    mfi: PropTypes.array.isRequired,
    parameters: PropTypes.array.isRequired
};

export default pure(Chart);
