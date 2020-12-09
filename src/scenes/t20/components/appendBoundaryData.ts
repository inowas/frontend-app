import {EMethodType, RTModellingObservationPoint} from '../../../core/model/rtm/modelling/RTModelling.type';
import {IPropertyValueObject} from '../../../core/model/types';
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

export const appendBoundaryData = async (
    rtm: RTModelling,
) => {
    const r = rtm.toObject();
    const dayDiff = dateDiffInDays(rtm.startDate, new Date(Date.now()));

    if (!r.data.head) {
        return null;
    }

    const times = _.range(1, dayDiff);

    const boundariesObject: IPropertyValueObject = {};

    r.data.head.forEach((h) => {
        if (Array.isArray(h.data)) {
            boundariesObject[h.boundary_id] = times.map((t) => {
                if (Array.isArray(h.data)) {
                    if (h.data.filter((r) => r.method !== EMethodType.CONSTANT).length === 0) {
                        return null;
                    }
                    return h.data.map(
                        (p) => {
                            if (p.values && t <= p.values.length) {
                                return p.values[t - 1]
                            }
                            return null;
                        }
                    );
                }
                return null;
            });
        } else {
            const keys = Object.keys(h.data);
            const opObject: IPropertyValueObject = {};

            keys.forEach((opId) => {
                if ((h.data as RTModellingObservationPoint)[opId].filter(
                    (r) => r.method !== EMethodType.CONSTANT).length === 0) {
                    return null;
                }
                opObject[opId] = times.map((t) => (h.data as RTModellingObservationPoint)[opId].map(
                    (p) => {
                        if (p.values && t <= p.values.length) {
                            return p.values[t - 1]
                        }
                        return null;
                    }
                ));
            });
            boundariesObject[h.boundary_id] = opObject;
        }
    });

    const results: IResults = {
        stressperiods: {
            times
        },
        boundaries: {
            spValues: boundariesObject
        }
    };

    return results;
};
