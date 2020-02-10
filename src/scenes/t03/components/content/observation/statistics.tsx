import math from 'mathjs';
import React, {ReactNode, SyntheticEvent, useEffect, useState} from 'react';
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
import {Container, DropdownProps, Form, Grid, Header, Segment, Table} from 'semantic-ui-react';
import {ModflowModel} from '../../../../../core/model/modflow';
import {IRootReducer} from '../../../../../reducers';
import {fetchCalculationObservations} from '../../../../../services/api';
import calculateStatistics, {ILinearRegression} from '../../../../../services/statistics/calculateStatistics';
import CustomizedDot from './CustomizedDot';

export type IHobData = Array<{
    simulated: number;
    observed: number;
    name: string;
}>;

export interface IStatistics {
    names: string[];
    data: Array<{
        name: string;
        simulated: number;
        observed: number;
        residual: number;
        absResidual: number;
        npf: number
    }>;
    stats: {
        observed: {
            std: number;
            z: number;
            deltaStd: number;
        };
        simulated: {
            std: number;
        };
        residual: {
            std: number;
            sse: number;
            rmse: number;
            nrmse: number;
            min: number;
            max: number;
            mean: number;
        },
        absResidual: {
            max: number;
            mean: number
            min: number;
        }
    };
    linRegObsSim: ILinearRegression;
    linRegResSim: ILinearRegression;
    linRegObsRResNpf: ILinearRegression;
}

type ICustomTooltipPayload = Array<{
    name: string;
    unit: string;
    value: number;
    payload: {
        x: number;
        y: number;
        name: string;
    }
}>;

const convenientColors = [
    '#393b89',
    '#5254a3',
    '#6b6ecf',
    '#9c9ede',
    '#637939',
    '#8ca252',
    '#b5cf6b',
    '#cedb9c',
    '#8c6d31',
    '#bd9e39',
    '#e7ba52',
    '#e7cb94',
    '#843c39',
    '#ad494a',
    '#d6616b',
    '#e7969c',
    '#7b4173',
    '#a55194',
    '#ce6dbd',
    '#de9ed6',
    '#222222',
    '#444444',
    '#666666',
    '#888888',
    '#aaaaaa',
    '#018571',
    '#76cdc5',
    '#a5cdc2'
];

const diagramLabel = (content: ReactNode) => (
    <div style={{position: 'absolute', bottom: 100, right: 80}}>
        <div style={{color: 'red', padding: 20, border: '1px solid red', backgroundColor: 'white'}}>
            {content}
        </div>
    </div>
);

