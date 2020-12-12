import {
    ArrayOfMethods,
    EMethodType,
    RTModellingObservationPoint
} from '../../../core/model/rtm/modelling/RTModelling.type';
import {BoundaryFactory, LineBoundary} from '../../../core/model/modflow/boundaries';
import {ISpValues} from '../../../core/model/modflow/boundaries/Boundary.type';
import {ModflowModel} from '../../../core/model/modflow';
import BoundaryCollection from '../../../core/model/modflow/boundaries/BoundaryCollection';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';
import _ from 'lodash';

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

const dateDiffInDays = (a: Date, b: Date) => {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

const addDays = (a: Date, days: number) => {
    const utc = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    return new Date(Math.floor(utc + (_MS_PER_DAY * days))).toISOString();
}

const appendSpValues = (spValues: ISpValues, data: ArrayOfMethods | null, days: number[]): ISpValues => {
    const newSpValues: ISpValues = days.map((t) => {
        if (!data || data.filter((r) => r.method !== EMethodType.CONSTANT).length === 0) {
            return spValues[spValues.length - 1];
        }
        return data.map((p) => {
                if (p.values && t <= p.values.length) {
                    return p.values[t - 1]
                }
                return spValues[spValues.length - 1][t - 1];
            }
        );
    });

    return spValues.concat(newSpValues);
}

export const appendBoundaryData = (
    boundaries: BoundaryCollection,
    model: ModflowModel,
    rtm: RTModelling,
) => {
    const r = rtm.toObject();
    const dayDiff = dateDiffInDays(rtm.startDate, new Date(Date.now()));

    if (!r.data.head) {
        return null;
    }

    const times = _.range(1, dayDiff);

    console.log(times);
    
    // Append Stressperiods

    const cStressperiods = model.stressperiods.toObject();
    const lastSp = cStressperiods.stressperiods[cStressperiods.stressperiods.length - 1];
    times.forEach((d) => {
        const newSp = {
            start_date_time: addDays(rtm.startDate, d),
            nstp: lastSp.nstp,
            tsmult: lastSp.tsmult,
            steady: lastSp.steady
        };
        cStressperiods.stressperiods.push(newSp);
    });

    // Append Boundaries
    
    const cBoundaries = boundaries.toObject().map((b) => {
        const cBoundary = BoundaryFactory.fromObject(b);
        if (rtm.heads) {
            const f1 = rtm.heads.filter((h) => h.boundary_id === cBoundary.id);

            if (cBoundary instanceof LineBoundary) {
                cBoundary.observationPoints.forEach((op) => {
                    const spValues = cBoundary.getSpValues(model.stressperiods, op.id);
                    if (f1.length > 0 && !Array.isArray(f1[0].data)) {
                        const d = f1[0].data as RTModellingObservationPoint;
                        if (d[op.id]) {
                            cBoundary.setSpValues(appendSpValues(spValues, d[op.id], times), op.id);
                        } else {
                            cBoundary.setSpValues(appendSpValues(spValues, null, times), op.id);
                        }
                    } else {
                        cBoundary.setSpValues(appendSpValues(spValues, null, times), op.id);
                    }
                });
            } else {
                const spValues = cBoundary.getSpValues(model.stressperiods);
                if (f1.length > 0 && Array.isArray(f1[0].data)) {
                    cBoundary.setSpValues(appendSpValues(spValues, f1[0].data, times));
                } else {
                    cBoundary.setSpValues(appendSpValues(spValues, null, times));
                }
            }
        }
        return cBoundary.toObject();
    });

    return {
        boundaries: cBoundaries,
        stressperiods: cStressperiods
    };
};
