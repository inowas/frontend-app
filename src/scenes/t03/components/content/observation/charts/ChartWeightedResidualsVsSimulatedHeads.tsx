import math from 'mathjs';
import React from 'react';
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
import {Segment} from 'semantic-ui-react';
import {IStatistics} from '../statistics';
import {convenientColors, diagramLabel, getNameFromPayload, ICustomTooltipPayload} from './chartHelpers';
import CustomizedDot from './CustomizedDot';

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

const chartWeightedResidualsVsSimulatedHeads = (props: IProps) => {
    const stats = props.statistics;
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
        y: xMin * linRegResSim.slope + linRegResSim.intercept
    }, {
        x: xMax,
        y: xMax * linRegResSim.slope + linRegResSim.intercept
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

export default chartWeightedResidualsVsSimulatedHeads;
