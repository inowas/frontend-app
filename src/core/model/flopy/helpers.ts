import {sortedUniq} from 'lodash';
import {Moment} from 'moment';
import {Array2D} from '../geometry/Array2D.type';
import {ICell} from '../geometry/Cells.type';
import {
    EvapotranspirationBoundary,
    HeadObservationWell,
    LineBoundary,
    PointBoundary,
    RechargeBoundary
} from '../modflow/boundaries';
import FlowAndHeadBoundary from '../modflow/boundaries/FlowAndHeadBoundary';
import Stressperiods from '../modflow/Stressperiods';
import {IPropertyValueObject} from '../types';

export const min = (a: Array2D<number> | number) => {

    if (!Array.isArray(a)) {
        return a;
    }

    if (isValue(a)) {
        return a;
    }

    const values = a
        .map((row) => row.filter((v) => (!isNaN(v) && v !== null)))
        .map((arr) => (Math.min.apply(null, arr)));

    return Math.min.apply(null, values);
};

export const max = (a: Array2D<number> | number) => {
    if (!Array.isArray(a)) {
        return a;
    }

    if (isValue(a)) {
        return a;
    }

    const values = a
        .map((row) => row.filter((v) => (!isNaN(v) && v !== null)))
        .map((arr) => (Math.max.apply(null, arr)));
    return Math.max.apply(null, values);
};

const isValue = (data: Array2D<number> | number) => {
    return !isNaN(data as number);
};

export const minify2dGridIfPossible = (data: Array2D<number>) => {
    const minValue = min(data);
    const maxValue = max(data);
    if (minValue === maxValue) {
        return minValue;
    }

    return data;
};

export const convertArrayToDict = (arr: any[]) => {
    const obj: IPropertyValueObject = {};
    arr.forEach((item, idx) => {
        obj[idx] = item;
    });
    return obj;
};

export const calculateHeadObservationData = (hobs: HeadObservationWell[], stressperiods: Stressperiods) => {

    if (hobs.length === 0) {
        return null;
    }

    const totims = stressperiods.totims;

    return hobs.map((h) => {
        const layer = h.layers[0];
        const cell = h.cells.toObject()[0];
        const timeSeriesData = h.getSpValues(stressperiods).map((spValue: number[], idx: number) => ([
            totims[idx], spValue[0]
        ]));

        return {
            layer,
            row: cell[1],
            column: cell[0],
            time_series_data: timeSeriesData
        };
    });
};

export const calculateLineBoundarySpData = (boundaries: LineBoundary[], stressperiods: Stressperiods) => {

    if (boundaries.length === 0) {
        return null;
    }

    const spData: number[][][] = [];
    for (let per = 0; per < stressperiods.count; per++) {
        spData[per] = [];
    }

    boundaries.forEach((b: LineBoundary) => {
        const cells = b.cells.toObject();
        const layers = b.layers;
        const ops = b.observationPoints;

        for (let per = 0; per < stressperiods.count; per++) {
            layers.forEach((lay: number) => {
                cells.forEach((cell: ICell) => {
                    const col = cell[0];
                    const row = cell[1];
                    const value = cell[2] ? cell[2] : 0;
                    const sector = Math.trunc(value);
                    const factor = Number((value - sector).toFixed(4));

                    const prevOP = ops[sector];
                    if (!prevOP) {
                        throw Error('PrevOp not found');
                    }

                    const prevSpValues = prevOP.getSpValues(stressperiods);
                    if (!prevSpValues) {
                        return;
                    }

                    const prevSpValue = prevSpValues[per];

                    const spvTemp = [lay, row, col];
                    if (factor === 0) {
                        spData[per].push(spvTemp.concat(prevSpValue));
                        return;
                    }

                    const nextOP = ops[sector + 1];
                    if (!nextOP) {
                        throw Error('NextOp not found');
                    }

                    const nextSpValues = nextOP.getSpValues(stressperiods);
                    if (!nextSpValues) {
                        return;
                    }

                    const nextSpValue = nextSpValues[per];

                    for (let propIdx = 0; propIdx < nextSpValue.length; propIdx++) {
                        const v = prevSpValue[propIdx] + (nextSpValue[propIdx] - prevSpValue[propIdx]) * factor;
                        spvTemp.push(Number(v.toFixed(3)));
                    }

                    spData[per].push(spvTemp);
                });
            });
        }
    });

    return convertArrayToDict(spData);
};

