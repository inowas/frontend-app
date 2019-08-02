import moment from 'moment';
import {Stressperiod} from '../../../../core/model/modflow';

test('Stressperiod constructor', () => {

    const dateTime = moment('2013-02-04T22:44:30.652Z');
    const obj = {
        start_date_time: dateTime.toISOString(),
        nstp: 10,
        tsmult: 1,
        steady: true
    };

    const stressperiod = new Stressperiod(obj);
    expect(stressperiod).toBeInstanceOf(Stressperiod);
    expect(stressperiod.startDateTime).toEqual(dateTime);
    expect(stressperiod.startDateTime.toISOString()).toEqual(dateTime.toISOString());
    expect(stressperiod.nstp).toEqual(10);
    expect(stressperiod.tsmult).toEqual(1);
    expect(stressperiod.steady).toEqual(true);
    expect(stressperiod.toObject()).toEqual(obj);
});

test('Stressperiod need to clone?', () => {

    const dateTime = moment('2013-02-04T22:44:30.652Z');
    const obj = {
        start_date_time: dateTime.toISOString(),
        nstp: 10,
        tsmult: 1,
        steady: true
    };

    const stressperiod = new Stressperiod(obj);
    expect(stressperiod).toBeInstanceOf(Stressperiod);
    expect(stressperiod.startDateTime).toEqual(dateTime);
    expect(stressperiod.startDateTime.toISOString()).toEqual(dateTime.toISOString());
    expect(stressperiod.nstp).toEqual(10);
    expect(stressperiod.tsmult).toEqual(1);
    expect(stressperiod.steady).toEqual(true);
    expect(stressperiod.toObject()).toEqual(obj);

    obj.nstp = 1;
    expect(stressperiod.nstp).toEqual(10);
});
