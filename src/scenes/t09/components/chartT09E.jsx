import React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';

import '../../less/toolDiagram.less';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine
} from 'recharts';
import {calcXtQ0Flux, calcXtQ0Head, dRho, calculateDiagramData} from '../calculations/calculationT09E';

const calculationErrorOverlay = (maxIter, valid, dxt) => {
    if (!valid) {
        return (
            <div className="diagram-labels-left">
                <div className="diagram-label">
                    <p>Invalid values: square root gets minus.</p>
                    <p>Offshore discharge rate is less than minimum discharge rate</p>
                </div>
            </div>
        );
    }

    if (maxIter) {
        return (
            <div className="diagram-labels-left">
                <div className="diagram-label">
                    <p>Maximum number of iterations are conducted.</p>
                    <p>Change in x <sub>t</sub>&nbsp;=&nbsp;<strong>{dxt.toFixed(1)}</strong>&nbsp;m</p>
                </div>
            </div>
        );
    }

    return (
        <div className="diagram-labels-left">
            <div className="diagram-label">
                <p>Change in x <sub>t</sub>&nbsp;=&nbsp;<strong>{dxt.toFixed(1)}</strong>&nbsp;m</p>
            </div>
        </div>
    );
};

const Chart = ({k, z0, l, w, dz, hi, i, df, ds, method}) => {
    let data;
    let dxt;
    let maxIter = false;
    let isValid = true;
    const alpha = dRho(df, ds);
    if (method === 'constHead') {
        const xtQ0Head1 = calcXtQ0Head(k, z0, 0, l, w, hi, alpha);
        const xt = xtQ0Head1[0];
        maxIter = xtQ0Head1[2];
        isValid = xtQ0Head1[3];

        const xtQ0Head2 = calcXtQ0Head(k, z0, dz, l, w, hi - dz, alpha);
        const xtSlr = xtQ0Head2[0]; // slr: after sea level rise
        if (maxIter === false) {
            maxIter = xtQ0Head2[2];
        }

        if (isValid) {
            isValid = xtQ0Head2[3];
        }

        dxt = xtSlr - xt;
        data = calculateDiagramData(xt, z0, xtSlr, dz, isValid);
    }

    if (method === 'constFlux') {
        const [xt, xtSlr] = calcXtQ0Flux(k, z0, dz, l, w, i, alpha);
        dxt = xtSlr - xt;
        data = calculateDiagramData(xt, z0, xtSlr, dz, isValid);
    }

    return (
        <div>
            <h2>Calculation</h2>
            <div className="grid-container">
                <div className="col stretch">
                    <div className="diagram">
                        <ResponsiveContainer width={'100%'} aspect={2}>
                            <LineChart data={data} margin={{
                                top: 20,
                                right: 55,
                                left: 50,
                                bottom: 0
                            }}>

                                <XAxis type="number" dataKey="xt"/>
                                <YAxis type="number" allowDecimals={false} tickLine={false} tickFormatter={(x) => {
                                    return x.toFixed(1);
                                }} orientation="right"/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Line isAnimationActive={false} type="basis" dataKey={'z0'} stroke="#ED8D05"
                                      strokeWidth="5" dot={false}/>
                                <Line isAnimationActive={false} type="basis" dataKey={'z0_new'} stroke="#ED8D05"
                                      strokeWidth="5" dot={false} strokeDasharray="15 15"/>
                                <ReferenceLine y={data[1].z0} stroke="black" strokeWidth="1" strokeDasharray="3 3" label="z₀" dot={false}/>
                                <ReferenceLine x={data[1].xt} stroke="black" strokeWidth="1" strokeDasharray="3 3" label="xt" dot={false}/>
                                <ReferenceLine x={data[2].xt} stroke="black" strokeWidth="1" strokeDasharray="3 3" label="xt'" dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="diagram-ylabels-right">
                            <p>z<sub>0</sub> (m)</p>
                        </div>
                        {calculationErrorOverlay(maxIter, isValid, dxt)}
                        <p className="center-vertical center-horizontal">x<sub>w</sub> (m)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

Chart.propTypes = {
    k: PropTypes.number.isRequired,
    l: PropTypes.number.isRequired,
    w: PropTypes.number.isRequired,
    z0: PropTypes.number.isRequired,
    ds: PropTypes.number.isRequired,
    df: PropTypes.number.isRequired,
    dz: PropTypes.number.isRequired,
    hi: PropTypes.number.isRequired,
    i: PropTypes.number.isRequired,
    method: PropTypes.string.isRequired
};

export default pure(Chart);