export const calculateFlowAndHeadBoundarySpData = (boundaries: FlowAndHeadBoundary[], stressperiods: Stressperiods) => {

    if (boundaries.length === 0) {
        return null;
    }

    let dateTimes: Moment[] = [];
    boundaries.forEach((b) => {
        b.observationPoints.forEach((op) => {
            dateTimes = dateTimes.concat(op.dateTimes);
        });
    });

    const totims: number[] = sortedUniq(dateTimes.map((dt) => stressperiods.totimFromDate(dt)));
    const bdtime = totims;
    const nbdtim = totims.length;

    const nflw: number = 0;
    const nhed: number = 0;

    const ds5: number[][] = [];
    const ds7: number[][] = [];

    boundaries.forEach((b: FlowAndHeadBoundary) => {
        const cells = b.cells.toObject();
        const layers = b.layers;
        const ops = b.observationPoints;

        layers.forEach((lay: number) => {
            cells.forEach((cell: ICell) => {
                const col = cell[0];
                const row = cell[1];
                const value = cell[2] ? cell[2] : 0;
                const sector = Math.trunc(value);
                const factor = Number((value - sector).toFixed(4));

                const prevOP = ops[sector];
                if (!prevOP) {
                    throw Error('PrevOp not found');
                }

                const prevOpValues = prevOP.getSpValues(stressperiods);
                if (!prevOpValues) {
                    return;
                }

                const prevFlowValues = prevOpValues.map((v) => v[1]);
                const prevHeadValues = prevOpValues.map((v) => v[0]);

                const ds5Temp = [lay, row, col, 0];
                const ds7Temp = [lay, row, col, 0];
                if (factor === 0) {
                    ds5.push(ds5Temp.concat(prevFlowValues));
                    ds7.push(ds7Temp.concat(prevHeadValues));
                    return;
                }

                const nextOP = ops[sector + 1];
                if (!nextOP) {
                    throw Error('NextOp not found');
                }

                const nextOpValues = nextOP.getSpValues(stressperiods);
                if (!nextOpValues) {
                    return;
                }

                const nextFlowValues = nextOpValues.map((v) => v[1]);
                const nextHeadValues = nextOpValues.map((v) => v[0]);

                const flowValues = prevFlowValues.map((pfv, idx) => {
                    if (nextFlowValues[idx]) {
                        return pfv + ((nextFlowValues[idx] - pfv) * factor);
                    }

                    return pfv;
                });

                const headValues = prevHeadValues.map((phv, idx) => {
                    if (nextHeadValues[idx]) {
                        return phv + ((nextHeadValues[idx] - phv) * factor);
                    }
                    return phv;
                });

                ds5.push(ds5Temp.concat(flowValues));
                ds7.push(ds7Temp.concat(headValues));
                return;
            });
        });
    });

    return {bdtime, nbdtim, nflw, nhed, ds5, ds7};
};

export const calculatePointBoundarySpData = (boundaries: PointBoundary[], stressperiods: Stressperiods,
                                             add = true) => {

    if (boundaries.length === 0) {
        return null;
    }

    const spData: number[][][] = new Array(stressperiods.count).fill([]);

    spData.forEach((sp, idx) => {
        boundaries.forEach((b) => {
            const layer = b.layers[0];
            const cell = b.cells.toObject()[0];
            const data = [layer, cell[1], cell[0]].concat(b.getSpValues(stressperiods)[idx]);

            let push = true;
            spData[idx] = spData[idx].map((spd) => {
                if (spd[0] === data[0] && spd[1] === data[1] && spd[2] === data[2]) {
                    push = false;

                    for (let propIdx = 3; propIdx < spd.length; propIdx++) {
                        if (add) {
                            spd[propIdx] += data[propIdx];
                        } else {
                            spd[propIdx] = data[propIdx];
                        }
                    }
                }
                return spd;
            });

            if (push) {
                spData[idx].push(data);
            }
        });
    });

    return convertArrayToDict(spData);

};

export const calculateRechargeSpData = (boundaries: RechargeBoundary[], stressperiods: Stressperiods, nrow: number,
                                        ncol: number) => {

    if (boundaries.length === 0) {
        return null;
    }

    const layers = sortedUniq(boundaries.map((b) => b.layers[0]));

    const spData: number[][][] = [];
    for (let per = 0; per < stressperiods.count; per++) {
        spData[per] = [];
        for (let row = 0; row < nrow; row++) {
            spData[per][row] = [];
            for (let col = 0; col < ncol; col++) {
                spData[per][row][col] = 0;
            }
        }
    }

    boundaries.forEach((rch) => {
        const cells = rch.cells.toObject();
        const spValues = rch.getSpValues(stressperiods);

        spData.forEach((sp, per) => {
            cells.forEach((cell) => {
                const row = cell[1];
                const col = cell[0];
                spData[per][row][col] += spValues[per][0];
            });
        });
    });

    return {
        spData: convertArrayToDict(spData),
        irch: layers.length > 1 ? layers : layers[0]
    };

};

export const calculateEvapotranspirationSpData = (
    boundaries: EvapotranspirationBoundary[],
    stressperiods: Stressperiods,
    nper: number,
    nrow: number,
    ncol: number
) => {
    if (boundaries.length === 0) {
        return null;
    }

    const layers = sortedUniq(boundaries.map((b) => b.layers[0]));

    const evtrData: number[][][] = [];
    for (let per = 0; per < nper; per++) {
        evtrData[per] = [];
        for (let row = 0; row < nrow; row++) {
            evtrData[per][row] = [];
            for (let col = 0; col < ncol; col++) {
                evtrData[per][row][col] = 0;
            }
        }
    }

    const surfData: number[][][] = [];
    for (let per = 0; per < nper; per++) {
        surfData[per] = [];
        for (let row = 0; row < nrow; row++) {
            surfData[per][row] = [];
            for (let col = 0; col < ncol; col++) {
                surfData[per][row][col] = 0;
            }
        }
    }

    const exdpData: number[][][] = [];
    for (let per = 0; per < nper; per++) {
        exdpData[per] = [];
        for (let row = 0; row < nrow; row++) {
            exdpData[per][row] = [];
            for (let col = 0; col < ncol; col++) {
                exdpData[per][row][col] = 0;
            }
        }
    }
    boundaries.forEach((b) => {
        const cells = b.cells.toObject();
        const spValues = b.getSpValues(stressperiods);

        for (let per = 0; per < nper; per++) {
            const [evtr, surf, exdp] = spValues[per];
            cells.forEach((cell) => {
                const row = cell[1];
                const col = cell[0];
                evtrData[per][row][col] += evtr;
                surfData[per][row][col] += surf;
                exdpData[per][row][col] += exdp;
            });
        }
    });

    return {
        ievt: layers.length > 1 ? layers : layers[0],
        evtr: convertArrayToDict(evtrData),
        surf: convertArrayToDict(surfData),
        exdp: convertArrayToDict(exdpData)
    };
};
