import moment from 'moment';
import {Stressperiod, Stressperiods, TimeUnit} from '../../../../core/model/modflow';
import {ITimeUnit} from '../../../../core/model/modflow/TimeUnit.type';

test('Stressperiods create with no sps', () => {

    const startDate = moment('2010-02-01T00:00:00.000Z');
    const endDate = moment('2011-01-21T00:00:00.000Z');
    const timeUnit = TimeUnit.fromInt(ITimeUnit.days);

    const stressperiods = Stressperiods.create(startDate, endDate, timeUnit);
    expect(stressperiods).toBeInstanceOf(Stressperiods);
    expect(stressperiods.startDateTime).toBeInstanceOf(moment);
    expect(stressperiods.startDateTime).toEqual(startDate);
    expect(stressperiods.endDateTime).toEqual(endDate);
    expect(stressperiods.timeUnit).toBeInstanceOf(TimeUnit);
    expect(stressperiods.timeUnit.toInt()).toEqual(timeUnit.toInt());
    expect(stressperiods.count).toEqual(1);
});

test('Stressperiods create from default', () => {
    const stressperiods = Stressperiods.fromDefaults();
    expect(stressperiods).toBeInstanceOf(Stressperiods);
    expect(stressperiods.startDateTime).toBeInstanceOf(moment);
    expect(stressperiods.startDateTime.toISOString()).toEqual('2000-01-01T00:00:00.000Z');
    expect(stressperiods.endDateTime.toISOString()).toEqual('2019-12-31T00:00:00.000Z');
    expect(stressperiods.timeUnit).toBeInstanceOf(TimeUnit);
    expect(stressperiods.timeUnit.toInt()).toEqual(4);
    expect(stressperiods.count).toEqual(1);
});

test('Stressperiods add, update, remove stressperiod and reorder automatically', () => {
    const stressperiods = Stressperiods.fromDefaults();
    expect(stressperiods).toBeInstanceOf(Stressperiods);
    expect(stressperiods.startDateTime).toBeInstanceOf(moment);
    expect(stressperiods.startDateTime.toISOString()).toEqual('2000-01-01T00:00:00.000Z');
    expect(stressperiods.endDateTime.toISOString()).toEqual('2019-12-31T00:00:00.000Z');
    expect(stressperiods.timeUnit).toBeInstanceOf(TimeUnit);
    expect(stressperiods.timeUnit.toInt()).toEqual(4);
    expect(stressperiods.count).toEqual(1);

    stressperiods.addStressPeriod(new Stressperiod({
        start_date_time: moment('2002-01-01T00:00:00.000Z').toISOString(),
        nstp: 2,
        tsmult: 1,
        steady: false
    }));

    expect(stressperiods.count).toEqual(2);
    expect(stressperiods.stressperiods[1].startDateTime.toISOString()).toEqual('2002-01-01T00:00:00.000Z');

    stressperiods.addStressPeriod(new Stressperiod({
        start_date_time: moment('2001-01-01T00:00:00.000Z').toISOString(),
        nstp: 2,
        tsmult: 1,
        steady: false
    }));

    expect(stressperiods.count).toEqual(3);
    expect(stressperiods.stressperiods[2].startDateTime.toISOString()).toEqual('2002-01-01T00:00:00.000Z');

    stressperiods.updateStressperiodByIdx(1, new Stressperiod({
        start_date_time: moment('2005-01-01T00:00:00.000Z').toISOString(),
        nstp: 2,
        tsmult: 1,
        steady: false
    }));

    expect(stressperiods.count).toEqual(3);
    expect(stressperiods.stressperiods[2].startDateTime.toISOString()).toEqual('2005-01-01T00:00:00.000Z');

    stressperiods.removeStressPeriod(1);
    expect(stressperiods.count).toEqual(2);
    expect(stressperiods.stressperiods[1].startDateTime.toISOString()).toEqual('2005-01-01T00:00:00.000Z');
});

test('Stressperiods toObject, fromObject', () => {
    const stressperiods = Stressperiods.fromDefaults();
    stressperiods.addStressPeriod(new Stressperiod({
        start_date_time: moment('2001-01-01T00:00:00.000Z').toISOString(),
        nstp: 2,
        tsmult: 1,
        steady: false
    }));
    stressperiods.addStressPeriod(new Stressperiod({
        start_date_time: moment('2002-01-01T00:00:00.000Z').toISOString(),
        nstp: 2,
        tsmult: 1,
        steady: false
    }));
    stressperiods.addStressPeriod(new Stressperiod({
        start_date_time: moment('2003-01-01T00:00:00.000Z').toISOString(),
        nstp: 2,
        tsmult: 1,
        steady: false
    }));

    const obj = stressperiods.toObject();
    expect(obj).toEqual(Stressperiods.fromObject(obj).toObject());
});

test('Stressperiods calculations', () => {
    const stressperiods = Stressperiods.fromDefaults();
    stressperiods.addStressPeriod(new Stressperiod({
        start_date_time: moment('2001-01-01T00:00:00.000Z').toISOString(),
        nstp: 2,
        tsmult: 1,
        steady: false
    }));
    stressperiods.addStressPeriod(new Stressperiod({
        start_date_time: moment('2002-01-01T00:00:00.000Z').toISOString(),
        nstp: 2,
        tsmult: 1,
        steady: false
    }));
    stressperiods.addStressPeriod(new Stressperiod({
        start_date_time: moment('2003-01-01T00:00:00.000Z').toISOString(),
        nstp: 2,
        tsmult: 1,
        steady: false
    }));
    stressperiods.addStressPeriod(new Stressperiod({
        start_date_time: moment('2004-02-05T00:00:00.000Z').toISOString(),
        nstp: 2,
        tsmult: 1,
        steady: false
    }));

    expect(stressperiods.dateTimes.map((dt) => dt.toISOString())).toEqual([
        '2000-01-01T00:00:00.000Z',
        '2001-01-01T00:00:00.000Z',
        '2002-01-01T00:00:00.000Z',
        '2003-01-01T00:00:00.000Z',
        '2004-02-05T00:00:00.000Z'
    ]);

    expect(stressperiods.totim).toEqual(7305);
    expect(stressperiods.perlens).toEqual([366, 365, 365, 400, 5808]);
    expect(stressperiods.totims).toEqual([0, 366, 731, 1096, 1496, 7304]);
});
