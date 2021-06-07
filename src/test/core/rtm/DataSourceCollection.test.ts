import {DATADROPPER_URL} from '../../../services/api';
import {DataSourceCollection, FileDataSource} from '../../../core/model/rtm/monitoring';
import {IDateTimeValue, IFileDataSource} from '../../../core/model/rtm/monitoring/Sensor.type';
import Uuid from 'uuid';

test('DatasourceCollection merge with local data', async () => {
    const data1 = [
        {timeStamp: 123000, value: 1},
        {timeStamp: 124000, value: 2},
        {timeStamp: 125000, value: 3},
    ];

    const ds1 = await FileDataSource.fromData(data1);

    const data2 = [
        {timeStamp: 125500, value: 3.5},
        {timeStamp: 126500, value: 4.5},
        {timeStamp: 127500, value: 5.5},
    ];

    const ds2 = await FileDataSource.fromData(data2);
    const dsc = new DataSourceCollection([
        ds1.toObject(),
        ds2.toObject()
    ]);

    expect(dsc.isFetched()).toBeTruthy();
    expect(dsc.globalBegin()).toEqual(123000);
    expect(dsc.globalEnd()).toEqual(127500);

    expect(await dsc.mergedData()).toEqual(data1.concat(data2));
});

async function submitData(data: IDateTimeValue[]) {
    return await FileDataSource.fromData(data);
}

test('DatasourceCollection fetches automatically if data is not loaded', async () => {
    const ds1Inst = await submitData([
        {timeStamp: 123000, value: 1},
        {timeStamp: 124000, value: 2},
        {timeStamp: 125000, value: 3}
    ]);

    const ds2Inst = await submitData([
        {timeStamp: 125500, value: 3.5},
        {timeStamp: 126500, value: 4.5},
        {timeStamp: 127500, value: 5.5}
    ]);

    const ds1Obj = {...ds1Inst.toObject(), data: undefined};
    const ds2Obj = {...ds2Inst.toObject(), data: undefined};

    const dsc = new DataSourceCollection([
        ds1Obj, ds2Obj
    ]);

    expect(dsc.isFetched()).toBeFalsy();
    expect(await dsc.mergedData()).toEqual([
            {timeStamp: 123000, value: 1},
            {timeStamp: 124000, value: 2},
            {timeStamp: 125000, value: 3},
            {timeStamp: 125500, value: 3.5},
            {timeStamp: 126500, value: 4.5},
            {timeStamp: 127500, value: 5.5}
        ]
    );
});

test('FileDataSource, loading pre-loaded data', async () => {
    const obj: IFileDataSource = {
        id: Uuid.v4(),
        file: {filename: '', server: DATADROPPER_URL}
    };

    obj.data = [{timeStamp: 1, value: 1.2}];
    const ds = (new FileDataSource(obj));
    await ds.loadData();
    expect(ds.data).toEqual([{timeStamp: 1, value: 1.2}]);
});

test('FileDataSource, loading from http-resource', async () => {
    const obj: IFileDataSource = {
        id: Uuid.v4(),
        file: {
            filename: '4483fd26048475aec17476b8450ee9ee8851112c.json',
            server: DATADROPPER_URL
        }
    };

    const ds = new FileDataSource(obj);
    await ds.loadData();
    expect(ds.data && ds.data.length).toEqual(15305);
});

// async/await can be used.
test('FileDataSource from data', async () => {
    const data = [{
        timeStamp: 123444,
        value: 1
    }];

    const ds = await FileDataSource.fromData(data);
    expect(ds).toBeInstanceOf(FileDataSource);
    await ds.loadData();
    expect(ds.data).toEqual(data);
    expect(ds.file).toEqual({
        filename: 'fb6da03381069eec2492185b9ab2879f03a962af.json',
        server: DATADROPPER_URL
    });
});

// async/await can be used.
test('FileDataSource from filename', async () => {
    const ds = await FileDataSource.fromFile({
        filename: 'fb6da03381069eec2492185b9ab2879f03a962af.json',
        server: DATADROPPER_URL
    });
    expect(ds).toBeInstanceOf(FileDataSource);
    await ds.loadData();
    expect(ds.data).toEqual([{timeStamp: 123444, value: 1}]);
});
