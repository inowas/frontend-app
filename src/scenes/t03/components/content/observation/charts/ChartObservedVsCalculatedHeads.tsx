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

const chartObservedVsCalculatedHead = (props: IProps) => {
    const stats = props.statistics;
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

export default chartObservedVsCalculatedHead;
