import Uuid from 'uuid';
import FileDataSource from '../../../core/model/rtm/monitoring/FileDataSource';
import {IFileDataSource} from '../../../core/model/rtm/monitoring/Sensor.type';
import {DATADROPPER_URL} from '../../../services/api';

test('Test FileDataSource, loading pre-loaded data', async () => {
    const obj: IFileDataSource = {
        id: Uuid.v4(),
        file: {filename: '', server: DATADROPPER_URL}
    };

    const ds = new FileDataSource(obj);

    // @ts-ignore
    ds._props.data = [{timeStamp: 1, value: 1.2}];
    await ds.loadData();
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
    await ds.loadData();
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
    await ds.loadData();
    expect(ds.data).toEqual(data);
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
    await ds.loadData();
    expect(ds.data).toEqual([{timeStamp: 123444, value: 1}]);
});
