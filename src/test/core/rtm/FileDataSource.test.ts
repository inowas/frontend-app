import {DATADROPPER_URL} from '../../../services/api';
import {IFileDataSource} from '../../../core/model/rtm/Sensor.type';
import FileDataSource from '../../../core/model/rtm/FileDataSource';
import Uuid from 'uuid';

test('Test FileDataSource, loading pre-loaded data', async () => {
    const obj: IFileDataSource = {
        id: Uuid.v4(),
        file: {filename: '', server: DATADROPPER_URL}
    };

    const ds = new FileDataSource(obj);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ds._props.data = [{timeStamp: 1, value: 1.2}];
    const data = await ds.loadData();
    expect(data).toEqual([{timeStamp: 1, value: 1.2}]);
    expect(ds.data).toEqual([{timeStamp: 1, value: 1.2}]);
});

test('Test FileDataSource, loading from http-resource', async () => {
    const obj: IFileDataSource = {
        id: Uuid.v4(),
        file: {
            filename: '4483fd26048475aec17476b8450ee9ee8851112c.json',
            server: DATADROPPER_URL
        }
    };

    const ds = new FileDataSource(obj);
    const data = await ds.loadData();
    expect(data && data.length).toEqual(15305);
    expect(ds.data && ds.data.length).toEqual(15305);
});

// async/await can be used.
test('Test FileDataSource from data', async () => {
    const data = [{
        timeStamp: 123444,
        value: 1
    }];

    const ds = await FileDataSource.fromData(data);
    expect(ds).toBeInstanceOf(FileDataSource);
    const expectedData = await ds.loadData();
    expect(data).toEqual(expectedData);
    expect(data).toEqual(ds.data);
    expect(ds.file).toEqual({
        filename: 'fb6da03381069eec2492185b9ab2879f03a962af.json',
        server: DATADROPPER_URL
    });
});

// async/await can be used.
test('Test FileDataSource from filename', async () => {
    const ds = await FileDataSource.fromFile({
        filename: 'fb6da03381069eec2492185b9ab2879f03a962af.json',
        server: DATADROPPER_URL
    });
    expect(ds).toBeInstanceOf(FileDataSource);
    expect(ds.data).toEqual([{timeStamp: 123444, value: 1}]);

    const data = await ds.loadData();
    expect(data).toEqual([{timeStamp: 123444, value: 1}]);
});

test('Test FileDataSource setBegin', async () => {
    const obj: IFileDataSource = {
        id: Uuid.v4(),
        file: {filename: '', server: DATADROPPER_URL}
    };

    const ds = new FileDataSource(obj);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ds._props.data = [
        {timeStamp: 1606760000, value: 1.0},
        {timeStamp: 1606761000, value: 1.0},
        {timeStamp: 1606762000, value: 1.0},
        {timeStamp: 1606763000, value: 1.0},
        {timeStamp: 1606764000, value: 1.0},
    ];
    const data = await ds.loadData();
    expect(data).toEqual([
        {timeStamp: 1606760000, value: 1.0},
        {timeStamp: 1606761000, value: 1.0},
        {timeStamp: 1606762000, value: 1.0},
        {timeStamp: 1606763000, value: 1.0},
        {timeStamp: 1606764000, value: 1.0},
    ]);

    ds.begin = 1606761050;
    const d = await ds.loadData();
    expect(d).toEqual([
        {timeStamp: 1606762000, value: 1.0},
        {timeStamp: 1606763000, value: 1.0},
        {timeStamp: 1606764000, value: 1.0},
    ]);
});

test('Test FileDataSource setEnd', async () => {
    const obj: IFileDataSource = {
        id: Uuid.v4(),
        file: {filename: '', server: DATADROPPER_URL}
    };

    const ds = new FileDataSource(obj);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ds._props.data = [
        {timeStamp: 1606760000, value: 1.0},
        {timeStamp: 1606761000, value: 1.0},
        {timeStamp: 1606762000, value: 1.0},
        {timeStamp: 1606763000, value: 1.0},
        {timeStamp: 1606764000, value: 1.0},
    ];
    const data = await ds.loadData();
    expect(data).toEqual([
        {timeStamp: 1606760000, value: 1.0},
        {timeStamp: 1606761000, value: 1.0},
        {timeStamp: 1606762000, value: 1.0},
        {timeStamp: 1606763000, value: 1.0},
        {timeStamp: 1606764000, value: 1.0},
    ]);

    ds.end = 1606762050;
    const d = await ds.loadData();
    expect(d).toEqual([
        {timeStamp: 1606760000, value: 1.0},
        {timeStamp: 1606761000, value: 1.0},
        {timeStamp: 1606762000, value: 1.0},
    ]);
});

test('Test FileDataSource setGte', async () => {
    const obj: IFileDataSource = {
        id: Uuid.v4(),
        file: {filename: '', server: DATADROPPER_URL}
    };

    const ds = new FileDataSource(obj);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ds._props.data = [
        {timeStamp: 1606760000, value: 1.1},
        {timeStamp: 1606761000, value: 1.1},
        {timeStamp: 1606762000, value: 1.2},
        {timeStamp: 1606763000, value: 1.2},
        {timeStamp: 1606764000, value: 1.1},
    ];
    const data = await ds.loadData();
    expect(data).toEqual([
        {timeStamp: 1606760000, value: 1.1},
        {timeStamp: 1606761000, value: 1.1},
        {timeStamp: 1606762000, value: 1.2},
        {timeStamp: 1606763000, value: 1.2},
        {timeStamp: 1606764000, value: 1.1},
    ]);

    ds.gte = 1.2;
    const d = await ds.loadData();
    expect(d).toEqual([
        {timeStamp: 1606762000, value: 1.2},
        {timeStamp: 1606763000, value: 1.2},
    ]);
});

test('Test FileDataSource setGte', async () => {
    const obj: IFileDataSource = {
        id: Uuid.v4(),
        file: {filename: '', server: DATADROPPER_URL}
    };

    const ds = new FileDataSource(obj);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ds._props.data = [
        {timeStamp: 1606760000, value: 1.0},
        {timeStamp: 1606761000, value: 1.1},
        {timeStamp: 1606762000, value: 1.2},
        {timeStamp: 1606763000, value: 1.2},
        {timeStamp: 1606764000, value: 1.1},
    ];
    const data = await ds.loadData();
    expect(data).toEqual([
        {timeStamp: 1606760000, value: 1.0},
        {timeStamp: 1606761000, value: 1.1},
        {timeStamp: 1606762000, value: 1.2},
        {timeStamp: 1606763000, value: 1.2},
        {timeStamp: 1606764000, value: 1.1},
    ]);

    ds.lte = 1.1;
    const d = await ds.loadData();
    expect(d).toEqual([
        {timeStamp: 1606760000, value: 1.0},
        {timeStamp: 1606761000, value: 1.1},
        {timeStamp: 1606764000, value: 1.1},
    ]);
});

