import React from 'react';
import PropTypes from 'prop-types';

import {Container, Grid, Header, Segment, Table} from 'semantic-ui-react';
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
import {Calculation} from '../../../../core/model/modflow';
import {connect} from 'react-redux';
import {fetchModflowFile} from '../../../../services/api';


class Observations extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isError: false,
            calibrationData: null
        };
    }

    componentDidMount() {
        if (!this.props.calculation) {
            return;
        }

        this.fetchFile('mf.hob.stat');
    }

    fetchFile = (file) => {
        const {calculation} = this.props;
        if (!calculation) {
            return;
        }

        const calculationId = calculation.id;
        if (!calculationId || calculationId === '') {
            return;
        }

        this.setState({isLoading: true}, () =>
            fetchModflowFile(calculationId, file,
                fileData => {
                    const {content} = fileData;
                    const calibrationData = JSON.parse(content.replace(/\bNaN\b/g, 'null'));
                    if (!calibrationData.hasOwnProperty('error')) {
                        this.setState({
                            calibrationData,
                            isLoading: false
                        })
                    }
                },
                e => {
                    this.setState({isError: true, isLoading: false});
                    console.error(e);
                })
        )
    };

    chartObservedVsCalculatedHeads = ({simulated, observed, deltaStd}) => {
        const data = simulated.map((s, i) => ({y: s, x: observed[i]}));

        const min = Math.floor(Math.min(...observed, ...simulated) / 10) * 10;
        const max = Math.ceil(Math.max(...observed, ...simulated) / 10) * 10;
        const line = [{x: min, y: min}, {x: max, y: max}];
        const linePlusDelta = [{x: min, y: min + deltaStd}, {x: max, y: max + deltaStd}];
        const lineMinusDelta = [{x: min, y: min - deltaStd}, {x: max, y: max - deltaStd}];

        return (
            <Segment raised>
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

    chartWeightedResidualsVsSimulatedHeads = ({simulated, weightedResiduals, linRegressSW}) => {
        const data = simulated.map((s, i) => ({x: s, y: weightedResiduals[i]}));
        const xMin = Math.floor(Math.min(...simulated) / 10) * 10;
        const xMax = Math.ceil(Math.max(...simulated) / 10) * 10;
        const yMin = Math.floor(Math.min(...weightedResiduals) / 10) * 10;
        const yMax = Math.ceil(Math.max(...weightedResiduals) / 10) * 10;

        // noinspection JSSuspiciousNameCombination
        const domainY = Math.ceil(Math.max(yMax, yMin));
        const line = [{x: xMin, y: yMin}, {x: xMax, y: yMax}];

        return (
            <Segment raised>
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
                        <p>f(x) = {linRegressSW[0].toFixed(3)}x + {linRegressSW[1].toFixed(3)}</p>
                    </div>
                </div>
            </Segment>
        );
    };

    chartRankedResidualsAgainstNormalProbability = ({npf, rankedResiduals, linRegressRN}) => {
        const data = npf.map((n, i) => ({y: n, x: rankedResiduals[i]}));
        const xMin = Math.floor(Math.min(...rankedResiduals) / 5) * 5;
        const xMax = Math.ceil(Math.max(...rankedResiduals) / 5) * 5;
        const yMin = Math.floor(Math.min(...npf) / 5) * 5;
        const yMax = Math.ceil(Math.max(...npf) / 5) * 5;

        const line = [{
            x: xMin,
            y: linRegressRN[0] * xMin + linRegressRN[1]
        }, {
            x: xMax,
            y: linRegressRN[0] * xMax + linRegressRN[1]
        }];

        const yDomain = [yMin, yMax];
        const xDomain = [xMin, xMax];

        return (
            <Segment raised>
                <ResponsiveContainer width={'100%'} aspect={2.0}>
                    <ScatterChart
                        margin={{top: 20, right: 20, bottom: 20, left: 20}}
                    >
                        <CartesianGrid/>
                        <XAxis
                            dataKey={'x'}
                            type="number"
                            name={'npf'} domain={xDomain}
                            label={{value: 'Residual', angle: 0, position: 'bottom'}}
                        />
                        <YAxis
                            dataKey={'y'}
                            type="number"
                            name={'ranked residuals'}
                            domain={yDomain}
                            label={{value: 'Normal Probability Function', angle: -90, position: 'left'}}
                        />
                        <Scatter name={'NPF vs. ranked residuals'} data={data} fill={'black'}/>
                        <Scatter data={line} line={{stroke: 'red', strokeWidth: 2}} shape={() => null}/>
                        <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                    </ScatterChart>
                </ResponsiveContainer>
                <div className="diagram-labels-right">
                    <div className="diagram-label" style={{color: 'red'}}>
                        <p>f(x) = {linRegressRN[0].toFixed(3)}x + {linRegressRN[1].toFixed(3)}</p>
                    </div>
                </div>
            </Segment>
        );
    };


    render() {
        const {calibrationData} = this.state;

        if (!calibrationData) {
            return (
                <p>loading...</p>
            );
        }

        return (
            <Grid>
                <Grid.Row>
                    <Container fluid>
                        <Header size={'large'}>Calculate statistics</Header>
                        <Segment raised>
                            <Table celled>
                                <Table.Body style={{overflowY: 'auto'}}>
                                    <Table.Row>
                                        <Table.Cell>Number of data points</Table.Cell>
                                        <Table.Cell>n [-]</Table.Cell>
                                        <Table.Cell>{calibrationData.n}</Table.Cell>
                                        <Table.Cell>-</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Maximum Absolute Residual</Table.Cell>
                                        <Table.Cell>R<sub>MAX</sub> </Table.Cell>
                                        <Table.Cell>{(calibrationData.rMax).toFixed(3)}</Table.Cell>
                                        <Table.Cell>m</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Minimum Absolute Residual</Table.Cell>
                                        <Table.Cell>R<sub>MIN</sub></Table.Cell>
                                        <Table.Cell>{(calibrationData.rMin).toFixed(3)}</Table.Cell>
                                        <Table.Cell>m</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Residual Mean</Table.Cell>
                                        <Table.Cell>R<sub>MEAN</sub></Table.Cell>
                                        <Table.Cell>{(calibrationData.rMean).toFixed(3)}</Table.Cell>
                                        <Table.Cell>m</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Absolute residual Mean</Table.Cell>
                                        <Table.Cell>|R<sub>MEAN</sub>|</Table.Cell>
                                        <Table.Cell>{(calibrationData.absRMean).toFixed(3)}</Table.Cell>
                                        <Table.Cell>m</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Standard error of estimation</Table.Cell>
                                        <Table.Cell>SSE</Table.Cell>
                                        <Table.Cell>{(calibrationData.sse).toFixed(3)}</Table.Cell>
                                        <Table.Cell>-</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Root Mean Squared Error</Table.Cell>
                                        <Table.Cell>RMSE</Table.Cell>
                                        <Table.Cell>{(calibrationData.rmse).toFixed(3)}</Table.Cell>
                                        <Table.Cell>m</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Normalized Root Mean Squared Error</Table.Cell>
                                        <Table.Cell>NRMSE</Table.Cell>
                                        <Table.Cell>{(calibrationData.nrmse).toFixed(3)}</Table.Cell>
                                        <Table.Cell>-</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Correlation Coefficient Pearson R</Table.Cell>
                                        <Table.Cell>R</Table.Cell>
                                        <Table.Cell>{(calibrationData.R).toFixed(3)}</Table.Cell>
                                        <Table.Cell>-</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Coefficient of determination</Table.Cell>
                                        <Table.Cell>R<sup>2</sup></Table.Cell>
                                        <Table.Cell>{(calibrationData.R2).toFixed(3)}</Table.Cell>
                                        <Table.Cell>-</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </Segment>

                        <Header size={'large'}>Simulated vs. Observed Values</Header>
                        {this.chartObservedVsCalculatedHeads({...calibrationData})}

                        <Header size={'large'}>Weighted residuals vs. simulated heads</Header>
                        {this.chartWeightedResidualsVsSimulatedHeads({...calibrationData})}

                        <Header size={'large'}>Ranked residuals against normal probability</Header>
                        {this.chartRankedResidualsAgainstNormalProbability({...calibrationData})}

                    </Container>
                </Grid.Row>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        calculation: state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null
    };
};

Observations.propTypes = {
    calculation: PropTypes.instanceOf(Calculation)
};

export default connect(mapStateToProps)(Observations);
