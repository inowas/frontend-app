import PrometheusDataSource from '../../../core/model/rtm/PrometheusDataSource';
import uuid from 'uuid';

import {IPrometheusDataSource} from '../../../core/model/rtm/Sensor.type';

test('Test PrometheusDataSource, create from params', () => {
    const obj: IPrometheusDataSource = {
        id: uuid.v4(),
        protocol: 'https',
        hostname: 'prometheus.inowas.com',
        query: 'pegel_online_wsv_sensors{station="DRESDEN", type="waterlevel"}/100',
        start: 1575500400,
        end: 1575586800,
        step: 120
    };
    const ds = new PrometheusDataSource(obj);
    expect(ds).toBeInstanceOf(PrometheusDataSource);
    expect(ds.url)
        .toEqual('https://prometheus.inowas.com/api/v1/query_range?' +
            'query=pegel_online_wsv_sensors%7Bstation%3D%22DRESDEN%22%2C%20type%3D%22waterlevel%22%7D%2F100' +
            `&start=${obj.start}` +
            `&end=${obj.end}` +
            `&step=${obj.step}`
        );
});

test('Test PrometheusDataSource, loading pre-loaded data', async () => {
    const obj: IPrometheusDataSource = {
        id: uuid.v4(),
        protocol: 'https',
        hostname: 'prometheus.inowas.com',
        query: 'pegel_online_wsv_sensors{station="DRESDEN", type="waterlevel"}/100',
        start: 1575500400,
        end: 1575586800,
        step: 120
    };

    const ds = new PrometheusDataSource(obj);
    ds.data = [{timeStamp: 1, value: 1.2}];
    await ds.loadData();
    expect(ds.data).toEqual(ds.toObject().data);
});

/* TODO: test('Test PrometheusDataSource, loading from http-resource', async () => {
    const obj: IPrometheusDataSource = {
        id: uuid.v4(),
        protocol: 'https',
        hostname: 'prometheus.inowas.com',
        query: 'pegel_online_wsv_sensors{station="DRESDEN", type="waterlevel"}/100',
        start: 1578310000,
        end: 1578316200,
        step: 120
    };

    const ds = new PrometheusDataSource(obj);
    await ds.loadData();
    expect(ds.data).toBeTruthy();
    expect(ds.data && ds.data.length).toEqual(52);
    expect(ds.loadData().then(() => expect(ds.data).toEqual(ds.toObject().data)));
});*/
