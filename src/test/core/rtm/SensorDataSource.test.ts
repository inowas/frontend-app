import Uuid from 'uuid';

import {ISensorDataSource} from '../../../core/model/rtm/Sensor.type';
import SensorDataSource from '../../../core/model/rtm/SensorDataSource';

test('Test SensorDataSource URL-props and regex pattern-matching', () => {
    const obj: ISensorDataSource = {
        id: Uuid.v4(),
        url: 'https://uit-sensors.inowas.com/sensors/project/DEU1/sensor/I-6/property/ec'
            + '?timeResolution=1D&begin=1&end=10'
    };

    const ds = new SensorDataSource(obj);
    expect(ds).toBeInstanceOf(SensorDataSource);
    expect(ds.id).toEqual(obj.id);
    expect(ds.url.toString()).toEqual(obj.url);
    expect(ds.urlProtocol).toEqual('https:');
    expect(ds.urlHostName).toEqual('uit-sensors.inowas.com');
    expect(ds.urlPathName).toEqual('/sensors/project/DEU1/sensor/I-6/property/ec');
    expect(ds.project).toEqual('DEU1');
    expect(ds.sensor).toEqual('I-6');
    expect(ds.parameter).toEqual('ec');
    expect(ds.urlSearchParams.has('timeResolution')).toBeTruthy();
    expect(ds.timeResolution).toEqual('1D');
    expect(ds.begin).toEqual(1);
    expect(ds.end).toEqual(10);

    ds.timeResolution = '1W';
    expect(ds.timeResolution).toEqual('1W');
    ds.begin = 2;
    expect(ds.begin).toEqual(2);
    expect(ds.urlSearchParams.get('begin')).toEqual('2');

    ds.end = 3;
    expect(ds.end).toEqual(3);
    expect(ds.urlSearchParams.get('end')).toEqual('3');

    ds.project = 'DEU2';
    expect(ds.project).toEqual('DEU2');

    ds.sensor = 'DEU2-1';
    expect(ds.sensor).toEqual('DEU2-1');

    ds.parameter = 'ccd';
    expect(ds.parameter).toEqual('ccd');

    ds.begin = null;
    expect(ds.begin).toEqual(null);
    expect(ds.urlSearchParams.get('begin')).toEqual(null);

    ds.end = null;
    expect(ds.end).toEqual(null);
    expect(ds.urlSearchParams.get('end')).toEqual(null);

    ds.timeResolution = null;
    expect(ds.timeResolution).toEqual(null);
    expect(ds.urlSearchParams.get('timeResolution')).toEqual(null);

    ds.min = 0.1;
    expect(ds.min).toEqual(0.1);
    expect(ds.urlSearchParams.get('min')).toEqual('0.1');
    ds.min = null;
    expect(ds.min).toBeNull();
    expect(ds.urlSearchParams.get('min')).toEqual(null);

    ds.max = 100;
    expect(ds.max).toEqual(100);
    expect(ds.urlSearchParams.get('max')).toEqual('100');
    ds.max = null;
    expect(ds.max).toBeNull();
    expect(ds.urlSearchParams.get('max')).toEqual(null);
});

test('Test SensorDataSource, create from params', () => {
    const ds = SensorDataSource.fromParams('uit-sensors.inowas.com', 'DEU1', 'I-3', 'ec');
    expect(ds).toBeInstanceOf(SensorDataSource);

});

test('Test SensorDataSource, loading pre-loaded data', async () => {
    const obj: ISensorDataSource = {
        id: Uuid.v4(),
        url: ''
    };

    const ds = new SensorDataSource(obj);
    ds.data = [{timeStamp: 1, value: 1.2}];
    await ds.loadData();
    expect(ds.data).toEqual(ds.toObject().data);
});

test('Test SensorDataSource, loading from http-resource', async () => {
    const obj: ISensorDataSource = {
        id: Uuid.v4(),
        url: 'https://uit-sensors.inowas.com/sensors/project/DEU1/sensor/I-6/property/ec' +
            '?timeResolution=1D&begin=0&end=1571047333'
    };

    const ds = new SensorDataSource(obj);
    await ds.loadData();
    expect(ds.data && ds.data.length).toEqual(131);

    ds.data = [{timeStamp: 1, value: 1.2}];
    expect(ds.loadData().then(() => expect(ds.data).toEqual(ds.toObject().data)));
});

test('Test SensorDataSource 2 , loading from http-resource', async () => {
    const obj: ISensorDataSource = {
        id: Uuid.v4(),
        url: 'https://sensors.inowas.com/sensors/project/DEU1/sensor/I-6/property/ec' +
            '?timeResolution=1D&begin=0&end=1571047333'
    };

    const ds = new SensorDataSource(obj);
    await ds.loadData();
    expect(ds.data && ds.data.length).toEqual(130);

    ds.data = [{timeStamp: 1, value: 1.2}];
    expect(ds.loadData().then(() => expect(ds.data).toEqual(ds.toObject().data)));
});
