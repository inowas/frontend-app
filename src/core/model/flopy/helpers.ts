import {sortedUniq, uniq} from 'lodash';
import {Moment} from 'moment';
import {Array2D} from '../geometry/Array2D.type';
import {ICell} from '../geometry/Cells.type';
import {Cells} from '../modflow';
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
import {IObsData} from './packages/mf/FlopyModflowMfhob';

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

    let dateTimes: Moment[] = [];
    hobs.forEach((b) => {
        dateTimes = dateTimes.concat(b.getDateTimes(stressperiods));
    });

    const hobData: IObsData[] = [];
    hobs.forEach((h) => {
        const layer = h.layers[0];
        const cell = h.cells.toObject()[0];
        const hobTotims = h.getDateTimes(stressperiods).map((dt) => stressperiods.totimFromDate(dt));
        const hobSpValues = h.getSpValues(stressperiods);

        const tsData = hobTotims.map((totim, idx) => {
            if (totim < 0) {
                return undefined;
            }
            return [totim, hobSpValues[idx][0]];
        }).filter((i) => i !== undefined) as number[][];

        hobData.push({
            obsname: h.name,
            layer,
            row: cell[1],
            column: cell[0],
            time_series_data: tsData
        });
    });

    return hobData;
};

export const calculateLineBoundarySpData = (boundaries: LineBoundary[], stressperiods: Stressperiods) => {

    if (boundaries.length === 0) {
        return null;
    }

    const spData: number[][][] = [];

    boundaries.forEach((b: LineBoundary) => {
        const cells = b.cells.toObject();
        const layers = b.layers;
        const ops = b.observationPoints.map((o) => ({spValues: o.getSpValues(stressperiods)}));

        for (let per = 0; per < stressperiods.count; per++) {
            spData[per] = [];
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

                    const prevSpValues = prevOP.spValues;
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

                    const nextSpValues = nextOP.spValues;
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

    let flowCells: Cells = Cells.fromArray([]);
    let headCells: Cells = Cells.fromArray([]);

    let dateTimes: Moment[] = [];
    boundaries.forEach((b) => {
        if (b.spValuesEnabled[1]) {
            flowCells = flowCells.merge(b.cells);
        }
        if (b.spValuesEnabled[0]) {
            headCells = headCells.merge(b.cells);
        }

        b.observationPoints.forEach((op) => {
            dateTimes = dateTimes.concat(op.getDateTimes(stressperiods));
        });
    });

    const totims: number[] = uniq(
        dateTimes.map((dt) => stressperiods.totimFromDate(dt)).filter((t) => t >= 0)
    ).sort((a, b) => a - b);
    const bdtime = totims;
    const nbdtim = totims.length;
    const ds5: number[][] = [];
    const ds7: number[][] = [];

    boundaries.forEach((b: FlowAndHeadBoundary) => {
        const cells = b.cells.toObject();
        const layers = b.layers;
        const ops = b.observationPoints.map((op) => ({
            dateTimes: op.getDateTimes(stressperiods),
            spValues: op.getSpValues(stressperiods),
            totims: op.getDateTimes(stressperiods).map((dt) => stressperiods.totimFromDate(dt))
        }));

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

                const prevOpTotims = prevOP.totims;
                const prevOpValues = prevOP.spValues;
                if (!prevOpValues || prevOpTotims.length === 0) {
                    return;
                }

                let prevTotimValues: Array<{ totim: number; flow: null | number; head: null | number }> = totims
                    .map((t) => ({
                        totim: t,
                        flow: null,
                        head: null
                    }));

                prevOpTotims.forEach((totim, idx) => {
                    prevTotimValues = prevTotimValues.map((ptv) => {
                        if (ptv.totim === totim) {
                            return {totim, flow: prevOpValues[idx][1], head: prevOpValues[idx][0]};
                        }
                        return ptv;
                    });
                });

                const prevFlowValues = bfill(ffill(prevTotimValues.map((tv) => tv.flow))) as number[];
                const prevHeadValues = bfill(ffill(prevTotimValues.map((tv) => tv.head))) as number[];

                const ds5Temp = [lay, row, col, 0];
                const ds7Temp = [lay, row, col, 0];
                if (factor === 0) {
                    if (b.spValuesEnabled[1]) {
                        ds5.push(ds5Temp.concat(prevFlowValues));
                    }

                    if (b.spValuesEnabled[0]) {
                        ds7.push(ds7Temp.concat(prevHeadValues));
                    }

                    return;
                }

                const nextOP = ops[sector + 1];
                if (!nextOP) {
                    throw Error('NextOp not found');
                }

                const nextOpTotims = nextOP.totims;
                const nextOpValues = nextOP.spValues;
                if (!nextOpValues || nextOpTotims.length === 0) {
                    return;
                }

                let nextTotimValues: Array<{ totim: number; flow: null | number; head: null | number }> = totims
                    .map((t) => ({
                        totim: t,
                        flow: null,
                        head: null
                    }));

                nextOpTotims.forEach((totim, idx) => {
                    nextTotimValues = nextTotimValues.map((ptv) => {
                        if (ptv.totim === totim) {
                            return {totim, flow: nextOpValues[idx][1], head: nextOpValues[idx][0]};
                        }
                        return ptv;
                    });
                });

                const nextFlowValues = bfill(ffill(nextTotimValues.map((tv) => tv.flow))) as number[];
                const nextHeadValues = bfill(ffill(nextTotimValues.map((tv) => tv.head))) as number[];

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

                if (b.spValuesEnabled[1]) {
                    ds5.push(ds5Temp.concat(flowValues));
                }

                if (b.spValuesEnabled[0]) {
                    ds7.push(ds7Temp.concat(headValues));
                }
            });
        });
    });

    const nflw: number = ds5.length;
    const nhed: number = ds7.length;

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

export const ffill = (arr: Array<number | null>) => {
    let latestValue: null | number = null;
    return arr.map((v) => {
        if (v !== null) {
            latestValue = v;
        }

        if (v === null && latestValue !== null) {
            return latestValue;
        }

        return v;
    });
};

export const bfill = (arr: Array<number | null>) => {
    return ffill(arr.reverse()).reverse();
};
