import {CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis} from 'recharts';
import {ICustomTooltipPayload, convenientColors, diagramLabel, getNameFromPayload} from './chartHelpers';
import {IStatistics} from '../statistics';
import {Segment} from 'semantic-ui-react';
import CustomizedDot from './CustomizedDot';
import React from 'react';
import math from 'mathjs';

interface IProps {
    statistics: IStatistics;
}

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

const chartRankedResidualsAgainstNormalProbability = (props: IProps) => {
    const stats = props.statistics;
    const {linRegObsRResNpf, names} = stats;

    const data = stats.data.map((d) => ({x: d.residual, y: d.npf, name: d.name}));
    const xMin = math.floor(stats.stats.residual.min);
    const xMax = math.ceil(stats.stats.residual.max);

    const line = [{
        x: xMin,
        y: (xMin * linRegObsRResNpf.slope) + linRegObsRResNpf.intercept
    }, {
        x: xMax,
        y: (xMax * linRegObsRResNpf.slope) + linRegObsRResNpf.intercept
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
                    <Scatter data={line} line={{stroke: 'red', strokeWidth: 2}} shape={() => <div />}/>
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

export default chartRankedResidualsAgainstNormalProbability;
