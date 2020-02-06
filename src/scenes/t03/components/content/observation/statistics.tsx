import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {Container, Grid, Header, Segment, Table} from 'semantic-ui-react';
import {ModflowModel} from '../../../../../core/model/modflow';
import {IRootReducer} from '../../../../../reducers';
import {fetchCalculationObservations} from '../../../../../services/api';
import calculateStatistics, {ILinearRegression} from '../../../../../services/statistics/calculateStatistics';

export type IHobData = Array<{
    simulated: number;
    observed: number;
    name: string;
}>;

export interface IStatistics {
    observed: number[];
    simulated: number[];
    n: number;
    rMax: number;
    rMin: number;
    rMean: number;
    absRMean: number;
    sse: number;
    rmse: number;
    nrmse: number;
    R: number;
    R2: number;
    Z: number;
    stdObserved: number;
    stdSimulated: number;
    deltaStd: number;
    weightedResiduals: number[];
    linearRegressionOS: ILinearRegression;
    rankedResiduals: number[];
    npf: number[];
    linearRegressionRN: ILinearRegression;
}

const observationStatistics = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hobData, setHobData] = useState<IHobData | null>(null);
    const [statistics, setStatistics] = useState<IStatistics | null>(null);

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;

    useEffect(() => {
        if (model && model.calculationId) {
            setIsLoading(true);
            fetchCalculationObservations(model.calculationId)
                .then((d: IHobData) => {
                    setHobData(d);
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                    setHobData([]);
                });
        }
    }, []);

    useEffect(() => {
        if (hobData && Array.isArray(hobData)) {
            setStatistics(calculateStatistics(hobData));
        }
    }, [hobData]);

    const chartObservedVsCalculatedHeads = (simulated: number[], observed: number[], deltaStd: number) => {
        const data = simulated.map((s, i) => ({y: s, x: observed[i]}));

        const min = Math.floor(Math.min(...observed, ...simulated));
        const max = Math.ceil(Math.max(...observed, ...simulated));
        const line = [{x: min, y: min}, {x: max, y: max}];
        const linePlusDelta = [{x: min, y: min + deltaStd}, {x: max, y: max + deltaStd}];
        const lineMinusDelta = [{x: min, y: min - deltaStd}, {x: max, y: max - deltaStd}];

        return (
            <Segment raised={true}>
                <ResponsiveContainer width={'100%'} aspect={2.0}>
                    <ScatterChart
                        margin={{top: 20, right: 20, bottom: 20, left: 20}}
                    >
                        <CartesianGrid/>
                        <XAxis
                            dataKey={'x'}
                            type="number"
                            name={'observed'}
                            domain={[min, max]}
                            label={{value: 'Observed Head [m]', angle: 0, position: 'bottom'}}
                        />
                        <YAxis
                            dataKey={'y'}
                            type="number"
                            name={'simulated'}
                            domain={['auto', 'auto']}
                            label={{value: 'Simulated Head [m]', angle: -90, position: 'left'}}
                        />
                        <Scatter name={'Observed vs. calculated Heads'} data={data} fill={'#8884d8'}/>
                        <Scatter data={line} line={{stroke: 'black', strokeWidth: 2}} shape={() => null}/>
                        <Scatter data={linePlusDelta} line={{stroke: 'red', strokeWidth: 2}} shape={() => null}/>
                        <Scatter data={lineMinusDelta} line={{stroke: 'red', strokeWidth: 2}} shape={() => null}/>
                        <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                    </ScatterChart>
                </ResponsiveContainer>
            </Segment>
        );
    };

    const chartWeightedResidualsVsSimulatedHeads = (
        simulated: number[],
        weightedResiduals: number[],
        linRegressSW: ILinearRegression
    ) => {
        const data = simulated.map((s, i) => ({x: s, y: weightedResiduals[i]}));
        const xMin = Math.floor(Math.min(...simulated));
        const xMax = Math.ceil(Math.max(...simulated));
        const yMin = Math.floor(Math.min(...weightedResiduals));
        const yMax = Math.ceil(Math.max(...weightedResiduals));

        // noinspection JSSuspiciousNameCombination
        const domainY = Math.ceil(Math.max(yMax, yMin));
        const line = [{x: xMin, y: yMin}, {x: xMax, y: yMax}];

        return (
            <Segment raised={true}>
                <ResponsiveContainer width={'100%'} aspect={2.0}>
                    <ScatterChart
                        margin={{top: 20, right: 20, bottom: 20, left: 20}}
                    >
                        <CartesianGrid/>
                        <XAxis
                            dataKey={'x'}
                            type="number"
                            name={'simulated'}
                            domain={[xMin, xMax]}
                            label={{value: 'Simulated Head [m a.s.l.]', angle: 0, position: 'bottom'}}
                        />
                        <YAxis
                            dataKey={'y'}
                            type="number"
                            name={'weighted'}
                            domain={[-domainY, domainY]}
                            label={{value: 'Residual', angle: -90, position: 'left'}}
                        />
                        <Scatter name={'Weighted residuals vs. simulated heads'} data={data} fill={'black'}/>
                        <Scatter data={line} line={{stroke: 'red', strokeWidth: 2}} shape={() => null}/>
                        <ReferenceLine y={0} stroke="blue" strokeWidth={2}/>
                        <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                    </ScatterChart>
                </ResponsiveContainer>
                <div className="diagram-labels-right">
                    <div className="diagram-label" style={{color: 'red'}}>
                        {<p>f(x) = {linRegressSW.slope.toFixed(3)}x + {linRegressSW.intercept.toFixed(3)}</p>}
                    </div>
                </div>
            </Segment>
        );
    };

    const chartRankedResidualsAgainstNormalProbability = (
        npf: number[],
        rankedResiduals: number[],
        linRegressRN: ILinearRegression
    ) => {
        const data = npf.map((n, i) => ({y: n, x: rankedResiduals[i]}));
        const xMin = Math.floor(Math.min(...rankedResiduals));
        const xMax = Math.ceil(Math.max(...rankedResiduals));

        const line = [{
            x: xMin,
            y: linRegressRN.slope * xMin + linRegressRN.intercept
        }, {
            x: xMax,
            y: linRegressRN.slope * xMax + linRegressRN.intercept
        }];

        return (
            <Segment raised={true}>
                <ResponsiveContainer width={'100%'} aspect={2.0}>
                    <ScatterChart
                        margin={{top: 20, right: 20, bottom: 20, left: 20}}
                    >
                        <CartesianGrid/>
                        <XAxis
                            dataKey={'x'}
                            type="number"
                            name={'npf'}
                            domain={[xMin, xMax]}
                            label={{value: 'Residual', angle: 0, position: 'bottom'}}
                        />
                        <YAxis
                            dataKey={'y'}
                            type="number"
                            name={'ranked residuals'}
                            domain={['auto', 'auto']}
                            label={{value: 'Normal Probability Function', angle: -90, position: 'left'}}
                        />
                        <Scatter name={'NPF vs. ranked residuals'} data={data} fill={'black'}/>
                        <Scatter data={line} line={{stroke: 'red', strokeWidth: 2}} shape={() => null}/>
                        <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                    </ScatterChart>
                </ResponsiveContainer>
                <div className="diagram-labels-right">
                    <div className="diagram-label" style={{color: 'red'}}>
                        <p>f(x) = {linRegressRN.slope.toFixed(3)}x + {linRegressRN.intercept.toFixed(3)}</p>
                    </div>
                </div>
            </Segment>
        );
    };

    return (
        <Segment color={'grey'} loading={isLoading}>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        {!statistics && <span>LOADING</span>}
                        {hobData && hobData.length === 0 && <span>No observation data available</span>}
                        {hobData && hobData.length > 0 && statistics &&
                        <Container fluid={true}>
                            <Header size={'large'}>Calculate statistics</Header>
                            <Segment raised={true}>
                                <Table celled={true}>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                            <Table.HeaderCell>Symbol</Table.HeaderCell>
                                            <Table.HeaderCell>Value</Table.HeaderCell>
                                            <Table.HeaderCell>Unit</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body style={{overflowY: 'auto'}}>
                                        <Table.Row>
                                            <Table.Cell>Number of data points</Table.Cell>
                                            <Table.Cell>n [-]</Table.Cell>
                                            <Table.Cell>{statistics.n}</Table.Cell>
                                            <Table.Cell>-</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Maximum Absolute Residual</Table.Cell>
                                            <Table.Cell>R<sub>MAX</sub> </Table.Cell>
                                            <Table.Cell>{statistics.rMax.toFixed(3)}</Table.Cell>
                                            <Table.Cell>m</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Minimum Absolute Residual</Table.Cell>
                                            <Table.Cell>R<sub>MIN</sub></Table.Cell>
                                            <Table.Cell>{statistics.rMin.toFixed(3)}</Table.Cell>
                                            <Table.Cell>m</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Residual Mean</Table.Cell>
                                            <Table.Cell>R<sub>MEAN</sub></Table.Cell>
                                            <Table.Cell>{statistics.rMean.toFixed(3)}</Table.Cell>
                                            <Table.Cell>m</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Absolute residual Mean</Table.Cell>
                                            <Table.Cell>|R<sub>MEAN</sub>|</Table.Cell>
                                            <Table.Cell>{statistics.absRMean.toFixed(3)}</Table.Cell>
                                            <Table.Cell>m</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Standard error of estimation</Table.Cell>
                                            <Table.Cell>SSE</Table.Cell>
                                            <Table.Cell>{statistics.sse.toFixed(3)}</Table.Cell>
                                            <Table.Cell>-</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Root Mean Squared Error</Table.Cell>
                                            <Table.Cell>RMSE</Table.Cell>
                                            <Table.Cell>{statistics.rmse.toFixed(3)}</Table.Cell>
                                            <Table.Cell>m</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Normalized Root Mean Squared Error</Table.Cell>
                                            <Table.Cell>NRMSE</Table.Cell>
                                            <Table.Cell>{statistics.nrmse.toFixed(3)}</Table.Cell>
                                            <Table.Cell>-</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Correlation Coefficient Pearson R</Table.Cell>
                                            <Table.Cell>R</Table.Cell>
                                            <Table.Cell>{statistics.R.toFixed(3)}</Table.Cell>
                                            <Table.Cell>-</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Coefficient of determination</Table.Cell>
                                            <Table.Cell>R<sup>2</sup></Table.Cell>
                                            <Table.Cell>{statistics.R2.toFixed(3)}</Table.Cell>
                                            <Table.Cell>-</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Segment>

                            <Header size={'large'}>Simulated vs. Observed Values</Header>
                            {chartObservedVsCalculatedHeads(
                                statistics.simulated,
                                statistics.observed,
                                statistics.deltaStd
                            )}

                            <Header size={'large'}>Weighted residuals vs. simulated heads</Header>
                            {chartWeightedResidualsVsSimulatedHeads(
                                statistics.simulated,
                                statistics.weightedResiduals,
                                statistics.linearRegressionOS
                            )}

                            <Header size={'large'}>Ranked residuals against normal probability</Header>
                            {chartRankedResidualsAgainstNormalProbability(
                                statistics.npf,
                                statistics.rankedResiduals,
                                statistics.linearRegressionRN
                            )}
                        </Container>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );

};

export default observationStatistics;
