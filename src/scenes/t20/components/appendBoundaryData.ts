import RTModelling from '../../../core/model/rtm/modelling/RTModelling';
import _ from 'lodash';

type IPointBoundary = {
    [id: string]: Array<number[] | null>;
};

interface ILineBoundary {
    [id: string]: IPointBoundary;
}

interface IResults {
    stressperiods: {
        times: number[];
    };
    boundaries: {
        spValues: IPointBoundary | ILineBoundary;
    }
}

function dateDiffInDays(a: Date, b: Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

const valuesByFunction = (f: string, numberOfDays: number) => {
    const a = new Array(numberOfDays - 1).fill(1);
    const r: number[] = a.map((v, k) => k + 1);
    return r;
};

export const appendBoundaryData = async (
    rtm: RTModelling,
) => {
    const r = rtm.toObject();
    const dayDiff = dateDiffInDays(rtm.startDate, new Date(Date.now()));

    if (!r.data.head) {
        return null;
    }

    const results: IResults = {
        stressperiods: {
            times: _.range(1, dayDiff)
        },
        boundaries: {
            spValues: {}
        }
    };

    /*r.data.head.forEach((b) => {
        // Line Boundary
        if (!Array.isArray(b.data)) {
            results.boundaries.spValues[b.boundary_id] = {};
            const keys = Object.keys(b.data);
            keys.forEach((key) => {
                (results.boundaries.spValues[b.boundary_id] as IPointBoundary)[key] =
                    (b.data as RTModellingObservationPoint)[key].map((r) => {
                        if (r.method === EMethodType.FUNCTION && r.function) {
                            return valuesByFunction(r.function, dayDiff);
                        }
                        if (r.method === EMethodType.SENSOR) {
                            return r.values;
                        }
                        return null;
                    })
            })
        }
        // Non-Line Boundary
        if (Array.isArray(b.data)) {
            results.boundaries.spValues[b.boundary_id] = b.data.map((r) => r.values);
        }
    });*/

    return results;
};
