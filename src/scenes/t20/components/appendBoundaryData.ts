import {Boundary} from '../../../core/model/modflow/boundaries';
import {EMethodType, ETimeResolution} from '../../../core/model/rtm/modelling/RTModelling.type';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';
import RTModellingMethod from '../../../core/model/rtm/modelling/RTModellingMethod';
import Stressperiod from '../../../core/model/modflow/Stressperiod';
import Stressperiods from '../../../core/model/modflow/Stressperiods';
import _ from 'lodash';
import moment from 'moment';

export const appendBoundaryData = (
    boundary: Boundary,
    method: RTModellingMethod,
    rtm: RTModelling,
    stressPeriods: Stressperiods,
    propertyKey: number,
    opId?: string
) => {
    console.log(stressPeriods.toObject());
    const spValues = opId ? boundary.getSpValues(stressPeriods, opId) : boundary.getSpValues(stressPeriods);

    const endDate = stressPeriods.endDateTime;
    const today = moment(Date.now());

    const quotient = rtm.timeResolution === ETimeResolution.DAILY ? 86400 : 1;
    const timeSteps = (today.unix() - endDate.unix()) / quotient;

    const cSp = _.cloneDeep(stressPeriods);
    const cSpValues: number[] = [];
    console.log(endDate, timeSteps);
    return null;
    for (let d = 0; d < timeSteps; d++) {
        console.log(d);
        const newSp = new Stressperiod({
            start_date_time: endDate.add(d, 'days').toISOString(),
            nstp: 1,
            tsmult: 1,
            steady: false
        });
        let newSpValue = spValues[spValues.length - 1][propertyKey];
        if (method.type === EMethodType.FUNCTION) {
            newSpValue = 0;
        }
        if (method.type === EMethodType.SENSOR) {
            newSpValue = -1;
        }
        cSp.addStressPeriod(newSp);
        cSpValues.push(newSpValue);
    }

    console.log(cSp.toObject(), cSpValues);
};