const observationStatistics = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hobData, setHobData] = useState<IHobData | null>(null);
    const [statistics, setStatistics] = useState<IStatistics | null>(null);
    const [excludedWells, setExcludedWells] = useState<string[]>([]);

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
            setStatistics(calculateStatistics(hobData, excludedWells));
        }
    }, [hobData, excludedWells]);

    const getNameFromPayload = (p: ICustomTooltipPayload) => {
        let name = p[0].payload.name;
        name = name.replace(/\d+$/, '');
        if (name.endsWith('.') || name.endsWith('_')) {
            return name.substr(0, name.length - 1);
        }
        return name;
    };

    const customTooltip = (e: any) => {
        if (e.active && e.payload && e.payload.length > 0) {
            const payload: ICustomTooltipPayload = e.payload;

            const wellName = getNameFromPayload(payload);

            return (
                <div
                    className={'recharts-default-tooltip'}
                    style={{
                        margin: 0,
                        padding: 10,
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <h3>{`Well ${wellName}`}</h3>
                    {payload.map((p, idx) => (
                        <p key={idx}>{`${p.name}: ${math.round(p.value, 3)} ${p.unit}`}</p>
                    ))}
                </div>
            );
        }

        return null;
    };

    const chartObservedVsCalculatedHeads = (stats: IStatistics) => {

        const simulated = stats.data.map((d) => d.simulated);
        const observed = stats.data.map((d) => d.observed);
        const deltaStd = stats.stats.observed.deltaStd;
        const {linRegObsSim, names} = stats;

        const data = stats.data.map((d) => ({x: d.observed, y: d.simulated, name: d.name}));

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

                        {names.map((n) => data.filter((d) => d.name.startsWith(n)))
                            .map((d, idx) => {
                                if (d.length > 0) {
                                    return (
                                        <Scatter
                                            name={d[0].name}
                                            key={idx}
                                            data={d}
                                            fill={convenientColors[idx % convenientColors.length]}
                                            shape={<CustomizedDot/>}
                                            opacity={0.5}
                                        />
                                    );
                                }
                                return null;
                            })
                        }

                        <Scatter data={line} line={{stroke: 'black', strokeWidth: 2}} shape={() => null}/>
                        <Scatter data={linePlusDelta} line={{stroke: 'red', strokeWidth: 2}} shape={() => null}/>
                        <Scatter data={lineMinusDelta} line={{stroke: 'red', strokeWidth: 2}} shape={() => null}/>
                        <Tooltip cursor={{strokeDasharray: '3 3'}} content={customTooltip}/>
                    </ScatterChart>
                </ResponsiveContainer>
                {diagramLabel(
                    <div>
                        <p>{linRegObsSim.eq}</p>
                        <p>R<sup>2</sup> = {linRegObsSim.r}</p>
                    </div>
                )}
            </Segment>
        );
    };

    const chartWeightedResidualsVsSimulatedHeads = (stats: IStatistics) => {
        const simulated = stats.data.map((d) => d.simulated);
        const weightedResiduals = stats.data.map((d) => d.residual);
        const {linRegResSim, names} = stats;

        const data = stats.data.map((d) => ({x: d.simulated, y: d.residual, name: d.name}));

        const xMin = Math.floor(Math.min(...simulated));
        const xMax = Math.ceil(Math.max(...simulated));
        const yMin = Math.floor(Math.min(...weightedResiduals));
        const yMax = Math.ceil(Math.max(...weightedResiduals));

        // noinspection JSSuspiciousNameCombination
        const domainY = Math.ceil(Math.max(yMax, yMin));
        const line = [{
            x: xMin,
            y: linRegResSim.exec(xMin)
        }, {
            x: xMax,
            y: linRegResSim.exec(xMax)
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
                        {names.map((n) => data.filter((d) => d.name.startsWith(n)))
                            .map((d, idx) => {
                                if (d.length > 0) {
                                    return (
                                        <Scatter
                                            name={d[0].name}
                                            key={idx}
                                            data={d}
                                            fill={convenientColors[idx % convenientColors.length]}
                                            shape={<CustomizedDot/>}
                                            opacity={0.5}
                                        />
                                    );
                                }

                                return null;
                            })
                        }
                        <Scatter data={line} line={{stroke: 'red', strokeWidth: 2}} shape={() => null}/>
                        <ReferenceLine y={0} stroke="blue" strokeWidth={2}/>
                        <Tooltip cursor={{strokeDasharray: '3 3'}} content={customTooltip}/>
                    </ScatterChart>
                </ResponsiveContainer>
                {diagramLabel(
                    <div>
                        <p>{linRegResSim.eq}</p>
                        <p>R<sup>2</sup> = {linRegResSim.r}</p>
                    </div>
                )}
            </Segment>
        );
    };

    const chartRankedResidualsAgainstNormalProbability = (stats: IStatistics) => {

        const {linRegObsRResNpf, names} = stats;

        const data = stats.data.map((d) => ({x: d.residual, y: d.npf, name: d.name}));
        const xMin = math.floor(stats.stats.residual.min);
        const xMax = math.ceil(stats.stats.residual.max);

        const line = [{
            x: xMin,
            y: linRegObsRResNpf.exec(xMin)
        }, {
            x: xMax,
            y: linRegObsRResNpf.exec(xMax)
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
                        {names.map((n) => data.filter((d) => d.name.startsWith(n)))
                            .map((d, idx) => {
                                if (d.length > 0) {
                                    return (
                                        <Scatter
                                            name={d[0].name}
                                            key={idx}
                                            data={d}
                                            fill={convenientColors[idx % convenientColors.length]}
                                            shape={<CustomizedDot/>}
                                            opacity={0.5}
                                        />
                                    );
                                }

                                return null;
                            })
                        }
                        <Scatter data={line} line={{stroke: 'red', strokeWidth: 2}} shape={() => null}/>
                        <Tooltip cursor={{strokeDasharray: '3 3'}} content={customTooltip}/>
                    </ScatterChart>
                </ResponsiveContainer>
                {diagramLabel(
                    <div>
                        <p>{linRegObsRResNpf.eq}</p>
                        <p>R<sup>2</sup> = {linRegObsRResNpf.r}</p>
                    </div>
                )}
            </Segment>
        );
    };

    const handleChangeExcludesWells = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const value: string[] = data.value as string[];
        setExcludedWells(value);
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
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={12}>
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
                                                        <Table.Cell>{statistics.data.length}</Table.Cell>
                                                        <Table.Cell>-</Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell>Maximum Absolute Residual</Table.Cell>
                                                        <Table.Cell>R<sub>MAX</sub> </Table.Cell>
                                                        <Table.Cell>
                                                            {statistics.stats.absResidual.max.toFixed(3)}
                                                        </Table.Cell>
                                                        <Table.Cell>m</Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell>Minimum Absolute Residual</Table.Cell>
                                                        <Table.Cell>R<sub>MIN</sub></Table.Cell>
                                                        <Table.Cell>
                                                            {statistics.stats.absResidual.min.toFixed(3)}
                                                        </Table.Cell>
                                                        <Table.Cell>m</Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell>Residual Mean</Table.Cell>
                                                        <Table.Cell>R<sub>MEAN</sub></Table.Cell>
                                                        <Table.Cell>
                                                            {statistics.stats.residual.mean.toFixed(3)}
                                                        </Table.Cell>
                                                        <Table.Cell>m</Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell>Absolute residual Mean</Table.Cell>
                                                        <Table.Cell>|R<sub>MEAN</sub>|</Table.Cell>
                                                        <Table.Cell>
                                                            {statistics.stats.residual.mean.toFixed(3)}
                                                        </Table.Cell>
                                                        <Table.Cell>m</Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell>Standard error of estimation</Table.Cell>
                                                        <Table.Cell>SSE</Table.Cell>
                                                        <Table.Cell>
                                                            {statistics.stats.residual.sse.toFixed(3)}
                                                        </Table.Cell>
                                                        <Table.Cell>-</Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell>Root Mean Squared Error</Table.Cell>
                                                        <Table.Cell>RMSE</Table.Cell>
                                                        <Table.Cell>
                                                            {statistics.stats.residual.rmse.toFixed(3)}
                                                        </Table.Cell>
                                                        <Table.Cell>m</Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell>Normalized Root Mean Squared Error</Table.Cell>
                                                        <Table.Cell>NRMSE</Table.Cell>
                                                        <Table.Cell>
                                                            {statistics.stats.residual.nrmse.toFixed(3)}
                                                        </Table.Cell>
                                                        <Table.Cell>-</Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell>Correlation Coefficient Pearson R</Table.Cell>
                                                        <Table.Cell>R</Table.Cell>
                                                        <Table.Cell>
                                                            {statistics.linRegObsSim.r.toFixed(3)}
                                                        </Table.Cell>
                                                        <Table.Cell>-</Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell>Coefficient of determination</Table.Cell>
                                                        <Table.Cell>R<sup>2</sup></Table.Cell>
                                                        <Table.Cell>
                                                            {statistics.linRegObsSim.r2.toFixed(3)}
                                                        </Table.Cell>
                                                        <Table.Cell>-</Table.Cell>
                                                    </Table.Row>
                                                </Table.Body>
                                            </Table>
                                        </Segment>
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Header size={'large'}>Exclude Wells</Header>
                                        <Segment raised={true}>
                                            <Form>
                                                <Form.Dropdown
                                                    multiple={true}
                                                    selection={true}
                                                    options={statistics.names.map((n) => ({key: n, value: n, text: n}))}
                                                    value={excludedWells}
                                                    name={'excludedWells'}
                                                    onChange={handleChangeExcludesWells}
                                                />
                                            </Form>
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>

                            <Header size={'large'}>Simulated vs. Observed Values</Header>
                            {chartObservedVsCalculatedHeads(statistics)}

                            <Header size={'large'}>Weighted residuals vs. simulated heads</Header>
                            {chartWeightedResidualsVsSimulatedHeads(statistics)}

                            <Header size={'large'}>Ranked residuals against normal probability</Header>
                            {chartRankedResidualsAgainstNormalProbability(statistics)}
                        </Container>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );

};

export default observationStatistics;
